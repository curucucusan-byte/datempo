import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/session";
import { exchangeCodeForTokens, storeTokens, getPrimaryCalendar } from "@/lib/google";
import { ensureAccount } from "@/lib/account";
import { getDb } from "@/lib/firebaseAdmin";
import type { Professional } from "@/lib/professionals";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) {
    return NextResponse.redirect(`/dashboard/minha-agenda?google_error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`/dashboard/minha-agenda?google_error=missing_code`);
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
        await db.collection("accounts").doc(user.uid).set(
          {
            linkedCalendars: [primary],
            activeCalendarId: primary.id,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Auto-criar perfil público para o calendário primary se ainda não existir
      if (primary) {
        // verifica se já existe um perfil com este calendarId
        const existingSnap = await db
          .collection("professionals")
          .where("ownerUid", "==", user.uid)
          .where("calendarId", "==", primary.id)
          .limit(1)
          .get();
        const exists = !existingSnap.empty;
        if (!exists) {
          // gera um slug a partir do summary
          function slugify(input: string) {
            return input
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
              .replace(/-{2,}/g, "-")
              .slice(0, 32) || "agenda";
          }
          let base = slugify(primary.summary || "agenda");
          let slug = base;
          for (let i = 0; i < 8; i++) {
            const d = await db.collection("professionals").doc(slug).get();
            if (!d.exists) break;
            slug = `${base}-${Math.random().toString(36).slice(2, 6)}`.slice(0, 32);
          }

          const professional: Professional = {
            slug,
            name: primary.summary || slug,
            description: undefined,
            phone: undefined,
            ownerUid: user.uid,
            calendarId: primary.id,
            services: [{ name: "Consulta", minutes: 60 }],
            workHours: {},
          };
          await db.collection("professionals").doc(slug).set(professional, { merge: true });
        }
      }
    } catch {
      // best-effort; se falhar, a tela permitirá vincular manualmente
    }
    return NextResponse.redirect(`/dashboard/minha-agenda?google_connected=1`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.redirect(`/dashboard/minha-agenda?google_error=${encodeURIComponent(message)}`);
  }
}
