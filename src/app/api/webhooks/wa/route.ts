import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Verificação do webhook (Meta envia hub.challenge)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expected = process.env.WA_VERIFY_TOKEN;
  if (mode === "subscribe" && token && expected && token === expected) {
    console.info("[wa:webhook] verify ok");
    return new Response(challenge ?? "", { status: 200 });
  }
  console.warn("[wa:webhook] verify failed", { mode, tokenPresent: Boolean(token) });
  return NextResponse.json({ error: "verify_failed" }, { status: 403 });
}

// POST: Eventos do WhatsApp
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as any;
    console.info("[wa:webhook:event]", JSON.stringify(body));
    // Futuro: processar mensagens, statuses, etc.
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[wa:webhook:error]", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

