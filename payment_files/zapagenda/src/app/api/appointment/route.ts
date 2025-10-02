// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/appointment/route.ts

import { NextResponse } from "next/server";

import { sendWhats } from "@/lib/whats";
import { addAppointment, loadAppointments, Appointment } from "@/lib/store";
import { normalizeE164BR } from "@/lib/phone";
import { rateLimit } from "@/lib/ratelimit";
import { ensureAccount, getAccount, isAccountActive } from "@/lib/account";
import { getLinkedCalendarBySlug, createGoogleCalendarEvent } from "@/lib/google"; // Importar createGoogleCalendarEvent

type Body = {
  slug: string;
  customerName: string;
  customerPhone: string;
  datetime: string;
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

    const linkedCalendar = await getLinkedCalendarBySlug(body.slug);
    if (!linkedCalendar) {
      return NextResponse.json({ error: "Agenda não encontrada." }, { status: 404 });
    }

    // Verifica se a conta do proprietário da agenda está ativa
    if (linkedCalendar.ownerUid) {
      const account = await ensureAccount(linkedCalendar.ownerUid, null);
      if (!isAccountActive(account)) {
        return NextResponse.json(
          {
            error:
              "Plano inativo. Acesse o dashboard do ZapAgenda para ativar ou renovar seu plano antes de aceitar novos agendamentos.",
          },
          { status: 403 }
        );
      }
    }

    const ownerPhone = linkedCalendar.whatsappNumber || process.env.OWNER_DEFAULT_PHONE || undefined;

    const phone = normalizeE164BR(body.customerPhone || "");
    if (!phone) {
      return NextResponse.json({ error: "WhatsApp inválido. Use +55DDDNÚMERO (ex.: +5553999999999)." }, { status: 400 });
    }

    const minutes = 60;

    const start = new Date(body.datetime);
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: "Data/hora inválida." }, { status: 400 });
    }
    const end = new Date(start.getTime() + minutes * 60 * 1000);

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
    const eventSummary = `Agendamento: ${body.customerName}`;
    const eventDescription = `Cliente: ${body.customerName}\nWhatsApp: ${body.customerPhone}\nAgenda: ${linkedCalendar.description || linkedCalendar.summary}`;
    const attendees = [{ email: linkedCalendar.ownerUid }]; // Adiciona o dono da agenda como participante

    // Se o cliente forneceu um email (assumindo que o WhatsApp pode ser um email para o Google Calendar)
    // ou se quisermos adicionar o cliente como participante via email, precisaríamos de um campo de email no formulário.
    // Por enquanto, vamos adicionar o dono da agenda como participante.

    await createGoogleCalendarEvent(
      linkedCalendar.ownerUid,
      linkedCalendar.id,
      eventSummary,
      eventDescription,
      start,
      end,
      // Se o cliente tiver um email, pode ser adicionado aqui:
      // [{ email: body.customerEmail }, { email: linkedCalendar.ownerUid }]
    );

    // ---------- mensagens ----------
    const humanDate = start.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

    const confirmMsg =
      `✅ *ZapAgenda* — Agendamento confirmado!\n` +
      `Agenda: *${linkedCalendar.description || linkedCalendar.summary}*\n` +
      `Cliente: *${body.customerName}*\n` +
      `Data/Hora: *${humanDate}*\n\n` +
      `Você receberá lembretes automáticos pelo WhatsApp se a agenda habilitou a função.`;

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
      ics: icsUrl,
    });
  } catch (err: unknown) {
    console.error("appointment error:", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

