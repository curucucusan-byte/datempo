import { NextResponse } from "next/server";
import { resolveProfessional } from "@/lib/professionals";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Slug obrigatório." }, { status: 400 });
  }
  const professional = await resolveProfessional(slug);
  if (!professional) {
    return NextResponse.json({ ok: false, error: "Profissional não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, professional });
}
  return NextResponse.json({ ok: true, professional });
}
