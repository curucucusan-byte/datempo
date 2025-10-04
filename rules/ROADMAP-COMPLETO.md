# 🎯 ROADMAP COMPLETO - ZapAgenda
## Análise de Regras de Negócio e Pendências para Deixar Tudo Redondinho

**Data:** 04 de Outubro de 2025  
**Status Atual:** Sistema funcional com design moderno, mas com gaps críticos em regras de negócio

---

## 📊 SUMÁRIO EXECUTIVO

### ✅ O que está FUNCIONANDO BEM:
- ✅ Design system moderno implementado em todas as páginas
- ✅ Autenticação Google + Firebase funcionando
- ✅ Integração Google Calendar (vincular/sincronizar agendas)
- ✅ Fluxo básico de agendamento público
- ✅ Sistema de planos (Free/Starter/Pro) definido
- ✅ Pagamentos Stripe (cartão + Pix) parcialmente implementados
- ✅ Build e deploy funcionais no Vercel

### ⚠️ O que está PARCIALMENTE IMPLEMENTADO:
- ⚠️ WhatsApp Cloud API (código existe mas sem guard de 22h)
- ⚠️ Sistema de mensagens (sem log/auditoria)
- ⚠️ Enforcement de limites por plano (código presente mas não totalmente aplicado)
- ⚠️ Webhook do Stripe (existe mas sem tratamento completo)

### ❌ O que está FALTANDO (CRÍTICO):
- ❌ Guard de envio de 22h (SessionIndex/AttemptLog)
- ❌ MessageLog para rastreabilidade LGPD
- ❌ Confirmação via WhatsApp com estados PENDING→TENTATIVE→CONFIRMED
- ❌ Pagamento no ato do agendamento (pré-pagamento de clientes)
- ❌ Contadores de uso em tempo real no dashboard
- ❌ Sistema de overage (excedente de mensagens)
- ❌ Reativação de clientes inativos
- ❌ Reviews Google pós-atendimento
- ❌ Lista de espera inteligente
- ❌ Histórico de pagamentos no dashboard

---

## 🔴 PRIORIDADE 1 - CRÍTICO (SEM ISSO, O SISTEMA NÃO ESTÁ COMPLIANT)

### 1.1 Guard de Envio WhatsApp (22h) + Auditoria LGPD

**Problema:** Sistema pode enviar mensagens sem consentimento/sessão válida, violando políticas do WhatsApp e LGPD.

**O que falta:**

#### A. Criar Coleções Firestore:

```typescript
// SessionIndex - Rastreamento de sessões ativas
type SessionIndex = {
  id: string; // phoneE164_tenantId
  phoneE164: string; // +55DDDNUMERO
  tenantId: string; // UID do dono da agenda
  lastInboundAt: string; // ISO timestamp última msg recebida
  lastOutboundAt: string; // ISO timestamp última msg enviada
  remindersOpt: "on" | "off" | "unknown"; // Consentimento lembretes
  optSource?: "button" | "keyword" | "form"; // Origem do opt-in
  optAt?: string; // Timestamp do opt-in
  createdAt: string;
  updatedAt: string;
};

// MessageLog - Histórico completo de mensagens
type MessageLog = {
  id: string; // gerado automaticamente
  tenantId: string; // UID dono
  appointmentId?: string; // Se relacionado a agendamento
  direction: "to_customer" | "to_owner" | "reminder" | "confirmation" | "feedback";
  phoneE164: string; // Destinatário
  waMessageId?: string; // ID retornado pela Meta API
  status: "sent" | "delivered" | "read" | "failed" | "blocked_by_guard";
  body: string; // Conteúdo da mensagem
  reason?: string; // Se blocked: "NO_RECENT_INBOUND_22H" | "OPT_OUT" | "PLAN_DISABLED"
  metadata?: Record<string, unknown>; // Dados extras
  createdAt: string;
};

// AttemptLog - Tentativas bloqueadas (subset do MessageLog)
type AttemptLog = {
  id: string;
  attemptedAt: string;
  tenantId: string;
  phoneE164: string;
  type: "CONFIRMATION" | "REMINDER" | "OTHER";
  allowed: boolean;
  reason?: "NO_RECENT_INBOUND_22H" | "OPT_OUT" | "PLAN_DISABLED" | "QUOTA_EXCEEDED" | "OTHER";
  appointmentId?: string;
};
```

#### B. Implementar Guard Function:

