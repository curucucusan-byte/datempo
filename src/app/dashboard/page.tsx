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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-slate-300 mt-2">
            Bem-vindo, <span className="font-medium text-slate-100">{(user as any).name ?? user.email ?? user.uid}</span>. Plano:
            {" "}
            <span className="font-medium text-emerald-300">{planDetails?.label ?? "Inativo"}</span> ({account.status}).
          </p>
          {trialWarning && (
            <p className="text-xs text-emerald-300 mt-1">
              Seu teste termina em {trialWarning.daysLeft} dia(s) (até {trialWarning.ends.toLocaleDateString("pt-BR")}).
            </p>
          )}
          <p className="text-sm text-slate-400 mt-1">
            Conecte sua conta do Google para manter os horários atualizados e enviar confirmações automáticas pelo WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/plans"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
          >
            Ver planos
          </Link>
          <LogoutButton />
        </div>
      </header>

      {(planInactive || trialWarning) && (
        <div className="mx-auto max-w-6xl px-6">
          <div className={`mb-6 rounded-3xl border px-6 py-4 text-sm ${planInactive ? "border-red-400/40 bg-red-900/30 text-red-100" : "border-emerald-400/40 bg-emerald-900/20 text-emerald-100"}`}>
            {planInactive ? (
              <>
                Seu plano está inativo no momento. Veja os <Link href="/dashboard/plans" className="underline">planos</Link> para reativar quando quiser.
              </>
            ) : (
              trialWarning && (
                <>
                  Seu teste termina em {trialWarning.daysLeft} dia(s) ({trialWarning.ends.toLocaleDateString("pt-BR")}). Escolha um plano para seguir usando.
                </>
              )
            )}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 pb-16 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 rounded-2xl bg-white/5 p-1 text-sm w-fit">
          <Link
            href="/dashboard?tab=resumo"
            className={`rounded-xl px-4 py-2 ${activeTab === "resumo" ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
          >
            Resumo
          </Link>
          <Link
            href="/dashboard?tab=agenda"
            className={`rounded-xl px-4 py-2 ${activeTab === "agenda" ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
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

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-lg font-semibold mb-4">Agendamentos</h2>
              <AppointmentList />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
