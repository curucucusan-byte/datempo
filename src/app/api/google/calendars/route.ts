import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
import { getAuthUrl, listCalendars } from "@/lib/google";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const calendars = await listCalendars(auth.uid);
  if (!calendars) {
    return NextResponse.json({ ok: true, connected: false, authUrl: getAuthUrl() });
  }
  return NextResponse.json({ ok: true, connected: true, calendars });
}

