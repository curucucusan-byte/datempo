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
  reviewsGoogle: boolean;
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
      maxAppointmentsPerMonth: 50,
      whatsappMessagesIncludedPerMonth: 50,
      maxAutoRemindersPerAppointment: 0,
    },
    features: {
      paymentAtBooking: false,
      reviewsGoogle: false,
      noShowPaymentOption: false,
    },
    overage: {
      whatsappMessageBRL: null,
    },
    bullets: [
      "1 agenda Google conectada",
      "50 agendamentos/mês",
      "50 mensagens WhatsApp incluídas",
      "Sem lembretes automáticos",
    ],
  },
  starter: {
    id: "starter",
    label: "Starter",
    monthlyPrice: 49,
    priceDisplay: "R$ 49,00/mês",
    trialDays: 3,
    limits: {
      maxConnectedCalendars: 3,
      maxAppointmentsPerMonth: 300,
      whatsappMessagesIncludedPerMonth: 300,
      maxAutoRemindersPerAppointment: 2,
    },
    features: {
      paymentAtBooking: true,
      reviewsGoogle: false,
      noShowPaymentOption: true,
    },
    overage: {
      whatsappMessageBRL: 0.19,
    },
    bullets: [
      "Até 3 agendas Google",
      "300 agendamentos/mês",
      "300 mensagens WhatsApp incluídas (overage opcional)",
      "Até 2 lembretes automáticos por agendamento",
      "Pagamentos no ato opcionais",
    ],
  },
  pro: {
    id: "pro",
    label: "Pro",
    monthlyPrice: 99,
    priceDisplay: "R$ 99,00/mês",
    trialDays: 3,
    limits: {
      maxConnectedCalendars: 20,
      maxAppointmentsPerMonth: 1000,
      whatsappMessagesIncludedPerMonth: 1000,
      maxAutoRemindersPerAppointment: 3,
    },
    features: {
      paymentAtBooking: true,
      reviewsGoogle: true,
      noShowPaymentOption: true,
    },
    overage: {
      whatsappMessageBRL: 0.17,
    },
    bullets: [
      "Até 20 agendas Google",
      "1.000 agendamentos/mês",
      "1.000 mensagens WhatsApp incluídas (overage opcional)",
      "Até 3 lembretes automáticos por agendamento",
      "Reviews Google e cobrança de no-show",
    ],
  },
};

export const DEFAULT_ACTIVE_PLAN_ID: ActivePlanId = "starter";

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
