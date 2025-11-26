# 🎯 Decisões Técnicas - DaTempo MVP

> Decisões estratégicas para lançamento rápido e sustentável
> Data: 26/11/2025
> Modo: Co-Founder (1 dev + AI)

---

## 🧭 Filosofia das Decisões

**Princípios:**
- ✅ Simples > Complexo
- ✅ Barato > Caro (até validar)
- ✅ Rápido > Perfeito
- ✅ Funcional > Bonito (mas mantendo identidade)
- ✅ Reversível > Irreversível

**Objetivo:** MVP funcional em 7-14 dias

---

## 📱 WhatsApp - DECISÃO FINAL

### **Estratégia: Click-to-Chat (100% Gratuito)**

**O que é:**
```
Sistema gera link WhatsApp com mensagem pré-preenchida
Cliente clica → abre WhatsApp dele
Cliente envia (ele inicia = GRÁTIS)
```

**Implementação:**
```typescript
// Exemplo de link gerado
https://wa.me/5511999999999?text=Olá!%20Confirmei%20meu%20agendamento%20para%20dia%2025/11%20às%2014h

// Código já existe em src/lib/whats.ts
// Modo: WA_FIRST_MESSAGE_MODE=link
```

**Custos:**
```
WhatsApp Click-to-Chat: R$ 0
API Meta (futuro): ~R$ 0,20/msg
Twilio (alternativa): ~R$ 0,18/msg
```

**Quando migrar para API paga:**
- ✅ 50+ usuários pagos (R$ 2000+ MRR)
- ✅ Métricas provarem que lembretes aumentam retenção
- ✅ Budget permite (R$ 500+/mês para WhatsApp)

**Por plano:**
```
FREE:
- Confirmação: Click-to-Chat ✅
- Lembretes: não tem

STARTER (R$ 39/mês):
- Confirmação: Click-to-Chat ✅
- 1 Lembrete 24h antes: Click-to-Chat ✅

PRO (R$ 79/mês):
- Confirmação: Click-to-Chat ✅
- Lembretes ilimitados: Click-to-Chat ✅
- Futuro: API paga quando escalar
```

---

## 🏗️ Infraestrutura - DECISÃO FINAL

### **Vercel Free Plan (início)**

**Por quê:**
```
✅ Deploy automático (git push)
✅ HTTPS grátis
✅ Edge Functions (rápidas)
✅ 100GB bandwidth/mês grátis
✅ Unlimited deployments
✅ Analytics básico incluso
```

**Limites Free Plan:**
```
Bandwidth: 100GB/mês
Executions: 100k/mês (Edge Functions)
Build minutes: 6000/mês

Suficiente para:
~10.000 visitas/mês
~50 usuários ativos
```

**Quando migrar para Pro ($20/mês):**
- Passar 100GB bandwidth
- Precisar de Web Analytics avançado
- Ter receita (5+ usuários pagos = R$ 195/mês)

### **Firebase (Firestore + Auth)**

**Tier Gratuito:**
```
Firestore:
- 50k reads/day
- 20k writes/day
- 20k deletes/day
- 1GB storage

Auth:
- 10k verificações/mês
- Unlimited usuários

Suficiente para:
~100 usuários ativos
~1000 agendamentos/dia
```

**Custos quando ultrapassar:**
```
Firestore: ~R$ 0,06 por 100k operations
Storage: ~R$ 0,03/GB
Auth: Grátis sempre

Estimativa 500 usuários:
~R$ 50/mês Firebase
```

**Custo TOTAL inicial:**
```
Domínio: R$ 40/ano (~R$ 3,50/mês)
Vercel: R$ 0
Firebase: R$ 0
WhatsApp: R$ 0
-----------------
TOTAL: R$ 3,50/mês 🎉
```

---

## 💰 Precificação - DECISÃO FINAL

### **Estrutura de Planos**

