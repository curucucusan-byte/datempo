# ZapAgenda – Regras de Negócio e Pendências

## 1. Entidades Centrais e Fontes de Dados
- **Account** (`src/lib/account.ts`): guarda o estado da assinatura do SaaS, preferências de lembrete, lista de `linkedCalendars`, além de `activeCalendarId` e `lastCalendarSwapAt`. Contas novas começam no plano `pro` em modo teste de 3 dias (`DEFAULT_ACTIVE_PLAN_ID`).
- **LinkedCalendar** (`src/lib/google.ts`, `src/app/api/account/google/route.ts`): espelha o vínculo com um calendário Google contendo `{ id, summary, ownerUid, slug, description, whatsappNumber, active }`.
- **Appointment** (`src/lib/store.ts`): agenda gravada no Firestore (coleção `appointments`) ou no arquivo local `data/appointments.json`, com `{ id, slug, customerName, customerPhone, service, startISO, endISO, ownerUid?, createdAt, reminderSentAt? }`. Para pré-pagamento, ampliar com campos `paymentRequired`, `paymentStatus`, `paymentProvider`, `paymentIntentId`, valores (`paymentAmount`, `paymentCurrency`) e registros de `paidAt`/`refundAt`.
- **Payments & Subscriptions** (`src/lib/payments.ts`): coleções em Firestore separadas para `payments` (Pix avulso) e `subscriptions` (cartão) via Stripe. Cobre apenas a cobrança do ZapAgenda; para pré-pagamento de clientes finais, `Appointment` armazena identificadores do PSP (`paymentIntentId`, `paymentStatus`).
- **Sessions & Auth** (`src/lib/session.ts`): gerencia cookies de sessão Firebase (`zapagenda_session`) válidos por 5 dias.
- **Leads** (`src/app/api/lead/route.ts`): captação opcional armazenada no Firestore ou no arquivo `leads.dev.json`.

### 1.1 Status, tokens e sessão (22h)

- `PENDING`: criado via formulário público; segura o slot pelo `holdTTLMinutes` até o cliente iniciar a conversa no WhatsApp.
- `TENTATIVE`: evento provisório no Google Calendar aguardando aprovação quando `confirmationMode=manual_by_owner`.
- `CONFIRMED`: evento e agendamento confirmados; mensagens só são enviadas se houver inbound do cliente nas últimas 22h (janela operacional de segurança).
- `CANCELLED`: cancelado manualmente (cliente/dono) ou por timeout de `TENTATIVE`.
- `EXPIRED`: `PENDING` sem mensagem durante o TTL; libera o horário sem criar evento.

Cada `Appointment` recebe um `token` que deve ser inserido no texto disparado pelo cliente (`CONFIRMAR {TOKEN} {DATA_LOCAL}`) para validar o fluxo no webhook. Manter índice de sessão por `(tenantId, phoneE164)` com `lastInboundAt/lastOutboundAt` para o guard de 22h.

### 1.2 Modelos auxiliares (sessão e auditoria)

SessionIndex (por telefone + tenant):

```json
{
  "phoneE164": "+55DDDNUMERO",
  "tenantId": "uuid",
  "lastInboundAt": "2025-10-03T20:15:00Z",
  "lastOutboundAt": "2025-10-03T20:16:10Z",
  "remindersOpt": "on | off | unknown"
}
```

AttemptLog (auditoria dos bloqueios do guard):

```json
{
  "attemptedAt": "ISO",
  "tenantId": "uuid",
  "phoneE164": "+55DDDNUMERO",
  "type": "CONFIRMATION | REMINDER | OTHER",
  "allowed": false,
  "reason": "NO_RECENT_INBOUND_22H | OPT_OUT | PLAN_DISABLED | OTHER"
}
```

## 2. Autenticação e Controle de Acesso
- Login exclusivo com Google OAuth pelo Firebase (`src/app/login/LoginForm.tsx`).
- Proteção do dashboard/APIs via `authenticateRequest` (cookie de sessão ou bearer token). Rotas de serviço (ex.: cron) podem usar `DASHBOARD_TOKEN`.
- Endpoints públicos de agendamento (`/agenda/[slug]` e legado `/[slug]`) não exigem autenticação.

## 3. Catálogo de Planos, Limites e Enforcement

