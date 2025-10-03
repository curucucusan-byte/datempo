// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/appointment/route.ts

import { NextResponse } from "next/server";

import { sendWhats } from "@/lib/whats";
import { addAppointment, loadAppointments, Appointment } from "@/lib/store";
import { normalizeE164BR } from "@/lib/phone";
import { rateLimit } from "@/lib/ratelimit";
import { ensureAccount, getAccount, isAccountActive } from "@/lib/account";
import { getLinkedCalendarBySlugWithToken, createGoogleCalendarEvent } from "@/lib/google"; // Importar createGoogleCalendarEvent

const DEFAULT_TIME_ZONE = process.env.DEFAULT_CALENDAR_TIMEZONE || "America/Sao_Paulo";

function formatCurrency(amountCents: number, currency: string) {
  const normalized = currency?.toUpperCase() || "BRL";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: normalized }).format(amountCents / 100);
}

function isValidTimeZone(tz: string | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = dtf.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  const year = Number(lookup.year);
  const month = Number(lookup.month);
  const day = Number(lookup.day);
  const hour = Number(lookup.hour);
  const minute = Number(lookup.minute);
  const second = Number(lookup.second);

  const inTimeZone = Date.UTC(year, month - 1, day, hour, minute, second);
  return inTimeZone - date.getTime();
}

function parseFormDateTime(value: string, timeZone: string) {
  // 1) Formato local "YYYY-MM-DDTHH:mm" (sem segundos e sem timezone)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    const [datePart, timePart] = value.split("T");
    if (!datePart || !timePart) return null;
    const [yearStr, monthStr, dayStr] = datePart.split("-");
    const [hourStr, minuteStr] = timePart.split(":");
    const baseUtc = Date.UTC(
      Number(yearStr),
      Number(monthStr) - 1,
      Number(dayStr),
      Number(hourStr),
      Number(minuteStr),
      0,
    );
    const baseDate = new Date(baseUtc);
    const offset = getTimeZoneOffset(baseDate, timeZone);
    return new Date(baseUtc - offset);
  }

  // 2) Qualquer ISO válido (ex.: "2025-10-03T10:00:00.000Z")
  const iso = new Date(value);
  if (!Number.isNaN(iso.getTime())) return iso;

  return null;
}

function clampDurationMinutes(value: unknown, fallback: number) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(8 * 60, Math.max(5, Math.round(num)));
}

