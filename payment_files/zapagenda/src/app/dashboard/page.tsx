import { redirect } from "next/navigation";

import { ensureAccount, getReminderSettings, isAccountActive } from "@/lib/account";
import { getAuthenticatedUser } from "@/lib/session";
import { ACTIVE_PLANS, getPlanDetails } from "@/lib/plans";

import Link from "next/link";

import AppointmentList from "./AppointmentList";
import LogoutButton from "./LogoutButton";
import ReminderSettings from "./ReminderSettings";

export const metadata = {
  title: "Dashboard — Agende Mais",
};

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  const account = await ensureAccount(user.uid, user.email ?? null);
  const planDetails = getPlanDetails(account.plan);
  const reminders = getReminderSettings(account);
  const accountActive = isAccountActive(account);

  const trialWarning =
    account.status === "trial" && account.trialEndsAt
      ? (() => {
          const ends = new Date(account.trialEndsAt);
          const daysLeft = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return { ends, daysLeft };
        })()
      : null;

  const planInactive = account.status === "canceled" || account.plan === "inactive";

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
              Teste sem custo: {trialWarning.daysLeft} dia(s) restantes (até {trialWarning.ends.toLocaleDateString("pt-BR")}).
            </p>
          )}
          <p className="text-sm text-slate-400 mt-1">
            Para liberar sincronização com Google Agenda, finalize a conexão OAuth quando solicitado.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/plans"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
          >
            Ver planos
          </Link>
          <Link
            href="/dashboard/minha-agenda"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
          >
            Minha agenda
          </Link>
          <LogoutButton />
        </div>
      </header>

      {(planInactive || trialWarning) && (
        <div className="mx-auto max-w-6xl px-6">
          <div className={`mb-6 rounded-3xl border px-6 py-4 text-sm ${planInactive ? "border-red-400/40 bg-red-900/30 text-red-100" : "border-emerald-400/40 bg-emerald-900/20 text-emerald-100"}`}>
            {planInactive ? (
              <>
                Seu plano está inativo. Acesse <Link href="/dashboard/plans" className="underline">Planos</Link> para reativar e liberar todos os recursos.
              </>
            ) : (
              trialWarning && (
                <>
                  Período de teste termina em {trialWarning.daysLeft} dia(s) ({trialWarning.ends.toLocaleDateString("pt-BR")}). Selecione um plano para manter o serviço ativo.
                </>
              )
            )}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 pb-16 space-y-6">
        <ReminderSettings
          initialEnabled={reminders.enabled}
          initialWindowMinutes={reminders.windowMinutes}
          canEdit={accountActive && account.plan === "pro"}
          planLabel={planDetails?.label ?? "Inativo"}
          planId={account.plan}
          availablePlanLabel={ACTIVE_PLANS.pro.label}
        />

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold mb-4">Agendamentos</h2>
          <AppointmentList />
        </div>
      </main>
    </div>
  );
}
