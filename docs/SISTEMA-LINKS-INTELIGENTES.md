# 🔗 Sistema de Links Inteligentes — DaTempo

> *"Links personalizados para facilitar o agendamento"*

---

## 📋 Especificação de Links

### 1. **Link Base (Padrão)**
```
https://datempo.com/agenda/seu-slug
```
Mostra: Calendário normal, todos os horários disponíveis

---

### 2. **Links com Filtros (Query Params)**

#### 📅 **Filtro de Período**
```
?view=week       → Mostra apenas próximos 7 dias
?view=month      → Mostra apenas próximo mês
?view=today      → Mostra apenas hoje
?view=tomorrow   → Mostra apenas amanhã
```

**Exemplos:**
```
/agenda/dr-silva?view=week
/agenda/dr-silva?view=month
/agenda/dr-silva?view=today
```

---

#### 🕐 **Filtro de Horário Específico**
```
?h=10:00         → Pre-seleciona horário 10:00
?date=2025-10-15 → Pre-seleciona data específica
```

**Exemplos:**
```
/agenda/dr-silva?date=2025-10-15&h=10:00
/agenda/dr-silva?view=tomorrow&h=14:00
```

---

#### ⏰ **Filtro de Turno**
```
?shift=morning   → Apenas manhã (08:00-12:00)
?shift=afternoon → Apenas tarde (12:00-18:00)
?shift=evening   → Apenas noite (18:00-21:00)
```

**Exemplos:**
```
/agenda/dr-silva?view=week&shift=morning
/agenda/nutricionista?shift=afternoon
```

---

#### 🎯 **Filtros Combinados**
```
?view=week&shift=morning          → Manhãs desta semana
?view=month&shift=afternoon       → Tardes deste mês
?date=2025-10-20&shift=evening    → Noites de um dia específico
```

---

## 🎨 Interface no Dashboard

### **Card "Links Rápidos"** (Nova seção)

```tsx
┌──────────────────────────────────────────────────────┐
│  🔗 Links Rápidos para Compartilhar                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  📋 Link Principal                                    │
│  ┌─────────────────────────────────────────────┐    │
│  │ https://datempo.com/agenda/dr-silva    [📋] │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  ⚡ Links Pré-Configurados                           │
│                                                       │
│  📅 Esta Semana                              [📋]    │
│  📅 Este Mês                                 [📋]    │
│  🌅 Apenas Manhãs (desta semana)            [📋]    │
│  🌆 Apenas Tardes (desta semana)            [📋]    │
│  🌙 Apenas Noites (desta semana)            [📋]    │
│                                                       │
│  🎯 Criar Link Personalizado                         │
│  ┌─────────┬───────────┬──────────┐                │
│  │ Período │ Turno     │ Gerar    │                │
│  │ [Week]  │ [Morning] │ [Copiar] │                │
│  └─────────┴───────────┴──────────┘                │
│                                                       │
│  💡 Dica: Copie e envie direto pro WhatsApp!        │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Implementação Técnica

### **1. Atualizar `AppointmentForm.tsx`**

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function AppointmentForm({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  
  // Detectar filtros da URL
  const view = searchParams.get("view"); // "week" | "month" | "today" | "tomorrow"
  const shift = searchParams.get("shift"); // "morning" | "afternoon" | "evening"
  const presetDate = searchParams.get("date"); // "2025-10-15"
  const presetHour = searchParams.get("h"); // "10:00"
  
  // Calcular range de datas baseado no filtro
  const dateRange = useMemo(() => {
    const today = new Date();
    
    switch(view) {
      case "today":
        return { start: today, end: today };
      
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: tomorrow, end: tomorrow };
      
      case "week":
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return { start: today, end: weekEnd };
      
      case "month":
        const monthEnd = new Date(today);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        return { start: today, end: monthEnd };
      
      default:
        return null; // Sem filtro
    }
  }, [view]);
  
  // Filtrar horários por turno
  const filterByShift = (hour: string) => {
    if (!shift) return true;
    
    const h = parseInt(hour.split(":")[0]);
    
    switch(shift) {
      case "morning":
        return h >= 8 && h < 12;
      case "afternoon":
        return h >= 12 && h < 18;
      case "evening":
        return h >= 18 && h <= 21;
      default:
        return true;
    }
  };
  
  // Aplicar filtros aos slots disponíveis
  const filteredSlots = useMemo(() => {
    return availableSlots.filter(filterByShift);
  }, [availableSlots, shift]);
  
  // Pre-selecionar data se veio na URL
  useEffect(() => {
    if (presetDate) {
      setSelectedDate(presetDate);
    }
  }, [presetDate]);
  
  // Pre-selecionar horário se veio na URL
  useEffect(() => {
    if (presetHour && availableSlots.includes(presetHour)) {
      setSelectedSlot(presetHour);
    }
  }, [presetHour, availableSlots]);
  
  // ... resto do componente
}
```

---

