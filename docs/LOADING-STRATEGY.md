# 🔄 Estratégia de Loading - DaTempo

## 📋 Análise Atual

### ✅ O que JÁ EXISTE:

1. **Skeletons no Dashboard** (`LoadingSkeleton.tsx`)
   - MetricCardSkeleton
   - AppointmentListSkeleton
   - SetupProgressSkeleton

2. **Loading em Componentes Específicos:**
   - LogoutButton: `{loading ? "Saindo..." : "Sair"}`
   - ReminderSettings: `{loading ? "Salvando..." : "Salvar"}`
   - AppointmentForm: `loadingSlots` state
   - LoginForm: `authenticating` overlay completo
   - CalendarsCard: estado `loading`

3. **Feedback de Ações:**
   - Botões com estados disabled
   - Mensagens temporárias ("Conectando...", "Agendando...")

### ❌ O que FALTA:

1. **Loading Global de Páginas**
   - Não há `loading.tsx` nas rotas
   - Transições entre páginas sem feedback

2. **Suspense Boundaries**
   - Componentes assíncronos sem fallback
   - Server Components sem loading state

3. **Loading Unificado**
   - Cada componente tem seu próprio estilo
   - Falta consistência visual
   - Sem identidade DaTempo

4. **Estados Vazios**
   - Empty states genéricos
   - Sem personalidade

---

## 🎯 Estratégia Recomendada

### **Abordagem Híbrida (Melhor opção)**

#### 1. **Loading Global de Páginas** (Next.js 13+)
✅ **Usar `loading.tsx` em cada rota principal**

**Vantagens:**
- Automático para toda rota
- Integra com Suspense
- Melhora UX em navegação
- Menos código

**Onde usar:**
```
src/app/
  ├── loading.tsx           ← Home
  ├── dashboard/
  │   ├── loading.tsx       ← Dashboard geral
  │   ├── minha-agenda/
  │   │   └── loading.tsx   ← Calendários
  │   └── plans/
  │       └── loading.tsx   ← Planos
  ├── login/
  │   └── loading.tsx       ← Login
  └── agenda/[slug]/
      └── loading.tsx       ← Página pública
```

#### 2. **Loading em Componentes Dinâmicos**
✅ **Skeletons customizados para dados que carregam depois**

**Vantagens:**
- Controle fino
- Melhor para fetches client-side
- Boa para listas/cards

**Onde usar:**
- AppointmentList (lista de agendamentos)
- CalendarsCard (lista de calendários)
- Stats/Metrics (métricas do dashboard)
- Availability slots (horários disponíveis)

#### 3. **Loading em Ações** (já existe, melhorar)
✅ **Feedback inline em botões e forms**

**Onde usar:**
- Botões de submit
- Ações críticas (save, delete, etc)
- Login/OAuth flows

---

## 🎨 Design System de Loading - DaTempo

### 1. **Loading Global de Página**

**Conceito:** *"Preparando sua escrivaninha..."*

