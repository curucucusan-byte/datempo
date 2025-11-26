# 🕰️ DaTempo - Estado Atual do Projeto

> Documentação fidedigna do que está funcionando HOJE
> Última atualização: 26/11/2025 05:43 AM

---

## 📊 Resumo Executivo

**Nome do Projeto:** DaTempo (rebranding de ZapAgenda)  
**Status Geral:** 73% Funcional  
**Pronto para Produção:** ⚠️ Parcial (MVP viável com limitações)  
**Stack:** Next.js 15.5.4 + TypeScript + Tailwind + Firebase + Google OAuth

---

## ✅ Features 100% Funcionais

### 1. 🔐 Autenticação Google OAuth
- **Status:** 🟢 PRONTA
- **Arquivos:** `src/lib/google.ts`, `src/app/api/google/oauth/`
- **Funcionalidades:**
  - Login via Google ✓
  - Refresh token automático ✓
  - Armazenamento seguro Firestore ✓
  - Escopos: Calendar (read/write) + Email ✓
  - Tratamento de erros robusto ✓

**Teste:** Funciona em dev e produção

---

### 2. 📅 Integração Google Calendar
- **Status:** 🟢 PRONTA
- **Arquivo:** `src/lib/google.ts`
- **Funcionalidades:**
  - Listar calendários do usuário ✓
  - Criar eventos automaticamente ✓
  - Consultar disponibilidade (FreeBusy) ✓
  - Prevenção de conflitos ✓
  - Sincronização bidirecional ✓
  - Timezone dinâmico ✓

**Função Principal:** `createGoogleCalendarEvent()` - 100% implementada

---

### 3. 🗓️ Sistema de Agendamentos Core
- **Status:** 🟢 PRONTO
- **Arquivo:** `src/app/api/appointment/route.ts` (400+ linhas)
- **Funcionalidades:**
  - Cliente agenda via link público ✓
  - Validação de conflitos (local + Google) ✓
  - Rate limiting (8 req/min por IP) ✓
  - Timezone dinâmico ✓
  - Duração personalizável (5-480 min) ✓
  - Normalização telefone BR (+55) ✓
  - Persistência Firestore + fallback JSON ✓
  - Criação automática de evento no Google Calendar ✓

**Teste:** Fluxo completo funcional

---

### 4. 💬 Notificações WhatsApp
- **Status:** 🟢 PRONTO
- **Arquivo:** `src/lib/whats.ts`
- **Modos:**
  - API (mensagem iniciada pela empresa) ✓
  - Link "Click-to-Chat" (cliente inicia - sem custo) ✓
- **Mensagens:**
  - Confirmação para cliente ✓
  - Notificação para proprietário ✓
  - Lembretes programados (cron) ✓

**Variável de controle:** `WA_FIRST_MESSAGE_MODE=api|link`

---

### 5. 💼 Sistema de Planos
- **Status:** 🟢 PRONTO
- **Arquivo:** `src/lib/plans.ts`
- **Planos Ativos:**
  - **Free:** 1 agenda, 100 reservas/mês
  - **Starter:** 3 agendas, 500 reservas/mês, lembretes
  - **Pro:** 10 agendas, 2000 reservas/mês, pagamentos + reviews

**Features:**
- Limites rastreados ✓
- Trial 14 dias ✓
- Status: active, trial, canceled, inactive ✓
- Verificação em cada agendamento ✓

---

### 6. 🎨 Páginas com Design Consistente

