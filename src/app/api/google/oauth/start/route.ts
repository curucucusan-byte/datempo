import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
import { getAuthUrl } from "@/lib/google";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = getAuthUrl();
  return NextResponse.redirect(url);
}