```tsx
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Relógio vintage animado */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Círculo externo */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#D4C4A8" 
              strokeWidth="2"
            />
            {/* Ponteiro das horas (fixo) */}
            <line 
              x1="50" 
              y1="50" 
              x2="50" 
              y2="30" 
              stroke="#8B6F47" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            {/* Ponteiro dos minutos (rotação) */}
            <line 
              x1="50" 
              y1="50" 
              x2="50" 
              y2="20" 
              stroke="#B8956A" 
              strokeWidth="2" 
              strokeLinecap="round"
              className="origin-center animate-spin"
              style={{ animationDuration: '2s' }}
            />
            {/* Centro */}
            <circle cx="50" cy="50" r="4" fill="#8B6F47"/>
          </svg>
        </div>
        
        {/* Texto acolhedor */}
        <div>
          <p className="font-['Crimson_Pro'] text-xl font-semibold text-[#8B6F47]">
            Só um instantinho...
          </p>
          <p className="text-sm text-[#9C8D7E] mt-2 font-['Inter']">
            Preparando tudo com carinho
          </p>
        </div>
        
        {/* Pontinhos animados (estilo retrô) */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#B8956A]"
              style={{
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2. **Skeleton Components - DaTempo Style**

**Conceito:** *Textura de papel com suave pulsação*

```tsx
// src/components/loading/Skeleton.tsx
export function Skeleton({ className = "", variant = "default" }: { 
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
}) {
  const baseClasses = "animate-pulse bg-[#EDE5D8] rounded";
  
  const variantClasses = {
    default: "h-4 w-full",
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="flex items-start gap-4 p-4 rounded-lg border border-[#EDE5D8] bg-[#FDFBF7]"
        >
          <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 3. **Loading em Botões**

**Conceito:** *Spinner vintage com feedback claro*

```tsx
// src/components/loading/ButtonSpinner.tsx
export function ButtonSpinner({ size = "sm" }: { size?: "xs" | "sm" | "md" }) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };
  
  return (
    <svg 
      className={`${sizeClasses[size]} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="3"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Uso em botão
export function Button({ children, loading, ...props }: ButtonProps) {
  return (
    <button
      disabled={loading}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-[#8B6F47] to-[#B8956A] text-[#FDFBF7] font-medium disabled:opacity-60"
      {...props}
    >
      {loading && <ButtonSpinner />}
      {loading ? "Carregando..." : children}
    </button>
  );
}
```

### 4. **Empty States - DaTempo**

**Conceito:** *Acolhedor e gentil, sem pressa*

```tsx
// src/components/EmptyState.tsx
export function EmptyState({
  icon = "☕",
  title = "Nada por aqui ainda",
  description = "Tudo tranquilo. Quando quiser, é só começar.",
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="font-['Crimson_Pro'] text-2xl font-semibold text-[#8B6F47] mb-2">
        {title}
      </h3>
      <p className="text-[#9C8D7E] mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

// Exemplos específicos
export function NoAppointments() {
  return (
    <EmptyState
      icon="📅"
      title="Nenhum agendamento ainda"
      description="Assim que alguém marcar horário com você, vai aparecer aqui. Por enquanto, tudo livre!"
      action={
        <a 
          href="/dashboard/minha-agenda" 
          className="text-[#8B6F47] hover:text-[#B8956A] font-medium"
        >
          Configurar minha agenda →
        </a>
      }
    />
  );
}

export function NoCalendars() {
  return (
    <EmptyState
      icon="🗓️"
      title="Nenhum calendário conectado"
      description="Conecte seu Google Calendar para começar a receber agendamentos."
      action={
        <button className="px-6 py-3 rounded-lg bg-gradient-to-br from-[#8B6F47] to-[#B8956A] text-white font-medium">
          Conectar Google Calendar
        </button>
      }
    />
  );
}
```

---

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── loading/
│       ├── PageLoader.tsx          ← Loading global
│       ├── Skeleton.tsx            ← Componentes skeleton
│       ├── ButtonSpinner.tsx       ← Spinner para botões
│       ├── EmptyState.tsx          ← Estados vazios
│       └── index.ts                ← Exports
├── app/
│   ├── loading.tsx                 ← Root loading
│   ├── dashboard/
│   │   ├── loading.tsx             ← Dashboard loading
│   │   ├── minha-agenda/
│   │   │   └── loading.tsx
│   │   └── plans/
│   │       └── loading.tsx
│   ├── login/
│   │   └── loading.tsx
│   └── agenda/[slug]/
│       └── loading.tsx
└── lib/
    └── loading-utils.ts            ← Helpers
```

---

## 🚀 Implementação por Prioridade

### 🔴 **Fase 1: Crítico (fazer agora)**

1. **Loading Global de Páginas**
   - [ ] Criar `src/components/loading/PageLoader.tsx`
   - [ ] Adicionar `loading.tsx` nas rotas principais
   - [ ] Estilo DaTempo (relógio vintage)

2. **Componentes Skeleton Básicos**
   - [ ] Criar `Skeleton.tsx` base
   - [ ] `CardSkeleton` e `ListSkeleton`
   - [ ] Aplicar em CalendarsCard e AppointmentList

### 🟡 **Fase 2: Importante (próximos dias)**

3. **Loading em Botões**
   - [ ] Criar `ButtonSpinner.tsx`
   - [ ] Padronizar todos os botões com loading
   - [ ] Textos: "Salvando...", "Carregando...", etc

4. **Empty States Personalizados**
   - [ ] Criar componente `EmptyState`
   - [ ] NoAppointments
   - [ ] NoCalendars
   - [ ] 404 acolhedor

### 🟢 **Fase 3: Refinamento (quando possível)**

5. **Animações Suaves**
   - [ ] Fade in/out em transições
   - [ ] Skeleton pulse mais lento (relaxado)
   - [ ] Micro-interactions

6. **Loading Específicos**
   - [ ] Loading de upload de imagem
   - [ ] Progress bar para processos longos
   - [ ] Toast notifications

---

## 💡 Dicas de Implementação

### **Next.js App Router - loading.tsx**

```tsx
// app/dashboard/loading.tsx
import { PageLoader } from '@/components/loading/PageLoader';

export default function Loading() {
  return <PageLoader message="Preparando sua escrivaninha..." />;
}
```

### **Suspense Boundary Manual**

```tsx
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/loading/Skeleton';

export default function Page() {
  return (
    <div>
      <h1>Minha Página</h1>
      
      <Suspense fallback={<CardSkeleton />}>
        <AsyncComponent />
      </Suspense>
    </div>
  );
}
```

### **Loading Client-Side**

```tsx
'use client';

import { useState } from 'react';
import { ButtonSpinner } from '@/components/loading/ButtonSpinner';

export function MyForm() {
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit() {
    setLoading(true);
    // ... fetch
    setLoading(false);
  }
  
  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading && <ButtonSpinner />}
      {loading ? "Salvando..." : "Salvar"}
    </button>
  );
}
```

---

## ✅ Checklist de Loading Completo

### Páginas:
- [ ] Homepage (`/`)
- [ ] Login (`/login`)
- [ ] Dashboard (`/dashboard`)
- [ ] Minha Agenda (`/dashboard/minha-agenda`)
- [ ] Planos (`/dashboard/plans`)
- [ ] Página pública (`/agenda/[slug]`)

### Componentes:
- [ ] AppointmentList (lista de agendamentos)
- [ ] CalendarsCard (lista de calendários)
- [ ] AppointmentForm (form de agendamento)
- [ ] ReminderSettings (configurações)
- [ ] Stats/Metrics (métricas)

### Ações:
- [ ] Login com Google
- [ ] Logout
- [ ] Salvar configurações
- [ ] Criar agendamento
- [ ] Conectar calendário
- [ ] Escolher plano

### Empty States:
- [ ] Sem agendamentos
- [ ] Sem calendários
- [ ] Sem resultados
- [ ] 404 Not Found
- [ ] Erro genérico

---

## 🎨 Animações CSS Extras

```css
/* globals.css - Adicionar */

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Pulse mais lento e suave */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 🎯 Recomendação Final

**Use a abordagem híbrida:**

1. ✅ **`loading.tsx`** para páginas inteiras (automático, limpo)
2. ✅ **Skeletons** para componentes com dados dinâmicos
3. ✅ **Spinners inline** para ações/botões
4. ✅ **Empty states** personalizados com tom DaTempo

**Benefícios:**
- UX consistente e profissional
- Menos código repetido
- Manutenção mais fácil
- Identidade visual forte
- Performance otimizada

---

Quer que eu comece implementando? Posso criar:
1. O `PageLoader` global
2. Os componentes `Skeleton`
3. Atualizar os `loading.tsx` nas rotas
4. Criar os empty states

O que prefere começar primeiro? 😊🕰️