```typescript
// src/lib/guards.ts (NOVO ARQUIVO)

import { getDb } from "@/lib/firebaseAdmin";
import { getAccount } from "@/lib/account";
import { ACTIVE_PLANS } from "@/lib/plans";

type GuardResult = {
  allowed: boolean;
  reason?: string;
  sessionValid?: boolean;
  planAllows?: boolean;
  hasConsent?: boolean;
};

export async function canSendWhatsApp(
  tenantId: string,
  phoneE164: string,
  messageType: "confirmation" | "reminder" | "feedback" | "other"
): Promise<GuardResult> {
  const db = getDb();
  
  // 1. Verificar plano
  const account = await getAccount(tenantId);
  if (!account) {
    return { allowed: false, reason: "ACCOUNT_NOT_FOUND" };
  }
  
  const plan = ACTIVE_PLANS[account.plan];
  
  // Free não tem lembretes automáticos
  if (messageType === "reminder" && plan.limits.maxAutoRemindersPerAppointment === 0) {
    return { allowed: false, reason: "PLAN_DISABLED", planAllows: false };
  }
  
  // 2. Verificar quota de mensagens
  // TODO: Implementar contador mensal
  // const usage = await getMonthlyUsage(tenantId);
  // if (usage.whatsAppMessages >= plan.limits.whatsappMessagesIncludedPerMonth) {
  //   if (plan.id === "free") return { allowed: false, reason: "QUOTA_EXCEEDED" };
  //   // Starter/Pro: permitir com overage
  // }
  
  // 3. Buscar sessão
  const sessionId = `${phoneE164}_${tenantId}`;
  const sessionDoc = await db.collection("sessionIndex").doc(sessionId).get();
  
  if (!sessionDoc.exists) {
    return { 
      allowed: false, 
      reason: "NO_SESSION_FOUND",
      sessionValid: false 
    };
  }
  
  const session = sessionDoc.data() as SessionIndex;
  
  // 4. Verificar consentimento (para lembretes)
  if (messageType === "reminder" && session.remindersOpt !== "on") {
    return { 
      allowed: false, 
      reason: "OPT_OUT",
      hasConsent: false 
    };
  }
  
  // 5. Verificar janela de 22h
  const now = Date.now();
  const lastInbound = new Date(session.lastInboundAt).getTime();
  const hoursSinceInbound = (now - lastInbound) / (1000 * 60 * 60);
  
  if (hoursSinceInbound > 22) {
    return { 
      allowed: false, 
      reason: "NO_RECENT_INBOUND_22H",
      sessionValid: false 
    };
  }
  
  return { 
    allowed: true,
    sessionValid: true,
    planAllows: true,
    hasConsent: messageType !== "reminder" || session.remindersOpt === "on"
  };
}

export async function logMessageAttempt(
  tenantId: string,
  phoneE164: string,
  type: string,
  allowed: boolean,
  reason?: string,
  appointmentId?: string
): Promise<void> {
  const db = getDb();
  await db.collection("attemptLog").add({
    attemptedAt: new Date().toISOString(),
    tenantId,
    phoneE164,
    type,
    allowed,
    reason,
    appointmentId,
  });
}

export async function logMessage(
  tenantId: string,
  phoneE164: string,
  direction: string,
  body: string,
  status: string,
  waMessageId?: string,
  appointmentId?: string,
  reason?: string
): Promise<void> {
  const db = getDb();
  await db.collection("messageLog").add({
    tenantId,
    phoneE164,
    direction,
    body,
    status,
    waMessageId,
    appointmentId,
    reason,
    createdAt: new Date().toISOString(),
  });
}

export async function updateSessionInbound(
  tenantId: string,
  phoneE164: string
): Promise<void> {
  const db = getDb();
  const sessionId = `${phoneE164}_${tenantId}`;
  const now = new Date().toISOString();
  
  await db.collection("sessionIndex").doc(sessionId).set({
    phoneE164,
    tenantId,
    lastInboundAt: now,
    updatedAt: now,
  }, { merge: true });
}

export async function updateSessionOutbound(
  tenantId: string,
  phoneE164: string
): Promise<void> {
  const db = getDb();
  const sessionId = `${phoneE164}_${tenantId}`;
  const now = new Date().toISOString();
  
  await db.collection("sessionIndex").doc(sessionId).set({
    phoneE164,
    tenantId,
    lastOutboundAt: now,
    updatedAt: now,
  }, { merge: true });
}
```

#### C. Atualizar WhatsApp Provider:

```typescript
// src/lib/whats.ts - MODIFICAR

import { canSendWhatsApp, logMessage, logMessageAttempt, updateSessionOutbound } from "@/lib/guards";

export async function sendWhats(params: {
  to: string;
  body: string;
  tenantId: string;
  messageType?: "confirmation" | "reminder" | "feedback" | "other";
  appointmentId?: string;
}): Promise<{ ok: boolean; waMessageId?: string; error?: string }> {
  const { to, body, tenantId, messageType = "other", appointmentId } = params;
  
  // GUARD CHECK
  const guardResult = await canSendWhatsApp(tenantId, to, messageType);
  
  if (!guardResult.allowed) {
    // Logar tentativa bloqueada
    await logMessageAttempt(tenantId, to, messageType, false, guardResult.reason, appointmentId);
    await logMessage(tenantId, to, "outbound", body, "blocked_by_guard", undefined, appointmentId, guardResult.reason);
    
    return { 
      ok: false, 
      error: `Envio bloqueado: ${guardResult.reason}` 
    };
  }
  
  // Prosseguir com envio normal...
  const token = process.env.WA_META_TOKEN;
  const phoneId = process.env.WA_PHONE_NUMBER_ID;
  
  if (!token || !phoneId) {
    await logMessage(tenantId, to, "outbound", body, "failed", undefined, appointmentId, "MISSING_CREDENTIALS");
    return { ok: false, error: "Credenciais WhatsApp ausentes" };
  }
  
  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      await logMessage(tenantId, to, "outbound", body, "failed", undefined, appointmentId, data.error?.message);
      return { ok: false, error: data.error?.message || "Falha ao enviar" };
    }
    
    const waMessageId = data.messages?.[0]?.id;
    
    // Atualizar sessão
    await updateSessionOutbound(tenantId, to);
    
    // Logar mensagem enviada
    await logMessage(tenantId, to, "outbound", body, "sent", waMessageId, appointmentId);
    
    // Logar tentativa bem-sucedida
    await logMessageAttempt(tenantId, to, messageType, true, undefined, appointmentId);
    
    return { ok: true, waMessageId };
  } catch (error) {
    await logMessage(tenantId, to, "outbound", body, "failed", undefined, appointmentId, error.message);
    return { ok: false, error: error.message };
  }
}
```