#### Homepage (`src/app/page.tsx`)
- **Status:** 🟢 PRONTO
- **Design:** Verde (#10b981) + Madeira (#8B6F47) ✓
- **Seções:** Hero, Recursos, Planos, FAQ, CTA ✓
- **Responsivo:** Mobile + Desktop ✓

#### Login (`src/app/login/page.tsx`)
- **Status:** 🟢 PRONTO
- **Design:** Madeira/Vintage completo ✓
- **Relógio decorativo ✓
- **Mensagens dinâmicas ✓

#### Agenda Pública (`src/app/agenda/[slug]/page.tsx`)
- **Status:** 🟢 PRONTO
- **Formulário de agendamento ✓
- **Preview de disponibilidade ✓

#### Dashboard (`src/app/dashboard/page.tsx`)
- **Status:** 🟢 PRONTO (nova estrutura 3 seções)
- **Navegação:** Visão Geral, Agendamentos, Configurações ✓
- **Design:** ⚠️ Azul predominante (inconsistente)

---

### 7. 🔗 Componente ShareableLink
- **Status:** 🟢 PRONTO
- **Arquivo:** `src/components/ShareableLink.tsx`
- **Funcionalidades:**
  - Copiar link ✓
  - QR Code gerado ✓
  - Compartilhar nativo (mobile) ✓
  - Preview/abrir ✓
  - Download QR Code ✓

---

### 8. 📍 API de Disponibilidade
- **Status:** 🟢 PRONTA
- **Arquivo:** `src/app/api/availability/route.ts`
- **Funcionalidades:**
  - Consulta disponibilidade por data ✓
  - Respeita workHours da agenda ✓
  - Integra com Google FreeBusy ✓
  - Previne conflitos ✓
  - Timezone dinâmico ✓

**Endpoint:** `GET /api/availability?slug={slug}&date=YYYY-MM-DD&h={token}`

---

### 9. 💾 Sistema de Storage Dual
- **Status:** 🟢 PRONTO
- **Arquivo:** `src/lib/store.ts`
- **Estratégia:**
  ```typescript
  if (FIRESTORE_ENABLED) {
    // Firestore (produção)
  } else {
    // JSON file (dev local)
  }
  ```

**Vantagem:** Desenvolvimento local sem Firebase ✓

---

## 🟡 Features Parciais (Iniciadas, Não Completas)

### 1. 💰 Pagamentos Pré-agendamento
- **Status:** 🟡 60% implementado
- **O que funciona:**
  - Estrutura de dados completa ✓
  - Modo "manual" (PIX com instruções) ✓
  - Campos em `Appointment` type ✓
  - Validação de plano ativo ✓
- **O que falta:**
  - ❌ Integração Stripe (rota retorna 501)
  - ❌ Validação pagamento antes de confirmar
  - ❌ Webhooks Stripe funcionais
  - ❌ UI para configurar valores

**Localização:** `src/app/api/appointment/route.ts` linha 156

---

### 2. 🔗 Links Inteligentes
- **Status:** 🟡 30% implementado
- **O que funciona:**
  - UI completa (botões, modal) ✓
  - Estrutura query params ✓
- **O que falta:**
  - ❌ Backend não processa filtros (`?view=week&shift=morning`)
  - ❌ Página agenda ignora query params
  - ❌ Lógica disponibilidade filtrada

**Documentação:** `docs/SISTEMA-LINKS-INTELIGENTES.md` (completo)

---

### 3. 🌟 Reviews Google
- **Status:** 🟡 20% implementado
- **O que existe:**
  - Mencionado nos planos (Pro) ✓
- **O que falta:**
  - ❌ Código backend inexistente
  - ❌ Integração Google My Business API
  - ❌ UI para solicitar reviews

---

### 4. ⏰ Lembretes Automáticos
- **Status:** 🟡 70% implementado
- **O que funciona:**
  - Script cron (`scripts/trigger-reminder.mjs`) ✓
  - Função `markReminderSent()` ✓
  - Campo `reminderSentAt` ✓
  - Envio WhatsApp ✓
- **O que falta:**
  - ❌ Configuração por agenda (tempo antes)
  - ❌ Interface dashboard para habilitar/desabilitar
  - ❌ Testes automatizados

---

### 5. 💳 Stripe Subscriptions
- **Status:** 🟡 40% implementado
- **Arquivos:** `src/lib/stripe.ts`, `/api/payments/`
- **O que existe:**
  - Cliente Stripe configurado ✓
  - Estrutura de webhooks ✓
  - Tipos TypeScript ✓
- **O que falta:**
  - ❌ Fluxo completo checkout
  - ❌ Webhooks testados
  - ❌ Upgrade/downgrade planos
  - ❌ Gestão de assinaturas no dashboard

---

## 🔴 Features Apenas Documentadas (Código Ausente)

### 1. 📚 Multi-Calendários UI
- **Status:** 🔴 20% implementado
- **O que existe:** Campo `linkedCalendars[]` no account
- **O que falta:** Interface para conectar/gerenciar múltiplas agendas

### 2. 🎯 Analytics/Métricas
- **Status:** 🔴 0%
- **Não existe:** Dashboard de métricas, conversão, etc.

---

## 🏗️ Arquitetura Técnica

### Banco de Dados: Firestore

```
/appointments/{id}
  ├─ id: string
  ├─ slug: string
  ├─ customerName: string
  ├─ customerPhone: string
  ├─ startISO: string
  ├─ endISO: string
  ├─ ownerUid: string
  ├─ paymentStatus: "not_required" | "pending" | "paid"
  └─ reminderSentAt: string | null

/googleTokens/{uid}
  ├─ access_token: string
  ├─ refresh_token: string
  ├─ expiry_date: number
  └─ updatedAt: string

/linkedCalendars/{slug}
  ├─ id: string (Google Calendar ID)
  ├─ summary: string
  ├─ ownerUid: string
  ├─ slug: string
  ├─ description: string
  ├─ whatsappNumber: string
  ├─ active: boolean
  ├─ slotDurationMinutes: number
  ├─ workHours: Record<string, string[]>
  ├─ requiresPrepayment: boolean
  ├─ prepaymentMode: "manual" | "stripe"
  └─ publicToken: string | null

/accounts/{uid}
  ├─ uid: string
  ├─ email: string
  ├─ plan: "free" | "starter" | "pro"
  ├─ status: "active" | "trial" | "canceled"
  ├─ trialEndsAt: string
  └─ linkedCalendars: LinkedCalendar[]
```

---

### APIs Organizadas

```
/api/
├── google/
│   ├── oauth/start/           ✅ Iniciar OAuth
│   ├── oauth/callback/        ✅ Callback OAuth
│   └── calendars/             ✅ Listar calendários
│
├── appointment/               ✅ Criar agendamento (POST)
├── appointments/              ⚠️ Listar agendamentos (precisa verificar)
├── availability/              ✅ Consultar disponibilidade
│
├── payments/                  🟡 Stripe (parcial)
├── webhooks/                  🟡 Stripe webhooks (parcial)
│
├── session/                   ✅ Gestão de sessão
├── account/                   ✅ Gestão de conta
│
├── cron/                      ✅ Lembretes automáticos
├── ics/                       ✅ Exportar .ics
├── lead/                      ❓ (precisa investigar)
└── logo/                      ❓ (precisa investigar)
```

---

## 🚨 Problemas de Consistência Identificados

### 1. Nome do Projeto
```json
// package.json
"name": "agende-mais"  ❌

// Código e docs
"DaTempo"  ✅
```

**Ação:** Atualizar package.json

---

### 2. Paleta de Cores Inconsistente

| Página | Cor Primária | Status |
|--------|--------------|--------|
| Homepage | Verde + Madeira | ✅ Consistente |
| Login | Madeira | ✅ Consistente |
| Dashboard | Azul (#2563eb) | ❌ Inconsistente |
| Agenda/[slug] | Cinza/Slate | ⚠️ Neutro (ok) |

**Ação:** Padronizar Dashboard para verde+madeira

---

### 3. Documentação vs Realidade

| Feature | Docs dizem | Código tem | Status |
|---------|-----------|------------|--------|
| Links Inteligentes | Completo | Só UI | 🟡 30% |
| Reviews Google | Disponível | Inexistente | 🔴 0% |
| Pagamentos | Funcional | Stripe não funciona | 🟡 60% |
| Multi-calendários | Pronto | Sem UI | 🟡 20% |

**Ação:** Criar documentação fidedigna (este arquivo)

---

## 📊 Completude Geral

```
┌─────────────────────────────────────┐
│ Feature              Status    %    │
├─────────────────────────────────────┤
│ Auth Google          ✅       100%  │
│ Google Calendar      ✅       100%  │
│ Agendamentos Core    ✅       100%  │
│ WhatsApp             ✅       100%  │
│ Sistema Planos       ✅       100%  │
│ Disponibilidade API  ✅       100%  │
│ Storage Dual         ✅       100%  │
│ Homepage             ✅       100%  │
│ Login                ✅       100%  │
│ Dashboard            ✅        95%  │
│ ShareableLink        ✅       100%  │
│ Lembretes            🟡        70%  │
│ Pagamentos           🟡        60%  │
│ Links Inteligentes   🟡        30%  │
│ Stripe Subscriptions 🟡        40%  │
│ Reviews Google       🔴         5%  │
│ Multi-Calendars UI   🔴        20%  │
│ Analytics            🔴         0%  │
├─────────────────────────────────────┤
│ GERAL                         73%   │
└─────────────────────────────────────┘
```

---

## 🎯 MVP Mínimo Viável - Checklist

### Para Lançar em Produção (Beta Fechado)

**Essenciais (DEVE ter):**
- [x] Autenticação Google
- [x] Criar agendamento
- [x] Sincronizar Google Calendar
- [x] Notificar WhatsApp
- [x] Prevenir conflitos
- [x] Link compartilhável
- [ ] Dashboard consistente (visual)
- [ ] Página de erro 404/500
- [ ] Rate limiting global
- [ ] Logs de erro estruturados

**Importantes (DEVERIA ter):**
- [x] Lembretes automáticos (70% pronto)
- [ ] Multi-calendários (UI)
- [ ] Configuração de workHours no dashboard
- [ ] Testes E2E básicos

**Desejáveis (PODE ter depois):**
- [ ] Links inteligentes (filtros)
- [ ] Pagamentos Stripe
- [ ] Reviews Google
- [ ] Analytics

---

## 📁 Estrutura de Arquivos Principal

```
zapagenda/
├── .clinerules                 ✅ Regras de desenvolvimento
├── package.json                ⚠️ Nome "agende-mais" (corrigir)
│
├── docs/
│   ├── 1-ESTADO-ATUAL/         ✅ Este arquivo
│   ├── 2-ROADMAP/              ⏳ A criar
│   └── 3-REFERENCIA/           ⏳ Reorganizar docs antigas
│
├── src/app/
│   ├── page.tsx                ✅ Homepage (verde+madeira)
│   ├── login/                  ✅ Login (madeira)
│   ├── dashboard/              🟡 Dashboard (azul - corrigir)
│   ├── agenda/[slug]/          ✅ Agenda pública
│   └── api/                    ✅ API Routes
│
├── src/components/
│   ├── Header.tsx              ✅ Header
│   ├── ShareableLink.tsx       ✅ Compartilhamento
│   └── loading/                ✅ Loading states
│
├── src/lib/
│   ├── google.ts               ✅ OAuth + Calendar
│   ├── store.ts                ✅ Storage dual
│   ├── plans.ts                ✅ Sistema planos
│   ├── whats.ts                ✅ WhatsApp
│   ├── stripe.ts               🟡 Stripe (parcial)
│   └── session.ts              ✅ Sessões
│
└── prompts/                    ⏳ A criar
```

---

## 🔧 Variáveis de Ambiente Necessárias

### Essenciais (Produção)
```bash
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APP_BASE_URL=

# Firebase Admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Timezone
DEFAULT_CALENDAR_TIMEZONE=America/Sao_Paulo
```

### Opcionais
```bash
# WhatsApp
WHATSAPP_API_KEY=
WA_FIRST_MESSAGE_MODE=link|api
OWNER_DEFAULT_PHONE=+55...

# Stripe (não funcional ainda)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage
APPOINTMENTS_FILE=data/appointments.json
```

---

## 🧪 Como Testar Localmente

```bash
# 1. Instalar dependências
yarn install

# 2. Configurar .env.local (copiar de .env.example)
cp .env.example .env.local
# Editar .env.local com suas credenciais

# 3. Iniciar dev server
yarn dev

# 4. Testar fluxo completo:
# - Acessar http://localhost:3000
# - Login com Google
# - Conectar calendário
# - Criar agenda
# - Compartilhar link
# - Testar agendamento (em aba anônima)
```

---

## 📞 Próximos Passos

Consulte: `docs/2-ROADMAP/MVP-PRODUCAO.md`

---

*DaTempo - Onde tudo dá tempo 🕰️*  
*Estado atual documentado em 26/11/2025*
