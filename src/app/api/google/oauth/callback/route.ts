// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/google/oauth/callback/route.ts

import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/session";
import { exchangeCodeForTokens, storeTokens, getPrimaryCalendar, LinkedCalendar } from "@/lib/google";
import { ensureAccount } from "@/lib/account";
import { getDb } from "@/lib/firebaseAdmin";
// import type { Professional } from "@/lib/professionals"; // Removido

const DEFAULT_SLOT_DURATION = 60;
const DEFAULT_WORK_HOURS = {
  monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
  saturday: [],
  sunday: [],
};

const DEFAULT_PREPAYMENT = {
  requiresPrepayment: false,
  prepaymentMode: "manual" as const,
  prepaymentAmountCents: 0,
  prepaymentCurrency: "brl",
  manualPixKey: "",
  manualInstructions: "",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) {
    return NextResponse.redirect(`/dashboard?tab=agenda&google_error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`/dashboard?tab=agenda&google_error=missing_code`);
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(`/login`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await storeTokens(user.uid, tokens);
    // Auto-vínculo inicial: se não houver agendas vinculadas, vincula a "primary".
    try {
      const db = getDb();
      const account = await ensureAccount(user.uid, user.email ?? null);
      const primary = await getPrimaryCalendar(user.uid);
      if (primary && (!account.linkedCalendars || account.linkedCalendars.length === 0)) {
        // Gerar slug único para a nova agenda
        function slugify(input: string) {
          return (input || "agenda")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .replace(/-{2,}/g, "-")
            .slice(0, 32) || "agenda";
        }
        const base = slugify(primary.summary || primary.id);
        let slug = base;
        for (let i = 0; i < 8; i++) {
          const snapshot = await db.collection("accounts").where("linkedCalendars.slug", "==", slug).limit(1).get();
          if (snapshot.empty) break;
          slug = `${base}-${Math.random().toString(36).slice(2, 6)}`.slice(0, 32);
        }

        const newLinkedCalendar: LinkedCalendar = {
          id: primary.id,
          summary: primary.summary,
          ownerUid: user.uid,
          slug,
          description: `Agenda de ${primary.summary}`, // Descrição padrão
          whatsappNumber: process.env.OWNER_DEFAULT_PHONE || "", // Número de WhatsApp padrão
          active: true,
          slotDurationMinutes: DEFAULT_SLOT_DURATION,
          workHours: DEFAULT_WORK_HOURS,
          requiresPrepayment: DEFAULT_PREPAYMENT.requiresPrepayment,
          prepaymentMode: DEFAULT_PREPAYMENT.prepaymentMode,
          prepaymentAmountCents: DEFAULT_PREPAYMENT.prepaymentAmountCents,
          prepaymentCurrency: DEFAULT_PREPAYMENT.prepaymentCurrency,
          manualPixKey: DEFAULT_PREPAYMENT.manualPixKey,
          manualInstructions: DEFAULT_PREPAYMENT.manualInstructions,
        };

        await db.collection("accounts").doc(user.uid).set(
          {
            linkedCalendars: [newLinkedCalendar],
            activeCalendarId: newLinkedCalendar.id,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch {
      // best-effort; se falhar, a tela permitirá vincular manualmente
    }
    return NextResponse.redirect(`/dashboard?tab=agenda&google_connected=1`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.redirect(`/dashboard?tab=agenda&google_error=${encodeURIComponent(message)}`);
  }
}
