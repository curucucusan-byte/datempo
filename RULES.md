# ZapAgenda – Regras de Negócio e Pendências

## 1. Entidades Centrais e Fontes de Dados
- **Account** (`src/lib/account.ts`): guarda o estado da assinatura do SaaS, preferências de lembrete, lista de `linkedCalendars`, além de `activeCalendarId` e `lastCalendarSwapAt`. Contas novas começam no plano `pro` em modo teste de 3 dias (`DEFAULT_ACTIVE_PLAN_ID`).
- **LinkedCalendar** (`src/lib/google.ts`, `src/app/api/account/google/route.ts`): espelha o vínculo com um calendário Google contendo `{ id, summary, ownerUid, slug, description, whatsappNumber, active }`.
- **Appointment** (`src/lib/store.ts`): agenda gravada no Firestore (coleção `appointments`) ou no arquivo local `data/appointments.json`, com `{ id, slug, customerName, customerPhone, service, startISO, endISO, ownerUid?, createdAt, reminderSentAt? }`.
- **Payments & Subscriptions** (`src/lib/payments.ts`): coleções em Firestore separadas para `payments` (Pix avulso) e `subscriptions` (cartão) via Stripe. Cobre apenas a cobrança do ZapAgenda; não há pré-pagamento de clientes finais.
- **Sessions & Auth** (`src/lib/session.ts`): gerencia cookies de sessão Firebase (`zapagenda_session`) válidos por 5 dias.
- **Leads** (`src/app/api/lead/route.ts`): captação opcional armazenada no Firestore ou no arquivo `leads.dev.json`.

## 2. Autenticação e Controle de Acesso
- Login exclusivo com Google OAuth pelo Firebase (`src/app/login/LoginForm.tsx`).
- Proteção do dashboard/APIs via `authenticateRequest` (cookie de sessão ou bearer token). Rotas de serviço (ex.: cron) podem usar `DASHBOARD_TOKEN`.
- Endpoints públicos de agendamento (`/agenda/[slug]` e legado `/[slug]`) não exigem autenticação.

## 3. Planos e Regras de Cobrança
- Planos definidos em `src/lib/plans.ts`:
  - **Essencial**: 1 agenda Google, 1 troca/dia, lembretes desativados.
  - **Pro**: até 10 agendas, 10 trocas/dia, lembretes configuráveis.
- `ensureAccount` cria conta automaticamente no primeiro login e inicia o trial.
- Fluxos atuais:
  - `/api/payments/create-subscription`: cria assinatura Stripe (cartão) e retorna um PaymentIntent `client_secret`.
  - `/api/payments/create-pix`: cria PaymentIntent Pix e salva registro em `payments` com `nextPaymentDate`.
  - `/api/webhooks/stripe`: atualiza status das contas conforme eventos de invoice/payment.
- Lacunas de frontend: `PaymentButtons` redireciona para `https://checkout.stripe.com/pay/${clientSecret}` (uso incorreto) e o fluxo Pix espera uma página `/payment/pix/[id]` inexistente. Não há UI para histórico ou status de pagamento.

## 4. Integração com Google Agenda
- OAuth (`/api/google/oauth/start`) exige usuário autenticado.
- Callback troca o código por tokens (`googleTokens`) e, se não houver agendas, vincula automaticamente o calendário primário com slug único, descrição padrão e WhatsApp de fallback (`OWNER_DEFAULT_PHONE`).
- Cartão "Minha agenda" (`CalendarsCard`) lista calendários, permite vincular/atualizar/remover/ativar com limites por plano e cooldown de 24h (`CALENDAR_SWAP_INTERVAL_MS`).
- `createGoogleCalendarEvent` cria eventos com fuso `DEFAULT_CALENDAR_TIMEZONE` (ou override) e lembretes manuais (email 24h + popup 10 min). O texto do evento inclui cliente, serviço, WhatsApp, descrição da agenda e link público.

## 5. Fluxo Público de Agendamento
- Dois caminhos coexistem:
  1. **Legado** `/[slug]/ClientPage.tsx` baseado em `@/lib/professionals` (arquivo hoje vazio). Rotas `/api/professional` e `/api/professionals/me` ainda dependem disso, logo o fluxo está quebrado.
  2. **Atual** `/agenda/[slug]` com `AppointmentForm`:
     - Disponibilidade obtida em `/api/availability` (depende de agenda vinculada).
     - Criação via `/api/appointment` com `{ slug, customerName, customerPhone, service?, datetime, durationMinutes?, timezone? }`.

