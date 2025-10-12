// Caminho do arquivo: /home/ubuntu/datempo/datempo/src/app/api/account/google/route.ts

import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
// import type { Professional } from "@/lib/professionals"; // Removido
import { ensureAccount, getAccount } from "@/lib/account";
import { CALENDAR_SWAP_INTERVAL_MS, getPlanCalendarLimit } from "@/lib/plans";
import { CalendarWorkHours, LinkedCalendar } from "@/lib/google";
import { normalizeE164BR } from "@/lib/phone";

const DEFAULT_SLOT_DURATION_MINUTES = 60;

const DEFAULT_WORK_HOURS: CalendarWorkHours = {
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

function sanitizeSlotDuration(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return DEFAULT_SLOT_DURATION_MINUTES;
  }
  return Math.max(5, Math.min(8 * 60, Math.round(numeric)));
}

function sanitizeWorkHours(workHours: CalendarWorkHours | undefined | null): CalendarWorkHours {
  if (!workHours || typeof workHours !== "object") {
    return { ...DEFAULT_WORK_HOURS };
  }

  const entries = Object.entries(workHours);
  if (!entries.length) {
    return { ...DEFAULT_WORK_HOURS };
  }

  const normalized: CalendarWorkHours = {};
  for (const [day, slots] of entries) {
    if (!Array.isArray(slots)) continue;
    const cleaned = slots
      .map((slot) => (typeof slot === "string" ? slot.trim() : ""))
      .filter((slot) => /^\d{2}:\d{2}$/.test(slot));
    normalized[day] = cleaned;
  }

  return Object.keys(normalized).length ? normalized : { ...DEFAULT_WORK_HOURS };
}

function sanitizePrepaymentConfig(value: Partial<LinkedCalendar> | undefined | null) {
  if (!value) {
    return { ...DEFAULT_PREPAYMENT };
  }

  const requiresPrepayment = Boolean(value.requiresPrepayment);
  const prepaymentMode: "manual" | "stripe" = value.prepaymentMode === "stripe" ? "stripe" : "manual";
  const amount = Number(value.prepaymentAmountCents);
  const prepaymentAmountCents = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : DEFAULT_PREPAYMENT.prepaymentAmountCents;
  const currency = typeof value.prepaymentCurrency === "string" && value.prepaymentCurrency.trim()
    ? value.prepaymentCurrency.trim().toLowerCase()
    : DEFAULT_PREPAYMENT.prepaymentCurrency;
  const manualPixKey = typeof value.manualPixKey === "string" ? value.manualPixKey.trim() : DEFAULT_PREPAYMENT.manualPixKey;
  const manualInstructions = typeof value.manualInstructions === "string"
    ? value.manualInstructions.trim()
    : DEFAULT_PREPAYMENT.manualInstructions;

  return {
    requiresPrepayment,
    prepaymentMode,
    prepaymentAmountCents,
    prepaymentCurrency: currency,
    manualPixKey,
    manualInstructions,
  };
}

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const account = await ensureAccount(auth.uid, auth.email ?? null);
  return NextResponse.json({ ok: true, account });
}