```
┌─────────────────────────────────────────────┐
│ FREE (R$ 0/mês)                             │
├─────────────────────────────────────────────┤
│ ✓ 1 agenda Google                           │
│ ✓ 30 agendamentos/mês (reduzido de 50)     │
│ ✓ Confirmação Click-to-Chat                │
│ ✗ Sem lembretes                             │
│ ⚠ Marca "Powered by DaTempo" (discreta)    │
│                                             │
│ Objetivo: Aquisição + Testar produto       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ STARTER (R$ 39/mês)                         │
├─────────────────────────────────────────────┤
│ ✓ 3 agendas Google                          │
│ ✓ 200 agendamentos/mês                      │
│ ✓ Confirmação + 1 lembrete                  │
│ ✓ Sem marca d'água                          │
│ ✓ Suporte email (48h)                       │
│ ✓ Configuração workHours                    │
│                                             │
│ Objetivo: Profissionais liberais           │
│ Target: Psicólogos, Personal, Dentistas    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ PRO (R$ 79/mês)                             │
├─────────────────────────────────────────────┤
│ ✓ 10 agendas Google                         │
│ ✓ 1000 agendamentos/mês                     │
│ ✓ Lembretes ilimitados                      │
│ ✓ PIX/Manual pagamentos                     │
│ ✓ Suporte prioritário (24h)                │
│ ✓ Múltiplos profissionais                  │
│                                             │
│ Objetivo: Clínicas, Salões, Consultórios   │
│ Target: Times com múltiplos profissionais   │
└─────────────────────────────────────────────┘
```

### **Comparação com Concorrência**

```
CALENDLY (Global):
- Essentials: USD 10/user/mês (~R$ 50)
- Professional: USD 15/user/mês (~R$ 75)
- Features: Sem WhatsApp, sem BR focus

AGENDOR (BR):
- Essencial: R$ 99/mês
- Features: CRM completo, não só agenda

CLICKAGENDA (BR):
- Básico: R$ 45/mês
- Features: Básico, sem WhatsApp

DATEMPO:
- Starter: R$ 39/mês ✅ Mais barato
- Pro: R$ 79/mês ✅ Mais features
- Diferencial: WhatsApp + Identidade única
```

### **Break-Even Analysis**

```
CUSTOS FIXOS/MÊS:
- Domínio: R$ 3,50
- Vercel: R$ 0
- Firebase: R$ 0
- WhatsApp: R$ 0
TOTAL: R$ 3,50/mês

MARGEM POR PLANO:
FREE: -R$ 3,50 (custo de aquisição)
STARTER: R$ 39 - R$ 3,50 = R$ 35,50 (91% margem!)
PRO: R$ 79 - R$ 3,50 = R$ 75,50 (95% margem!)

BREAK-EVEN:
1 usuário STARTER = já paga custos
2 FREE + 1 STARTER = lucrativo
10 FREE + 3 STARTER = R$ 106,50 lucro/mês
```

**Cenários:**

```
CONSERVADOR (Mês 3):
- 50 FREE
- 5 STARTER (R$ 195)
- 1 PRO (R$ 79)
= R$ 274/mês - R$ 3,50 = R$ 270,50 lucro

REALISTA (Mês 6):
- 100 FREE
- 15 STARTER (R$ 585)
- 5 PRO (R$ 395)
= R$ 980/mês - R$ 3,50 = R$ 976,50 lucro

OTIMISTA (Mês 12):
- 200 FREE
- 30 STARTER (R$ 1170)
- 15 PRO (R$ 1185)
= R$ 2355/mês - R$ 3,50 = R$ 2351,50 lucro
```

---

## 🎯 Features MVP - O QUE TER

### **CORE (Já pronto - 90%):**
- [x] Auth Google
- [x] Sincronizar Google Calendar
- [x] Agendamento público
- [x] Prevenção de conflitos
- [x] WhatsApp Click-to-Chat
- [x] Link compartilhável + QR Code

### **ESSENCIAL (Falta implementar - 10%):**
- [ ] Dashboard verde+madeira (corrigir visual)
- [ ] Multi-calendários UI básica
- [ ] Configurar workHours no dashboard
- [ ] Páginas 404/500 customizadas
- [ ] Termos + Privacidade (simples)

