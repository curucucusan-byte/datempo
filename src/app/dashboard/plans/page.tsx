import Link from "next/link";
import { redirect } from "next/navigation";

import { ensureAccount } from "@/lib/account";
import { getAuthenticatedUser } from "@/lib/session";
import { ACTIVE_PLANS, getPlanDetails, type ActivePlanId } from "@/lib/plans";
import { listPaymentsByUid, listSubscriptionsByUid } from "@/lib/payments";
import PaymentButtons from "./PaymentButtons";

export const metadata = {
  title: "Planos — ZapAgenda",
};

export default async function PlansPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=${encodeURIComponent('/dashboard/plans')}&m=login_required`);

  const account = await ensureAccount(user.uid, user.email ?? null);
  const planDetails = getPlanDetails(account.plan);
  const [payments, subscriptions] = await Promise.all([
    listPaymentsByUid(user.uid),
    listSubscriptionsByUid(user.uid),
  ]);

  const formatDateTime = (iso: string | null | undefined) => {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("pt-BR");
  };

  const formatCurrency = (amount: number, currency = "brl") =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);

  const resolvePlanLabel = (value: string | null | undefined) => {
    if (!value) return "—";
    if (value in ACTIVE_PLANS) {
      return ACTIVE_PLANS[value as ActivePlanId].label;
    }
    if (value === "essencial") return `${ACTIVE_PLANS.free.label} (legado)`;
    return value;
  };

  const noticeParam = Array.isArray(searchParams?.m) ? searchParams?.m[0] : searchParams?.m;
  const lastPaidSub = subscriptions.find((s) => s.plan !== "free");
  const showDowngraded = (noticeParam === "downgraded") || (
    account.plan === "free" && lastPaidSub && ["canceled", "past_due", "incomplete", "incomplete_expired"].includes(lastPaidSub.status)
  );

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
      {showDowngraded && (
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-900/20 p-4 text-sm text-amber-100">
            Você não possui mais o plano pago. Sua conta segue ativa no plano Free. Faça upgrade novamente para
            recuperar os recursos adicionais.
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 pb-16 space-y-12">
        <div className="grid gap-6 md:grid-cols-3">
          {["free", "starter", "pro"].map((planKey) => {
            const plan = ACTIVE_PLANS[planKey as keyof typeof ACTIVE_PLANS];
            const isCurrent = account.plan === plan.id;
            const isPaidPlan = plan.monthlyPrice > 0;
            const highlight = plan.id === "starter";
            const highlights = [
              `${plan.limits.maxConnectedCalendars} agenda(s) Google`,
              `${plan.limits.maxAppointmentsPerMonth} agendamentos/mês`,
              `${plan.limits.whatsappMessagesIncludedPerMonth} mensagens WhatsApp incluídas`,
              plan.limits.maxAutoRemindersPerAppointment > 0
                ? `Até ${plan.limits.maxAutoRemindersPerAppointment} lembretes/atendimento`
                : "Sem lembretes automáticos",
            ];

            return (
            <div
              key={plan.id}
              className={`flex h-full flex-col rounded-3xl border p-6 ${
                highlight
                  ? "border-emerald-400/60 bg-emerald-500/10"
                  : "border-white/10 bg-slate-900/60"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">{plan.label}</h2>
                {highlight && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">Recomendado</span>}
              </div>
              <div className="mt-1 text-2xl font-bold">{plan.priceDisplay}</div>
              <p className="mt-1 text-sm text-slate-300">
                {plan.monthlyPrice === 0
                  ? "Sem mensalidade."
                  : plan.trialDays > 0
                  ? `${plan.trialDays} dia(s) de teste.`
                  : "Cancele quando quiser."}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" aria-hidden>
                      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4 border-t border-white/10">
                {isCurrent ? (
                  <div className="text-center py-3 text-emerald-300 font-medium">
                    ✓ Plano Atual
                  </div>
                ) : !isPaidPlan ? (
                  <div className="text-center py-3 text-slate-300">
                    Incluído por padrão — basta continuar usando.
                  </div>
                ) : (
                  <PaymentButtons plan={plan.id as Exclude<ActivePlanId, "free">} price={plan.monthlyPrice} />
                )}
              </div>
            </div>
            );
          })}
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Histórico de assinaturas</h2>
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left">Assinatura</th>
                  <th className="px-3 py-2 text-left">Plano</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Período atual</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-400">
                      Nenhuma assinatura registrada ainda.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-t border-white/5">
                      <td className="px-3 py-3 text-slate-200">{subscription.id}</td>
                      <td className="px-3 py-3 text-slate-300">{resolvePlanLabel(subscription.plan)}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {formatDateTime(subscription.currentPeriodStart)} ➝ {formatDateTime(subscription.currentPeriodEnd)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pagamentos Pix</h2>
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Data</th>
                  <th className="px-3 py-2 text-left">Valor</th>
                  <th className="px-3 py-2 text-left">Plano</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                      Nenhum pagamento encontrado.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-t border-white/5">
                      <td className="px-3 py-3 text-emerald-200">{payment.id}</td>
                      <td className="px-3 py-3 text-slate-300">{formatDateTime(payment.createdAt)}</td>
                      <td className="px-3 py-3 text-slate-200">{formatCurrency(payment.amount, payment.currency)}</td>
                      <td className="px-3 py-3 text-slate-300">{resolvePlanLabel(payment.plan)}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