### 3.1 Estrutura canônica do plano
```json
{
  "planId": "free | starter | pro",
  "displayName": "string",
  "priceBRL": 0,
  "limits": {
    "maxConnectedCalendars": 1,
    "maxAppointmentsPerMonth": 50,
    "whatsappMessagesIncludedPerMonth": 50,
    "maxAutoRemindersPerAppointment": 0
  },
  "features": {
    "paymentAtBooking": false,
    "reviewsGoogle": false,
    "noShowPaymentOption": false
  },
  "overage": {
    "whatsappMessageBRL": null
  }
}
```

### 3.2 Planos (valores atuais)
```json
[
  {
    "planId": "free",
    "displayName": "Free",
    "priceBRL": 0,
    "limits": {
      "maxConnectedCalendars": 1,
      "maxAppointmentsPerMonth": 50,
      "whatsappMessagesIncludedPerMonth": 50,
      "maxAutoRemindersPerAppointment": 0
    },
    "features": {
      "paymentAtBooking": false,
      "reviewsGoogle": false,
      "noShowPaymentOption": false
    },
    "overage": { "whatsappMessageBRL": null }
  },
  {
    "planId": "starter",
    "displayName": "Starter",
    "priceBRL": 49,
    "limits": {
      "maxConnectedCalendars": 3,
      "maxAppointmentsPerMonth": 300,
      "whatsappMessagesIncludedPerMonth": 300,
      "maxAutoRemindersPerAppointment": 2
    },
    "features": {
      "paymentAtBooking": true,
      "reviewsGoogle": false,
      "noShowPaymentOption": true
    },
    "overage": { "whatsappMessageBRL": 0.19 }
  },
  {
    "planId": "pro",
    "displayName": "Pro",
    "priceBRL": 99,
    "limits": {
      "maxConnectedCalendars": 20,
      "maxAppointmentsPerMonth": 1000,
      "whatsappMessagesIncludedPerMonth": 1000,
      "maxAutoRemindersPerAppointment": 3
    },
    "features": {
      "paymentAtBooking": true,
      "reviewsGoogle": true,
      "noShowPaymentOption": true
    },
    "overage": { "whatsappMessageBRL": 0.17 }
  }
]
```

### 3.3 Regras globais (sem tecnicês)
- Somente WhatsApp; nunca iniciar conversa; regra operacional de 22h (inbound ≤ 22h).
- Remetente único: número central ou BYON do tenant.
- Pagamento no ato (quando ativado): pós `paid|approved` → `CONFIRMED` imediato.

### 3.4 Enforcement por plano
- `maxConnectedCalendars`: bloquear vínculos além do limite.
- `maxAppointmentsPerMonth`: negar novas criações ao atingir o teto, orientando upgrade.
- `whatsappMessagesIncludedPerMonth`:
  - Contagem por mensagem enviada pelo sistema (respostas autorizadas pelo guard 22h).
  - Free: bloquear acima da franquia (sem overage).
  - Starter/Pro: permitir excedente cobrando `overage.whatsappMessageBRL` por mensagem.
- `maxAutoRemindersPerAppointment`: respeitar o máximo de lembretes automáticos por agendamento (guard 22h e opt-in obrigatórios).

## 4. Integração com Google Agenda
- OAuth (`/api/google/oauth/start`) exige usuário autenticado.
- Callback troca o código por tokens (`googleTokens`) e, se não houver agendas, vincula automaticamente o calendário primário com slug único, descrição padrão e WhatsApp de fallback (`OWNER_DEFAULT_PHONE`).
- Cartão "Minha agenda" (`CalendarsCard`) lista calendários, permite vincular/atualizar/remover/ativar com limites por plano e cooldown de 24h (`CALENDAR_SWAP_INTERVAL_MS`).
- `createGoogleCalendarEvent` cria eventos com fuso `DEFAULT_CALENDAR_TIMEZONE` (ou override) e lembretes manuais (email 24h + popup 10 min). O texto do evento inclui cliente, serviço, WhatsApp, descrição da agenda e link público.

## 5. Fluxo Público de Agendamento + Confirmação via WhatsApp
- Remover o fluxo legado `/[slug]` e rotas associadas (`/api/professional*`). O único caminho suportado passa por `/agenda/[slug]` + `AppointmentForm`.
- `/api/appointment` deve continuar validando disponibilidade, slug, plano ativo e taxa de requisições, mas agora responder com `status=PENDING`, `token`, `holdTTL`, `confirmationMode` e o link `wa.me` para o cliente iniciar a conversa.
- Não enviar mensagens proativas antes da primeira mensagem do cliente. Sem templates/fallback: nunca iniciar conversa.