### Lógica do `/api/appointment` (pós-refatoração)
1. **Rate limit**: 8 requisições/min por IP (`rateLimit`).
2. **Validação**: slug/nome/telefone/datetime obrigatórios; telefone normalizado (`normalizeE164BR`). Serviço/duração/fuso opcionais com defaults seguros.
3. **Busca do calendário**: 404 se `slug` inexistente.
4. **Status da conta**: garante conta ativa; bloqueia se plano inativo.
5. **Contato do dono**: usa `whatsappNumber` da agenda ou `OWNER_DEFAULT_PHONE`.
6. **Data/Hora**: `parseFormDateTime` converte `YYYY-MM-DDTHH:MM` + timezone em Date UTC; duração limitada entre 5 e 480 min.
7. **Owner definido**: rejeita se `ownerUid` ausente (setup inconsistente).
8. **Conflitos**: verifica colisões em dados locais/Firestore e, indiretamente, via FreeBusy na etapa de disponibilidade.
9. **Evento Google**: resumo `${serviceLabel} — ${customerName}`, descrição rica + link público, participantes com email do dono quando disponível, timezone propagado.
10. **Notificações WhatsApp**:
    - Cliente: mensagem com agenda, cliente, serviço e data/hora local.
    - Dono: aviso com cliente/serviço/agendamento e alerta de trial, se aplicável.
11. **Persistência**: grava `Appointment` com serviço e timezone no retorno.
12. **Resposta**: `{ ok, id, when, minutes, service, timeZone, ics }` com link ICS.

## 6. Notificações e Lembretes
- `sendWhats` suporta provedores `mock/test/dev`, `twilio` e `zapi`. Variáveis de ambiente obrigatórias.
- Mensagem de confirmação enviada logo após o agendamento.
- Cron de lembretes (`/api/cron/reminder`) exige autenticação. Passos:
  - Carrega compromissos sem `reminderSentAt` e dentro da janela configurada (default 120 min).
  - Garante conta ativa e lembretes habilitados (somente plano Pro).
  - Envia WhatsApp para cliente e, opcionalmente, para o dono; adiciona alerta de trial.
  - Marca `reminderSentAt` para evitar duplicidade.
- Problema: cron ainda depende de `@/lib/professionals` para dados do dono, portanto os lembretes podem falhar.
- Não existe fluxo de feedback pós-atendimento via WhatsApp.

## 7. Cobrança do SaaS e Painéis Internos
- Dashboard `/dashboard/plans` oferece upgrade, porém:
  - Integração com Stripe Checkout ausente (usa `client_secret` incorretamente).
  - Fluxo Pix não tem página para QR/status; não há polling para confirmar pagamento.
- Nada exibe histórico de pagamentos/assinaturas no dashboard, embora os dados estejam no Firestore.
- Downgrade automático em caso de Pix vencido depende de webhook manual; não há lógica auxiliar.

## 8. Persistência de Dados e Ambiente
- Firestore é opcional; sem credenciais os dados ficam em arquivos locais (ineficiente para produção multi-instância).
- Variáveis críticas: `DEFAULT_CALENDAR_TIMEZONE`, `APP_BASE_URL`, `NEXT_PUBLIC_APP_BASE_URL`, Stripe/Firebase/WhatsApp.

## 9. Pendências Conhecidas
1. **Módulo de profissionais** removido mas ainda referenciado (rotas/cron/landing legacy quebrados).
2. **Disponibilidade** fixa em 60 min; ignora duração por serviço e horários de trabalho.
3. **UX de pagamento** incompleta (cartão/Pix) e ausência de histórico.
4. **Participantes Google**: só email do dono; cliente não recebe convite.
5. **Slug de agenda**: auto-link pode colidir; uso de random fallback limitado.
6. **Lembrete para dono**: cron usa dados inexistentes (profissional), logo aviso pode não sair.
7. **Feedback WhatsApp**: não implementado.
8. **Tratamento de erros**: falhas de API Google não aparecem para o cliente; agendamento pode quebrar silenciosamente.
9. **Fusos horários**: apenas default global; nada configurável por agenda.
10. **Segurança**: cron acessível para qualquer sessão autenticada; ideal exigir token de serviço.

## 10. Checklist para Fechar o Fluxo Atual
- [ ] Recriar metadados de profissional/serviço baseados nas agendas vinculadas.
- [ ] Ajustar `/api/availability` e formulários para usar duração por serviço e janelas de trabalho.
- [ ] Implementar corretamente o fluxo de pagamento SaaS (Stripe Elements/Checkout + Pix page) e exibir histórico.
- [ ] Dar visibilidade aos pagamentos em dashboards (filtros, exportação).
- [ ] Consertar cron de lembretes e fontes de dados do dono.
- [ ] Implementar fluxo de feedback pós-consulta via WhatsApp.
- [ ] Melhorar UX de reautenticação Google (tokens revogados, erros).
- [ ] Logar/monitorar falhas de WhatsApp.

## 11. Feature Proposta – Pré-pagamento Opcional por Agenda

### Objetivos
- Permitir que cada agenda exija pagamento antecipado.
- Suportar dois modos: **Stripe** (cartão/Pix automático) e **manual** (Pix/chave bancária configurável).
- Bloquear confirmação até o pagamento ser concluído.
- Mostrar recebimentos no dashboard e no evento do Google.

