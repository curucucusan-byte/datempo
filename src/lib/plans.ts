export type ActivePlanId = "free" | "starter" | "pro";
export type PlanId = ActivePlanId | "inactive";

export type PlanLimits = {
  maxConnectedCalendars: number;
  maxAppointmentsPerMonth: number;
  whatsappMessagesIncludedPerMonth: number;
  maxAutoRemindersPerAppointment: number;
};

export type PlanFeatures = {
  paymentAtBooking: boolean;
  noShowPaymentOption: boolean;
};

export type PlanOverage = {
  whatsappMessageBRL: number | null;
};

export type PlanDetails = {
  id: ActivePlanId;
  label: string;
  monthlyPrice: number;
  priceDisplay: string;
  trialDays: number;
  limits: PlanLimits;
  features: PlanFeatures;
  overage: PlanOverage;
  bullets: string[];
};

export const ACTIVE_PLANS: Record<ActivePlanId, PlanDetails> = {
  free: {
    id: "free",
    label: "Free",
    monthlyPrice: 0,
    priceDisplay: "Grátis",
    trialDays: 0,
    limits: {
      maxConnectedCalendars: 1,
      maxAppointmentsPerMonth: 30,
      whatsappMessagesIncludedPerMonth: 30,
      maxAutoRemindersPerAppointment: 0,
    },
    features: {
      paymentAtBooking: false,
      noShowPaymentOption: false,
    },
    overage: {
      whatsappMessageBRL: null,
    },
    bullets: [
      "1 agenda Google conectada",
      "30 agendamentos/mês",
      "Confirmação via WhatsApp",
      "Sem lembretes automáticos",
    ],
  },
  starter: {
    id: "starter",
    label: "Starter",
    monthlyPrice: 39,
    priceDisplay: "R$ 39,00/mês",
    trialDays: 0,
    limits: {
      maxConnectedCalendars: 3,
      maxAppointmentsPerMonth: 200,
      whatsappMessagesIncludedPerMonth: 200,
      maxAutoRemindersPerAppointment: 1,
    },
    features: {
      paymentAtBooking: false,
      noShowPaymentOption: false,
    },
    overage: {
      whatsappMessageBRL: null,
    },
    bullets: [
      "Até 3 agendas Google",
      "200 agendamentos/mês",
      "Confirmação + 1 lembrete WhatsApp",
      "Sem marca d'água",
      "Suporte email (48h)",
    ],
  },
  pro: {
    id: "pro",
    label: "Pro",
    monthlyPrice: 79,
    priceDisplay: "R$ 79,00/mês",
    trialDays: 0,
    limits: {
      maxConnectedCalendars: 10,
      maxAppointmentsPerMonth: 1000,
      whatsappMessagesIncludedPerMonth: 1000,
      maxAutoRemindersPerAppointment: 3,
    },
    features: {
      paymentAtBooking: false,
      noShowPaymentOption: false,
    },
    overage: {
      whatsappMessageBRL: null,
    },
    bullets: [
      "Até 10 agendas Google",
      "1.000 agendamentos/mês",
      "Lembretes ilimitados WhatsApp",
      "PIX/Manual para pagamentos",
      "Suporte prioritário (24h)",
    ],
  },
};

export const DEFAULT_ACTIVE_PLAN_ID: ActivePlanId = "free";

export function isActivePlan(plan: PlanId): plan is ActivePlanId {
  return plan === "free" || plan === "starter" || plan === "pro";
}

export function getPlanDetails(plan: PlanId) {
  if (isActivePlan(plan)) {
    return ACTIVE_PLANS[plan];
  }
  return null;
}

export function getPlanCalendarLimit(plan: PlanId): number {
  return isActivePlan(plan) ? ACTIVE_PLANS[plan].limits.maxConnectedCalendars : 0;
}

export const CALENDAR_SWAP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 1 dia
