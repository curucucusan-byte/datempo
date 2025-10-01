import professionalsData from "@/data/professionals.json";

import { getDb } from "@/lib/firebaseAdmin";

export type Professional = {
  slug: string;
  name: string;
  description?: string;
  phone?: string;
  ownerUid?: string;
  // Se definido, este perfil representa diretamente um calendário Google específico
  calendarId?: string;
  services: { name: string; minutes: number }[];
  workHours: Record<string, string[]>;
};

const professionals: Professional[] = Array.isArray(professionalsData)
  ? (professionalsData as Professional[])
  : [];

const FIREBASE_ENABLED = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

export function isFirestoreEnabledForProfessionals() {
  return FIREBASE_ENABLED;
}

const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type RawService = {
  name?: unknown;
  minutes?: unknown;
};

type RawWorkHours = Record<string, unknown>;

export function normalizeServicesInput(input: unknown): Professional["services"] {
  if (!Array.isArray(input)) return [];
  const normalized: Professional["services"] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const raw = item as RawService;
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const minutesValue = typeof raw.minutes === "number" ? raw.minutes : Number(raw.minutes);
    if (!name || !Number.isFinite(minutesValue) || minutesValue <= 0) continue;
    normalized.push({ name, minutes: Math.round(minutesValue) });
  }
  return normalized;
}

export function normalizeWorkHoursInput(input: unknown): Record<string, string[]> {
  if (!input || typeof input !== "object") return {};
  const raw = input as RawWorkHours;
  const normalized: Record<string, string[]> = {};
  for (const day of WEEKDAY_KEYS) {
    const value = raw[day];
    if (!Array.isArray(value)) continue;
    const slots = value
      .map((slot) => (typeof slot === "string" ? slot.trim() : ""))
      .filter((slot) => /^\d{2}:\d{2}$/.test(slot));
    if (slots.length) {
      normalized[day] = Array.from(new Set(slots));
    }
  }
  return normalized;
}

export function listProfessionals(): Professional[] {
  return professionals;
}

export function getProfessional(slug: string): Professional | undefined {
  return professionals.find((p) => p.slug === slug);
}

export async function listProfessionalsByOwner(ownerUid: string): Promise<Professional[]> {
  if (FIREBASE_ENABLED) {
    try {
      const db = getDb();
      const snapshot = await db.collection("professionals").where("ownerUid", "==", ownerUid).get();
      return snapshot.docs.map((doc) => doc.data() as Professional);
    } catch (err) {
      console.error("Erro ao listar profissionais do Firestore:", err);
      return [];
    }
  }
  return professionals.filter((p) => p.ownerUid === ownerUid);
}

export async function getProfessionalFromFirestore(slug: string): Promise<Professional | undefined> {
  if (!FIREBASE_ENABLED) return undefined;
  try {
    const db = getDb();
    const doc = await db.collection("professionals").doc(slug).get();
    if (!doc.exists) return undefined;
    return doc.data() as Professional;
  } catch (err) {
    console.error("Erro ao ler professional do Firestore:", err);
    return undefined;
  }
}

export async function resolveProfessional(slug: string): Promise<Professional | undefined> {
  const local = getProfessional(slug);
  if (local) return local;
  return getProfessionalFromFirestore(slug);
}

export async function upsertProfessional(professional: Professional): Promise<void> {
  if (!FIREBASE_ENABLED) {
    throw new Error("Firestore não está habilitado. Configure as variáveis Firebase Admin.");
  }
  const db = getDb();
  await db.collection("professionals").doc(professional.slug).set(professional, { merge: true });
}

export function getServiceMinutes(
  professional: Professional,
  service: string,
  fallback: number
): number {
  return (
    professional.services.find((s) => s.name === service)?.minutes ?? fallback
  );
}
