"use client";

import { useState } from "react";

type Props = {
  planId: "essencial" | "pro";
  isCurrent: boolean;
};

export default function ChoosePlanButton({ planId, isCurrent }: Props) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, status: "active" }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.error || `Erro ${r.status}`);
      }
      setDone(true);
      // leva o usuário para a agenda para conectar Google
      window.location.href = "/dashboard/minha-agenda";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao ativar plano");
    } finally {
      setBusy(false);
    }
  }

  if (isCurrent) {
    return (
      <button
        type="button"
        disabled
        className="mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold bg-white/10 text-slate-200 ring-1 ring-white/15 disabled:opacity-60"
      >
        Plano atual
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={choose}
        disabled={busy || done}
        className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold ${
          planId === "pro"
            ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            : "bg-white/10 text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
        } disabled:opacity-60`}
      >
        {busy ? "Ativando..." : "Ativar agora"}
      </button>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

