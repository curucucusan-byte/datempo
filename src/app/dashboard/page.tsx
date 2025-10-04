import { redirect } from "next/navigation";

import { ensureAccount, getReminderSettings, isAccountActive } from "@/lib/account";
import { getAuthenticatedUser } from "@/lib/session";
import { ACTIVE_PLANS, getPlanDetails, isActivePlan } from "@/lib/plans";
import { listSubscriptionsByUid } from "@/lib/payments";

import Link from "next/link";

import AppointmentList from "./AppointmentList";
import LogoutButton from "./LogoutButton";
import ReminderSettings from "./ReminderSettings";
import CalendarsCard from "./minha-agenda/CalendarsCard";

export const metadata = {
  title: "Dashboard — ZapAgenda",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent('/dashboard')}&m=login_required`);
  }

  const account = await ensureAccount(user.uid, user.email ?? null);
  // Se usuário foi rebaixado de um plano pago, levar direto à página de planos com aviso
  if (account.plan === "free") {
    try {
      const subs = await listSubscriptionsByUid(user.uid);
      const hadPaid = subs.some((s) => s.plan !== "free");
      const notActive = subs.some((s) => ["canceled", "past_due", "incomplete", "incomplete_expired"].includes(s.status));
      if (hadPaid && notActive) {
        redirect(`/dashboard/plans?m=downgraded`);
      }
    } catch {}
  }
  const planDetails = getPlanDetails(account.plan);
  const reminders = getReminderSettings(account);
  const accountActive = isAccountActive(account);
  const planLimits = isActivePlan(account.plan) ? ACTIVE_PLANS[account.plan].limits : null;
  const requiredPlanLabel = ACTIVE_PLANS.starter.label;
  const maxAutoReminders = planLimits?.maxAutoRemindersPerAppointment ?? 0;
  const canEditReminders = accountActive && maxAutoReminders > 0;

  const trialWarning =
    account.status === "trial" && account.trialEndsAt
      ? (() => {
          const ends = new Date(account.trialEndsAt);
          const daysLeft = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return { ends, daysLeft };
        })()
      : null;

  const planInactive = account.status === "canceled" || account.plan === "inactive";

  const activeTab = (Array.isArray(searchParams?.tab) ? searchParams?.tab[0] : searchParams?.tab) || "resumo";

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
              <span className="text-lg font-bold text-slate-900">ZapAgenda</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/plans"
                className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Ver planos
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-lg text-slate-600 mt-2">
            Bem-vindo, <span className="font-semibold text-slate-900">{(user as any).name ?? user.email ?? user.uid}</span>
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="font-medium text-emerald-700">Plano {planDetails?.label ?? "Inativo"}</span>
            <span className="text-slate-500">• {account.status}</span>
          </div>
          {trialWarning && (
            <p className="text-sm text-emerald-600 mt-2 font-medium">
              ⏰ Seu teste termina em {trialWarning.daysLeft} dia(s) — {trialWarning.ends.toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </div>

      {(planInactive || trialWarning) && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className={`rounded-2xl border px-6 py-4 text-base ${planInactive ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
            {planInactive ? (
              <>
                ⚠️ Seu plano está inativo. <Link href="/dashboard/plans" className="font-semibold underline hover:text-amber-700">Ver planos</Link> para reativar.
              </>
            ) : (
              trialWarning && (
                <>
                  ⏰ Seu teste termina em {trialWarning.daysLeft} dia(s) ({trialWarning.ends.toLocaleDateString("pt-BR")}). <Link href="/dashboard/plans" className="font-semibold underline hover:text-emerald-700">Escolha um plano</Link>.
                </>
              )
            )}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm w-fit border border-slate-200">
          <Link
            href="/dashboard?tab=resumo"
            className={`rounded-full px-6 py-2 font-medium transition-colors ${activeTab === "resumo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Resumo
          </Link>
          <Link
            href="/dashboard?tab=agenda"
            className={`rounded-full px-6 py-2 font-medium transition-colors ${activeTab === "agenda" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Minha agenda
          </Link>
        </div>

        {activeTab === "agenda" ? (
          <CalendarsCard />
        ) : (
          <>
            <ReminderSettings
              initialEnabled={reminders.enabled}
              initialWindowMinutes={reminders.windowMinutes}
              canEdit={canEditReminders}
              planLabel={planDetails?.label ?? "Inativo"}
              planId={account.plan}
              requiredPlanLabel={requiredPlanLabel}
              maxAutoReminders={maxAutoReminders}
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Agendamentos</h2>
              <AppointmentList />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
