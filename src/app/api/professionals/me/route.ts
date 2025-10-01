import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
import {
  listProfessionalsByOwner,
  getProfessionalFromFirestore,
  upsertProfessional,
  isFirestoreEnabledForProfessionals,
  normalizeServicesInput,
  normalizeWorkHoursInput,
  type Professional,
} from "@/lib/professionals";

function sanitizeSlug(slug: unknown) {
  if (typeof slug !== "string") return null;
  const trimmed = slug.trim().toLowerCase();
  if (!/^([a-z0-9]+(-[a-z0-9]+)*)$/.test(trimmed)) return null;
  if (trimmed.length < 3 || trimmed.length > 32) return null;
  return trimmed;
}

function slugifyFromName(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  const trimmed = base.slice(0, 32).replace(/^-+|-+$/g, "");
  return trimmed.length >= 3 ? trimmed : null;
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugifyFromName(name) || `agenda`;
  const existing = await getProfessionalFromFirestore(base);
  if (!existing) return base;
  for (let i = 0; i < 8; i++) {
    const suffix = Math.random().toString(36).slice(2, 6);
    const candidate = `${base}-${suffix}`.slice(0, 32);
    const exists = await getProfessionalFromFirestore(candidate);
    if (!exists) return candidate;
  }
  return `${base}-${Date.now().toString(36).slice(-4)}`.slice(0, 32);
}

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirestoreEnabledForProfessionals()) {
    return NextResponse.json(
      { error: "Firestore não está configurado. Configure Firebase Admin para usar esta rota." },
      { status: 503 }
    );
  }

  const professionals = await listProfessionalsByOwner(auth.uid);
  return NextResponse.json({ ok: true, professionals });
}

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirestoreEnabledForProfessionals()) {
    return NextResponse.json(
      { error: "Firestore não está configurado. Configure Firebase Admin para usar esta rota." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as Partial<Professional> | null;
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Nome do profissional é obrigatório." }, { status: 400 });
  }

  // Slug opcional: se não vier ou for inválido, geramos a partir do nome
  let slug = sanitizeSlug((body as any).slug);
  if (!slug) {
    slug = await generateUniqueSlug(name);
  } else {
    const existing = await getProfessionalFromFirestore(slug);
    if (existing && existing.ownerUid && existing.ownerUid !== auth.uid) {
      slug = await generateUniqueSlug(name);
    }
  }

  const professional: Professional = {
    slug,
    name,
    description: typeof body.description === "string" ? body.description.trim() : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
    ownerUid: auth.uid,
    calendarId: typeof (body as any).calendarId === "string" ? String((body as any).calendarId) : undefined,
    services: normalizeServicesInput(body.services),
    workHours: normalizeWorkHoursInput(body.workHours),
  };

  let existedBefore = await getProfessionalFromFirestore(slug);
  try {
    await upsertProfessional(professional);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao salvar profissional.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, professional }, { status: existedBefore ? 200 : 201 });
}
