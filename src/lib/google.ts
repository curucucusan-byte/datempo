import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

import { getDb } from "@/lib/firebaseAdmin";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
];

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

export async function getAuthorizedClientForUid(uid: string): Promise<OAuth2Client | null> {
  const tokens = await getTokens(uid);
  if (!tokens) return null;
  const client = getOAuthClient();
  client.setCredentials(tokens);
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

export async function listCalendars(uid: string) {
  const auth = await getAuthorizedClientForUid(uid);
  if (!auth) return null;
  const cal = google.calendar({ version: "v3", auth });
  const resp = await cal.calendarList.list({});
  const items = resp.data.items || [];
  return items.map((c) => ({ id: String(c.id), summary: String(c.summary || c.id) }));
}

export async function getPrimaryCalendar(uid: string): Promise<{ id: string; summary: string } | null> {
  const auth = await getAuthorizedClientForUid(uid);
  if (!auth) return null;
  const cal = google.calendar({ version: "v3", auth });
  const resp = await cal.calendarList.list({});
  const items = resp.data.items || [];
  const primary = items.find((c) => (c.primary === true) || (c.id === "primary"));
  if (!primary) return null;
  return { id: String(primary.id), summary: String(primary.summary || primary.id) };
}

export async function freeBusyForDate(uid: string, calendarId: string, date: string) {
  const auth = await getAuthorizedClientForUid(uid);
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