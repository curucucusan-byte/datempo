// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/lib/account.ts

import { getDb } from "@/lib/firebaseAdmin";
import {
  ACTIVE_PLANS,
  DEFAULT_ACTIVE_PLAN_ID,
  getPlanCalendarLimit,
  isActivePlan,
  type ActivePlanId,
  type PlanId,
} from "@/lib/plans";
import { LinkedCalendar } from "@/lib/google"; // Importar o novo tipo LinkedCalendar

export type ReminderSettings = {
  enabled: boolean;
  windowMinutes: number;
};

export type Account = {
  uid: string;
  email?: string | null;
  plan: PlanId;
  status: "active" | "trial" | "past_due" | "canceled";
  trialEndsAt?: string | null; // ISO
  reminders: ReminderSettings;
  linkedCalendars: LinkedCalendar[]; // Usar o novo tipo LinkedCalendar
  activeCalendarId?: string | null;
  lastCalendarSwapAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

const COLLECTION = "accounts";

function nowIso() {
  return new Date().toISOString();
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function defaultRemindersForPlan(plan: PlanId): ReminderSettings {
  const baseMinutes = 120;
  if (plan === "pro") {
    return { enabled: true, windowMinutes: baseMinutes };
  }
  return { enabled: false, windowMinutes: baseMinutes };
}

function sanitizeReminders(plan: PlanId, value: ReminderSettings | undefined): ReminderSettings {
  const base = value ?? defaultRemindersForPlan(plan);
  const minutes = Number.isFinite(base.windowMinutes) ? Math.max(5, Math.round(base.windowMinutes)) : 120;
  if (plan !== "pro") {
    return { enabled: Boolean(base.enabled), windowMinutes: minutes }; // Alterado para manter enabled se for false
  }
  return { enabled: Boolean(base.enabled), windowMinutes: minutes };
}

function applyPlanConstraints(account: Account, plan: PlanId) {
  const limit = getPlanCalendarLimit(plan);
  const calendars = account.linkedCalendars.map((calendar, index) => {
    const withinLimit = limit === 0 ? false : index < limit;
    return {
      ...calendar,
      active: withinLimit ? calendar.active !== false : false,
    };
  });

  let activeCalendarId = account.activeCalendarId ?? null;
  if (activeCalendarId) {
    const stillActive = calendars.some((calendar) => calendar.id === activeCalendarId && calendar.active);
    if (!stillActive) {
      activeCalendarId = calendars.find((calendar) => calendar.active)?.id ?? null;
    }
  } else {
    activeCalendarId = calendars.find((calendar) => calendar.active)?.id ?? null;
  }

  const reminders = sanitizeReminders(plan, account.reminders);

  return {
    linkedCalendars: calendars,
    activeCalendarId,
    reminders,
  } satisfies Pick<Account, "linkedCalendars" | "activeCalendarId" | "reminders">;
}

function normalizePlan(plan: unknown): PlanId {
  if (plan === "inactive") return "inactive";
  if (plan === "essencial" || plan === "pro") return plan;
  return "inactive";
}

function normalizeAccount(data: Account): Account {
  const plan = normalizePlan(data.plan);
  const reminders = sanitizeReminders(plan, data.reminders);
  return {
    ...data,
    plan,
    reminders,
    linkedCalendars: Array.isArray(data.linkedCalendars) ? data.linkedCalendars : [],
    activeCalendarId: data.activeCalendarId ?? null,
    lastCalendarSwapAt: data.lastCalendarSwapAt ?? null,
  };
}

async function maybeExpireTrial(account: Account): Promise<Account> {
  if (account.status !== "trial" || !account.trialEndsAt) {
    return account;
  }
  const ends = new Date(account.trialEndsAt);
  if (Number.isNaN(ends.getTime()) || ends.getTime() > Date.now()) {
    return account;
  }
  const db = getDb();
  const updates: Partial<Account> = {
    status: "active",
    plan: "essencial",
    updatedAt: nowIso(),
  };
  await db.collection(COLLECTION).doc(account.uid).set(updates, { merge: true });
  const constrained = applyPlanConstraints({ ...account, ...updates }, "essencial");
  return normalizeAccount({ ...account, ...updates, ...constrained });
}

export async function getAccount(uid: string): Promise<Account | null> {
  const db = getDb();
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  const raw = doc.data() as Account;
  const normalized = normalizeAccount(raw);
  return maybeExpireTrial(normalized);
}

export async function ensureAccount(uid: string, email?: string | null): Promise<Account> {
  const existing = await getAccount(uid);
  if (existing) return existing;
  const plan: ActivePlanId = DEFAULT_ACTIVE_PLAN_ID;
  const now = nowIso();
  const trialEnds = addDays(ACTIVE_PLANS[plan].trialDays);
  const account: Account = {
    uid,
    email: email ?? null,
    plan,
    status: "trial",
    trialEndsAt: trialEnds,
    reminders: defaultRemindersForPlan(plan),
    linkedCalendars: [], // Inicializar como array vazio de LinkedCalendar
    activeCalendarId: null,
    lastCalendarSwapAt: null,
    createdAt: now,
    updatedAt: now,
  };
  const db = getDb();
  await db.collection(COLLECTION).doc(uid).set(account);
  return normalizeAccount(account);
}

export function isAccountActive(account: Account): boolean {
  if (account.plan === "inactive") return false;
  if (account.status === "active") return true;
  if (account.status !== "trial") return false;
  if (!account.trialEndsAt) return true;
  const ends = new Date(account.trialEndsAt);
  return !Number.isNaN(ends.getTime()) && ends.getTime() > Date.now();
}

export function getReminderSettings(account: Account): ReminderSettings {
  return sanitizeReminders(account.plan, account.reminders);
}

export function canSendReminders(account: Account): boolean {
  if (!isAccountActive(account)) return false;
  if (account.plan !== "pro") return false;
  return getReminderSettings(account).enabled;
}

export async function updateAccount(
  uid: string,
  updates: {
    plan?: PlanId;
    status?: Account["status"];
    trialEndsAt?: string | null;
    reminders?: Partial<ReminderSettings>;
    linkedCalendars?: LinkedCalendar[]; // Permitir atualização de linkedCalendars
    activeCalendarId?: string | null;
  }
): Promise<Account> {
  const current = await ensureAccount(uid, null);

  const nextPlan = normalizePlan(updates.plan ?? current.plan);
  const nextStatus = updates.status ?? current.status;

  const payload: Partial<Account> = {
    plan: nextPlan,
    status: nextStatus,
    updatedAt: nowIso(),
  };

  if (typeof updates.trialEndsAt !== "undefined") {
    payload.trialEndsAt = updates.trialEndsAt;
  }

  if (typeof updates.reminders !== "undefined") {
    const baseAccount = normalizeAccount({ ...current, plan: nextPlan } as Account);
    const merged: ReminderSettings = {
      ...baseAccount.reminders,
      ...updates.reminders,
    } as ReminderSettings;
    payload.reminders = sanitizeReminders(nextPlan, merged);
  }

  if (typeof updates.linkedCalendars !== "undefined") {
    payload.linkedCalendars = updates.linkedCalendars;
  }

  if (typeof updates.activeCalendarId !== "undefined") {
    payload.activeCalendarId = updates.activeCalendarId;
  }

  if (updates.plan && isActivePlan(nextPlan) && nextStatus === "trial" && !updates.trialEndsAt) {
    payload.trialEndsAt = addDays(ACTIVE_PLANS[nextPlan].trialDays);
  }

  // Garantir que plano ativo tenha lembranças coerentes
  const accountForConstraints: Account = {
    ...current,
    ...payload,
    reminders: sanitizeReminders(nextPlan, payload.reminders ?? current.reminders),
    linkedCalendars: payload.linkedCalendars ?? current.linkedCalendars,
    activeCalendarId: payload.activeCalendarId ?? current.activeCalendarId,
    trialEndsAt: payload.trialEndsAt ?? current.trialEndsAt,
    createdAt: current.createdAt,
    updatedAt: payload.updatedAt ?? current.updatedAt,
  };

  const constrained = applyPlanConstraints(accountForConstraints, nextPlan);
  payload.linkedCalendars = constrained.linkedCalendars;
  payload.activeCalendarId = constrained.activeCalendarId;
  payload.reminders = constrained.reminders;

  const db = getDb();
  await db.collection(COLLECTION).doc(uid).set(payload, { merge: true });
  const refreshed = await getAccount(uid);
  if (!refreshed) {
    throw new Error("Falha ao atualizar conta.");
  }
  return refreshed;
}
