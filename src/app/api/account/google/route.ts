import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
import type { Professional } from "@/lib/professionals";
import { ensureAccount, getAccount } from "@/lib/account";
import { CALENDAR_SWAP_INTERVAL_MS, getPlanCalendarLimit } from "@/lib/plans";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const account = await ensureAccount(auth.uid, auth.email ?? null);
  return NextResponse.json({ ok: true, account });
}

type Body =
  | { action: "link"; calendar: { id: string; summary: string } }
  | { action: "unlink"; id: string }
  | { action: "unlinkAll" }
  | { action: "setActive"; id: string };

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || typeof body !== "object" || !("action" in body)) {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const dbAccount = await getAccount(auth.uid);
  const account = dbAccount ?? (await ensureAccount(auth.uid, auth.email ?? null));
  const limit = getPlanCalendarLimit(account.plan);

  const now = Date.now();
  const lastSwapAt = account.lastCalendarSwapAt ? Date.parse(account.lastCalendarSwapAt) : 0;
  const canSwapNow = !lastSwapAt || now - lastSwapAt >= CALENDAR_SWAP_INTERVAL_MS;

  async function ensureProfileForCalendar(ownerUid: string, calendar: { id: string; summary: string }) {
    try {
      const db = (await import("@/lib/firebaseAdmin")).getDb();
      const existing = await db
        .collection("professionals")
        .where("ownerUid", "==", ownerUid)
        .where("calendarId", "==", calendar.id)
        .limit(1)
        .get();
      if (!existing.empty) return; // já existe

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
      const base = slugify(calendar.summary || calendar.id);
      let slug = base;
      for (let i = 0; i < 8; i++) {
        const d = await db.collection("professionals").doc(slug).get();
        if (!d.exists) break;
        slug = `${base}-${Math.random().toString(36).slice(2, 6)}`.slice(0, 32);
      }
      const professional: Professional = {
        slug,
        name: calendar.summary || slug,
        description: undefined,
        phone: undefined,
        ownerUid,
        calendarId: calendar.id,
        services: [{ name: "Consulta", minutes: 60 }],
        workHours: {},
      };
      await db.collection("professionals").doc(slug).set(professional, { merge: true });
    } catch {
      // best-effort; não bloqueia o vínculo
    }
  }

  if (body.action === "link") {
    const { id, summary } = body.calendar ?? { id: "", summary: "" };
    if (!id || !summary) {
      return NextResponse.json({ error: "Informe id e summary do calendário" }, { status: 400 });
    }

    const existsIdx = account.linkedCalendars.findIndex((c) => c.id === id);
    if (existsIdx !== -1) {
      // já vinculado: apenas define como ativo (sem contar como troca se já era ativo)
      const alreadyActive = account.activeCalendarId === id;
      const payload: Record<string, unknown> = {};
      if (!alreadyActive) {
        if (!canSwapNow) {
          const retryAt = new Date(lastSwapAt + CALENDAR_SWAP_INTERVAL_MS).toISOString();
          return NextResponse.json(
            { error: "Troca permitida 1 vez ao dia.", retryAt },
            { status: 429 }
          );
        }
        payload.activeCalendarId = id;
        payload.lastCalendarSwapAt = new Date(now).toISOString();
      }
      payload.updatedAt = new Date(now).toISOString();
      await (await import("@/lib/firebaseAdmin")).getDb()
        .collection("accounts").doc(account.uid).set(payload, { merge: true });
      // garante perfil para esse calendário
      await ensureProfileForCalendar(account.uid, { id, summary });
      return NextResponse.json({ ok: true, account: { ...account, ...payload } });
    }

    // novo vínculo
    if (account.plan === "essencial" && account.linkedCalendars.length >= 1) {
      // Essencial: substituir como swap diário
      if (!canSwapNow) {
        const retryAt = new Date(lastSwapAt + CALENDAR_SWAP_INTERVAL_MS).toISOString();
        return NextResponse.json(
          { error: "Troca permitida 1 vez ao dia.", retryAt },
          { status: 429 }
        );
      }
      const payload: Record<string, unknown> = {
        linkedCalendars: [{ id, summary }],
        activeCalendarId: id,
        lastCalendarSwapAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      };
      await (await import("@/lib/firebaseAdmin")).getDb()
        .collection("accounts").doc(account.uid).set(payload, { merge: true });
      return NextResponse.json({ ok: true, account: { ...account, ...payload } });
    }

    // Pro: até limit (10)
    if (account.linkedCalendars.length >= limit) {
      return NextResponse.json({ error: `Limite de ${limit} agendas atingido.` }, { status: 400 });
    }
    const nextList = [...account.linkedCalendars, { id, summary }];
    const payload: Record<string, unknown> = {
      linkedCalendars: nextList,
      // se não houver ativo, define automaticamente
      activeCalendarId: account.activeCalendarId ?? id,
      updatedAt: new Date(now).toISOString(),
    };
    await (await import("@/lib/firebaseAdmin")).getDb()
      .collection("accounts").doc(account.uid).set(payload, { merge: true });
    await ensureProfileForCalendar(account.uid, { id, summary });
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  if (body.action === "unlink") {
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Informe id" }, { status: 400 });
    const next = account.linkedCalendars.filter((c) => c.id !== id);
    const payload: Record<string, unknown> = { linkedCalendars: next, updatedAt: new Date(now).toISOString() };
    if (account.activeCalendarId === id) {
      payload.activeCalendarId = next[0]?.id ?? null;
    }
    await (await import("@/lib/firebaseAdmin")).getDb()
      .collection("accounts").doc(account.uid).set(payload, { merge: true });
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  if (body.action === "unlinkAll") {
    if (account.plan !== "pro") {
      return NextResponse.json({ error: "Disponível apenas no plano Pro." }, { status: 403 });
    }
    const payload = {
      linkedCalendars: [] as Array<{ id: string; summary: string }>,
      activeCalendarId: null as string | null,
      updatedAt: new Date(now).toISOString(),
    };
    await (await import("@/lib/firebaseAdmin")).getDb()
      .collection("accounts").doc(account.uid).set(payload, { merge: true });
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  if (body.action === "setActive") {
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Informe id" }, { status: 400 });
    const exists = account.linkedCalendars.some((c) => c.id === id);
    if (!exists) return NextResponse.json({ error: "Agenda não vinculada" }, { status: 400 });
    if (account.activeCalendarId === id) return NextResponse.json({ ok: true, account });
    if (!canSwapNow) {
      const retryAt = new Date(lastSwapAt + CALENDAR_SWAP_INTERVAL_MS).toISOString();
      return NextResponse.json(
        { error: "Troca permitida 1 vez ao dia.", retryAt },
        { status: 429 }
      );
    }
    const payload = {
      activeCalendarId: id,
      lastCalendarSwapAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };
    await (await import("@/lib/firebaseAdmin")).getDb()
      .collection("accounts").doc(account.uid).set(payload, { merge: true });
    // tenta descobrir summary da lista já vinculada
    const summary = account.linkedCalendars.find((c) => c.id === id)?.summary || id;
    await ensureProfileForCalendar(account.uid, { id, summary });
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