#### D. Atualizar Webhook WhatsApp:

```typescript
// src/app/api/webhooks/wa/route.ts - ADICIONAR

import { updateSessionInbound, logMessage } from "@/lib/guards";

export async function POST(request: Request) {
  // ... código existente de validação ...
  
  const payload = await request.json();
  
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "messages") continue;
      
      const messages = change.value?.messages || [];
      
      for (const msg of messages) {
        const from = msg.from; // phoneE164
        const text = msg.text?.body || "";
        const waMessageId = msg.id;
        
        // IMPORTANTE: Atualizar sessão inbound
        // Precisamos saber qual tenantId (pode vir do metadata ou lookup)
        // Por ora, assumir que o número receptor identifica o tenant
        
        const tenantId = await getTenantIdByPhone(change.value.metadata.phone_number_id);
        
        if (tenantId) {
          await updateSessionInbound(tenantId, from);
          await logMessage(tenantId, from, "inbound", text, "received", waMessageId);
        }
        
        // ... resto do processamento de confirmação ...
      }
    }
  }
  
  return NextResponse.json({ ok: true });
}

// Helper function (implementar)
async function getTenantIdByPhone(phoneNumberId: string): Promise<string | null> {
  // Buscar no linkedCalendars qual tenantId usa esse phoneNumberId
  // Ou manter mapeamento separado
  return null; // TODO
}
```

**Estimativa:** 16-24 horas de desenvolvimento

---

### 1.2 Sistema de Contadores e Enforcement de Quotas

**Problema:** Planos têm limites definidos mas não são enforçados em tempo real.

**O que falta:**

#### A. Criar Coleção de Uso Mensal:

```typescript
// MonthlyUsage - Contadores por tenant por mês
type MonthlyUsage = {
  id: string; // `${tenantId}_${YYYY-MM}`
  tenantId: string;
  month: string; // "2025-10"
  planId: string; // Snapshot do plano no período
  counters: {
    appointments: number;
    whatsAppMessages: number;
    connectedCalendars: number; // Snapshot
  };
  overage: {
    whatsAppMessages: number; // Mensagens além do incluído
    chargesBRL: number; // Valor a cobrar (Starter/Pro)
  };
  periodStart: string;
  periodEnd: string;
  updatedAt: string;
};
```

#### B. Implementar Funções de Controle:

```typescript
// src/lib/usage.ts (NOVO ARQUIVO)

import { getDb } from "@/lib/firebaseAdmin";
import { getAccount } from "@/lib/account";
import { ACTIVE_PLANS } from "@/lib/plans";

export async function getCurrentMonthUsage(tenantId: string): Promise<MonthlyUsage> {
  const db = getDb();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const usageId = `${tenantId}_${month}`;
  
  const doc = await db.collection("monthlyUsage").doc(usageId).get();
  
  if (doc.exists) {
    return doc.data() as MonthlyUsage;
  }
  
  // Criar novo registro
  const account = await getAccount(tenantId);
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  
  const newUsage: MonthlyUsage = {
    id: usageId,
    tenantId,
    month,
    planId: account.plan,
    counters: {
      appointments: 0,
      whatsAppMessages: 0,
      connectedCalendars: account.linkedCalendars?.length || 0,
    },
    overage: {
      whatsAppMessages: 0,
      chargesBRL: 0,
    },
    periodStart,
    periodEnd,
    updatedAt: new Date().toISOString(),
  };
  
  await db.collection("monthlyUsage").doc(usageId).set(newUsage);
  return newUsage;
}

export async function incrementAppointmentCounter(tenantId: string): Promise<boolean> {
  const usage = await getCurrentMonthUsage(tenantId);
  const account = await getAccount(tenantId);
  const plan = ACTIVE_PLANS[account.plan];
  
  if (usage.counters.appointments >= plan.limits.maxAppointmentsPerMonth) {
    return false; // Bloqueado
  }
  
  const db = getDb();
  await db.collection("monthlyUsage").doc(usage.id).update({
    "counters.appointments": usage.counters.appointments + 1,
    updatedAt: new Date().toISOString(),
  });
  
  return true;
}

export async function incrementMessageCounter(tenantId: string): Promise<boolean> {
  const usage = await getCurrentMonthUsage(tenantId);
  const account = await getAccount(tenantId);
  const plan = ACTIVE_PLANS[account.plan];
  
  const newCount = usage.counters.whatsAppMessages + 1;
  const included = plan.limits.whatsappMessagesIncludedPerMonth;
  
  // Free: bloquear se exceder
  if (plan.id === "free" && newCount > included) {
    return false;
  }
  
  // Starter/Pro: permitir e calcular overage
  let overage = 0;
  let chargesBRL = 0;
  
  if (newCount > included) {
    overage = newCount - included;
    chargesBRL = overage * (plan.overage?.whatsappMessageBRL || 0);
  }
  
  const db = getDb();
  await db.collection("monthlyUsage").doc(usage.id).update({
    "counters.whatsAppMessages": newCount,
    "overage.whatsAppMessages": overage,
    "overage.chargesBRL": chargesBRL,
    updatedAt: new Date().toISOString(),
  });
  
  return true;
}

export async function canConnectNewCalendar(tenantId: string): Promise<boolean> {
  const account = await getAccount(tenantId);
  const plan = ACTIVE_PLANS[account.plan];
  const currentCount = account.linkedCalendars?.length || 0;
  
  return currentCount < plan.limits.maxConnectedCalendars;
}
```

