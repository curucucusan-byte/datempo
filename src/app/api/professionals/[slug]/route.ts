import { NextRequest, NextResponse } from "next/server";

import { getLinkedCalendarBySlug } from "@/lib/google";

export async function GET(
  request: NextRequest,
) {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop(); // Extrai o slug da URL

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Slug obrigatório." }, { status: 400 });
  }
  const calendar = await getLinkedCalendarBySlug(slug);
  if (!calendar) {
    return NextResponse.json({ ok: false, error: "Agenda não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, professional: {
    slug: calendar.slug,
    name: calendar.description || calendar.summary,
    description: calendar.description,
    phone: calendar.whatsappNumber,
    calendarId: calendar.id,
    services: calendar.services,
    workHours: calendar.workHours,
  } });
}
