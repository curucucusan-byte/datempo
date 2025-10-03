import fs from "node:fs/promises";
import path from "node:path";

import { getDb } from "@/lib/firebaseAdmin";

export type Appointment = {
  id: string;
  slug: string;
  customerName: string;
  customerPhone: string;
  startISO: string;
  endISO: string;
  ownerUid?: string | null;
  createdAt: string;
  reminderSentAt?: string | null;
  paymentStatus?: "not_required" | "pending" | "paid" | "failed";
  paymentMode?: "manual" | "stripe" | null;
  paymentAmountCents?: number | null;
  paymentCurrency?: string | null;
  paymentReference?: string | null;
  paymentInstructions?: string | null;
};

const FIRESTORE_ENABLED = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

const storeFile =
  process.env.APPOINTMENTS_FILE ||
  path.join(process.cwd(), "data", "appointments.json");

let cache: Appointment[] | null = null;
let cacheMtime = 0;

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && typeof (error as NodeJS.ErrnoException).code === "string";
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function loadFromFile(): Promise<Appointment[]> {
  try {
    const stat = await fs.stat(storeFile);
    if (cache && stat.mtimeMs === cacheMtime) {
      return cache.map((x) => ({ ...x }));
    }
    const raw = await fs.readFile(storeFile, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error("invalid appointments data");
    cache = data as Appointment[];
    cacheMtime = stat.mtimeMs;
    return cache.map((x) => ({ ...x }));
  } catch (err: unknown) {
    if (isErrnoException(err) && err.code === "ENOENT") {
      cache = [];
      cacheMtime = Date.now();
      return [];
    }
    throw err;
  }
}

async function saveToFile(list: Appointment[]): Promise<void> {
  await ensureDir(storeFile);
  const serialized = JSON.stringify(list, null, 2);
  await fs.writeFile(storeFile, serialized, "utf8");
  cache = list.map((x) => ({ ...x }));
  cacheMtime = Date.now();
}

async function loadFromFirestore(): Promise<Appointment[]> {
  const db = getDb();
  const snapshot = await db.collection("appointments").orderBy("startISO").get();
  return snapshot.docs.map((doc) => doc.data() as Appointment);
}

async function addToFirestore(appt: Appointment): Promise<void> {
  const db = getDb();
  await db.collection("appointments").doc(appt.id).set(appt);
}

export async function loadAppointments(): Promise<Appointment[]> {
  if (FIRESTORE_ENABLED) {
    return loadFromFirestore();
  }
  return loadFromFile();
}

export async function addAppointment(appt: Appointment): Promise<void> {
  if (FIRESTORE_ENABLED) {
    await addToFirestore(appt);
    return;
  }
  const list = await loadFromFile();
  list.push(appt);
  await saveToFile(list);
}

export async function replaceAppointments(list: Appointment[]): Promise<void> {
  if (FIRESTORE_ENABLED) {
    const db = getDb();
    const batchSize = list.length;
    const batch = db.batch();
    for (const appt of list) {
      const ref = db.collection("appointments").doc(appt.id);
      batch.set(ref, appt);
    }
    if (batchSize > 0) {
      await batch.commit();
    }
    return;
  }
  await saveToFile(list);
}

export async function markReminderSent(id: string, whenISO: string): Promise<void> {
  if (FIRESTORE_ENABLED) {
    const db = getDb();
    await db.collection("appointments").doc(id).update({ reminderSentAt: whenISO });
    return;
  }

  const list = await loadFromFile();
  const idx = list.findIndex((apt) => apt.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], reminderSentAt: whenISO };
  await saveToFile(list);
}
