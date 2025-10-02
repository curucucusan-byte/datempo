// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/lib/stripe.ts

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripeClient: Stripe | null = null;

function initializeStripe(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não está configurada nas variáveis de ambiente.");
  }

  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
  });
}

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = initializeStripe();
  }

  return stripeClient;
}

export type StripeCustomer = {
  id: string;
  email?: string | null;
  name?: string | null;
  metadata: {
    uid: string;
  };
};

export type StripeSubscription = {
  id: string;
  customer: string;
  status: Stripe.Subscription.Status;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  metadata: {
    uid: string;
    plan: string;
  };
};

export type StripePaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: Stripe.PaymentIntent.Status;
  metadata: {
    uid: string;
    plan: string;
    type: "subscription" | "pix_monthly";
  };
};

// Criar ou recuperar um cliente Stripe
export async function getOrCreateStripeCustomer(uid: string, email?: string | null): Promise<StripeCustomer> {
  const stripe = getStripeClient();
  // Tenta via Search API por metadata.uid
  try {
    const found = await stripe.customers.search({
      query: `metadata['uid']:'${uid.replace(/'/g, "")}'`,
      limit: 1,
    });
    if (found.data.length > 0) {
      return found.data[0] as unknown as StripeCustomer;
    }
  } catch {
    // fallback silencioso
  }

  // Fallback: tenta por email (se disponível)
  if (email) {
    try {
      const list = await stripe.customers.list({ email, limit: 1 });
      if (list.data.length > 0) {
        return list.data[0] as unknown as StripeCustomer;
      }
    } catch {}
  }

  // Cria novo
  const customer = await stripe.customers.create({
    email: email || undefined,
    metadata: { uid },
  });
  return customer as unknown as StripeCustomer;
}

// Criar uma assinatura recorrente para cartão de crédito
export async function createSubscription(
  customerId: string,
  priceId: string,
  uid: string,
  plan: string
): Promise<StripeSubscription> {
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata: {
      uid,
      plan,
    },
  });

  return subscription as StripeSubscription;
}

// Criar um PaymentIntent para pagamento único via Pix
export async function createPixPaymentIntent(
  amount: number,
  customerId: string,
  uid: string,
  plan: string
): Promise<StripePaymentIntent> {
  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe usa centavos
    currency: "brl",
    customer: customerId,
    payment_method_types: ["pix"],
    metadata: {
      uid,
      plan,
      type: "pix_monthly",
    },
  });

  return paymentIntent as StripePaymentIntent;
}

// Cancelar uma assinatura
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();
  return await stripe.subscriptions.cancel(subscriptionId);
}

// Recuperar uma assinatura
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();
  return await stripe.subscriptions.retrieve(subscriptionId);
}

// Recuperar um PaymentIntent
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

// Listar assinaturas de um cliente
export async function listCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const stripe = getStripeClient();
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
  });
  return subscriptions.data;
}
