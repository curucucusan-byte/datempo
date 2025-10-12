// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/dashboard/minha-agenda/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { ensureAccount } from "@/lib/account";
import { getAuthenticatedUser } from "@/lib/session";
// import { listProfessionalsByOwner } from "@/lib/professionals"; // Removido
import { getPlanDetails } from "@/lib/plans";
import { getTokens } from "@/lib/google";
import CalendarsCard from "./CalendarsCard";
// import CalendarProfiles from "./CalendarProfiles"; // Removido

export const metadata = {
  title: "Minha Agenda — Agende Mais",
};

export default async function MinhaAgendaPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  const account = await ensureAccount(user.uid, user.email ?? null);
  // Se ainda não conectou o Google, redireciona para consentimento automaticamente
  const tokens = await getTokens(user.uid);
  if (!tokens) {
    redirect("/api/google/oauth/start");
  }
  // const professionals = await listProfessionalsByOwner(user.uid); // Removido
  const calendars = account.linkedCalendars ?? [];
  const plan = getPlanDetails(account.plan);
  const trialWarning =
    account.status === "trial" && account.trialEndsAt
      ? (() => {
          const ends = new Date(account.trialEndsAt!);
          const daysLeft = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return { ends, daysLeft };
        })()
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div>
          <h1 className="text-3xl font-semibold">Minha agenda</h1>
          <p className="mt-2 text-slate-300">
            Ajuste as informações da sua agenda do Google para serem usadas no link e nos envios.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Google Agenda é obrigatório: conecte sua conta quando for solicitado para sincronizar seus horários. {plan ? (
              <>Plano atual: <span className="text-slate-200">{plan.label}</span>. {plan.googleCalendars === 1 ? "1 agenda (troca 1x ao dia)." : `Até ${plan.googleCalendars} agendas.`}</>
            ) : (
              <>Plano inativo.</>
            )}
          </p>
          {trialWarning && (
            <p className="mt-1 text-xs text-emerald-300">
              Teste sem custo: {trialWarning.daysLeft} dia(s) restantes (até {trialWarning.ends.toLocaleDateString("pt-BR")}).
            </p>
          )}
          {(account.status === "canceled" || account.plan === "inactive") && (
            <p className="mt-3 text-sm text-red-300">
              Seu plano está inativo. Reative em <Link href="/dashboard/plans" className="underline">Planos</Link> para
              editar a agenda.
            </p>
          )}
        </div>
        <Link
          href="/dashboard"
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
        >
          Voltar ao dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 space-y-6">
        <CalendarsCard />

        {/* O componente CalendarProfiles foi removido. A gestão de agendas será feita diretamente aqui ou em um novo componente focado em Google Calendars. */}
        {/* <CalendarProfiles
          calendars={calendars}
          profiles={professionals}
          readOnly={account.status === "canceled" || account.plan === "inactive"}
        /> */}
      </main>
    </div>
  );
}