### 5.1 Modo automático (`confirmationMode=auto_on_customer_msg`)
1. Front abre `wa.me/{whatsappNumber}?text=CONFIRMAR%20{TOKEN}%20{DATA_LOCAL}` imediatamente após criar o `Appointment`.
2. Webhook `/api/webhooks/wa` valida `hub.verify_token`, normaliza o payload (`entry[].changes[].value.messages[0]`), extrai `token` via regex e confere se está dentro de `holdTTL`.
3. Antes de confirmar, revalida conflitos: se já existir evento/compromisso, responde orientando a remarcar.
4. Atualiza o Google Calendar (`status="confirmed"`, `extendedProperties.private.token`) e grava `googleEventId`.
5. Atualiza o `Appointment` para `CONFIRMED`, preenche `consentAt` e envia a mensagem consolidada (serviço+data local+links) somente se a sessão estiver válida pelo guard 22h (inbound ≤ 22h).

### 5.2 Modo manual (`confirmationMode=manual_by_owner`)
1. Passos 1–2 iguais ao modo automático.
2. Backend cria evento `status="tentative"` com `extendedProperties.private.token` e registra `Appointment=status=TENTATIVE`.
3. Painel gera link seguro `approve?token=` para dono/staff aprovarem.
4. Aprovação → `events.patch` (`status="confirmed"`), `Appointment → CONFIRMED`, envio da confirmação no WhatsApp apenas se o guard 22h permitir (inbound ≤ 22h).
5. Rejeição ou timeout (`tentativeAutoCancelHours`) → remover evento, marcar `CANCELLED` e, se houver sessão ativa, avisar o cliente.

### 5.3 Expiração, cancelamento e reagendamento
- `holdTTLMinutes`: expira `PENDING` sem mensagem → `EXPIRED`, sem eventos criados.
- Cancelamentos vindos do cliente ou painel → `CANCELLED`, remover evento e, se o guard 22h permitir, responder com confirmação do cancelamento.
- Reagendamentos precisam solicitar uma nova mensagem do cliente caso a janela gratuita tenha fechado; fornecer CTA que abre `wa.me` com `ok` pré-preenchido.

### 5.4 Mensageria, consentimento e auditoria
- Persistir todas as mensagens em `MessageLog` (`direction`, `status`, `waMessageId`, `payload.raw`).
- Preencher/atualizar `consentAt` na primeira mensagem recebida.
- Validar opcionalmente `X-Hub-Signature-256` com `META_APP_SECRET`; logar divergências.
- Métricas mínimas: taxa de confirmação, tempo P95 de `PENDING→CONFIRMED`, bloqueios do guard 22h, % expirados.

### 5.5 Itens a remover/atualizar
- Remover integrações `zapi`/`twilio` e respectivas variáveis (`WHATS_PROVIDER`, `Z_API_*`, `TWILIO_*`).
- Atualizar mocks/tests para o payload da Cloud API.
- Ajustar copies/landing/painel para comunicar confirmação via WhatsApp Cloud API e janela operacional de 22h (margem de segurança).
- Expor no dashboard os estados `PENDING`, `TENTATIVE`, `CONFIRMED`, `CANCELLED` e `EXPIRED` com links para o log de mensagens.

## 6. Notificações e Lembretes
- `sendWhats` deve usar apenas WhatsApp Cloud API (Meta). Remover seletores de provedor; manter `mock` apenas para testes.
- Guard de envio de 22h: só enviar se houver mensagem inbound do cliente para o nosso número nas últimas 22h. Nunca iniciar conversa; sem templates/fallback.
- Cron de lembretes (`/api/cron/reminder`) deve consultar o SessionIndex e AttemptLog. Se a sessão não for válida (inbound > 22h, opt-out, plano), abortar o envio e registrar.
- Registrar cada envio/bloqueio: `MessageLog` (mensagens) e `AttemptLog` (bloqueios). Ajustar dependência de `@/lib/professionals` para usar dados do `LinkedCalendar`/`Account`.
- Fluxo de feedback pós-atendimento: aplicar o mesmo guard (22h) e não iniciar conversa.

### 6.1 Guard de envio (assinatura sugerida)

Assinatura textual: `canSendWhatsApp(tenantId, phoneE164, messageType) -> { allowed: boolean, reason?: string }`.

Ordem de checagem:
- Plano do tenant permite o tipo de envio? (ex.: lembretes habilitados no plano e nas preferências)
- Consentimento do cliente (`remindersOpt == "on"`)
- Sessão válida (`now - lastInboundAt <= 22h`)
- Roteamento do remetente correto (central ou BYON configurado)
- Franquia de mensagens disponível OU overage permitido (Starter/Pro)