type Body =
  | {
      action: "link";
      calendar: {
        id: string;
        summary: string;
        description: string;
        whatsappNumber: string;
        slotDurationMinutes?: number;
        workHours?: CalendarWorkHours;
        requiresPrepayment?: boolean;
        prepaymentMode?: "manual" | "stripe";
        prepaymentAmountCents?: number;
        prepaymentCurrency?: string;
        manualPixKey?: string;
        manualInstructions?: string;
        logoPath?: string;
      };
    }
  | { action: "unlink"; id: string }
  | { action: "unlinkAll" }
  | { action: "setActive"; id: string }
  | { action: "regenPublicToken"; id: string }
  | {
      action: "updateCalendar";
      id: string;
      description?: string;
      whatsappNumber?: string;
      slotDurationMinutes?: number;
      workHours?: CalendarWorkHours;
      requiresPrepayment?: boolean;
      prepaymentMode?: "manual" | "stripe";
      prepaymentAmountCents?: number;
      prepaymentCurrency?: string;
      manualPixKey?: string;
      manualInstructions?: string;
      logoPath?: string;
    };

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
    const {
      id,
      summary,
      description,
      whatsappNumber,
      slotDurationMinutes,
      workHours,
      requiresPrepayment,
      prepaymentMode,
      prepaymentAmountCents,
      prepaymentCurrency,
      manualPixKey,
      manualInstructions,
      logoPath,
    } = body.calendar ?? { id: "", summary: "", description: "", whatsappNumber: "" };
    if (!id || !summary || !description || !whatsappNumber) {
      return NextResponse.json({ error: "Informe id, summary, description e whatsappNumber do calendário" }, { status: 400 });
    }

    const normalizedWhatsapp = normalizeE164BR(whatsappNumber || "");
    if (!normalizedWhatsapp) {
      return NextResponse.json({ error: "WhatsApp inválido. Use +55DDDNÚMERO." }, { status: 400 });
    }

    const existsIdx = account.linkedCalendars.findIndex((c) => c.id === id);
    if (existsIdx !== -1) {
      // Já vinculado: apenas atualiza os detalhes e define como ativo (sem contar como troca se já era ativo)
      const alreadyActive = account.activeCalendarId === id;
      const prepaymentConfig = sanitizePrepaymentConfig({
        requiresPrepayment,
        prepaymentMode,
        prepaymentAmountCents,
        prepaymentCurrency,
        manualPixKey,
        manualInstructions,
      });

      const updatedCalendar: LinkedCalendar = {
        ...account.linkedCalendars[existsIdx],
        description,
        whatsappNumber: normalizedWhatsapp,
        slotDurationMinutes: sanitizeSlotDuration(
          slotDurationMinutes ?? account.linkedCalendars[existsIdx]?.slotDurationMinutes
        ),
        workHours: sanitizeWorkHours(workHours ?? account.linkedCalendars[existsIdx]?.workHours),
        requiresPrepayment: prepaymentConfig.requiresPrepayment,
        prepaymentMode: prepaymentConfig.prepaymentMode,
        prepaymentAmountCents: prepaymentConfig.prepaymentAmountCents,
        prepaymentCurrency: prepaymentConfig.prepaymentCurrency,
        manualPixKey: prepaymentConfig.manualPixKey,
        manualInstructions: prepaymentConfig.manualInstructions,
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
      {
        const dbRef = (await import("@/lib/firebaseAdmin")).getDb();
        await dbRef.collection("accounts").doc(account.uid).set(payload, { merge: true });
        // manter índice por slug atualizado
        if (updatedCalendar.slug) {
          await dbRef.collection("linkedCalendars").doc(updatedCalendar.slug).set(updatedCalendar);
        }
      }
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

    const prepaymentConfig = sanitizePrepaymentConfig({
      requiresPrepayment,
      prepaymentMode,
      prepaymentAmountCents,
      prepaymentCurrency,
      manualPixKey,
      manualInstructions,
    });

    // token público para compartilhar link com hash
    const publicToken = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);

    const newLinkedCalendar: LinkedCalendar = {
      id,
      summary,
      ownerUid: auth.uid,
      slug,
      description,
      whatsappNumber: normalizedWhatsapp,
      active: true, // Nova agenda é ativa por padrão
      slotDurationMinutes: sanitizeSlotDuration(slotDurationMinutes),
      workHours: sanitizeWorkHours(workHours),
      requiresPrepayment: prepaymentConfig.requiresPrepayment,
      prepaymentMode: prepaymentConfig.prepaymentMode,
      prepaymentAmountCents: prepaymentConfig.prepaymentAmountCents,
      prepaymentCurrency: prepaymentConfig.prepaymentCurrency,
      manualPixKey: prepaymentConfig.manualPixKey,
      manualInstructions: prepaymentConfig.manualInstructions,
      publicToken,
      logoPath: typeof logoPath === "string" && logoPath.trim() ? logoPath.trim() : null,
    };

    const nextLinkedCalendars = [...account.linkedCalendars, newLinkedCalendar];
    const payload: Record<string, unknown> = {
      linkedCalendars: nextLinkedCalendars,
      activeCalendarId: account.activeCalendarId ?? id, // Se não houver ativo, define automaticamente
      updatedAt: new Date(now).toISOString(),
    };
    await db.collection("accounts").doc(account.uid).set(payload, { merge: true });
    // indexar por slug para consulta pública
    await db.collection("linkedCalendars").doc(slug).set(newLinkedCalendar);
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
    {
      const dbRef = (await import("@/lib/firebaseAdmin")).getDb();
      await dbRef.collection("accounts").doc(account.uid).set(payload, { merge: true });
      // remover índice deste slug
      try {
        const removed = account.linkedCalendars.find((c) => c.id === id);
        if (removed?.slug) {
          await dbRef.collection("linkedCalendars").doc(removed.slug).delete();
        }
      } catch {}
    }
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
    {
      const dbRef = (await import("@/lib/firebaseAdmin")).getDb();
      // remover todos os índices desta conta
      try {
        for (const cal of account.linkedCalendars) {
          if (cal.slug) {
            await dbRef.collection("linkedCalendars").doc(cal.slug).delete().catch(() => {});
          }
        }
      } catch {}
      await dbRef.collection("accounts").doc(account.uid).set(payload, { merge: true });
    }
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

  if (body.action === "regenPublicToken") {
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Informe id" }, { status: 400 });
    const idx = account.linkedCalendars.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "Agenda não encontrada" }, { status: 404 });
    const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    const updated = { ...account.linkedCalendars[idx], publicToken: token } as LinkedCalendar;
    const next = [...account.linkedCalendars];
    next[idx] = updated;
    const payload = { linkedCalendars: next, updatedAt: new Date().toISOString() } as Record<string, unknown>;
    const dbRef = (await import("@/lib/firebaseAdmin")).getDb();
    await dbRef.collection("accounts").doc(account.uid).set(payload, { merge: true });
    if (updated.slug) {
      await dbRef.collection("linkedCalendars").doc(updated.slug).set(updated);
    }
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  if (body.action === "updateCalendar") {
    const {
      id,
      description,
      whatsappNumber,
      slotDurationMinutes,
      workHours,
      requiresPrepayment,
      prepaymentMode,
      prepaymentAmountCents,
      prepaymentCurrency,
      manualPixKey,
      manualInstructions,
      logoPath,
    } = body;
    if (!id) {
      return NextResponse.json({ error: "Informe id" }, { status: 400 });
    }
    const calendarIndex = account.linkedCalendars.findIndex((c) => c.id === id);
    if (calendarIndex === -1) {
      return NextResponse.json({ error: "Agenda não encontrada para atualização" }, { status: 404 });
    }

    const current = account.linkedCalendars[calendarIndex];
    const prepaymentConfig = sanitizePrepaymentConfig({
      requiresPrepayment,
      prepaymentMode,
      prepaymentAmountCents,
      prepaymentCurrency,
      manualPixKey,
      manualInstructions,
    });
    const updatedCalendar: LinkedCalendar = {
      ...current,
      description: typeof description === "string" && description.trim() ? description.trim() : current.description,
      whatsappNumber:
        typeof whatsappNumber === "string" && whatsappNumber.trim()
          ? (normalizeE164BR(whatsappNumber || "") || current.whatsappNumber)
          : current.whatsappNumber,
      slotDurationMinutes: sanitizeSlotDuration(
        typeof slotDurationMinutes !== "undefined" ? slotDurationMinutes : current.slotDurationMinutes
      ),
      workHours: workHours ? sanitizeWorkHours(workHours) : current.workHours ?? sanitizeWorkHours(undefined),
      requiresPrepayment: prepaymentConfig.requiresPrepayment,
      prepaymentMode: prepaymentConfig.prepaymentMode,
      prepaymentAmountCents: prepaymentConfig.prepaymentAmountCents,
      prepaymentCurrency: prepaymentConfig.prepaymentCurrency,
      manualPixKey: prepaymentConfig.manualPixKey,
      manualInstructions: prepaymentConfig.manualInstructions,
      logoPath: typeof logoPath === "string" && logoPath.trim() ? logoPath.trim() : current.logoPath ?? null,
    };
    const nextLinkedCalendars = [...account.linkedCalendars];
    nextLinkedCalendars[calendarIndex] = updatedCalendar;

    const payload: Record<string, unknown> = {
      linkedCalendars: nextLinkedCalendars,
      updatedAt: new Date(now).toISOString(),
    };
    {
      const dbRef = (await import("@/lib/firebaseAdmin")).getDb();
      await dbRef.collection("accounts").doc(account.uid).set(payload, { merge: true });
      // manter índice por slug atualizado
      if (updatedCalendar.slug) {
        await dbRef.collection("linkedCalendars").doc(updatedCalendar.slug).set(updatedCalendar);
      }
    }
    return NextResponse.json({ ok: true, account: { ...account, ...payload } });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
