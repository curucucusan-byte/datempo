import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Esta rota foi descontinuada. Utilize o painel de Google Agenda para gerenciar perfis públicos." },
    { status: 410 }
  );
}

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Esta rota foi descontinuada. Utilize o painel de Google Agenda para gerenciar perfis públicos." },
    { status: 410 }
  );
}