## 7. Cobrança do SaaS e Painéis Internos
- Dashboard `/dashboard/plans` oferece upgrade, porém:
  - Integração com Stripe Checkout ausente (usa `client_secret` incorretamente).
  - Fluxo Pix não tem página para QR/status; não há polling para confirmar pagamento.
- Nada exibe histórico de pagamentos/assinaturas no dashboard, embora os dados estejam no Firestore.
- Downgrade automático em caso de Pix vencido depende de webhook manual; não há lógica auxiliar.

## 8. Persistência de Dados e Ambiente
- Firestore é opcional; sem credenciais os dados ficam em arquivos locais (ineficiente para produção multi-instância).
- Variáveis críticas: `DEFAULT_CALENDAR_TIMEZONE`, `APP_BASE_URL`, `NEXT_PUBLIC_APP_BASE_URL`, chaves Firebase, Stripe e WhatsApp Cloud API (`WA_META_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_WABA_ID`, `WA_VERIFY_TOKEN`, `WA_GRAPH_BASE`). Para pré-pagamento, incluir `paymentWebhookSecret` (por PSP) e valores padrão de `paymentWebhookTimeoutMinutes`.
- Adicionar `META_APP_SECRET` quando for implementar a validação da assinatura do webhook.
- Remover variáveis legadas de provedores (`WHATS_PROVIDER`, `Z_API_*`, `TWILIO_*`).

### 8.1 Dados de assinatura/uso por tenant
```json
{
  "tenantId": "uuid",
  "planId": "free | starter | pro",
  "currentPeriodStart": "ISO",
  "currentPeriodEnd": "ISO",
  "usage": {
    "appointmentsMonth": 0,
    "whatsAppMessagesMonth": 0
  },
  "billing": {
    "overageWhatsAppBRL": 0
  }
}
```
- Reset de `usage` no início de cada período; `overageWhatsAppBRL` exibido no painel (Starter/Pro).

## 9. Pendências Conhecidas
1. **Módulo de profissionais** removido mas ainda referenciado (rotas/cron/landing legacy quebrados).
2. **Disponibilidade** fixa em 60 min; ignora duração por serviço e horários de trabalho.
3. **UX de pagamento** incompleta (cartão/Pix) e ausência de histórico.
4. **Participantes Google**: só email do dono; cliente não recebe convite.
5. **Slug de agenda**: auto-link pode colidir; uso de random fallback limitado.
6. **Lembrete para dono**: cron usa dados inexistentes (profissional), logo aviso pode não sair.
7. **Feedback WhatsApp**: não implementado.
8. **Mensageria**: migrar totalmente para Cloud API (contratos/payloads novos) e remover referências a Z-API/Twilio.
9. **Tratamento de erros**: falhas de API Google ou WhatsApp não aparecem para o cliente; agendamento pode quebrar silenciosamente.
10. **Fusos horários**: apenas default global; nada configurável por agenda.
11. **Segurança**: cron acessível para qualquer sessão autenticada; ideal exigir token de serviço.

## 13. Cobrança e Excedentes (Contratos)
- Free: bloquear envios acima do incluído.
- Starter/Pro: permitir overage a `overage.whatsappMessageBRL`; exibir contadores em tempo real e consolidar no fechamento do ciclo.

Registro mínimo de faturamento (exemplo):
```json
{
  "tenantId": "uuid",
  "periodStart": "ISO",
  "periodEnd": "ISO",
  "planId": "starter",
  "basePriceBRL": 49,
  "whatsAppIncluded": 300,
  "whatsAppUsed": 420,
  "overageUnitBRL": 0.19,
  "overageQty": 120,
  "overageTotalBRL": 22.8,
  "totalBRL": 71.8
}
```

## 14. Flags e Erros Padrão
- `ERR_PLAN_LIMIT_REACHED` (appointments/calendars/messages)
- `ERR_PLAN_FEATURE_DISABLED` (ex.: lembretes/pagamento no ato)
- `ERR_WA_SESSION_TOO_OLD` (falha na regra 22h)
- `ERR_WA_OPT_OUT` (cliente desativou lembretes)
- `ERR_OVERAGE_NOT_ALLOWED` (Free tentando excedente)

