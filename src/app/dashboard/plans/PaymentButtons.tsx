"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { type ActivePlanId } from "@/lib/plans";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface PaymentButtonsProps {
  plan: ActivePlanId;
  price: number;
}

type CardModalState = {
  clientSecret: string;
  subscriptionId?: string;
};

export default function PaymentButtons({ plan, price }: PaymentButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"card" | "pix" | null>(null);
  const [cardModal, setCardModal] = useState<CardModalState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cardDisabled = !publishableKey || stripePromise === null;

  const handleCardPayment = async () => {
    if (cardDisabled) {
      setErrorMessage("Stripe publishable key ausente. Configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
      return;
    }
    setLoading("card");
    setErrorMessage(null);
    setMessage(null);
    try {
      const response = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.clientSecret) {
        throw new Error(data.error || "Falha ao iniciar pagamento");
      }
      setCardModal({ clientSecret: data.clientSecret, subscriptionId: data.subscription?.id });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(null);
    }
  };

  const handlePixPayment = async () => {
    setLoading("pix");
    setErrorMessage(null);
    setMessage(null);
    try {
      const response = await fetch("/api/payments/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.payment?.id) {
        throw new Error(data.error || "Erro ao gerar pagamento Pix");
      }
      router.push(`/payment/pix/${data.payment.id}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCardPayment}
        disabled={loading !== null}
        className="w-full rounded bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading === "card" ? "Processando..." : `💳 Cartão - R$ ${price}/mês`}
      </button>

      <button
        type="button"
        onClick={handlePixPayment}
        disabled={loading !== null}
        className="w-full rounded bg-green-600 py-2 px-4 text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading === "pix" ? "Processando..." : `🔑 Pix - R$ ${price}/mês`}
      </button>

      <p className="text-center text-xs text-gray-500">
        Cartão: cobrança automática mensal
        <br />
        Pix: pagamento manual a cada mês
      </p>

      {errorMessage && (
        <p className="rounded-lg border border-red-400/30 bg-red-900/20 p-2 text-xs text-red-200">{errorMessage}</p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-400/30 bg-emerald-900/20 p-2 text-xs text-emerald-200">{message}</p>
      )}

      {cardModal && stripePromise && (
        <CardPaymentDialog
          clientSecret={cardModal.clientSecret}
          stripePromise={stripePromise}
          onClose={() => setCardModal(null)}
          onSuccess={() => {
            setCardModal(null);
            setMessage("Pagamento confirmado! Seu plano será atualizado em instantes.");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

type CardPaymentDialogProps = {
  clientSecret: string;
  stripePromise: ReturnType<typeof loadStripe>;
  onClose: () => void;
  onSuccess: () => void;
};

function CardPaymentDialog({ clientSecret, stripePromise, onClose, onSuccess }: CardPaymentDialogProps) {
  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#34d399",
          borderRadius: "12px",
        },
      },
    }),
    [clientSecret],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Pagamento seguro</h2>
            <p className="text-xs text-slate-400">Informe os dados do cartão para concluir a assinatura.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Fechar
          </button>
        </div>

        <div className="mt-4">
          <Elements stripe={stripePromise} options={options}>
            <CardPaymentForm onCancel={onClose} onSuccess={onSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

type CardPaymentFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

function CardPaymentForm({ onCancel, onSuccess }: CardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Não foi possível confirmar o pagamento.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && <p className="text-xs text-red-300">{error}</p>}

      <div className="flex items-center justify-end gap-3 text-sm">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-slate-300 hover:bg-white/10"
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {submitting ? "Confirmando..." : "Pagar"}
        </button>
      </div>
    </form>
  );
}
