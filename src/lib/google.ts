// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/lib/google.ts

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

import { getDb } from "@/lib/firebaseAdmin";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar", // Adicionado para permitir escrita
  "https://www.googleapis.com/auth/userinfo.email",
];

export type CalendarWorkHours = Record<string, string[]>;

const DEFAULT_CALENDAR_TIMEZONE = process.env.DEFAULT_CALENDAR_TIMEZONE || "America/Sao_Paulo";

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Variável ${name} não configurada.`);
  }
  return value;
}

function getRedirectUri() {
  const fromEnv = process.env.GOOGLE_REDIRECT_URI;
  if (fromEnv) return fromEnv;
  const base = required("APP_BASE_URL", process.env.APP_BASE_URL).replace(/\/$/, "");
  return `${base}/api/google/oauth/callback`;
}

export function getOAuthClient() {
  const clientId = required("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  const clientSecret = required("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
  const redirectUri = getRedirectUri();
  return new OAuth2Client({ clientId, clientSecret, redirectUri });
}

export function getAuthUrl(state?: string) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    include_granted_scopes: true,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

const TOKENS_COLLECTION = "googleTokens";

export type GoogleTokens = {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  scope?: string | null;
  token_type?: string | null;
};

export async function storeTokens(uid: string, tokens: GoogleTokens) {
  const db = getDb();
  const now = new Date().toISOString();
  await db.collection(TOKENS_COLLECTION).doc(uid).set({ ...tokens, updatedAt: now }, { merge: true });
}

export async function getTokens(uid: string): Promise<GoogleTokens | null> {
  const db = getDb();
  const doc = await db.collection(TOKENS_COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return (doc.data() as GoogleTokens) ?? null;
}

export async function getAuthenticatedClient(uid: string): Promise<OAuth2Client | null> {
  const tokens = await getTokens(uid);
  if (!tokens) return null;
  const client = getOAuthClient();
  
  // Filter out null values before setting credentials
  const credentials = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
    scope: tokens.scope ?? undefined,
    token_type: tokens.token_type ?? undefined,
  };
  
  client.setCredentials(credentials);
  client.on("tokens", async (t) => {
    try {
      await storeTokens(uid, {
        access_token: t.access_token ?? tokens.access_token,
        refresh_token: t.refresh_token ?? tokens.refresh_token,
        expiry_date: t.expiry_date ?? tokens.expiry_date,
        scope: t.scope ?? tokens.scope,
        token_type: t.token_type ?? tokens.token_type,
      });
    } catch {
      // best-effort
    }
  });
  return client;
}

export type LinkedCalendar = {
  id: string;
  summary: string;
  ownerUid: string;
  slug: string;
  description: string;
  whatsappNumber: string;
  active: boolean;
  slotDurationMinutes?: number | null;
  workHours?: CalendarWorkHours;
  requiresPrepayment?: boolean;
  prepaymentMode?: "manual" | "stripe";
  prepaymentAmountCents?: number | null;
  prepaymentCurrency?: string | null;
  manualPixKey?: string | null;
  manualInstructions?: string | null;
  // Acesso público com hash/token opcional
  publicToken?: string | null;
  // Suporte a logotipo em /public (opcional)
  logoPath?: string | null; // exemplo: "/agenda-logos/{slug}/logo.webp"
};

export async function listCalendars(uid: string) {
  const auth = await getAuthenticatedClient(uid);
  if (!auth) return null;
  const cal = google.calendar({ version: "v3", auth });
  const resp = await cal.calendarList.list({});
  const items = resp.data.items || [];
  return items.map((c) => ({ id: String(c.id), summary: String(c.summary || c.id) }));
}

export async function getPrimaryCalendar(uid: string): Promise<{ id: string; summary: string } | null> {
  const auth = await getAuthenticatedClient(uid);
  if (!auth) return null;
  const cal = google.calendar({ version: "v3", auth });
  const resp = await cal.calendarList.list({});
  const items = resp.data.items || [];
  const primary = items.find((c) => (c.primary === true) || (c.id === "primary"));
  if (!primary) return null;
  return { id: String(primary.id), summary: String(primary.summary || primary.id) };
}

export async function getLinkedCalendarBySlug(slug: string): Promise<LinkedCalendar | null> {
  const db = getDb();
  // Nova estratégia: coleção indexada por slug
  const bySlug = await db.collection("linkedCalendars").doc(slug).get();
  if (bySlug.exists) {
    const data = bySlug.data() as LinkedCalendar | null;
    return data ?? null;
  }
  // Backwards compatibility: tentar encontrar dentro do array (pode não funcionar em todos cenários no Firestore)
  try {
    const snapshot = await db
      .collection("accounts")
      .where("linkedCalendars.slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const accountData = snapshot.docs[0].data();
    const linkedCalendars = accountData.linkedCalendars as LinkedCalendar[];
    return linkedCalendars.find((cal) => cal.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function getLinkedCalendarBySlugWithToken(
  slug: string,
  token?: string | null,
): Promise<LinkedCalendar | null> {
  const cal = await getLinkedCalendarBySlug(slug);
  if (!cal) return null;
  const requiredToken = cal.publicToken?.trim();
  if (!requiredToken) return cal; // sem token definido, acesso aberto (retrocompatibilidade)
  if ((token || "").trim() === requiredToken) return cal;
  return null;
}

export async function freeBusyForDate(uid: string, calendarId: string, date: string) {
  const auth = await getAuthenticatedClient(uid);
  if (!auth) return null;
  const cal = google.calendar({ version: "v3", auth });
  const timeMin = new Date(`${date}T00:00:00.000Z`).toISOString();
  const timeMax = new Date(`${date}T23:59:59.999Z`).toISOString();
  const resp = await cal.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    },
  });
  const busy = resp.data.calendars?.[calendarId]?.busy ?? [];
  const result = busy
    .map((b) => ({ start: String(b.start), end: String(b.end) }))
    .filter((b) => b.start && b.end);
  return result;
}

export async function createGoogleCalendarEvent(
  ownerUid: string,
  calendarId: string,
  summary: string,
  description: string,
  start: Date,
  end: Date,
  attendees: { email: string }[] = [],
  timeZone?: string,
) {
  const auth = await getAuthenticatedClient(ownerUid);
  if (!auth) {
    const errorMsg = `Cliente Google não autenticado para criar evento. OwnerUid: ${ownerUid}`;
    console.error("[google:event:create:no-auth]", { ownerUid, calendarId });
    throw new Error(errorMsg);
  }

  const calendar = google.calendar({ version: "v3", auth });

  const tz = timeZone && isValidTimeZone(timeZone) ? timeZone : DEFAULT_CALENDAR_TIMEZONE;

  const event = {
    summary: summary,
    description: description,
    start: {
      dateTime: start.toISOString(),
      timeZone: tz, // Mantém eventos alinhados ao fuso da agenda
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: tz,
    },
    attendees: attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 24 horas antes
        { method: "popup", minutes: 10 }, // 10 minutos antes
      ],
    },
  };

  console.info("[google:event:create:start]", {
    ownerUid,
    calendarId,
    summary,
    start: event.start,
    attendeesCount: attendees?.length ?? 0,
  });

  try {
    const res = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    console.info("[google:event:create:ok]", {
      ownerUid,
      calendarId,
      eventId: res.data?.id,
      htmlLink: res.data?.htmlLink,
    });

    return res.data;
  } catch (error: unknown) {
    console.error("[google:event:create:error]", {
      ownerUid,
      calendarId,
      error: error instanceof Error ? error.message : String(error),
      errorDetails: error,
    });

    // Re-lançar com mensagem mais específica
    if (error instanceof Error) {
      throw new Error(`Falha ao criar evento no Google Calendar: ${error.message}`);
    }
    throw error;
  }
}

function isValidTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
