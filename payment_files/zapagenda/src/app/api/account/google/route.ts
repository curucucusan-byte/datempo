// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/account/google/route.ts

import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
// import type { Professional } from "@/lib/professionals"; // Removido
import { ensureAccount, getAccount } from "@/lib/account";
import { CALENDAR_SWAP_INTERVAL_MS, getPlanCalendarLimit } from "@/lib/plans";
import { LinkedCalendar } from "@/lib/google"; // Importar LinkedCalendar

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const account = await ensureAccount(auth.uid, auth.email ?? null);
  return NextResponse.json({ ok: true, account });
}

type Body =
  | { action: "link"; calendar: { id: string; summary: string; description: string; whatsappNumber: string } }
  | { action: "unlink"; id: string }
  | { action: "unlinkAll" }
  | { action: "setActive"; id: string }
  | { action: "updateCalendar"; id: string; description: string; whatsappNumber: string }; // Nova ação

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

  // A função ensureProfileForCalendar e a lógica de slugify não são mais necessárias
  // pois o conceito de Professional foi removido.

  if (body.action === "link") {
    const { id, summary, description, whatsappNumber } = body.calendar ?? { id: "", summary: "", description: "", whatsappNumber: "" };
    if (!id || !summary || !description || !whatsappNumber) {
      return NextResponse.json({ error: "Informe id, summary, description e whatsappNumber do calendário" }, { status: 400 });
    }

    const existsIdx = account.linkedCalendars.findIndex((c) => c.id === id);
    if (existsIdx !== -1) {
      // Já vinculado: apenas atualiza os detalhes e define como ativo (sem contar como troca se já era ativo)
      const alreadyActive = account.activeCalendarId === id;
      const updatedCalendar: LinkedCalendar = {
        ...account.linkedCalendars[existsIdx],
        description,
        whatsappNumber,
      };
      const nextLinkedCalendars = [...account.linkedCalendars];
      nextLinkedCalendars[existsIdx] = updatedCalendar;

      const payload: Record<string, unknown> = {
        linkedCalendars: nextLinkedCalendars,
      };
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
      return NextResponse.json({ ok: true, account: { ...account, ...payload } });
    }

    // Novo vínculo
    if (account.linkedCalendars.length >= limit) {
      return NextResponse.json({ error: `Limite de ${limit} agendas atingido.` }, { status: 400 });
    }

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
    const base = slugify(summary || id);
    let slug = base;
    const db = (await import("@/lib/firebaseAdmin")).getDb();
    for (let i = 0; i < 8; i++) {
      const snapshot = await db.collection("accounts").where("linkedCalendars.slug", "==", slug).limit(1).get();
      if (snapshot.empty) break;
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`.slice(0, 32);
    }

    const newLinkedCalendar: LinkedCalendar = {
      id,
      summary,
      ownerUid: auth.uid,
      slug,
      description,
      whatsappNumber,
      active: true, // Nova agenda é ativa por padrão
    };

    const nextLinkedCalendars = [...account.linkedCalendars, newLinkedCalendar];
    const payload: Record<string, unknown> = {
      linkedCalendars: nextLinkedCalendars,
      activeCalendarId: account.activeCalendarId ?? id, // Se não houver ativo, define automaticamente
      updatedAt: new Date(now).toISOString(),
    };
    await db.collection("accounts").doc(account.uid).set(payload, { merge: true });
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
      linkedCalendars: [] as LinkedCalendar[],
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
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  if (body.action === "updateCalendar") {
    const { id, description, whatsappNumber } = body;
    if (!id || !description || !whatsappNumber) {
      return NextResponse.json({ error: "Informe id, description e whatsappNumber" }, { status: 400 });
    }
    const calendarIndex = account.linkedCalendars.findIndex((c) => c.id === id);
    if (calendarIndex === -1) {
      return NextResponse.json({ error: "Agenda não encontrada para atualização" }, { status: 404 });
    }

    const updatedCalendar: LinkedCalendar = {
      ...account.linkedCalendars[calendarIndex],
      description,
      whatsappNumber,
    };
    const nextLinkedCalendars = [...account.linkedCalendars];
    nextLinkedCalendars[calendarIndex] = updatedCalendar;

    const payload: Record<string, unknown> = {
      linkedCalendars: nextLinkedCalendars,
      updatedAt: new Date(now).toISOString(),
    };
    await (await import("@/lib/firebaseAdmin")).getDb()
      .collection("accounts").doc(account.uid).set(payload, { merge: true });
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}

