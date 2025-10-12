import Link from "next/link";
import { redirect } from "next/navigation";

import { ensureAccount } from "@/lib/account";
import { getAuthenticatedUser } from "@/lib/session";
import { ACTIVE_PLANS, getPlanDetails } from "@/lib/plans";
import PaymentButtons from "./PaymentButtons";

export const metadata = {
  title: "Planos — Agende Mais",
};

export default async function PlansPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const account = await ensureAccount(user.uid, user.email ?? null);
  const planDetails = getPlanDetails(account.plan);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div>
          <h1 className="text-3xl font-semibold">Escolha o plano ideal</h1>
          <p className="mt-2 text-slate-300">
            Conta atual: {" "}
            <span className="font-medium text-emerald-300">
              {planDetails?.label ?? "Inativo"}
            </span>{" "}
            — status {account.status}.
            {account.trialEndsAt && account.status === "trial" && (
              <> Teste expira em {new Date(account.trialEndsAt).toLocaleDateString("pt-BR")}.</>
            )}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
        >
          Voltar ao dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {Object.values(ACTIVE_PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 ${
                plan.id === "pro"
                  ? "border-emerald-400/60 bg-emerald-500/10"
                  : "border-white/10 bg-slate-900/60"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">{plan.label}</h2>
                {plan.id === "pro" && <span className="text-xs text-emerald-300">Completo</span>}
              </div>
              <div className="mt-3 text-2xl font-bold">{plan.priceDisplay}</div>
              <p className="mt-2 text-sm text-slate-300">
                Teste por {plan.trialDays} dia(s), sem custo.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {plan.bullets.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400">
                      <path
                        fill="currentColor"
                        d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm4.7 7.29-5.06 5.06a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41 4.36-4.36a1 1 0 1 1 1.41 1.41Z"
                      />
                    </svg>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {account.plan === plan.id ? (
                  <div className="text-center py-3 text-emerald-300 font-medium">
                    ✓ Plano Atual
                  </div>
                ) : (
                  <PaymentButtons plan={plan.id} price={plan.monthlyPrice} />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
