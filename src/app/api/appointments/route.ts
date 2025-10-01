import { NextResponse } from "next/server";

import { loadAppointments } from "@/lib/store";
import { authenticateRequest } from "@/lib/session";

function parseDate(value: string | null, endOfDay = false) {
  if (!value) return null;
  const iso = value.match(/T/)
    ? value
    : endOfDay
    ? `${value}T23:59:59.999Z`
    : `${value}T00:00:00.000Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.trim();
  const sinceParam = searchParams.get("since");
  const untilParam = searchParams.get("until");

  const sinceDate = parseDate(sinceParam, false);
  const untilDate = parseDate(untilParam, true);

  const list = await loadAppointments();

  const filtered = list.filter((apt) => {
    if (slug && apt.slug !== slug) return false;
    const start = new Date(apt.startISO);
    if (Number.isNaN(start.getTime())) return false;
    if (sinceDate && start < sinceDate) return false;
    if (untilDate && start > untilDate) return false;
    return true;
  });

  filtered.sort((a, b) => a.startISO.localeCompare(b.startISO));

  return NextResponse.json({
    ok: true,
    count: filtered.length,
    filters: {
      slug: slug || null,
      since: sinceDate?.toISOString() ?? null,
      until: untilDate?.toISOString() ?? null,
    },
    appointments: filtered,
  });
}
