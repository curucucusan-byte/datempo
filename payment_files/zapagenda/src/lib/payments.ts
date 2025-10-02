// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/lib/payments.ts

import { getDb } from "@/lib/firebaseAdmin";
import { stripe, getOrCreateStripeCustomer, createSubscription, createPixPaymentIntent } from "@/lib/stripe";
import { updateAccount, getAccount } from "@/lib/account";
import { ACTIVE_PLANS, type ActivePlanId } from "@/lib/plans";

export type PaymentMethod = "credit_card" | "pix";

export type PaymentRecord = {
  id: string;
  uid: string;
  plan: ActivePlanId;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "canceled";
  stripePaymentIntentId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  nextPaymentDate?: string; // Para pagamentos Pix mensais
};

export type Subscription = {
  id: string;
  uid: string;
  plan: ActivePlanId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: "active" | "past_due" | "canceled" | "incomplete" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

const PAYMENTS_COLLECTION = "payments";
const SUBSCRIPTIONS_COLLECTION = "subscriptions";

function nowIso() {
  return new Date().toISOString();
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// Criar pagamento via cartão de crédito (assinatura recorrente)
export async function createCreditCardSubscription(
  uid: string,
  email: string | null,
  plan: ActivePlanId
): Promise<{ subscription: Subscription; clientSecret: string }> {
  const db = getDb();
  const planDetails = ACTIVE_PLANS[plan];
  
  if (!planDetails) {
    throw new Error("Plano inválido.");
  }

  // Criar ou recuperar cliente Stripe
  const stripeCustomer = await getOrCreateStripeCustomer(uid, email);

  // Criar Price no Stripe (ou usar um existente)
  const stripePrice = await stripe.prices.create({
    unit_amount: planDetails.monthlyPrice * 100, // Centavos
    currency: "brl",
    recurring: { interval: "month" },
    product_data: {
      name: `ZapAgenda - Plano ${planDetails.label}`,
    },
  });

  // Criar assinatura no Stripe
  const stripeSubscription = await createSubscription(
    stripeCustomer.id,
    stripePrice.id,
    uid,
    plan
  );

  // Salvar assinatura no Firebase
  const subscription: Subscription = {
    id: stripeSubscription.id,
    uid,
    plan,
    stripeSubscriptionId: stripeSubscription.id,
    stripeCustomerId: stripeCustomer.id,
    status: stripeSubscription.status as Subscription["status"],
    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  await db.collection(SUBSCRIPTIONS_COLLECTION).doc(subscription.id).set(subscription);

  // Obter client_secret para o frontend
  const invoice = stripeSubscription.latest_invoice as any;
  const paymentIntent = invoice?.payment_intent;
  const clientSecret = paymentIntent?.client_secret;

  if (!clientSecret) {
    throw new Error("Falha ao obter client_secret para pagamento.");
  }

  return { subscription, clientSecret };
}

// Criar pagamento via Pix (mensal avulso)
export async function createPixPayment(
  uid: string,
  email: string | null,
  plan: ActivePlanId
): Promise<{ payment: PaymentRecord; clientSecret: string }> {
  const db = getDb();
  const planDetails = ACTIVE_PLANS[plan];
  
  if (!planDetails) {
    throw new Error("Plano inválido.");
  }

  // Criar ou recuperar cliente Stripe
  const stripeCustomer = await getOrCreateStripeCustomer(uid, email);

  // Criar PaymentIntent no Stripe
  const stripePaymentIntent = await createPixPaymentIntent(
    planDetails.monthlyPrice,
    stripeCustomer.id,
    uid,
    plan
  );

  // Calcular próxima data de pagamento (1 mês a partir de agora)
  const nextPaymentDate = addMonths(new Date(), 1).toISOString();

  // Salvar pagamento no Firebase
  const payment: PaymentRecord = {
    id: stripePaymentIntent.id,
    uid,
    plan,
    method: "pix",
    amount: planDetails.monthlyPrice,
    currency: "brl",
    status: stripePaymentIntent.status as PaymentRecord["status"],
    stripePaymentIntentId: stripePaymentIntent.id,
    stripeCustomerId: stripeCustomer.id,
    nextPaymentDate,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  await db.collection(PAYMENTS_COLLECTION).doc(payment.id).set(payment);

  return { payment, clientSecret: stripePaymentIntent.client_secret! };
}

// Atualizar status de pagamento após webhook da Stripe
export async function updatePaymentStatus(
  paymentIntentId: string,
  status: PaymentRecord["status"],
  paidAt?: string
): Promise<void> {
  const db = getDb();
  
  const paymentDoc = await db.collection(PAYMENTS_COLLECTION).doc(paymentIntentId).get();
  if (!paymentDoc.exists) {
    throw new Error("Pagamento não encontrado.");
  }

  const payment = paymentDoc.data() as PaymentRecord;
  
  const updates: Partial<PaymentRecord> = {
    status,
    updatedAt: nowIso(),
  };

  if (paidAt) {
    updates.paidAt = paidAt;
  }

  await db.collection(PAYMENTS_COLLECTION).doc(paymentIntentId).update(updates);

  // Se o pagamento foi bem-sucedido, atualizar a conta do usuário
  if (status === "succeeded") {
    await updateAccount(payment.uid, {
      plan: payment.plan,
      status: "active",
    });
  }
}

// Atualizar status de assinatura após webhook da Stripe
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: Subscription["status"],
  currentPeriodStart?: number,
  currentPeriodEnd?: number,
  cancelAtPeriodEnd?: boolean
): Promise<void> {
  const db = getDb();
  
  const subscriptionDoc = await db.collection(SUBSCRIPTIONS_COLLECTION).doc(subscriptionId).get();
  if (!subscriptionDoc.exists) {
    throw new Error("Assinatura não encontrada.");
  }

  const subscription = subscriptionDoc.data() as Subscription;
  
  const updates: Partial<Subscription> = {
    status,
    updatedAt: nowIso(),
  };

  if (currentPeriodStart) {
    updates.currentPeriodStart = new Date(currentPeriodStart * 1000).toISOString();
  }

  if (currentPeriodEnd) {
    updates.currentPeriodEnd = new Date(currentPeriodEnd * 1000).toISOString();
  }

  if (typeof cancelAtPeriodEnd === "boolean") {
    updates.cancelAtPeriodEnd = cancelAtPeriodEnd;
  }

  await db.collection(SUBSCRIPTIONS_COLLECTION).doc(subscriptionId).update(updates);

  // Atualizar a conta do usuário baseado no status da assinatura
  if (status === "active") {
    await updateAccount(subscription.uid, {
      plan: subscription.plan,
      status: "active",
    });
  } else if (status === "canceled" || status === "past_due") {
    await updateAccount(subscription.uid, {
      plan: "inactive",
      status: "canceled",
    });
  }
}

// Obter assinatura ativa de um usuário
export async function getUserActiveSubscription(uid: string): Promise<Subscription | null> {
  const db = getDb();
  
  const snapshot = await db
    .collection(SUBSCRIPTIONS_COLLECTION)
    .where("uid", "==", uid)
    .where("status", "in", ["active", "trialing"])
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as Subscription;
}

// Obter último pagamento Pix de um usuário
export async function getUserLastPixPayment(uid: string): Promise<PaymentRecord | null> {
  const db = getDb();
  
  const snapshot = await db
    .collection(PAYMENTS_COLLECTION)
    .where("uid", "==", uid)
    .where("method", "==", "pix")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as PaymentRecord;
}

// Verificar se um usuário pode fazer um novo pagamento Pix
export async function canUserMakePixPayment(uid: string): Promise<boolean> {
  const lastPixPayment = await getUserLastPixPayment(uid);
  
  if (!lastPixPayment) {
    return true; // Primeiro pagamento
  }

  if (lastPixPayment.status === "pending") {
    return false; // Já tem um pagamento pendente
  }

  if (!lastPixPayment.nextPaymentDate) {
    return true; // Sem data de próximo pagamento definida
  }

  // Verificar se já passou da data de próximo pagamento
  const nextPaymentDate = new Date(lastPixPayment.nextPaymentDate);
  const now = new Date();
  
  return now >= nextPaymentDate;
}
