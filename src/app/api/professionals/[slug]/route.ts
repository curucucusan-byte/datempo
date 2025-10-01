import { NextRequest, NextResponse } from "next/server";
import { resolveProfessional } from "@/lib/professionals";

export async function GET(
  request: NextRequest,
) {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop(); // Extrai o slug da URL

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Slug obrigatório." }, { status: 400 });
  }
  const professional = await resolveProfessional(slug);
  if (!professional) {
    return NextResponse.json({ ok: false, error: "Profissional não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, professional });
}
