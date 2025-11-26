# 🚀 MVP Produção Definitivo - DaTempo

> Checklist prático e executável para lançamento do MVP
> Data: 26/11/2025
> Prazo: 7-14 dias
> Status: 🟡 Em preparação

---

## 🎯 Objetivo do MVP

**Definição:**
> Versão mínima funcional do DaTempo que entrega valor real para usuários, sem features prometidas mas não implementadas, com foco em validação de mercado e aprendizado.

**Critérios de Sucesso:**
- ✅ 100% das features prometidas funcionam
- ✅ Visual consistente (verde+madeira)
- ✅ Zero bugs críticos impeditivos
- ✅ Métricas básicas implementadas
- ✅ Documentação reflete realidade

**Não é objetivo:**
- ❌ Ter todas as features imagináveis
- ❌ Ser perfeito em todos os detalhes
- ❌ Escalar para milhares de usuários
- ❌ Competir com Calendly em features

---

## ✅ Features QUE DEVEM ESTAR (Core)

### **1. Autenticação** ✅ PRONTO
```
Status: 100% funcional
Arquivo: src/lib/google.ts, src/app/api/google/
Teste: Login com Google funciona
```

- [x] Login via Google OAuth
- [x] Refresh token automático
- [x] Logout funcional
- [x] Sessão persistente
- [x] Tratamento de erros

---

### **2. Sincronização Google Calendar** ✅ PRONTO
```
Status: 100% funcional
Arquivo: src/lib/google.ts
Teste: Eventos criados aparecem no Google Calendar
```

- [x] Listar calendários do usuário
- [x] Criar eventos automaticamente
- [x] Consultar disponibilidade (FreeBusy)
- [x] Prevenir conflitos
- [x] Timezone dinâmico

---

### **3. Sistema de Agendamento Público** ✅ PRONTO
```
Status: 100% funcional
Arquivo: src/app/api/appointment/route.ts
Teste: Cliente consegue agendar via link público
```

- [x] Página pública de agendamento
- [x] Visualização de disponibilidade
- [x] Formulário de agendamento
- [x] Validação de conflitos
- [x] Rate limiting (8 req/min)
- [x] Normalização telefone BR
- [x] Criação automática no Calendar

---

### **4. Notificações WhatsApp** ✅ PRONTO
```
Status: 100% funcional (Click-to-Chat)
Arquivo: src/lib/whats.ts
Teste: Cliente recebe link WhatsApp após agendar
```

- [x] Confirmação via Click-to-Chat
- [x] Link pré-preenchido
- [x] Mensagem personalizada
- [x] Suporte a múltiplos providers (futuro)

---

### **5. Link Compartilhável** ✅ PRONTO
```
Status: 100% funcional
Arquivo: src/components/ShareableLink.tsx
Teste: Profissional consegue compartilhar link da agenda
```

- [x] Copiar link
- [x] Gerar QR Code
- [x] Compartilhar nativo (mobile)
- [x] Preview/abrir link
- [x] Download QR Code

---

### **6. Sistema de Planos** ⚠️ PRECISA ATUALIZAR
```
Status: 80% funcional (precisa ajustar limites)
Arquivo: src/lib/plans.ts
Ação: Atualizar limites conforme DECISOES-TECNICAS.md
```

- [x] Estrutura de planos (free, starter, pro)
- [x] Limites por plano
- [ ] Atualizar para novos limites (30, 200, 1000)
- [ ] Atualizar preços (R$ 39, R$ 79)
- [ ] Remover "reviewsGoogle" de features
- [ ] Ajustar bullets dos planos

**Ação necessária:**
```typescript
// Atualizar em src/lib/plans.ts

FREE:
- maxAppointmentsPerMonth: 30 (era 50)
- whatsappMessagesIncludedPerMonth: 30 (era 50)
- Remover menção a lembretes

STARTER:
- monthlyPrice: 39 (era 49)
- priceDisplay: "R$ 39,00/mês"
- maxAppointmentsPerMonth: 200 (era 500)
- whatsappMessagesIncludedPerMonth: 200 (era 500)

PRO:
- monthlyPrice: 79 (era 99)
- priceDisplay: "R$ 79,00/mês"
- maxConnectedCalendars: 10 (era 20)
- reviewsGoogle: false (remover feature)
```