### **2. Criar Componente `QuickLinks.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface QuickLinksProps {
  slug: string;
  baseUrl: string; // Ex: "https://datempo.com"
}

export default function QuickLinks({ slug, baseUrl }: QuickLinksProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  const baseLink = `${baseUrl}/agenda/${slug}`;
  
  const quickLinks = [
    { label: "📅 Esta Semana", url: `${baseLink}?view=week` },
    { label: "📅 Este Mês", url: `${baseLink}?view=month` },
    { label: "🌅 Manhãs (semana)", url: `${baseLink}?view=week&shift=morning` },
    { label: "🌆 Tardes (semana)", url: `${baseLink}?view=week&shift=afternoon` },
    { label: "🌙 Noites (semana)", url: `${baseLink}?view=week&shift=evening` },
    { label: "📍 Hoje", url: `${baseLink}?view=today` },
    { label: "📍 Amanhã", url: `${baseLink}?view=tomorrow` },
  ];
  
  const copyToClipboard = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      alert("Erro ao copiar link");
    }
  };
  
  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
        🔗 Links Rápidos para Compartilhar
      </h3>
      
      {/* Link Principal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          📋 Link Principal
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={baseLink}
            readOnly
            className="flex-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-2 text-sm font-mono text-slate-700"
          />
          <button
            onClick={() => copyToClipboard(baseLink, "principal")}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            {copied === "principal" ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Links Pré-Configurados */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          ⚡ Links Pré-Configurados
        </label>
        <div className="space-y-2">
          {quickLinks.map((link) => (
            <div key={link.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-700">
                {link.label}
              </span>
              <button
                onClick={() => copyToClipboard(link.url, link.label)}
                className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied === link.label ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dica */}
      <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
        <p className="text-sm text-emerald-800">
          💡 <strong>Dica:</strong> Copie o link e envie direto no WhatsApp para facilitar o agendamento do cliente!
        </p>
      </div>
    </div>
  );
}
```

---

### **3. Adicionar no Dashboard**

```tsx
// src/app/dashboard/minha-agenda/page.tsx

import QuickLinks from "./QuickLinks";

export default async function MinhaAgendaPage() {
  const linkedCalendars = await getLinkedCalendars(user.uid);
  
  return (
    <div>
      {/* ... outros componentes ... */}
      
      {linkedCalendars.map((calendar) => (
        <div key={calendar.id}>
          <CalendarCard calendar={calendar} />
          
          {/* NOVO: Links Rápidos */}
          <QuickLinks 
            slug={calendar.slug}
            baseUrl="https://datempo.com" // ou process.env.APP_BASE_URL
          />
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Casos de Uso

### **1. Profissional de Saúde**
```
"Mande esse link pro WhatsApp dos pacientes que querem consulta de manhã esta semana:"
→ /agenda/dr-silva?view=week&shift=morning
```

### **2. Salão de Beleza**
```
"Link para agendar ainda hoje:"
→ /agenda/salao-bela?view=today
```

### **3. Personal Trainer**
```
"Horários disponíveis para treino à tarde este mês:"
→ /agenda/personal-joao?view=month&shift=afternoon
```

### **4. Advogado**
```
"Agende uma reunião amanhã:"
→ /agenda/adv-maria?view=tomorrow
```

---

## 📱 Mensagem WhatsApp Template

```
Olá! 👋

Agende seu horário clicando no link abaixo:
https://datempo.com/agenda/dr-silva?view=week&shift=morning

📅 Mostra apenas: Manhãs desta semana
⏰ Rápido e fácil!

Qualquer dúvida, é só chamar.
```

---

## ✅ Checklist de Implementação

### Fase 1: Backend (Query Params)
- [ ] Atualizar `AppointmentForm.tsx` para ler `searchParams`
- [ ] Implementar filtro `view` (today, tomorrow, week, month)
- [ ] Implementar filtro `shift` (morning, afternoon, evening)
- [ ] Implementar pre-seleção de `date` e `h` (hora)

### Fase 2: UI (Dashboard)
- [ ] Criar componente `QuickLinks.tsx`
- [ ] Adicionar botões de cópia rápida
- [ ] Implementar feedback visual (ícone ✓ ao copiar)
- [ ] Adicionar no dashboard `/minha-agenda`

### Fase 3: UX
- [ ] Mostrar badge na página pública quando tem filtro ativo
- [ ] Ex: "🌅 Mostrando apenas manhãs desta semana"
- [ ] Adicionar dica de uso no dashboard

---

## 🎨 Identidade Visual

**Seguir design híbrido (verde + madeira):**

```tsx
// Botão copiar primário
className="bg-gradient-to-r from-emerald-600 to-emerald-500"

// Link cards
className="border-emerald-200 bg-emerald-50 hover:border-emerald-400"

// Badges de filtro ativo
className="bg-amber-50 border-amber-200 text-amber-800"
```

---

**Resultado:** Links super simples de criar e compartilhar! 🚀🔗

Quer que eu implemente isso agora?