## 15. Auditoria & LGPD (mínimo)
- Consentimento de lembretes no WhatsApp: armazenar `remindersOpt="on"`, `optSource` (ex.: botão/keyword) e `optAt` (ISO) por telefone+tenant.
- AttemptLog: manter motivos padronizados de bloqueio pelo guard (ex.: `NO_RECENT_INBOUND_22H`, `PLAN_DISABLED`, `OPT_OUT`).
- Retenção de logs por período razoável; anonimização quando aplicável; nenhum dado sensível de cartão deve ser armazenado.

## 10. Checklist para Fechar o Fluxo Atual
- [ ] Recriar metadados de profissional/serviço baseados nas agendas vinculadas.
- [ ] Ajustar `/api/availability` e formulários para usar duração por serviço e janelas de trabalho.
- [ ] Implementar corretamente o fluxo de pagamento SaaS (Stripe Elements/Checkout + Pix page) e exibir histórico.
- [ ] Dar visibilidade aos pagamentos em dashboards (filtros, exportação).
- [ ] Concluir migração para WhatsApp Cloud API (env vars, payloads, webhook `hub.verify_token`).
- [ ] Implementar pagamento no ato do agendamento: checkout obrigatório quando habilitado, webhook idempotente e atualização automática do Calendar.
- [ ] Implementar catálogo de planos (Free/Starter/Pro) com enforcement: limites de calendários/agendamentos/mensagens e overage.
- [ ] Exibir contadores de uso no dashboard (incluído, usado, excedente estimado) e erros padrão (ex.: `ERR_WA_SESSION_TOO_OLD`, `ERR_OVERAGE_NOT_ALLOWED`).
- [ ] Consertar cron de lembretes e fontes de dados do dono.
- [ ] Implementar fluxo de feedback pós-consulta via WhatsApp.
- [ ] Melhorar UX de reautenticação Google (tokens revogados, erros).
- [ ] Logar/monitorar falhas de WhatsApp.

## 11. Pagamento no Ato do Agendamento (pré-pagamento opcional)

### Objetivo
- Permitir que serviços/agendas cobrem antecipadamente e confirmem a reserva assim que o PSP sinalizar pagamento aprovado.
- Manter o botão "Abrir WhatsApp" como canal opcional para comunicações gratuitas, sem torná-lo obrigatório para concluir a confirmação.

### Extensões de Modelo
```ts
// ProviderSettings
paymentAtBookingEnabled: boolean; // default false
paymentProvider?: "stripe" | "mercadopago" | "pagarme" | "other";
paymentWebhookSecret?: string;
paymentWebhookTimeoutMinutes?: number; // default 15

// Service (opcional, para granularidade por serviço)
paymentAtBookingEnabled?: boolean;
paymentProvider?: "stripe" | "mercadopago" | "pagarme" | "other";
paymentCurrency?: string; // default BRL
paymentAmountCents?: number;

// Appointment
paymentRequired?: boolean;
paymentStatus?: "PENDING" | "REQUIRES_ACTION" | "PAID" | "FAILED" | "REFUNDED";
paymentProvider?: "stripe" | "mercadopago" | "pagarme" | "other";
paymentIntentId?: string | null;
paymentAmount?: number; // centavos
paymentCurrency?: string; // ex.: BRL
paidAt?: string | null;
refundAt?: string | null;
refundAmount?: number; // centavos
```
- Armazenar apenas IDs/valores; nunca persistir dados sensíveis de cartão (PCI).

### Regras de Negócio
1. **Confirmação imediata pós-pagamento**
   - Webhook do PSP com `status in ["paid", "approved"]` atualiza `Appointment.status = CONFIRMED`, `paymentStatus = PAID`, preenche `paidAt`, cria/atualiza evento no Google Calendar com `status="confirmed"` e `extendedProperties.private.paymentIntentId`.
   - Processamento idempotente usando `paymentIntentId`.
2. **Aprovação opcional do dono**
   - Painel/evento podem oferecer botão "Confirmar novamente". A ação deve ser idempotente, não alterando o estado se já estiver `CONFIRMED`.
3. **Fluxo WhatsApp**
- O CTA "Abrir WhatsApp" continua disponível para o cliente iniciar a sessão e permitir mensagens gratuitas dentro da janela operacional de 22h (inbound recente).
   - Não é obrigatório para concluir a confirmação quando o pagamento foi aprovado.
4. **Expiração do HOLD TTL**
   - Antes do checkout: segue `PENDING` com `holdTTLMinutes` padrão.
   - Ao iniciar checkout, estender TTL até `paymentWebhookTimeoutMinutes` (ex.: +15 min). Se o PSP não confirmar dentro da janela, marcar `EXPIRED` e liberar o slot.
