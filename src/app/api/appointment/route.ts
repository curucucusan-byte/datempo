// src/app/api/appointment/route.ts
import { NextResponse } from "next/server";

import { sendWhats } from "@/lib/whats";
import { addAppointment, loadAppointments, Appointment } from "@/lib/store";
import { getProfessional, getServiceMinutes, resolveProfessional } from "@/lib/professionals";
import { normalizeE164BR } from "@/lib/phone";
import { rateLimit } from "@/lib/ratelimit";
import { ensureAccount, getAccount, isAccountActive } from "@/lib/account";

type Body = {
  slug: string;
  customerName: string;
  customerPhone: string; // pode vir “solto”; vamos normalizar para +55...
  service: string;
  datetime: string; // ISO local (do <input type="datetime-local">)
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
    if (!body?.slug || !body?.customerName || !body?.customerPhone || !body?.service || !body?.datetime) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    let prof = getProfessional(body.slug);
    if (!prof) {
      prof = await resolveProfessional(body.slug);
    }
    if (!prof) {
      return NextResponse.json({ error: "Profissional não encontrado." }, { status: 404 });
    }

    if (prof.ownerUid) {
      const account = await ensureAccount(prof.ownerUid, null);
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

    const ownerPhone = prof.phone || process.env.OWNER_DEFAULT_PHONE || undefined;

    // normaliza telefone do cliente para +55DDDNÚMERO (E.164)
    const phone = normalizeE164BR(body.customerPhone || "");
    if (!phone) {
      return NextResponse.json({ error: "WhatsApp inválido. Use +55DDDNÚMERO (ex.: +5553999999999)." }, { status: 400 });
    }

    // duração do serviço
    const minutes = getServiceMinutes(prof, body.service, 60);

    // janela do agendamento
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
        { error: "Horário indisponível para este profissional. Escolha outro horário." },
        { status: 409 }
      );
    }

    // ---------- mensagens ----------
    const humanDate = start.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

    const confirmMsg =
      `✅ *ZapAgenda* — Agendamento confirmado!\n` +
      `Profissional: *${body.slug}*\n` +
      `Cliente: *${body.customerName}*\n` +
      `Serviço: *${body.service}* (${minutes} min)\n` +
      `Data/Hora: *${humanDate}*\n\n` +
      `Você receberá lembretes automáticos pelo WhatsApp se o profissional habilitou a função.`;

    // envia para o cliente
    await sendWhats({ to: phone, message: confirmMsg });

    // notifica o dono do slug (se houver um)
    if (ownerPhone) {
      let trialLine = "";
      if (prof?.ownerUid) {
        try {
          const acc = await getAccount(prof.ownerUid);
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
          `🧾 Novo agendamento — ${body.slug}\n` +
          `Cliente: ${body.customerName}\n` +
          `Serviço: ${body.service} (${minutes} min)\n` +
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
      service: body.service,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      ownerUid: prof?.ownerUid ?? null,
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
