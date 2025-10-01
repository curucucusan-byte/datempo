export type ActivePlanId = "essencial" | "pro";
export type PlanId = ActivePlanId | "inactive";

export type PlanDetails = {
  id: ActivePlanId;
  label: string;
  monthlyPrice: number;
  priceDisplay: string;
  trialDays: number;
  googleCalendars: number;
  calendarSwapPerDay: number;
  whatsappReminders: {
    enabled: boolean;
    configurable: boolean;
  };
  bullets: string[];
};

export const ACTIVE_PLANS: Record<ActivePlanId, PlanDetails> = {
  essencial: {
    id: "essencial",
    label: "Essencial",
    monthlyPrice: 21,
    priceDisplay: "R$ 21,00/mês",
    trialDays: 3,
    googleCalendars: 1,
    calendarSwapPerDay: 1,
    whatsappReminders: {
      enabled: false,
      configurable: false,
    },
    bullets: [
      "1 agenda do Google (troca 1x ao dia)",
      "Lembretes WhatsApp: Não",
      "Teste: 3 dias (sem custo)",
    ],
  },
  pro: {
    id: "pro",
    label: "Pro",
    monthlyPrice: 39,
    priceDisplay: "R$ 39,00/mês",
    trialDays: 3,
    googleCalendars: 10,
    calendarSwapPerDay: 10,
    whatsappReminders: {
      enabled: true,
      configurable: true,
    },
    bullets: [
      "Até 10 agendas do Google",
      "Lembretes WhatsApp: Sim (configurável)",
      "Teste: 3 dias (sem custo)",
    ],
  },
};

export const DEFAULT_ACTIVE_PLAN_ID: ActivePlanId = "pro";

export function isActivePlan(plan: PlanId): plan is ActivePlanId {
  return plan === "essencial" || plan === "pro";
}

export function getPlanDetails(plan: PlanId) {
  if (isActivePlan(plan)) {
    return ACTIVE_PLANS[plan];
  }
  return null;
}

export function getPlanCalendarLimit(plan: PlanId): number {
  return isActivePlan(plan) ? ACTIVE_PLANS[plan].googleCalendars : 0;
}

export const CALENDAR_SWAP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 1 dia