### **IMPORTANTE (Fase 2 - pós-MVP):**
- [ ] Lembretes configuráveis por agenda
- [ ] Exportar agendamentos CSV
- [ ] Estatísticas básicas (agendamentos/mês)
- [ ] Integração PIX manual

---

## 🚫 Features REMOVER/OCULTAR

### **Não implementado (remover da UI/docs):**
- ❌ **Reviews Google** (0% implementado)
  - Remover de `plans.ts` 
  - Remover da homepage
  - Remover da documentação
  
- ❌ **Links Inteligentes com filtros** (30% implementado)
  - Ocultar botões de filtro
  - Manter estrutura para futuro
  
- ❌ **Stripe Checkout** (60% implementado)
  - Ocultar da UI
  - Manter código para futuro
  - Documentar como "futuro"

- ❌ **Analytics Dashboard** (0% implementado)
  - Usar Google Analytics apenas
  - Remover menções a analytics interno

### **"Em breve" proibido:**
- Nunca mostrar features "coming soon"
- Nunca prometer o que não existe
- Documentação = realidade atual

---

## 📊 Métricas (Google Analytics 4)

### **Eventos Essenciais:**

```javascript
// src/app/layout.tsx ou _app.tsx
gtag('event', 'sign_up', { 
  method: 'Google',
  timestamp: Date.now()
});

gtag('event', 'calendar_connected', {
  calendar_count: 1
});

gtag('event', 'first_appointment_created', {
  plan: 'free'
});

gtag('event', 'link_shared', {
  method: 'copy' // ou 'qr' ou 'native'
});

gtag('event', 'booking_completed', {
  plan: 'free',
  appointment_duration: 60
});

gtag('event', 'plan_upgrade', {
  from: 'free',
  to: 'starter',
  value: 39
});
```

### **Funil de Conversão:**

```
1. Visitante → Cadastro (sign_up)
2. Cadastro → Conectou calendário (calendar_connected)
3. Conectou → Criou 1ª agenda (first_appointment_created)
4. Criou → Compartilhou link (link_shared)
5. Compartilhou → Recebeu 1º booking (booking_completed)

Meta MVP:
- 1→2: >70%
- 2→3: >80%
- 3→4: >90%
- 4→5: >20% (depende do usuário divulgar)
```

### **Métricas Internas (Firestore):**

```typescript
// Coleção: /metrics/daily/{date}
{
  date: "2025-11-26",
  signups: 5,
  appointments_created: 12,
  bookings_completed: 8,
  active_users: 15,
  by_plan: {
    free: 12,
    starter: 2,
    pro: 1
  }
}
```

---

## 🗓️ Plano de Migração (Quando escalar)

### **Vercel Free → Pro ($20/mês)**
**Quando:**
- Passar 100GB bandwidth/mês
- OU precisar analytics avançado
- OU ter 5+ usuários pagos (R$ 195+ MRR)

**Benefícios Pro:**
- Analytics detalhado
- Password protection
- Prioridade de build

---

### **Click-to-Chat → WhatsApp API**
**Quando:**
- 30+ usuários pagos (R$ 1500+ MRR)
- OU métricas mostrarem que API aumenta retenção
- OU competição adotar API

**Custos API:**
```
Twilio (mais simples):
- Setup: R$ 0
- Mensagem: R$ 0,18/msg
- 1000 msgs/mês = R$ 180

Meta (oficial):
- Setup: USD 15/mês
- Mensagem: R$ 0,20/msg
- 1000 msgs/mês = R$ 200
```

**Budget necessário:**
```
30 usuários STARTER = R$ 1170/mês
Budget WhatsApp: ~R$ 200/mês (17% da receita)
Lucro líquido: ~R$ 970/mês

Viável? SIM ✅
```

---

### **Firebase Tier Gratuito → Blaze (Pay-as-you-go)**
**Quando:**
- Passar 50k reads/day
- OU 20k writes/day
- OU 1GB storage

