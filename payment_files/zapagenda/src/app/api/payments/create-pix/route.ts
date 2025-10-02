// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/payments/create-pix/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/session";
import { createPixPayment, canUserMakePixPayment } from "@/lib/payments";
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

    // Verificar se o usuário pode fazer um novo pagamento Pix
    const canMakePayment = await canUserMakePixPayment(user.uid);
    if (!canMakePayment) {
      return NextResponse.json(
        { error: "Você já possui um pagamento Pix pendente ou ainda não chegou a data do próximo pagamento." },
        { status: 400 }
      );
    }

    const result = await createPixPayment(user.uid, user.email, plan);

    return NextResponse.json({
      ok: true,
      payment: result.payment,
      clientSecret: result.clientSecret,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Pix:", error);
    const message = error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
