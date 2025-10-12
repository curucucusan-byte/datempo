import { NextResponse } from "next/server";

import { loadAppointments, markReminderSent } from "@/lib/store";
import { getProfessional, resolveProfessional } from "@/lib/professionals";
import { sendWhats } from "@/lib/whats";
import { authenticateRequest } from "@/lib/session";
import {
  canSendReminders,
  getAccount,
  getReminderSettings,
  isAccountActive,
  type Account,
} from "@/lib/account";

const FALLBACK_WINDOW_MINUTES = Number(process.env.REMINDER_WINDOW_MINUTES ?? "120");
const FALLBACK_NOTIFY_OWNER = process.env.REMINDER_NOTIFY_OWNER === "true";

function formatRelative(minutesUntil: number) {
  if (minutesUntil <= 1) return "menos de 1 minuto";
  if (minutesUntil < 60) return `${minutesUntil} minutos`;
  const hours = Math.floor(minutesUntil / 60);
  const minutes = minutesUntil % 60;
  if (minutes === 0) return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  return `${hours} ${hours === 1 ? "hora" : "horas"} e ${minutes} minutos`;
}

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const appointments = await loadAppointments();

  const professionalCache = new Map<string, Awaited<ReturnType<typeof resolveProfessional>> | null>();
  const accountCache = new Map<string, Account | null>();

  async function getOwnerUid(apptSlug: string, savedOwner?: string | null) {
    if (savedOwner) return savedOwner;
    if (!professionalCache.has(apptSlug)) {
      const fromLocal = getProfessional(apptSlug);
      if (fromLocal?.ownerUid) {
        professionalCache.set(apptSlug, fromLocal);
      } else {
        professionalCache.set(apptSlug, await resolveProfessional(apptSlug));
      }
    }
    const prof = professionalCache.get(apptSlug);
    return prof?.ownerUid ?? null;
  }

  async function getOwnerAccount(uid: string) {
    if (accountCache.has(uid)) {
      return accountCache.get(uid) ?? null;
    }
    const account = await getAccount(uid);
    accountCache.set(uid, account);
    return account;
  }

  const due: Array<
    Awaited<ReturnType<typeof loadAppointments>>[number] & {
      ownerUid: string | null;
      notifyOwner: boolean;
    }
  > = [];
  for (const appt of appointments) {
    if (appt.reminderSentAt) continue;
    const start = new Date(appt.startISO);
    if (Number.isNaN(start.getTime())) continue;
    if (start <= now) continue;

    const ownerUid = await getOwnerUid(appt.slug, appt.ownerUid);
    let windowMinutes = FALLBACK_WINDOW_MINUTES;
    let notifyOwner = FALLBACK_NOTIFY_OWNER;
    let canSend = Number.isFinite(windowMinutes) && windowMinutes > 0;

    if (ownerUid) {
      const account = await getOwnerAccount(ownerUid);
      if (!account || !isAccountActive(account)) {
        continue;
      }
      if (!canSendReminders(account)) {
        continue;
      }
      const reminders = getReminderSettings(account);
      windowMinutes = reminders.windowMinutes;
      notifyOwner = FALLBACK_NOTIFY_OWNER;
      canSend = reminders.enabled && windowMinutes > 0;
    }

    if (!canSend) {
      continue;
    }

    const upperBound = new Date(now.getTime() + windowMinutes * 60_000);
    if (start > upperBound) {
      continue;
    }

    due.push({ ...appt, ownerUid, notifyOwner });
  }

  due.sort((a, b) => a.startISO.localeCompare(b.startISO));

  const results: {
    processed: number;
    sent: number;
    errors: { id: string; message: string }[];
  } = {
    processed: due.length,
    sent: 0,
    errors: [],
  };

  for (const appt of due) {
    try {
      const start = new Date(appt.startISO);
      const minutesUntil = Math.max(
        1,
        Math.round((start.getTime() - now.getTime()) / 60_000)
      );
      const humanDate = start.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
      let prof = getProfessional(appt.slug);
      if (!prof && professionalCache.has(appt.slug)) {
        prof = professionalCache.get(appt.slug) ?? undefined;
      }
      if (!prof) {
        const resolved = await resolveProfessional(appt.slug);
        professionalCache.set(appt.slug, resolved ?? null);
        prof = resolved ?? undefined;
      }

      const message =
        `⏰ *Lembrete Agende Mais*\n` +
        `Você tem ${appt.service} com ${prof?.name ?? appt.slug} em ${formatRelative(minutesUntil)}.\n` +
        `Data/Hora: *${humanDate}*\n\n` +
        `Se precisar reagendar, responda esta mensagem.`;

      await sendWhats({ to: appt.customerPhone, message });

      if (appt.notifyOwner) {
        const ownerPhone = prof?.phone || process.env.OWNER_DEFAULT_PHONE;
        if (ownerPhone) {
          let trialLine = "";
          if (appt.ownerUid) {
            try {
              const acc = await getOwnerAccount(appt.ownerUid);
              if (acc?.status === "trial" && acc.trialEndsAt) {
                const ends = new Date(acc.trialEndsAt);
                const daysLeft = Math.max(0, Math.ceil((ends.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                trialLine = `\n\n⚑ Conta em teste sem custo: ${daysLeft} dia(s) restantes.`;
              }
            } catch {}
          }
          const ownerMsg =
            `🔔 Lembrete: ${appt.customerName} tem ${appt.service} em ${formatRelative(minutesUntil)}.\n` +
            `Quando: ${humanDate}.` +
            trialLine;
          await sendWhats({ to: ownerPhone, message: ownerMsg });
        }
      }

      await markReminderSent(appt.id, new Date().toISOString());
      results.sent += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      results.errors.push({ id: appt.id, message });
    }
  }

  const status = results.errors.length > 0 ? 207 : 200;
  return NextResponse.json({ ok: results.errors.length === 0, ...results }, { status });
}

export async function GET(req: Request) {
  // facilitar testes manuais (ex.: curl GET)
  return POST(req);
}
