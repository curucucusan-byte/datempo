import { notFound, redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/session";
import { getPaymentRecordById } from "@/lib/payments";
import { getPaymentIntent } from "@/lib/stripe";
import PixStatusClient from "./PixStatusClient";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export default async function PixPaymentPage({ params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent('/payment/pix/' + params.id)}&m=login_required`);
  }

  const record = await getPaymentRecordById(params.id);
  if (!record || record.uid !== user.uid) {
    notFound();
  }

  const paymentIntent = await getPaymentIntent(params.id);
  const amountFormatted = formatCurrency(paymentIntent.amount, paymentIntent.currency.toUpperCase());

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-slate-950 px-6 py-12 text-slate-100">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Pagamento Pix</h1>
        <p className="text-sm text-slate-300">
          Envie o Pix no valor de <span className="text-emerald-300">{amountFormatted}</span> para concluir a assinatura.
          O acesso ao DaTempo é liberado assim que o pagamento for confirmado automaticamente.
        </p>
      </header>

      <PixStatusClient
        paymentId={params.id}
        initialStatus={paymentIntent.status}
        amount={paymentIntent.amount}
        currency={paymentIntent.currency}
        nextAction={paymentIntent.next_action ?? null}
      />

      <footer className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-400">
        <p>Pagamento associado à conta {user.email ?? user.uid}.</p>
        <p className="mt-1">Após a confirmação do Pix, esta tela será atualizada automaticamente.</p>
      </footer>
    </div>
  );
}