type Body = {
  slug: string;
  customerName: string;
  customerPhone: string;
  datetime: string;
  durationMinutes?: number;
  timezone?: string;
  h?: string; // token público opcional
};

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function POST(req: Request) {
  try {
    // ---------- rate-limit por IP (8 req/min) ----------
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
    const rl = rateLimit(`apt:${ip}`, 8, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em instantes." },
        { status: 429 }
      );
    }

    // ---------- body e validações ----------
    const body = (await req.json()) as Body;
    if (!body?.slug || !body?.customerName || !body?.customerPhone || !body?.datetime) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const linkedCalendar = await getLinkedCalendarBySlugWithToken(body.slug, body.h);
    if (!linkedCalendar) {
      return NextResponse.json({ error: "Agenda não encontrada ou link inválido." }, { status: 404 });
    }

    // Verifica se a conta do proprietário da agenda está ativa
    let ownerAccount: Awaited<ReturnType<typeof ensureAccount>> | null = null;
    if (linkedCalendar.ownerUid) {
      ownerAccount = await ensureAccount(linkedCalendar.ownerUid, null);
      if (!isAccountActive(ownerAccount)) {
        // Não expor detalhes de billing ao cliente final
        return NextResponse.json(
          { error: "Agenda indisponível no momento. Tente novamente mais tarde." },
          { status: 403 },
        );
      }
    }

    const ownerPhone = linkedCalendar.whatsappNumber || process.env.OWNER_DEFAULT_PHONE || undefined;

    const phone = normalizeE164BR(body.customerPhone || "");
    if (!phone) {
      return NextResponse.json({ error: "WhatsApp inválido. Use +55DDDNÚMERO (ex.: +5553999999999)." }, { status: 400 });
    }

    const minutes = clampDurationMinutes(body.durationMinutes, 60);
    const timeZone = isValidTimeZone(body.timezone) ? body.timezone : DEFAULT_TIME_ZONE;

    const start = parseFormDateTime(body.datetime, timeZone);
    if (!start || Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: "Data/hora inválida." }, { status: 400 });
    }
    const end = new Date(start.getTime() + minutes * 60 * 1000);
    if (start.getTime() < Date.now()) {
      return NextResponse.json({ error: "Escolha um horário no futuro." }, { status: 400 });
    }

    if (!linkedCalendar.ownerUid) {
      return NextResponse.json(
        { error: "Agenda indisponível no momento. Tente novamente mais tarde." },
        { status: 503 },
      );
    }

    const requiresPrepayment = Boolean(
      linkedCalendar.requiresPrepayment && (linkedCalendar.prepaymentAmountCents ?? 0) > 0,
    );
    const prepaymentMode = linkedCalendar.prepaymentMode === "stripe" ? "stripe" : "manual";
    const prepaymentAmountCents = linkedCalendar.prepaymentAmountCents ?? 0;
    const prepaymentCurrency = linkedCalendar.prepaymentCurrency ?? "brl";
    const prepaymentPixKey = linkedCalendar.manualPixKey ?? "";
    const prepaymentManualInstructions = linkedCalendar.manualInstructions ?? "";

    if (requiresPrepayment && prepaymentMode === "stripe") {
      return NextResponse.json(
        { error: "Pré-pagamento via cartão ainda não está disponível para agendamentos." },
        { status: 501 },
      );
    }

    // ---------- conflito ----------
    const list = await loadAppointments();
    const hasClash = list.some(a =>
      a.slug === body.slug &&
      overlaps(start, end, new Date(a.startISO), new Date(a.endISO))
    );
    if (hasClash) {
      return NextResponse.json(
        { error: "Horário indisponível para esta agenda. Escolha outro horário." },
        { status: 409 }
      );
    }

    // ---------- Criar evento no Google Calendar ----------
    const eventSummary = `Atendimento — ${body.customerName}`;
    const eventDescription = [
      `Cliente: ${body.customerName}`,
      `WhatsApp: ${body.customerPhone}`,
      `Agenda: ${linkedCalendar.description || linkedCalendar.summary}`,
      linkedCalendar.slug
        ? `Link público: ${(process.env.APP_BASE_URL || "").replace(/\/$/, "")}/agenda/${linkedCalendar.slug}`
        : "",
      requiresPrepayment
        ? `Pagamento: ${formatCurrency(prepaymentAmountCents, prepaymentCurrency)} — pendente`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const attendees = ownerAccount?.email ? [{ email: ownerAccount.email }] : [];

    await createGoogleCalendarEvent(
      linkedCalendar.ownerUid,
      linkedCalendar.id,
      eventSummary,
      eventDescription,
      start,
      end,
      attendees,
      timeZone,
    );

    // ---------- mensagens ----------
    const humanDate = start.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone,
    });

    const paymentAmountLocalized = formatCurrency(prepaymentAmountCents, prepaymentCurrency);
    const paymentInstructionsText = requiresPrepayment
      ? [
          `Valor: ${paymentAmountLocalized}.`,
          prepaymentPixKey ? `Chave Pix: ${prepaymentPixKey}.` : "",
          prepaymentManualInstructions,
        ]
          .filter(Boolean)
          .join(" ")
      : null;

    const confirmMsgLines = [
      `✅ *ZapAgenda* — Agendamento registrado!`,
      `Agenda: *${linkedCalendar.description || linkedCalendar.summary}*`,
      `Cliente: *${body.customerName}*`,
      `Data/Hora: *${humanDate}*`,
    ];
    if (requiresPrepayment && paymentInstructionsText) {
      confirmMsgLines.push("\n🔔 *Pagamento necessário antes da confirmação final.*", paymentInstructionsText.trim());
    }
    confirmMsgLines.push("\nVocê receberá lembretes automáticos pelo WhatsApp se a agenda habilitou a função.");
    const confirmMsg = confirmMsgLines.join("\n");

    await sendWhats({ to: phone, message: confirmMsg });

    if (ownerPhone) {
      let trialLine = "";
      if (linkedCalendar.ownerUid) {
        try {
          const acc = await getAccount(linkedCalendar.ownerUid);
          if (acc?.status === "trial" && acc.trialEndsAt) {
            const ends = new Date(acc.trialEndsAt);
            const daysLeft = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            trialLine = `\n\n⚑ Sua conta está em teste sem custo (${daysLeft} dia(s) restantes). Ative um plano em /dashboard/plans para não interromper o serviço.`;
          }
        } catch {}
      }
      await sendWhats({
        to: ownerPhone,
        message:
          `🧾 Novo agendamento — ${linkedCalendar.description || linkedCalendar.summary}\n` +
          `Cliente: ${body.customerName}\n` +
          `Quando: ${humanDate}\n` +
          (requiresPrepayment ? `Pagamento: ${paymentAmountLocalized} (${prepaymentMode === "manual" ? "manual" : "online"})\n` : "") +
          `Contato do cliente: ${phone}` +
          trialLine,
      });
    }

    // ---------- persistir ----------
    const appt: Appointment = {
      id: `apt_${Math.random().toString(36).slice(2, 10)}`,
      slug: body.slug,
      customerName: body.customerName,
      customerPhone: phone,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      ownerUid: linkedCalendar.ownerUid ?? null,
      createdAt: new Date().toISOString(),
      paymentStatus: requiresPrepayment ? "pending" : "not_required",
      paymentMode: requiresPrepayment ? prepaymentMode : null,
      paymentAmountCents: requiresPrepayment ? prepaymentAmountCents : null,
      paymentCurrency: requiresPrepayment ? prepaymentCurrency : null,
      paymentReference: null,
      paymentInstructions: paymentInstructionsText,
    };

    await addAppointment(appt);

    // ---------- link ICS ----------
    const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
    const icsUrl = `${base}/api/ics/${appt.id}`;

    // ---------- resposta ----------
    return NextResponse.json({
      ok: true,
      id: appt.id,
      when: start.toISOString(),
      minutes,
      timeZone,
      ics: icsUrl,
      payment: requiresPrepayment
        ? {
            status: "pending" as const,
            mode: prepaymentMode,
            amountCents: prepaymentAmountCents,
            currency: prepaymentCurrency,
            pixKey: prepaymentPixKey,
            instructions: paymentInstructionsText,
          }
        : {
            status: "not_required" as const,
          },
    });
  } catch (err: unknown) {
    console.error("appointment error:", err);
    return NextResponse.json(
      { error: "Agenda indisponível no momento. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
