// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/payments/create-subscription/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/session";
import { createCreditCardSubscription } from "@/lib/payments";
import { ACTIVE_PLANS, type ActivePlanId } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !ACTIVE_PLANS[plan as ActivePlanId]) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    const result = await createCreditCardSubscription(user.uid, user.email, plan);

    return NextResponse.json({
      ok: true,
      subscription: result.subscription,
      clientSecret: result.clientSecret,
    });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    const message = error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
