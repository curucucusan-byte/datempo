"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Stripe } from "stripe";

type PixStatusClientProps = {
  paymentId: string;
  initialStatus: Stripe.PaymentIntent.Status;
  amount: number;
  currency: string;
  nextAction: Stripe.PaymentIntent.NextAction | null;
};

type PixState = {
  status: Stripe.PaymentIntent.Status;
  qrBase64?: string | null;
  qrUrl?: string | null;
  expiresAt?: string | null;
  copyText?: string | null;
};

function extractPixData(nextAction: Stripe.PaymentIntent.NextAction | null): Omit<PixState, "status"> {
  if (!nextAction || nextAction.type !== "pix_display_qr_code") {
    return { qrBase64: null, qrUrl: null, expiresAt: null, copyText: null };
  }
  const qr = nextAction.pix_display_qr_code;
  return {
    qrBase64: qr?.data ?? null,
    qrUrl: qr?.image_url_png ?? null,
    expiresAt: qr?.expires_at ?? null,
    copyText: qr?.emv ?? null,
  };
}

export default function PixStatusClient({ paymentId, initialStatus, amount, currency, nextAction }: PixStatusClientProps) {
  const [state, setState] = useState<PixState>(() => ({
    status: initialStatus,
    ...extractPixData(nextAction),
  }));
  const [hydrated, setHydrated] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const poll = useCallback(async () => {
    try {
      const response = await fetch(`/api/payments/pix/${paymentId}`);
      const data = await response.json();
      if (!response.ok || !data.ok) return;
      const extracted = extractPixData(data.stripe.nextAction as Stripe.PaymentIntent.NextAction | null);
      setState({
        status: data.stripe.status as Stripe.PaymentIntent.Status,
        qrBase64: extracted.qrBase64,
        qrUrl: extracted.qrUrl,
        expiresAt: extracted.expiresAt,
        copyText: extracted.copyText,
      });
    } catch {
      // ignore
    }
  }, [paymentId]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.status === "succeeded" || state.status === "canceled") return;
    const id = window.setInterval(poll, 5000);
    return () => window.clearInterval(id);
  }, [hydrated, poll, state.status]);

  const amountFormatted = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
  }, [amount, currency]);

  const handleCopy = async () => {
    if (!state.copyText) return;
    try {
      await navigator.clipboard.writeText(state.copyText);
      setCopyFeedback("Código Pix copiado!");
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch {
      setCopyFeedback("Não foi possível copiar automaticamente.");
    }
  };

  const isCompleted = state.status === "succeeded";
  const isExpired = state.status === "canceled" || state.status === "requires_payment_method";

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-white">Faça o Pix de {amountFormatted}</h2>
        {!isCompleted && !isExpired && (
          <p className="mt-2 text-sm text-slate-300">
            Abra seu app bancário, escolha Pix &rarr; QR Code e aponte a câmera. Se preferir, copie o código abaixo.
          </p>
        )}

        {isCompleted && (
          <p className="mt-4 text-sm text-emerald-300">Pagamento confirmado! Você receberá o comprovante por e-mail.</p>
        )}

        {isExpired && !isCompleted && (
          <p className="mt-4 text-sm text-red-300">Este código expirou. Gere um novo pagamento na tela de planos.</p>
        )}

        {!isCompleted && !isExpired && (
          <div className="mt-6 flex flex-col items-center gap-4">
            {state.qrBase64 && (
              <Image
                src={`data:image/png;base64,${state.qrBase64}`}
                alt="QR Code Pix"
                width={220}
                height={220}
                unoptimized
                className="h-56 w-56 rounded-2xl border border-white/10 bg-white p-4"
              />
            )}
            {!state.qrBase64 && state.qrUrl && (
              <Image
                src={state.qrUrl}
                alt="QR Code Pix"
                width={220}
                height={220}
                unoptimized
                className="h-56 w-56 rounded-2xl border border-white/10 bg-white p-4"
              />
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
            >
              Copiar código Pix
            </button>
            {copyFeedback && <p className="text-xs text-slate-300">{copyFeedback}</p>}
            {state.copyText && (
              <textarea
                readOnly
                value={state.copyText}
                className="w-full rounded-xl bg-white/10 p-3 text-xs text-slate-200"
                rows={4}
              />
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-xs text-slate-400">
        <div>Status atual: <span className="text-slate-200">{state.status}</span></div>
        {state.expiresAt && !isCompleted && (
          <div className="mt-1">Expira em: {new Date(state.expiresAt).toLocaleString("pt-BR")}</div>
        )}
        <div className="mt-1">Pagamento ID: {paymentId}</div>
      </div>
    </div>
  );
}
