import Link from "next/link";
import { redirect } from "next/navigation";

import { ensureAccount } from "@/lib/account";
import { getAuthenticatedUser } from "@/lib/session";
import { ACTIVE_PLANS, getPlanDetails, type ActivePlanId } from "@/lib/plans";
import { listPaymentsByUid, listSubscriptionsByUid } from "@/lib/payments";
import PaymentButtons from "./PaymentButtons";

export const metadata = {
  title: "Planos — DaTempo",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Modern Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">DaTempo</span>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Voltar ao dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Escolha o plano ideal</h1>
          <p className="mt-4 text-lg text-slate-600">
            Conta atual: {" "}
            <span className="font-semibold text-emerald-600">
              {planDetails?.label ?? "Inativo"}
            </span>
            {account.trialEndsAt && account.status === "trial" && (
              <> • Teste expira em {new Date(account.trialEndsAt).toLocaleDateString("pt-BR")}
              </>
            )}
          </p>
        </div>
      </div>
      {showDowngraded && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
            ⚠️ Você não possui mais o plano pago. Sua conta segue ativa no plano Free. Faça upgrade para
            recuperar os recursos adicionais.
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid gap-8 md:grid-cols-3">
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
              className={`relative flex h-full flex-col rounded-3xl border-2 p-8 bg-white transition-all hover:scale-105 ${
                highlight
                  ? "border-emerald-300 shadow-xl shadow-emerald-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                  Mais popular
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-slate-900">{plan.label}</h2>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-900 whitespace-nowrap">{plan.priceDisplay.split("/")[0]}</span>
                {plan.monthlyPrice > 0 && <span className="text-lg text-slate-500">/mês</span>}
              </div>
              <p className="mt-2 text-base text-slate-600">
                {plan.monthlyPrice === 0
                  ? "Sem mensalidade."
                  : plan.trialDays > 0
                  ? `${plan.trialDays} dia(s) de teste.`
                  : "Cancele quando quiser."}
              </p>
              <ul className="mt-6 space-y-3 text-base text-slate-700">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6 border-t border-slate-100">
                {isCurrent ? (
                  <div className="text-center py-3 text-emerald-600 font-semibold text-base">
                    ✓ Plano Atual
                  </div>
                ) : !isPaidPlan ? (
                  <div className="text-center py-3 text-slate-500 text-base">
                    Incluído por padrão
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
