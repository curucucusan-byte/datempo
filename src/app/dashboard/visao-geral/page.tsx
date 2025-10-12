// Visão Geral - Dashboard Principal

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Calendar, TrendingUp, Users, Clock } from "lucide-react";

import { getAuthenticatedUser } from "@/lib/session";
import { ensureAccount, getReminderSettings, isAccountActive } from "@/lib/account";
import { ACTIVE_PLANS, getPlanDetails } from "@/lib/plans";

import { MetricCard } from "../components/MetricCard";
import { MetricCardSkeleton } from "../components/LoadingSkeleton";
import { SetupProgress, SetupStep } from "../components/SetupProgress";
import { QuickActions } from "../components/QuickActions";

export const metadata = {
  title: "Visão Geral — DaTempo",
};

// Função para buscar métricas dos agendamentos
async function getMetrics(userId: string) {
  const { getDb } = await import("@/lib/firebaseAdmin");
  const db = getDb();
  const { Timestamp } = await import("firebase-admin/firestore");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Agendamentos deste mês
  const thisMonthSnapshot = await db
    .collection("appointments")
    .where("ownerUid", "==", userId)
    .where("startAt", ">=", Timestamp.fromDate(startOfMonth))
    .get();

  // Agendamentos de hoje
  const todaySnapshot = await db
    .collection("appointments")
    .where("ownerUid", "==", userId)
    .where("startAt", ">=", Timestamp.fromDate(startOfToday))
    .where("startAt", "<", Timestamp.fromDate(new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)))
    .get();

  // Cálculo de taxa de comparecimento (appointments com status CONFIRMED)
  const confirmedCount = thisMonthSnapshot.docs.filter(
    (doc: any) => doc.data().status === "CONFIRMED"
  ).length;
  const attendanceRate = thisMonthSnapshot.size > 0
    ? Math.round((confirmedCount / thisMonthSnapshot.size) * 100)
    : 0;

  // Próximos agendamentos (próximos 5)
  const upcomingSnapshot = await db
    .collection("appointments")
    .where("ownerUid", "==", userId)
    .where("startAt", ">=", Timestamp.fromDate(now))
    .orderBy("startAt", "asc")
    .limit(5)
    .get();

  const upcoming = upcomingSnapshot.docs.map((doc: any) => ({
    id: doc.id,
    customerName: doc.data().customerName || "Cliente",
    startAt: doc.data().startAt?.toDate().toLocaleString("pt-BR") || "",
    status: doc.data().status || "PENDING",
  }));

  return {
    thisMonthTotal: thisMonthSnapshot.size,
    todayTotal: todaySnapshot.size,
    attendanceRate,
    upcoming,
  };
}

// Componente de métricas (async)
async function MetricsSection({ userId }: { userId: string }) {
  const metrics = await getMetrics(userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Agendamentos este mês"
        value={metrics.thisMonthTotal}
        icon={Calendar}
        color="emerald"
      />
      <MetricCard
        title="Taxa de comparecimento"
        value={`${metrics.attendanceRate}%`}
        icon={TrendingUp}
        color="blue"
      />
      <MetricCard
        title="Agendamentos hoje"
        value={metrics.todayTotal}
        icon={Clock}
        color="purple"
      />
    </div>
  );
}

// Componente de próximos agendamentos
async function UpcomingAppointments({ userId }: { userId: string }) {
  const metrics = await getMetrics(userId);

  if (metrics.upcoming.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-slate-600">Nenhum agendamento próximo</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Próximos Agendamentos</h2>
      <div className="space-y-3">
        {metrics.upcoming.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors"
          >
            <div>
              <p className="font-medium text-slate-900">{apt.customerName}</p>
              <p className="text-sm text-slate-600">{apt.startAt}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                apt.status === "CONFIRMED"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {apt.status === "CONFIRMED" ? "Confirmado" : "Pendente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function VisaoGeralPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/dashboard")}&m=login_required`);
  }

  const account = await ensureAccount(user.uid, user.email ?? null);
  const planDetails = getPlanDetails(account.plan);
  const reminders = getReminderSettings(account);
  const accountActive = isAccountActive(account);

  // Verificar quais passos do setup foram completados
  const { getDb } = await import("@/lib/firebaseAdmin");
  const db = getDb();
  const calendarsSnapshot = await db
    .collection("linkedCalendars")
    .where("ownerUid", "==", user.uid)
    .limit(1)
    .get();

  const hasGoogleCalendar = !calendarsSnapshot.empty;
  const hasRemindersEnabled = reminders.enabled;
  const hasPlan = account.plan !== "inactive" && account.status !== "canceled";

  const setupSteps: SetupStep[] = [
    { id: "account", label: "Conta criada", done: true },
    { id: "plan", label: "Plano ativo", done: hasPlan },
    {
      id: "calendar",
      label: "Google Calendar conectado",
      done: hasGoogleCalendar,
      action: hasGoogleCalendar
        ? undefined
        : {
            label: "Conectar",
            onClick: () => (window.location.href = "/dashboard?tab=configuracoes"),
          },
    },
    {
      id: "reminders",
      label: "Lembretes configurados",
      done: hasRemindersEnabled,
      action: hasRemindersEnabled
        ? undefined
        : {
            label: "Configurar",
            onClick: () => (window.location.href = "/dashboard?tab=configuracoes"),
          },
    },
    {
      id: "slug",
      label: "Slug personalizado",
      done: !!calendarsSnapshot.docs[0]?.data().slug,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Setup Progress */}
      <SetupProgress steps={setupSteps} />

      {/* Métricas */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>
        }
      >
        <MetricsSection userId={user.uid} />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions
        actions={[
          {
            icon: "link",
            title: "Ver minha página de agendamento",
            description: "Compartilhe com seus clientes",
            href: calendarsSnapshot.docs[0]?.data().slug
              ? `/agenda/${calendarsSnapshot.docs[0].data().slug}`
              : "#",
          },
          {
            icon: "calendar",
            title: "Conectar Google Calendar",
            description: hasGoogleCalendar
              ? "Calendário já conectado"
              : "Sincronize seus agendamentos",
            href: "/dashboard?tab=configuracoes",
          },
          {
            icon: "settings",
            title: "Configurar lembretes",
            description: "Envie lembretes automáticos por WhatsApp",
            href: "/dashboard?tab=configuracoes",
          },
          {
            icon: "zap",
            title: "Ver planos",
            description: `Plano atual: ${planDetails?.label || "Inativo"}`,
            href: "/dashboard/plans",
          },
        ]}
      />

      {/* Próximos Agendamentos */}
      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        }
      >
        <UpcomingAppointments userId={user.uid} />
      </Suspense>
    </div>
  );
}