#### C. Integrar nos Endpoints:

```typescript
// src/app/api/appointment/route.ts - ADICIONAR no início

import { incrementAppointmentCounter } from "@/lib/usage";

export async function POST(request: Request) {
  // ... validações existentes ...
  
  // NOVO: Verificar quota
  const canCreate = await incrementAppointmentCounter(ownerUid);
  if (!canCreate) {
    return NextResponse.json({
      ok: false,
      error: "Limite mensal de agendamentos atingido. Faça upgrade do seu plano.",
      code: "ERR_PLAN_LIMIT_REACHED",
    }, { status: 403 });
  }
  
  // ... criar agendamento ...
}
```

```typescript
// src/lib/whats.ts - ADICIONAR após guard

import { incrementMessageCounter } from "@/lib/usage";

export async function sendWhats(params) {
  // ... guard check ...
  
  // NOVO: Verificar quota
  const canSend = await incrementMessageCounter(tenantId);
  if (!canSend) {
    await logMessage(tenantId, to, "outbound", body, "blocked_by_guard", undefined, appointmentId, "QUOTA_EXCEEDED");
    return { ok: false, error: "Limite de mensagens atingido este mês" };
  }
  
  // ... enviar mensagem ...
}
```

**Estimativa:** 12-16 horas

---

### 1.3 Dashboard de Uso em Tempo Real

**O que falta:**

