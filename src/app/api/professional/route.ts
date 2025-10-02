import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
import { getLinkedCalendarBySlug } from "@/lib/google";

const DEFAULT_SERVICES = [{ name: "Atendimento padrão", minutes: 60 }];

function toPublicProfile(calendar: Awaited<ReturnType<typeof getLinkedCalendarBySlug>>) {
  if (!calendar) return null;
  return {
    slug: calendar.slug,
    name: calendar.description || calendar.summary,
    description: calendar.description,
    phone: calendar.whatsappNumber,
    calendarId: calendar.id,
    services: calendar.services && calendar.services.length ? calendar.services : DEFAULT_SERVICES,
    workHours: calendar.workHours ?? null,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Informe o slug (?slug=)." },
      { status: 400 }
    );
  }

  const calendar = await getLinkedCalendarBySlug(slug);
  const profile = toPublicProfile(calendar);
  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "Agenda não encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, professional: profile });
}

export async function PUT(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Operação substituída. Atualize os dados pelo painel de Google Agenda." },
    { status: 410 }
  );
}
