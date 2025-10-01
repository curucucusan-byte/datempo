// src/app/api/lead/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { rateLimit } from "@/lib/ratelimit";
import { getDb } from "@/lib/firebaseAdmin";

type Lead = {
  email: string;
  source?: string;
  ts: string;
  ua?: string;
  utm?: Record<string, string>;
};

const isProd = process.env.NODE_ENV === "production";
const FORMSPREE_ID = process.env.FORMSPREE_ID; // opcional em prod
const DUPLICATE_TTL_MS = 1000 * 60 * 60 * 12; // 12h
const FIRESTORE_ENABLED = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

const LEADS_FILE = path.join(process.cwd(), "leads.dev.json");

const seenEmails = new Map<string, number>();

function isDuplicate(email: string, now: number) {
  const ts = seenEmails.get(email);
  if (typeof ts === "number" && now - ts < DUPLICATE_TTL_MS) {
    return true;
  }
  return false;
}

function rememberEmail(email: string, now: number) {
  seenEmails.set(email, now);
  // limpeza simples para evitar crescimento infinito
  for (const [key, ts] of seenEmails) {
    if (now - ts > DUPLICATE_TTL_MS) {
      seenEmails.delete(key);
    }
  }
}

async function persistLead(lead: Lead, now: number) {
  if (FIRESTORE_ENABLED) {
    const db = getDb();
    const docRef = db.collection("leads").doc(lead.email);
    const doc = await docRef.get();
    if (doc.exists) {
      rememberEmail(lead.email, now);
      return { duplicate: true, message: "Lead já registrado." } as const;
    }
    await docRef.set({
      ...lead,
      createdAt: lead.ts,
      lastSeenAt: new Date(now).toISOString(),
    });
    rememberEmail(lead.email, now);
    return { duplicate: false } as const;
  }

  let arr: Lead[] = [];
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf8");
    arr = JSON.parse(raw);
    if (!Array.isArray(arr)) arr = [];
  } catch {}

  if (arr.some((item) => item.email === lead.email)) {
    rememberEmail(lead.email, now);
    return { duplicate: true, message: "Lead já registrado." } as const;
  }

  arr.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(arr, null, 2), "utf8");
  rememberEmail(lead.email, now);
  return { duplicate: false } as const;
}

export async function POST(req: Request) {
  try {
    const ipHeader =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "";
    const ip = ipHeader.split(",")[0].trim() || "local";
    const rl = rateLimit(`lead:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em instantes." },
        { status: 429 }
      );
    }

    if (isProd && !FORMSPREE_ID) {
      return NextResponse.json(
        { error: "FORMSPREE_ID não configurado. Defina a variável de ambiente no deploy." },
        { status: 500 }
      );
    }

    const { email, source, utm } = (await req.json()) as {
      email?: unknown;
      source?: unknown;
      utm?: unknown;
    };
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email inválido" }, { status: 400 });
    }

    const utmEntries =
      utm && typeof utm === "object" && !Array.isArray(utm)
        ? Object.entries(utm).filter(([, value]) => typeof value === "string" && value.trim())
        : [];
    const utmData = utmEntries.length
      ? Object.fromEntries(utmEntries.map(([k, v]) => [k, (v as string).trim()]))
      : undefined;

    const lead: Lead = {
      email: email.trim().toLowerCase(),
      source: typeof source === "string" && source.trim() ? source.trim() : undefined,
      ts: new Date().toISOString(),
      ua: req.headers.get("user-agent") ?? undefined,
      utm: utmData,
    };

    const now = Date.now();

    if (isDuplicate(lead.email, now)) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: "Lead já registrado recentemente." },
        { status: 200 }
      );
    }

    const storeResult = await persistLead(lead, now);
    if (storeResult.duplicate) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: storeResult.message },
        { status: 200 }
      );
    }

    if (isProd && FORMSPREE_ID) {
      // envia para Formspree (crie um form e coloque o ID como env)
      const r = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(lead),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Formspree error: ${r.status} ${text}`);
      }
    }

    return NextResponse.json({ ok: true, message: "Lead registrado." });
  } catch (err: unknown) {
    console.error("Lead POST error:", err);
    const message = err instanceof Error ? err.message : "erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