```typescript
// src/app/dashboard/usage/page.tsx (NOVA PÁGINA)

import { getCurrentMonthUsage } from "@/lib/usage";
import { getAccount } from "@/lib/account";
import { ACTIVE_PLANS } from "@/lib/plans";

export default async function UsagePage() {
  const user = await getAuthenticatedUser();
  const usage = await getCurrentMonthUsage(user.uid);
  const account = await getAccount(user.uid);
  const plan = ACTIVE_PLANS[account.plan];
  
  const appointmentPercent = (usage.counters.appointments / plan.limits.maxAppointmentsPerMonth) * 100;
  const messagePercent = (usage.counters.whatsAppMessages / plan.limits.whatsappMessagesIncludedPerMonth) * 100;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Uso do Plano {plan.label}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Agendamentos */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Agendamentos</h2>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>{usage.counters.appointments} / {plan.limits.maxAppointmentsPerMonth}</span>
              <span className={appointmentPercent > 80 ? "text-amber-600" : "text-slate-600"}>
                {appointmentPercent.toFixed(0)}%
              </span>
            </div>
            <div className="mt-2 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${appointmentPercent > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(appointmentPercent, 100)}%` }}
              />
            </div>
          </div>
          {appointmentPercent > 80 && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl">
              Você está próximo do limite! Considere fazer upgrade.
            </p>
          )}
        </div>
        
        {/* Card Mensagens WhatsApp */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Mensagens WhatsApp</h2>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>{usage.counters.whatsAppMessages} / {plan.limits.whatsappMessagesIncludedPerMonth}</span>
              <span className={messagePercent > 80 ? "text-amber-600" : "text-slate-600"}>
                {messagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="mt-2 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${messagePercent > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(messagePercent, 100)}%` }}
              />
            </div>
          </div>
          {usage.overage.whatsAppMessages > 0 && (
            <div className="mt-3 text-sm bg-emerald-50 p-3 rounded-xl">
              <p className="font-medium text-emerald-800">
                Excedente: {usage.overage.whatsAppMessages} mensagens
              </p>
              <p className="text-emerald-600">
                Cobrança adicional: R$ {usage.overage.chargesBRL.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold">Período atual</h3>
        <p className="text-sm text-slate-600 mt-1">
          {new Date(usage.periodStart).toLocaleDateString("pt-BR")} até {new Date(usage.periodEnd).toLocaleDateString("pt-BR")}
        </p>
      </div>
    </div>
  );
}
```

**Estimativa:** 8-12 horas

---

## 🟠 PRIORIDADE 2 - IMPORTANTE (FUNCIONALIDADES CORE)

### 2.1 Fluxo Completo de Confirmação via WhatsApp

**Problema:** Estados PENDING/TENTATIVE/CONFIRMED não estão implementados corretamente.

**O que falta:**

#### A. Atualizar Modelo Appointment:

```typescript
// src/lib/store.ts - ADICIONAR campos

export type Appointment = {
  // ... campos existentes ...
  status: "PENDING" | "TENTATIVE" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  token: string; // Token único para validação
  holdTTLMinutes: number; // Tempo de espera inicial
  expiresAt: string; // Timestamp de expiração
  confirmationMode: "auto_on_customer_msg" | "manual_by_owner";
  consentAt?: string; // Timestamp da primeira mensagem do cliente
  tentativeAutoCancelHours?: number; // Para modo manual
};
```

#### B. Gerar Token e Link:

```typescript
// src/app/api/appointment/route.ts - MODIFICAR resposta

import crypto from "crypto";

export async function POST(request: Request) {
  // ... validações ...
  
  const token = crypto.randomBytes(8).toString("hex"); // Token único
  const holdTTLMinutes = 30; // 30 minutos para cliente confirmar
  const expiresAt = new Date(Date.now() + holdTTLMinutes * 60 * 1000).toISOString();
  
  const appointment = {
    // ... campos existentes ...
    status: "PENDING",
    token,
    holdTTLMinutes,
    expiresAt,
    confirmationMode: "auto_on_customer_msg", // ou vir da agenda
    createdAt: new Date().toISOString(),
  };
  
  await saveAppointment(appointment);
  
  // Formatar data local para mensagem
  const appointmentDate = new Date(datetime);
  const dateLocal = appointmentDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // Criar link WhatsApp
  const waText = `CONFIRMAR ${token} ${dateLocal}`;
  const waLink = `https://wa.me/${linkedCalendar.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  
  return NextResponse.json({
    ok: true,
    appointment: {
      id: appointment.id,
      status: "PENDING",
      expiresAt,
      holdTTLMinutes,
    },
    wa: {
      link: waLink,
      text: waText,
      message: "Clique no botão abaixo para confirmar pelo WhatsApp",
    },
  });
}
```

#### C. Processar Confirmação no Webhook:

```typescript
// src/app/api/webhooks/wa/route.ts - ADICIONAR lógica

export async function POST(request: Request) {
  // ... validação webhook ...
  
  const messages = change.value?.messages || [];
  
  for (const msg of messages) {
    const from = msg.from;
    const text = msg.text?.body || "";
    
    // Extrair token via regex
    const match = text.match(/CONFIRMAR\s+([a-f0-9]{16})/i);
    if (!match) continue;
    
    const token = match[1];
    
    // Buscar agendamento
    const appointment = await getAppointmentByToken(token);
    if (!appointment || appointment.status !== "PENDING") {
      // Token inválido ou já processado
      await sendWhats({
        to: from,
        body: "Token inválido ou agendamento já confirmado.",
        tenantId: appointment?.ownerUid || "",
        messageType: "other",
      });
      continue;
    }
    
    // Verificar expiração
    if (new Date() > new Date(appointment.expiresAt)) {
      await updateAppointment(appointment.id, { status: "EXPIRED" });
      await sendWhats({
        to: from,
        body: "Este agendamento expirou. Por favor, faça uma nova reserva.",
        tenantId: appointment.ownerUid,
        messageType: "other",
      });
      continue;
    }
    
    // Revalidar conflitos no Google Calendar
    const hasConflict = await checkGoogleCalendarConflict(
      appointment.ownerUid,
      appointment.slug,
      appointment.startISO,
      appointment.endISO
    );
    
    if (hasConflict) {
      await updateAppointment(appointment.id, { status: "CANCELLED" });
      await sendWhats({
        to: from,
        body: "Desculpe, este horário foi preenchido. Por favor, escolha outro.",
        tenantId: appointment.ownerUid,
        messageType: "other",
      });
      continue;
    }
    
    // Modo automático: confirmar imediatamente
    if (appointment.confirmationMode === "auto_on_customer_msg") {
      const googleEventId = await createGoogleCalendarEvent({
        ownerUid: appointment.ownerUid,
        calendarId: appointment.slug, // Buscar calendarId real
        summary: `Agendamento - ${appointment.customerName}`,
        startISO: appointment.startISO,
        endISO: appointment.endISO,
        description: `Cliente: ${appointment.customerName}\nWhatsApp: ${appointment.customerPhone}`,
        status: "confirmed",
        extendedProperties: {
          private: { token, appointmentId: appointment.id },
        },
      });
      
      await updateAppointment(appointment.id, {
        status: "CONFIRMED",
        googleEventId,
        consentAt: new Date().toISOString(),
      });
      
      // Enviar confirmação (respeitando guard)
      await sendWhats({
        to: from,
        body: `✅ Agendamento confirmado!\n\nData: ${dateLocal}\nLocal: ${linkedCalendar.summary}\n\nVocê receberá um lembrete próximo ao horário.`,
        tenantId: appointment.ownerUid,
        messageType: "confirmation",
        appointmentId: appointment.id,
      });
    }
    
    // Modo manual: criar tentativo
    else if (appointment.confirmationMode === "manual_by_owner") {
      const googleEventId = await createGoogleCalendarEvent({
        // ... mesmos params ...
        status: "tentative",
      });
      
      await updateAppointment(appointment.id, {
        status: "TENTATIVE",
        googleEventId,
        consentAt: new Date().toISOString(),
      });
      
      await sendWhats({
        to: from,
        body: `Pedido recebido! Aguarde aprovação do profissional.`,
        tenantId: appointment.ownerUid,
        messageType: "confirmation",
        appointmentId: appointment.id,
      });
      
      // Notificar dono (se sessão válida)
      await sendWhats({
        to: linkedCalendar.whatsappNumber,
        body: `Novo agendamento aguardando aprovação:\n${appointment.customerName} - ${dateLocal}\n\nAprove em: ${APP_BASE_URL}/dashboard/approve?token=${token}`,
        tenantId: appointment.ownerUid,
        messageType: "other",
      });
    }
  }
  
  return NextResponse.json({ ok: true });
}
```

**Estimativa:** 20-24 horas

---

### 2.2 Pagamento no Ato do Agendamento (Pré-Pagamento)

**Problema:** Cliente final não pode pagar antecipadamente pelo serviço.

**O que falta:**

#### A. Estender Modelos:

```typescript
// LinkedCalendar - adicionar configs de pagamento
type LinkedCalendar = {
  // ... campos existentes ...
  paymentAtBookingEnabled?: boolean;
  paymentProvider?: "stripe" | "mercadopago" | "pagarme";
  paymentCurrency?: string; // BRL
  paymentAmountCents?: number; // Valor em centavos
  paymentWebhookSecret?: string; // Por agenda
};

// Appointment - campos de pagamento
type Appointment = {
  // ... campos existentes ...
  paymentRequired?: boolean;
  paymentStatus?: "PENDING" | "REQUIRES_ACTION" | "PAID" | "FAILED" | "REFUNDED";
  paymentProvider?: string;
  paymentIntentId?: string;
  paymentAmount?: number; // centavos
  paymentCurrency?: string;
  paidAt?: string;
  refundAt?: string;
  refundAmount?: number;
};
```

#### B. Checkout Endpoint:

```typescript
// src/app/api/appointment/checkout/route.ts (NOVO)

export async function POST(request: Request) {
  const { appointmentId } = await request.json();
  
  const appointment = await getAppointment(appointmentId);
  if (!appointment || appointment.status !== "PENDING") {
    return NextResponse.json({ error: "Agendamento inválido" }, { status: 400 });
  }
  
  const linkedCalendar = await getLinkedCalendarBySlug(appointment.slug);
  if (!linkedCalendar.paymentAtBookingEnabled) {
    return NextResponse.json({ error: "Pagamento não habilitado" }, { status: 400 });
  }
  
  const stripe = getStripeClient();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: linkedCalendar.paymentAmountCents,
    currency: linkedCalendar.paymentCurrency || "brl",
    payment_method_types: ["card", "pix"],
    metadata: {
      appointmentId: appointment.id,
      ownerUid: appointment.ownerUid,
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
    },
  });
  
  // Estender TTL
  const extendedExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // +15 min
  
  await updateAppointment(appointment.id, {
    paymentRequired: true,
    paymentProvider: "stripe",
    paymentIntentId: paymentIntent.id,
    paymentAmount: linkedCalendar.paymentAmountCents,
    paymentCurrency: linkedCalendar.paymentCurrency,
    paymentStatus: "PENDING",
    expiresAt: extendedExpiresAt,
  });
  
  return NextResponse.json({
    ok: true,
    clientSecret: paymentIntent.client_secret,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    expiresAt: extendedExpiresAt,
  });
}
```

#### C. Webhook de Pagamento:

```typescript
// src/app/api/webhooks/payment/route.ts (NOVO)

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_APPOINTMENTS // Novo secret!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const appointmentId = paymentIntent.metadata.appointmentId;
    
    const appointment = await getAppointment(appointmentId);
    if (!appointment) return NextResponse.json({ ok: true });
    
    // Confirmar agendamento
    const googleEventId = await createGoogleCalendarEvent({
      ownerUid: appointment.ownerUid,
      // ... dados do evento ...
      status: "confirmed",
      extendedProperties: {
        private: {
          appointmentId,
          paymentIntentId: paymentIntent.id,
        },
      },
    });
    
    await updateAppointment(appointmentId, {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paidAt: new Date().toISOString(),
      googleEventId,
    });
    
    // Enviar confirmação (se guard permitir)
    await sendWhats({
      to: appointment.customerPhone,
      body: `✅ Pagamento confirmado! Seu agendamento está garantido.\n\nData: ${formatDate(appointment.startISO)}`,
      tenantId: appointment.ownerUid,
      messageType: "confirmation",
      appointmentId,
    });
  }
  
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const appointmentId = paymentIntent.metadata.appointmentId;
    
    await updateAppointment(appointmentId, {
      paymentStatus: "FAILED",
    });
    
    // Manter PENDING até expirar o TTL
  }
  
  return NextResponse.json({ ok: true });
}
```

**Estimativa:** 24-32 horas

---

## 🟡 PRIORIDADE 3 - DESEJÁVEL (MELHORIAS DE UX)

### 3.1 Histórico de Pagamentos no Dashboard

```typescript
// src/app/dashboard/payments/page.tsx (NOVA)

export default async function PaymentsHistoryPage() {
  const user = await getAuthenticatedUser();
  
  const subscription = await getUserActiveSubscription(user.uid);
  const pixPayments = await getUserPixPayments(user.uid); // Implementar query
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Histórico de Pagamentos</h1>
      
      {subscription && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-emerald-900">Assinatura Ativa</h2>
          <p className="text-sm text-emerald-700 mt-2">
            Plano: {subscription.plan}<br/>
            Status: {subscription.status}<br/>
            Próxima cobrança: {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
          </p>
        </div>
      )}
      
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Pagamentos Anteriores</h2>
        <table className="w-full">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="text-left py-2">Data</th>
              <th className="text-left py-2">Plano</th>
              <th className="text-left py-2">Método</th>
              <th className="text-left py-2">Valor</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pixPayments.map(payment => (
              <tr key={payment.id} className="border-b border-slate-100">
                <td className="py-3">{new Date(payment.createdAt).toLocaleDateString("pt-BR")}</td>
                <td className="py-3">{payment.plan}</td>
                <td className="py-3">PIX</td>
                <td className="py-3">R$ {(payment.amount / 100).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    payment.status === "succeeded" ? "bg-emerald-100 text-emerald-700" :
                    payment.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Estimativa:** 8 horas

---

### 3.2 Reativação de Clientes Inativos

```typescript
// src/lib/reactivation.ts (NOVO)

export async function findInactiveCustomers(
  tenantId: string,
  daysSinceLastAppointment: number = 60
): Promise<Array<{ phone: string; name: string; lastVisit: string }>> {
  const db = getDb();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastAppointment);
  
  const appointments = await db.collection("appointments")
    .where("ownerUid", "==", tenantId)
    .where("status", "==", "CONFIRMED")
    .where("startISO", "<", cutoffDate.toISOString())
    .orderBy("startISO", "desc")
    .get();
  
  // Agrupar por cliente e pegar último atendimento
  const customers = new Map();
  appointments.docs.forEach(doc => {
    const apt = doc.data();
    if (!customers.has(apt.customerPhone)) {
      customers.set(apt.customerPhone, {
        phone: apt.customerPhone,
        name: apt.customerName,
        lastVisit: apt.startISO,
      });
    }
  });
  
  return Array.from(customers.values());
}

export async function sendReactivationMessage(
  tenantId: string,
  customerPhone: string,
  slots: string[]
): Promise<void> {
  const body = `Olá! Sentimos sua falta! 😊\n\nTemos horários disponíveis:\n${slots.map(s => `• ${s}`).join("\n")}\n\nResponda com o número da opção que prefere!`;
  
  await sendWhats({
    to: customerPhone,
    body,
    tenantId,
    messageType: "other", // Reativação precisa de inbound recente!
  });
}
```

**Estimativa:** 12 horas

---

### 3.3 Reviews Google Automáticos

```typescript
// src/lib/reviews.ts (NOVO)

export async function sendReviewRequest(
  tenantId: string,
  customerPhone: string,
  appointmentId: string
): Promise<void> {
  const account = await getAccount(tenantId);
  const plan = ACTIVE_PLANS[account.plan];
  
  if (!plan.features.reviewsGoogle) {
    return; // Recurso não disponível no plano
  }
  
  // Buscar Place ID do Google Business
  const placeId = account.googleBusinessPlaceId; // Adicionar ao Account
  if (!placeId) return;
  
  const reviewLink = `https://search.google.com/local/writereview?placeid=${placeId}`;
  
  const body = `Obrigado pela visita! 🙏\n\nSua opinião é muito importante. Poderia avaliar nosso atendimento?\n\n${reviewLink}`;
  
  await sendWhats({
    to: customerPhone,
    body,
    tenantId,
    messageType: "feedback",
    appointmentId,
  });
}

// Chamar após conclusão do agendamento (cron)
// Após 2h do horário marcado, enviar review request
```

**Estimativa:** 8 horas

---

## 🔵 PRIORIDADE 4 - FUTURO (NICE TO HAVE)

### 4.1 Lista de Espera Inteligente

**Conceito:** Quando cliente cancela, notificar automaticamente pessoas na lista de espera.

```typescript
type WaitlistEntry = {
  id: string;
  tenantId: string;
  slug: string;
  customerPhone: string;
  customerName: string;
  preferredDates: string[]; // ISOs
  createdAt: string;
  notifiedAt?: string;
};

// Implementar após cancelamento
export async function notifyWaitlist(
  tenantId: string,
  slug: string,
  freedSlot: string
): Promise<void> {
  // Buscar entries na waitlist
  // Enviar WhatsApp com o horário disponível
  // Marcar como notificado
}
```

**Estimativa:** 16 horas

---

### 4.2 Multi-Idioma (i18n)

**Conceito:** Suporte para inglês/espanhol além de português.

**Implementar:** next-intl ou i18next

**Estimativa:** 24-32 horas

---

### 4.3 Relatórios Avançados

**Conceito:** Exportar CSV, gráficos de ocupação, análise de no-shows.

**Estimativa:** 20 horas

---

## 📋 RESUMO DE ESFORÇO TOTAL

| Prioridade | Item | Estimativa (horas) |
|------------|------|-------------------|
| 🔴 P1 | Guard 22h + Auditoria | 16-24 |
| 🔴 P1 | Contadores + Enforcement | 12-16 |
| 🔴 P1 | Dashboard de Uso | 8-12 |
| 🟠 P2 | Confirmação WhatsApp | 20-24 |
| 🟠 P2 | Pagamento Pré-Booking | 24-32 |
| 🟡 P3 | Histórico Pagamentos | 8 |
| 🟡 P3 | Reativação Clientes | 12 |
| 🟡 P3 | Reviews Google | 8 |
| 🔵 P4 | Lista de Espera | 16 |
| 🔵 P4 | Multi-Idioma | 24-32 |
| 🔵 P4 | Relatórios | 20 |

**Total Crítico (P1):** 36-52 horas (1-1.5 semanas)  
**Total Core (P1+P2):** 96-124 horas (2.5-3 semanas)  
**Total Completo (P1+P2+P3):** 124-152 horas (3-4 semanas)

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### Semana 1: Compliance e Segurança
- [ ] Implementar Guard de 22h
- [ ] Criar SessionIndex, MessageLog, AttemptLog
- [ ] Atualizar sendWhats() com guard
- [ ] Atualizar webhook WhatsApp com updateSessionInbound
- [ ] Testes manuais de bloqueio

### Semana 2: Enforcement e Contadores
- [ ] Criar MonthlyUsage collection
- [ ] Implementar incrementAppointmentCounter
- [ ] Implementar incrementMessageCounter
- [ ] Integrar em /api/appointment e sendWhats
- [ ] Criar dashboard de uso
- [ ] Testes de limites (Free vs Starter vs Pro)

### Semana 3: Confirmação WhatsApp
- [ ] Adicionar campos status/token/expiresAt em Appointment
- [ ] Modificar /api/appointment para retornar link WhatsApp
- [ ] Implementar processamento de confirmação no webhook
- [ ] Adicionar revalidação de conflitos
- [ ] Testes end-to-end do fluxo

### Semana 4: Pagamento Pré-Booking
- [ ] Estender LinkedCalendar com paymentAtBookingEnabled
- [ ] Criar endpoint /api/appointment/checkout
- [ ] Implementar webhook de pagamento
- [ ] Integrar com formulário público
- [ ] Testes com cartão de teste Stripe

### Semana 5: Refinamentos
- [ ] Histórico de pagamentos
- [ ] Reativação de clientes
- [ ] Reviews Google
- [ ] Testes de integração
- [ ] Documentação atualizada

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### Variáveis de Ambiente (.env.local):

```bash
# WhatsApp Cloud API
WA_META_TOKEN=EAA...
WA_PHONE_NUMBER_ID=123...
WA_WABA_ID=456...
WA_VERIFY_TOKEN=seu_token_secreto
WA_GRAPH_BASE=https://graph.facebook.com/v20.0
META_APP_SECRET=abc123... # Para validação de assinatura

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook do SaaS
STRIPE_WEBHOOK_SECRET_APPOINTMENTS=whsec_... # Webhook pré-pagamento

# Firebase
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# App
APP_BASE_URL=https://zapagenda.com
NEXT_PUBLIC_APP_BASE_URL=https://zapagenda.com
DEFAULT_CALENDAR_TIMEZONE=America/Sao_Paulo
DASHBOARD_TOKEN=token_seguro_para_cron
```

---

## 📝 ÍNDICES FIRESTORE NECESSÁRIOS

```json
// firebase/firestore.indexes.json - ADICIONAR

{
  "indexes": [
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "ownerUid", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "startISO", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "token", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "messageLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "sessionIndex",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "lastInboundAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de considerar "tudo redondinho", validar:

### Compliance:
- [ ] Nenhuma mensagem WhatsApp enviada sem inbound < 22h
- [ ] Todas as mensagens logadas em MessageLog
- [ ] Tentativas bloqueadas registradas em AttemptLog
- [ ] Consentimento de lembretes armazenado

### Funcionalidades:
- [ ] Agendamento cria status PENDING com token
- [ ] Cliente recebe link WhatsApp correto
- [ ] Confirmação via WhatsApp transiciona para CONFIRMED
- [ ] Evento criado no Google Calendar
- [ ] Lembretes respeitam guard de 22h
- [ ] Limites de plano enforçados (appointments/mensagens)
- [ ] Overage calculado corretamente (Starter/Pro)
- [ ] Dashboard mostra uso em tempo real
- [ ] Pagamento pré-booking confirma automaticamente
- [ ] Webhook Stripe processa corretamente

### UX:
- [ ] Mensagens de erro claras
- [ ] Loading states em todos os botões
- [ ] Mobile responsivo
- [ ] Acessibilidade básica (ARIA labels)

### Performance:
- [ ] Build sem warnings
- [ ] Lighthouse score > 90
- [ ] Tempo de resposta API < 2s

---

## 🚀 CONCLUSÃO

Para deixar o ZapAgenda **"tudo redondinho"**, o foco deve ser:

1. **Semana 1-2:** Compliance (guard 22h + contadores) - **CRÍTICO**
2. **Semana 3:** Confirmação WhatsApp completa - **CORE**
3. **Semana 4:** Pagamento pré-booking - **DIFERENCIAL**
4. **Semana 5+:** Melhorias UX e features avançadas

Com isso, o sistema estará:
- ✅ Compliant com WhatsApp Cloud API
- ✅ LGPD-ready
- ✅ Monetizável (SaaS + marketplace)
- ✅ Escalável
- ✅ Pronto para crescimento

**Próximo passo:** Priorizar Semana 1 e começar pela implementação do Guard de 22h.
