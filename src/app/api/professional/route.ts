import { NextResponse } from "next/server";

import {
  getProfessional,
  resolveProfessional,
  getProfessionalFromFirestore,
  upsertProfessional,
  isFirestoreEnabledForProfessionals,
  normalizeServicesInput,
  normalizeWorkHoursInput,
  type Professional,
} from "@/lib/professionals";
import { authenticateRequest } from "@/lib/session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Informe o slug do profissional (?slug=)." },
      { status: 400 }
    );
  }

  let professional = getProfessional(slug);

  if (!professional) {
    professional = await resolveProfessional(slug);
  }

  if (!professional) {
    return NextResponse.json(
      { ok: false, error: "Profissional não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, professional });
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Informe o slug (?slug=)." }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirestoreEnabledForProfessionals()) {
    return NextResponse.json(
      { error: "Firestore não está configurado. Configure Firebase Admin para editar profissionais." },
      { status: 503 }
    );
  }

  const existing = await getProfessionalFromFirestore(slug);
  if (!existing) {
    return NextResponse.json({ error: "Profissional não encontrado." }, { status: 404 });
  }

  if (existing.ownerUid && existing.ownerUid !== auth.uid) {
    return NextResponse.json({ error: "Você não tem permissão para editar este profissional." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as Partial<Professional> | null;
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : existing.name;
  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  const description = typeof body.description === "string" ? body.description.trim() : existing.description;
  const phone = typeof body.phone === "string" ? body.phone.trim() : existing.phone;
  const calendarId = typeof (body as any)?.calendarId === "string" ? String((body as any).calendarId) : existing.calendarId;

  const services = body.services ? normalizeServicesInput(body.services) : existing.services;
  const workHours = body.workHours ? normalizeWorkHoursInput(body.workHours) : existing.workHours;

  const professional: Professional = {
    ...existing,
    name,
    description,
    phone,
    calendarId,
    services,
    workHours,
    ownerUid: existing.ownerUid ?? auth.uid,
  };

  try {
    await upsertProfessional(professional);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao salvar profissional.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, professional });
}
