import { NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/session";
import { getPaymentRecordById } from "@/lib/payments";
import { getPaymentIntent } from "@/lib/stripe";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const record = await getPaymentRecordById(id);
  if (!record || record.uid !== auth.uid) {
    return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
  }

  try {
    const paymentIntent = await getPaymentIntent(id);

    return NextResponse.json({
      ok: true,
      payment: record,
      stripe: {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        nextAction: paymentIntent.next_action ?? null,
        charges: paymentIntent.charges?.data ?? [],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao consultar Stripe" }, { status: 500 });
  }
}
