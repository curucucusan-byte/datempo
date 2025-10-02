// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/dashboard/plans/PaymentButtons.tsx

"use client";

import { useState } from "react";
import { type ActivePlanId } from "@/lib/plans";

interface PaymentButtonsProps {
  plan: ActivePlanId;
  price: number;
}

export default function PaymentButtons({ plan, price }: PaymentButtonsProps) {
  const [loading, setLoading] = useState<"card" | "pix" | null>(null);

  const handleCardPayment = async () => {
    setLoading("card");
    try {
      const response = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (data.ok) {
        // Redirecionar para checkout da Stripe
        window.location.href = `https://checkout.stripe.com/pay/${data.clientSecret}`;
      } else {
        alert(data.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      alert("Erro ao processar pagamento");
    } finally {
      setLoading(null);
    }
  };

  const handlePixPayment = async () => {
    setLoading("pix");
    try {
      const response = await fetch("/api/payments/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (data.ok) {
        // Redirecionar para página de pagamento Pix
        window.location.href = `/payment/pix/${data.payment.id}`;
      } else {
        alert(data.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      alert("Erro ao processar pagamento");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleCardPayment}
        disabled={loading !== null}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading === "card" ? "Processando..." : `💳 Cartão - R$ ${price}/mês`}
      </button>
      
      <button
        onClick={handlePixPayment}
        disabled={loading !== null}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading === "pix" ? "Processando..." : `🔑 Pix - R$ ${price}/mês`}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Cartão: cobrança automática mensal<br/>
        Pix: pagamento manual a cada mês
      </p>
    </div>
  );
}