### Extensões de Modelo
```ts
// LinkedCalendar
requiresPrepayment: boolean;
prepaymentAmountCents?: number;
prepaymentCurrency?: string; // default BRL
prepaymentMode?: "stripe" | "manual";
manualPixKey?: string;
manualBankDetails?: string;
paymentDescription?: string;

// Appointment
paymentStatus?: "not_required" | "pending" | "paid" | "failed";
paymentMode?: "stripe" | "manual";
paymentAmountCents?: number;
paymentCurrency?: string;
paymentReference?: string;
paymentDueAt?: string;
```
- Criar coleção `appointmentPayments` (ou adaptar `payments`) para log e conciliação.

### Backend
1. `/api/appointment`: se `requiresPrepayment` estiver ativo, retornar `paymentStatus: "pending"`.
   - **Stripe**: gerar PaymentIntent específico com metadata; retornar `client_secret` e adiar atualização do evento até webhook confirmar.
   - **Manual**: marcar pendente, definir prazo (`paymentDueAt`) e enviar mensagem com instruções.
2. Novo endpoint `/api/appointments/{id}/confirm-payment` para o dono validar pagamentos manuais.
3. Webhook Stripe: diferenciar `appointment_prepayment` e atualizar Appointment (`paid`/`failed`), além de notificar via WhatsApp.
4. Rotina agendada: cancelar compromissos pendentes após o prazo e alertar cliente/dono.

### Frontend/Dashboard
- **CalendarsCard**: adicionar controles (toggle, valor, modo, dados Pix/conta) – possivelmente exclusivo do plano Pro.
- **Formulário público**: integrar Stripe Elements/Checkout quando `prepaymentMode === "stripe"`; exibir modal com instruções e status quando manual.
- **Painel de confirmação**: mostrar status de pagamento, travar ICS até pagamento confirmado (opcional).
- **Dashboard**: seção "Pagamentos" para compromissos (filtros por status/agenda) + ações para confirmar/cancelar.

### Google Agenda & Mensageria
- Atualizar evento com status do pagamento, valor e referência.
- Após pagamento aprovado, fazer `events.patch` marcando como pago; opcionalmente usar cores ou convidados especiais.
- Templates WhatsApp:
  - Pós-agendamento: instruções ou confirmação.
  - Pós-pagamento: "Pagamento confirmado".
  - Cancelamento automático: aviso para cliente e dono.

### Relatórios & Compliance
- Guardar comprovantes (Stripe ou referencia manual) para auditoria.
- Observar LGPD: nada de dados sensíveis de cartão; guardar somente metadados permitidos.
- Disponibilizar exportação (CSV) por agenda/período.

### Questões em Aberto
1. Pagamentos manuais precisam de confirmação do dono ou aceitam auto declaração do cliente?
2. Qual o prazo padrão para pagamento manual? Será configurável?
3. PaymentIntent Pix de pré-pagamento reutiliza `createPixPaymentIntent` atual ou exige um novo fluxo?
4. Pré-pagamento ficará restrito ao plano Pro?
5. Como lidar com reagendamentos/cancelamentos pagos (especialmente reembolso Stripe)?

---
Este documento deve ser revisado conforme módulos forem concluídos (profissionais, pagamentos completos, etc.).

## 12. Plano de Implementação Priorizado

Abaixo, um roteiro sugerido para atacar as pendências sem travar o desenvolvimento:

1. **Estabilizar a base de agendamentos**
   - Reintroduzir dados de serviços/horários diretamente a partir dos calendários vinculados.
   - Atualizar `/api/availability` e os formulários públicos para usar duração por serviço e bloquear horários fora do expediente.
   - Garantir que o cron de lembretes funcione sem dependências quebradas.

2. **Corrigir fluxos críticos existentes**
   - Ajustar o módulo de pagamentos SaaS (Stripe Elements/Checkout + página Pix) e exibir histórico no dashboard.
   - Revisar a segurança das rotas sensíveis (cron, APIs internas) adicionando token de serviço quando necessário.
   - Melhorar o tratamento de erros e os logs em integrações externas (Google e provedores WhatsApp).

3. **Entregar a proteção por pré-pagamento**
   - Estender o modelo `LinkedCalendar`/`Appointment` e criar endpoints/coleções auxiliares.
   - Implementar o fluxo de pagamento (Stripe e manual), incluindo mensagens no WhatsApp e atualização do evento Google.
   - Construir a seção de gestão de pagamentos no dashboard.

4. **Automação pós-atendimento e experiência do cliente**
   - Implementar o fluxo de feedback via WhatsApp.
   - Adicionar convites por e-mail (cliente como attendee) e melhorias de UX nas telas públicas.

5. **Relatórios e finalização**
   - Exportações CSV, visões de faturamento e painéis consolidados.
   - Revisar documentação, `.env` e instruções de deploy.

Seguir essa ordem minimiza retrabalho: primeiro estabiliza o core de agendamento, depois corrige monetização existente, em seguida adiciona o novo pré-pagamento (que depende das etapas anteriores) e, por fim, trabalha na camada de experiências avançadas e relatórios.