5. **Cancelamento e reembolso**
   - Cancelamentos pós-pagamento devem atualizar `paymentStatus` (`REFUND_REQUESTED`/`REFUNDED` se adotados), registrar `refundAt`/`refundAmount` e refletir no Calendar.
   - Políticas de reembolso são configuráveis pelo Provider; ZapAgenda apenas registra o resultado.
6. **No-show**
   - `NO_SHOW` pode coexistir com pagamento concluído; eventuais multas/estornos parciais são tratados fora do escopo deste adendo.

### Contratos e Integração
- **Webhook PSP → ZapAgenda**: endpoint autenticado por `paymentWebhookSecret`. Eventos `paid|approved` confirmam o agendamento. Eventos `failed|canceled` marcam `paymentStatus=FAILED` mantendo `PENDING` até o TTL expirar.
- **Checkout**: `/api/appointment` deve retornar instruções do PSP (ex.: `client_secret`, `preferenceId`) quando `paymentRequired=true`, além de informar o tempo restante (`paymentWebhookTimeoutMinutes`).
- **Google Calendar**: utilizar o contrato existente, apenas garantindo `status="confirmed"` e armazenando `paymentIntentId` em `extendedProperties.private`.
- **Mensageria**: se houver sessão válida (guard 22h), enviar mensagem de confirmação pós-pagamento. Sem sessão válida, não enviar nada por WhatsApp.

### 11.1 Integração com Planos
- Se `features.paymentAtBooking == true` no plano do tenant e o serviço estiver com a opção ativada, confirmar automaticamente após `paid|approved`.
- Mensagem de confirmação no WhatsApp somente se o guard 22h permitir; aprovação manual do Provider continua opcional e idempotente.

### Segurança e Compliance
- Validar a assinatura/secret de todos os webhooks do PSP.
- Registrar consentimento e termos de reembolso aceitos pelo cliente.
- Garantir que nenhuma informação de cartão passe pelo backend (usar checkout hospedado ou SDKs do PSP).

### Estados e Transições (pagamento habilitado)
```
PENDING --(checkout iniciado)-------------> PENDING (TTL estendido)
PENDING --(PSP paid/approved)------------> CONFIRMED (paymentStatus=PAID)
PENDING --(TTL expira sem pagar)---------> EXPIRED
CONFIRMED --(cancel + refund aprovado)-> CANCELLED (paymentStatus=REFUNDED opcional)
```
- Aprovação manual continua opcional e idempotente após confirmação via pagamento.

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
   - Completar a migração para WhatsApp Cloud API: remover código legado, validar webhook (`hub.verify_token`/`X-Hub-Signature-256`) e ajustar mensageria PENDING/TENTATIVE/CONFIRMED.
   - Revisar a segurança das rotas sensíveis (cron, APIs internas) adicionando token de serviço quando necessário.
   - Melhorar o tratamento de erros e os logs em integrações externas (Google e WhatsApp).

3. **Entregar o pagamento no ato do agendamento**
   - Estender `ProviderSettings`/`Service`/`Appointment` com campos `paymentAtBookingEnabled`, `paymentStatus`, `paymentIntentId`, etc.
   - Ajustar `/api/appointment` para sinalizar `paymentRequired`, devolver credenciais de checkout e estender o `holdTTL` enquanto o pagamento está em curso.
   - Implementar webhook do PSP (Stripe/MercadoPago/Pagar.me) validando assinatura, confirmando automaticamente o evento no Google Calendar e registrando `paidAt`/`refundAt`.
   - Atualizar dashboard/painel para exibir status de pagamento (`PENDING`, `PAID`, `FAILED`, `REFUNDED`) e ações de cancelamento/reembolso.

4. **Automação pós-atendimento e experiência do cliente**
   - Implementar o fluxo de feedback via WhatsApp.
   - Adicionar convites por e-mail (cliente como attendee) e melhorias de UX nas telas públicas.

5. **Relatórios e finalização**
   - Exportações CSV, visões de faturamento e painéis consolidados.
   - Revisar documentação, `.env` e instruções de deploy.

Seguir essa ordem minimiza retrabalho: primeiro estabiliza o core de agendamento, depois corrige monetização existente, em seguida adiciona o novo pré-pagamento (que depende das etapas anteriores) e, por fim, trabalha na camada de experiências avançadas e relatórios.