---

### **7. Dashboard Base** ⚠️ PRECISA PADRONIZAR
```
Status: 90% funcional (visual inconsistente)
Arquivo: src/app/dashboard/page.tsx
Ação: Padronizar cores para verde+madeira
```

- [x] Estrutura de navegação
- [x] Listagem de agendamentos
- [x] Logout funcional
- [ ] Cores verde+madeira (está azul)
- [ ] Remover menções a features inexistentes
- [ ] Microcopy acolhedor

**Ação necessária:**
- Substituir azul (#2563eb, #3b82f6) por verde (#10b981)
- Aplicar paleta madeira (#8B6F47, #D4C4A8)
- Manter tipografia consistente
- Verificar todos os componentes do dashboard

---

### **8. Multi-Calendários** ⚠️ PRECISA UI BÁSICA
```
Status: 50% funcional (backend pronto, UI falta)
Arquivo: src/app/dashboard/
Ação: Criar UI básica para gerenciar múltiplas agendas
```

- [x] Estrutura de dados (linkedCalendars)
- [x] API para criar/listar
- [ ] UI para criar nova agenda
- [ ] UI para listar agendas ativas
- [ ] UI para ativar/desativar agenda
- [ ] UI básica de configuração

**Componente a criar:**
```typescript
// src/app/dashboard/CalendarManager.tsx
- Lista agendas existentes
- Botão "Nova Agenda"
- Form simples: nome, descrição, whatsapp
- Toggle ativar/desativar
- Sem configurações avançadas (fase 2)
```

---

### **9. Configuração WorkHours** ⚠️ PRECISA IMPLEMENTAR
```
Status: 0% UI (estrutura existe no backend)
Arquivo: Criar src/app/dashboard/WorkHoursConfig.tsx
Ação: UI simples para definir horários de trabalho
```

- [ ] UI para selecionar dias da semana
- [ ] Inputs de horário início/fim
- [ ] Validação horários
- [ ] Salvar em linkedCalendar.workHours

**Exemplo de UI:**
```
Segunda a Sexta:
[x] Segunda: [08:00] às [18:00]
[x] Terça: [08:00] às [18:00]
[ ] Sábado
[ ] Domingo

Ou: Template pré-definidos
- Comercial (Seg-Sex 8-18h)
- Flexível (Seg-Sab 9-21h)
- Custom
```

---

### **10. Páginas Essenciais** ⚠️ FALTAM ALGUMAS
```
Status: 60% completo
Ação: Criar páginas faltantes
```

- [x] Homepage (src/app/page.tsx) ✅
- [x] Login (src/app/login/page.tsx) ✅
- [x] Dashboard (src/app/dashboard/page.tsx) ✅
- [x] Agenda pública (src/app/agenda/[slug]/page.tsx) ✅
- [ ] 404 customizada
- [ ] 500 erro customizada
- [ ] Termos de Uso (básico)
- [ ] Política de Privacidade (LGPD básico)

**Criar:**
```typescript
// src/app/not-found.tsx
- Página 404 com identidade DaTempo
- "Ops, essa página foi tomar um café"
- Link para homepage
- QR Code com mensagem divertida

// src/app/error.tsx
- Página 500 genérica
- "Algo não saiu como esperado"
- Botão "Tentar novamente"

// src/app/termos/page.tsx
- Termos de Uso simples
- Texto jurídico básico
- Atualização LGPD

// src/app/privacidade/page.tsx
- Política de Privacidade
- Conformidade LGPD
- Contato para exclusão de dados
```

---

## 🚫 Features QUE DEVEM SAIR (Remover/Ocultar)

### **1. Reviews Google** ❌ REMOVER COMPLETAMENTE
```
Status: 0% implementado, mas mencionado em vários lugares
Ação: Remover de TODOS os lugares
```

**Locais para limpar:**
- [ ] src/lib/plans.ts → features.reviewsGoogle: false (remover)
- [ ] Homepage → Remover menção nos cards de features
- [ ] Planos → Remover dos bullets do plano PRO
- [ ] Documentação → Arquivar docs relacionados

**Buscar e remover:**
```bash
grep -r "review" src/
grep -r "Review" src/
grep -r "avaliação" src/
```

---

### **2. Links Inteligentes** ⚠️ OCULTAR UI (manter estrutura)
```
Status: 30% implementado (UI pronta, backend não)
Ação: Ocultar botões, manter código para futuro
```

**Locais para ocultar:**
- [ ] src/components/ShareableLink.tsx → Ocultar botões de filtro
- [ ] src/app/dashboard/ → Remover menção a "filtros avançados"
- [ ] Docs → Marcar como "Roadmap futuro"

**Não deletar código:**
```typescript
// Manter estrutura de query params
// Só ocultar UI que permite criar links filtrados
// Backend será implementado na Fase 2
```

---

### **3. Stripe Checkout** ⚠️ OCULTAR (manter código)
```
Status: 60% implementado (não funcional)
Ação: Ocultar completamente da UI
```

**Locais para ocultar:**
- [ ] Planos homepage → Botões só "Começar grátis"
- [ ] Dashboard → Remover qualquer menção a pagamento
- [ ] Remover rotas /api/payments/ do front (manter backend)

**Para planos pagos (futuro):**
- Criar processo manual de upgrade
- Email para solicitar upgrade
- Configurar manualmente no Firebase

---

### **4. Analytics Dashboard** ❌ REMOVER
```
Status: 0% implementado
Ação: Remover menções, usar GA4 apenas
```

- [ ] Remover qualquer tela de "Analytics"
- [ ] Remover links no menu para métricas
- [ ] Documentar uso de Google Analytics 4

---

### **5. Features "Em Breve"** ❌ PROIBIDO
```
Regra: NUNCA mostrar "Coming soon", "Em breve", etc
```

- [ ] Auditar toda UI procurando por:
  - "Em breve"
  - "Coming soon"
  - "Brevemente"
  - "Futuro"
  - Badges de "NEW" em features inexistentes

---

## 🎨 Correções Visuais CRÍTICAS

### **Dashboard - Padronização Verde+Madeira**
```
Prazo: 1-2 dias
Prioridade: 🔴 CRÍTICA
```

**Paleta atual (ERRADA):**
```css
❌ Azul primário: #2563eb, #3b82f6
❌ Azul secundário: #60a5fa
❌ Background azul claro
```

**Paleta correta:**
```css
✅ Verde WhatsApp: #10b981
✅ Madeira escura: #8B6F47
✅ Madeira média: #B8956A
✅ Papel velho: #F5EFE6
✅ Sépia: #4A3F35
```

**Componentes a corrigir:**
- [ ] Botões primários → verde (#10b981)
- [ ] Links/hovers → madeira (#8B6F47)
- [ ] Background cards → papel (#F5EFE6 ou #FDFBF7)
- [ ] Textos principais → sépia (#4A3F35)
- [ ] Badges/tags → madeira clara (#D4C4A8)

**Arquivos principais:**
```
src/app/dashboard/page.tsx
src/app/dashboard/components/*.tsx
src/app/dashboard/agendamentos/page.tsx
src/app/dashboard/configuracoes/page.tsx
```

---

### **Microcopy Acolhedor**
```
Prazo: 1 dia
Prioridade: 🟡 MÉDIA
```

**Substituir em todo dashboard:**
```
❌ "Delete" → ✅ "Remover" ou "Dispensar"
❌ "Cancel" → ✅ "Deixa pra depois"
❌ "Edit" → ✅ "Ajustar"
❌ "Settings" → ✅ "Configurações" ou "Seus ajustes"
❌ "Loading..." → ✅ "Só um instantinho..."
❌ "Error" → ✅ "Ops, algo inesperado..."
❌ "Success" → ✅ "Prontinho!"
```

---

## 📊 Métricas Básicas

### **Google Analytics 4**
```
Prazo: 1 dia
Prioridade: 🟡 MÉDIA (implementar antes do deploy final)
```

**Setup:**
1. Criar conta GA4
2. Obter ID de medição (G-XXXXXXXXXX)
3. Instalar no layout principal

**Código:**
```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  
  return (
    <html>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

### **Eventos Críticos**
```
Implementar em pontos chave da aplicação
```

**Lista de eventos:**

1. **Sign Up** (após completar OAuth)
```typescript
gtag('event', 'sign_up', { method: 'Google' })
```

2. **Calendar Connected** (após conectar primeiro calendário)
```typescript
gtag('event', 'calendar_connected', { calendar_count: 1 })
```

3. **First Appointment Created** (ao criar primeira agenda)
```typescript
gtag('event', 'first_appointment_created', { plan: accountPlan })
```

4. **Link Shared** (ao copiar/compartilhar link)
```typescript
gtag('event', 'link_shared', { method: 'copy' }) // ou 'qr', 'native'
```

5. **Booking Completed** (quando cliente agenda)
```typescript
gtag('event', 'booking_completed', {
  plan: ownerPlan,
  duration: slotDuration
})
```

**Locais para adicionar:**
```
1. src/app/api/google/oauth/callback/route.ts (sign_up)
2. src/app/dashboard/page.tsx (calendar_connected)
3. src/app/api/appointment/route.ts (booking_completed)
4. src/components/ShareableLink.tsx (link_shared)
```

---

## 🗓️ Cronograma Executável (7 Dias)

### **DIA 1: Limpeza e Documentação** ✅ CONCLUÍDO
```
Status: ✅ FEITO
```
- [x] Criar DECISOES-TECNICAS.md
- [x] Criar ANALISE-PRODUTO-COMPLETA.md
- [x] Criar MVP-PRODUCAO-DEFINITIVO.md (este arquivo)

---

### **DIA 2: Código - Planos e Limpeza**
```
Prazo: 26/11/2025 (amanhã)
Responsável: Dev
Estimativa: 6-8h
```

**Manhã (3-4h):**
- [ ] Atualizar src/lib/plans.ts (novos limites e preços)
- [ ] Remover reviewsGoogle de todas features
- [ ] Atualizar bullets dos planos
- [ ] Testar localmente

**Tarde (3-4h):**
- [ ] Buscar e remover menções a "Reviews Google"
- [ ] Ocultar botões de Links Inteligentes
- [ ] Ocultar Stripe Checkout da UI
- [ ] Limpar features "Em breve"
- [ ] Commit: "chore: remove unimplemented features"

---

### **DIA 3: Visual - Dashboard Verde+Madeira**
```
Prazo: 27/11/2025
Responsável: Dev
Estimativa: 6-8h
```

**Manhã (3-4h):**
- [ ] Auditar todas páginas do dashboard
- [ ] Substituir azul por verde+madeira
- [ ] Atualizar componentes base (botões, links)
- [ ] Testar em dark/light mode se aplicável

**Tarde (3-4h):**
- [ ] Ajustar microcopy para tom acolhedor
- [ ] Criar página 404 customizada
- [ ] Criar página 500 customizada
- [ ] Commit: "feat: standardize dashboard design system"

---

### **DIA 4: Features - Multi-Calendários e WorkHours**
```
Prazo: 28/11/2025
Responsável: Dev
Estimativa: 6-8h
```

**Manhã (3-4h):**
- [ ] Criar CalendarManager component
- [ ] UI para listar agendas
- [ ] UI para criar nova agenda (form básico)
- [ ] Testar criação/listagem

**Tarde (3-4h):**
- [ ] Criar WorkHoursConfig component
- [ ] UI para definir horários por dia
- [ ] Validações básicas
- [ ] Integrar ao criar/editar agenda
- [ ] Commit: "feat: add calendar manager and work hours config"

---

### **DIA 5: Compliance - Termos e Privacidade**
```
Prazo: 29/11/2025
Responsável: Dev
Estimativa: 4-6h
```

**Manhã (2-3h):**
- [ ] Criar página Termos de Uso (template simples)
- [ ] Criar página Privacidade (LGPD básico)
- [ ] Links no footer de todas páginas

**Tarde (2-3h):**
- [ ] Implementar Google Analytics 4
- [ ] Adicionar eventos críticos (5 eventos)
- [ ] Testar tracking localmente
- [ ] Commit: "feat: add legal pages and analytics"

---

### **DIA 6: Testes e Correções**
```
Prazo: 30/11/2025
Responsável: Dev
Estimativa: 8h
```

**Manhã (4h):**
- [ ] Teste completo fluxo profissional
  - Cadastro → Conectar → Criar agenda → Configurar → Compartilhar
- [ ] Teste completo fluxo cliente
  - Acessar link → Ver disponibilidade → Agendar
- [ ] Teste responsivo (mobile, tablet)
- [ ] Listar bugs encontrados

**Tarde (4h):**
- [ ] Corrigir bugs críticos
- [ ] Corrigir bugs médios (se tempo)
- [ ] Verificar todas páginas (visual consistency)
- [ ] Preparar para deploy

---

### **DIA 7: Deploy e Soft Launch**
```
Prazo: 01/12/2025 (domingo)
Responsável: Dev
Estimativa: 4-6h
```

**Manhã (2-3h):**
- [ ] Deploy Vercel produção
- [ ] Configurar variáveis de ambiente
- [ ] Testar em produção
- [ ] Verificar GA4 funcionando

**Tarde (2-3h):**
- [ ] Criar lista de 5-10 beta testers
- [ ] Preparar mensagem de convite
- [ ] Enviar convites
- [ ] Criar formulário de feedback (Google Forms)
- [ ] Documentar primeiras impressões

---

## 📝 Checklist Pré-Deploy

### **Código**
- [ ] Todas features core funcionando
- [ ] Features não prontas removidas/ocultas
- [ ] Visual 100% consistente (verde+madeira)
- [ ] Microcopy acolhedor em toda aplicação
- [ ] Zero warnings no console
- [ ] Build production sem erros
- [ ] TypeScript sem erros

### **Conteúdo**
- [ ] Termos de Uso criados
- [ ] Privacidade LGPD criada
- [ ] FAQ básico (se houver)
- [ ] 404/500 customizadas
- [ ] Todos textos revisados

### **Técnico**
- [ ] Variáveis ambiente configuradas
- [ ] Google Analytics funcionando
- [ ] Rate limiting ativo
- [ ] Firebase funcionando
- [ ] OAuth Google funcionando
- [ ] WhatsApp Click-to-Chat testado

### **Segurança**
- [ ] HTTPS ativo (Vercel fornece)
- [ ] CORS configurado
- [ ] Rate limiting testado
- [ ] Validação inputs no backend
- [ ] Sem secrets no código

---

## 🧪 Testes Manuais Essenciais

### **Fluxo Profissional**
```
Tempo estimado: 15 min
```

1. [ ] Acessar homepage
2. [ ] Clicar "Começar grátis"
3. [ ] Fazer login com Google
4. [ ] Autorizar acesso ao Calendar
5. [ ] Redirecionar para dashboard
6. [ ] Criar primeira agenda
7. [ ] Configurar workHours
8. [ ] Copiar link compartilhável
9. [ ] Abrir link em aba anônima
10. [ ] Verificar se carrega disponibilidade

### **Fluxo Cliente**
```
Tempo estimado: 5 min
```

1. [ ] Acessar link público da agenda
2. [ ] Ver horários disponíveis
3. [ ] Selecionar data/hora
4. [ ] Preencher nome e telefone
5. [ ] Confirmar agendamento
6. [ ] Receber link WhatsApp
7. [ ] Verificar evento no Google Calendar (profissional)

### **Fluxo Responsivo**
```
Tempo estimado: 10 min
```

1. [ ] Testar homepage no mobile
2. [ ] Testar login no mobile
3. [ ] Testar dashboard no mobile
4. [ ] Testar agendamento público no mobile
5. [ ] Compartilhamento nativo funciona

---

## 📞 Plano de Soft Launch (Dia 7+)

### **Beta Testers (5-10 pessoas)**

**Perfil ideal:**
- Conhecidos pessoais
- Profissionais liberais (psicólogos, personal, dentistas)
- Pacientes sobre tecnologia
- Dispostos a dar feedback honesto

**Convite:**
```
Oi [Nome]!

Estou lançando o DaTempo, uma ferramenta de agendamento 
que integra Google Calendar + WhatsApp.

A ideia é facilitar a vida de profissionais como você, 
eliminando aquela correria de confirmar horários.

Você poderia testar por 1 semana e me dar feedback sincero?
É 100% grátis e leva 5 minutos pra configurar.

Link: [URL]

Abraço!
```

**Formulário de Feedback:**
```
1. Conseguiu criar sua primeira agenda?
2. O que foi confuso ou difícil?
3. Você usaria isso no dia a dia? Por quê?
4. Quanto pagaria por mês? (R$ 0, 20, 39, 50, 100+)
5. O que está faltando que seria essencial?
6. Nota de 0-10 e por quê?
```

---

## 🎯 Critérios de Sucesso MVP

### **Técnico (Obrigatório)**
```
✅ Build production sem erros
✅ Deploy Vercel funcionando
✅ Todas features core operacionais
✅ Zero bugs críticos (impedem uso)
✅ Visual 100% consistente
✅ GA4 tracking funcionando
```

### **Produto (Desejável)**
```
✅ 3+ beta testers conseguiram usar
✅ 2+ agendamentos reais completados
✅ 1+ feedback positivo espontâneo
✅ Zero bugs impeditivos reportados
✅ Tempo setup < 10 minutos (média)
```

### **Negócio (Validação)**
```
✅ 1+ pessoa vê valor em pagar
✅ 50%+ completam primeiro agendamento
✅ 30%+ usam na semana seguinte
✅ NPS > 6 (promoters - passives)
```

---

## 🚨 Plano B (Se algo der errado)

### **Bugs Críticos Encontrados**
```
Ação:
1. Pausar convites novos
2. Corrigir urgente
3. Comunicar transparência aos beta testers
4. Re-testar
5. Relançar em 24-48h
```

### **Feedback Muito Negativo**
```
Ação:
1. Entrevistas 1-1 com quem criticou
2. Entender o "por quê"
3. Avaliar se é bug, UX, ou produto errado
4. Ajustar ou pivotar
5. Não desanimar - é aprendizado
```

### **Ninguém Usa**
```
Ação:
1. Verificar se é problema técnico (acessibilidade)
2. Entrevistar quem não usou (por quê?)
3. Reavaliar proposta de valor
4. Ajustar ou considerar pivotar
```

---

## 📚 Recursos e Referências

### **Documentação Interna**
- [Decisões Técnicas](./DECISOES-TECNICAS.md)
- [Análise de Produto](./ANALISE-PRODUTO-COMPLETA.md)
- [Estado Atual](./1-ESTADO-ATUAL/README.md)
- [Design System](./DESIGN-SYSTEM-DATEMPO.md)

### **Ferramentas**
- Vercel Dashboard: https://vercel.com/dashboard
- Firebase Console: https://console.firebase.google.com
- Google Analytics: https://analytics.google.com
- Google Cloud: https://console.cloud.google.com

---

## 🔄 Atualização Pós-Launch

**Este checklist deve ser atualizado após:**
- Cada dia de desenvolvimento
- Deploy em produção
- Feedback de beta testers
- Bugs críticos encontrados

**Marcar itens como:**
- [ ] A fazer
- [⏳] Em progresso
- [✅] Concluído
- [❌] Não será feito (justificar)

---

**Última atualização:** 26/11/2025  
**Próxima revisão:** Diária durante os 7 dias  
**Owner:** Dev Lead + AI Co-Founder

---

*DaTempo - MVP com tranquilidade, mas com foco 🕰️*  
*"Feito > Perfeito"*