**Estimativa:**
```
100 usuários ativos:
- Reads: ~30k/day (dentro do limite)
- Writes: ~10k/day (dentro do limite)

500 usuários ativos:
- Reads: ~150k/day (R$ 20/mês extra)
- Writes: ~50k/day (R$ 15/mês extra)
- Total: ~R$ 35/mês Firebase

Receita com 500 usuários:
- 400 FREE + 75 STARTER + 25 PRO
- MRR: ~R$ 4900
- Firebase = 0,7% da receita ✅ Tranquilo
```

---

## 🔐 Segurança e Compliance

### **LGPD (Básico para MVP):**
- [ ] Política de Privacidade simples
- [ ] Termos de Uso claros
- [ ] Cookie consent (se usar cookies de tracking)
- [ ] Email para solicitar exclusão de dados

### **Segurança:**
- [x] HTTPS (Vercel fornece)
- [x] Firebase Auth (seguro por padrão)
- [x] Rate limiting em APIs (já implementado)
- [ ] Logs de acesso (GA4)

---

## 📝 Documentação Técnica

### **Arquivos a criar/atualizar:**
- [ ] `.env.example` (com WA_FIRST_MESSAGE_MODE=link)
- [ ] `README.md` (simplificar, focar no MVP)
- [ ] `docs/SETUP-RAPIDO.md` (5 min setup)
- [ ] `docs/TERMOS-USO.md` (básico)
- [ ] `docs/PRIVACIDADE.md` (LGPD básico)

### **Arquivos a remover/arquivar:**
- [ ] Mover docs antigos para `docs/archive/`
- [ ] Limpar regras antigas de `rules/`
- [ ] Consolidar múltiplos READMEs

---

## 🎯 Próximos 7 Dias - Implementação

### **Dia 1 (hoje): Documentação**
- [x] Criar DECISOES-TECNICAS.md (este arquivo)
- [ ] Criar ANALISE-PRODUTO-COMPLETA.md
- [ ] Criar MVP-PRODUCAO-DEFINITIVO.md

### **Dia 2: Código - Limpeza**
- [ ] Atualizar `src/lib/plans.ts` (novos limites)
- [ ] Remover menções a Reviews Google
- [ ] Ocultar Links Inteligentes da UI
- [ ] Configurar `WA_FIRST_MESSAGE_MODE=link`

### **Dia 3: Código - Visual**
- [ ] Padronizar Dashboard (verde+madeira)
- [ ] Páginas 404/500
- [ ] Loading states consistentes

### **Dia 4: Código - Features**
- [ ] Multi-calendários UI básica
- [ ] WorkHours configurável
- [ ] Termos + Privacidade simples

### **Dia 5: Testes**
- [ ] Fluxo completo manual
- [ ] Teste mobile responsivo
- [ ] Correção de bugs encontrados

### **Dia 6: Deploy**
- [ ] Deploy Vercel produção
- [ ] Configurar domínio (se tiver)
- [ ] Google Analytics 4
- [ ] Testar em produção

### **Dia 7: Soft Launch**
- [ ] Compartilhar com 3-5 pessoas próximas
- [ ] Coletar feedback inicial
- [ ] Ajustes rápidos se necessário

---

## 💭 Filosofia de Decisão

**Por que essas escolhas:**

1. **Click-to-Chat vs API paga:**
   - R$ 0 vs R$ 200/mês
   - Validar produto antes de gastar
   - Funcionalidade 90% igual para usuário

2. **Vercel Free vs Render:**
   - Deploy mais rápido
   - Analytics incluso
   - Escala automática

3. **Preços R$ 39/79 vs R$ 49/99:**
   - Mais competitivo
   - Margem ainda excelente (91-95%)
   - Barreira psicológica menor

4. **Remover features não prontas:**
   - Confiança > Promessas
   - Foco > Dispersão
   - Realidade > Marketing

---

## 🔄 Revisão e Atualização

**Este documento deve ser atualizado quando:**
- Custos mudarem significativamente
- Métricas mostrarem necessidade de mudança
- Escala exigir infraestrutura diferente
- Competição mudar o jogo

**Última atualização:** 26/11/2025  
**Próxima revisão:** Após 30 dias em produção  
**Owner:** Time DaTempo (dev + AI co-founder)

---

*DaTempo - Decisões técnicas com tranquilidade 🕰️*
