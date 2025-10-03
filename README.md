# ZapAgenda

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


Last updated: 2025-10-03 09:00

[![Deployed on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mgotze/zapagenda)

## Atualizações recentes (Out/2025)

- WhatsApp Cloud API (Meta) habilitado; Z-API/Twilio removidos. Variáveis: `WA_META_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_WABA_ID`, `WA_VERIFY_TOKEN`, `WA_GRAPH_BASE`.
- Regra operacional de 22h: só respondemos se houve inbound ≤ 22h; nunca iniciamos conversa.
- Pagamento no ato (opcional): `paymentAtBookingEnabled` confirma automaticamente após webhook `paid|approved`.
- Novos planos: Free (R$ 0), Starter (R$ 49), Pro (R$ 99) com limites por plano (calendários, agendamentos/mês, mensagens WhatsApp incluídas) e overage por mensagem no Starter/Pro.
- Build/deploy seguem com Yarn Classic (`yarn install`, `yarn dev`, `yarn build`).

## Próximos passos

- Substituir o código legado do provedor WhatsApp pelos contratos Meta: remover chamadas `Z_API_*`, `WHATS_PROVIDER=zapi` e adaptar payloads para `messages`/`entry.changes`.
- Rodar `yarn build` e validar um deploy pós-alterações (Stripe/Pix + ícone do calendário).
- Garantir que o webhook `/api/webhooks/wa` valide `hub.verify_token` e registre mensagens (entrada/saída) com consentimento LGPD.
- Implementar o checkout obrigatório quando `paymentAtBookingEnabled=true`, garantindo confirmação automática e idempotente após o webhook do PSP.
- Atualizar vitrine/landing para refletir Free/Starter/Pro, limites e overage.
- Testar em staging o downgrade automático: simular falha/cancelamento de cobrança e checar agendas bloqueadas.
- Criar dashboards métricos para monitorar upgrades/downgrades e custos de mensagens (sem templates), taxa de bloqueios pelo guard 22h.

## Getting Started

First, run the development server (Yarn Classic only):

```bash
yarn install
yarn dev
```

> ⚠️ Utilizamos apenas Yarn 1 (`1.22.x`). Evite `npm`, `pnpm` ou `bun` para não quebrar o lockfile e o build em produção.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Local testing quickstart

1. Copie `.env.local.example` para `.env.local` (ou `.env.example` caso prefira) e ajuste os valores. Para testes locais sem integração real, use valores fictícios para `WA_META_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_WABA_ID`, defina `paymentWebhookSecret` dummy e mantenha `DASHBOARD_TOKEN=localtoken`. Remova `WHATS_PROVIDER` do template assim que o código migrar totalmente para Cloud API.
2. Configure Firebase:
   - **Admin SDK**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (service account) para Firestore.
   - **Client/Web SDK**: chaves `NEXT_PUBLIC_FIREBASE_*` geradas ao criar um app Web no console (ex.: `NEXT_PUBLIC_FIREBASE_API_KEY`). Sem elas o login não carrega.
3. Inicie o projeto com `yarn dev` e acesse:
   - Landing page: `http://localhost:3000/` (fluxo já preparado para produção, com CTA de login).
   - Página do profissional demo: `http://localhost:3000/demo` (crie agendamentos → `/api/appointment`).
   - Login/Dashboard: `http://localhost:3000/login` (use um usuário criado no Firebase Auth). A tela aceita e-mail/senha ou Google; habilite o provedor Google no painel do Firebase Auth para permitir o login social. Após autenticar, gerencie agendas em `/dashboard` e `/dashboard/professionals`.
4. Para acionar manualmente o lembrete de WhatsApp, execute `yarn cron:reminder`. Caso use token de serviço, envie `Authorization: Bearer <DASHBOARD_TOKEN>`; senão, autentique via Firebase e use um ID token válido.
5. Verifique os resultados:
   - Leads em dev: arquivo `leads.dev.json`.
   - Agendamentos locais: `data/appointments.json` (criado automaticamente).
   - Logs do provedor mock: console do servidor (`[whats:mock]`).

### Checklist de testes manuais

Execute os passos abaixo sempre que configurar um novo ambiente ou antes de fazer deploy:

1. **Seed inicial** — Com Firebase configurado (ou somente arquivos locais), rode `yarn seed:professionals` e confira se os profissionais aparecem na coleção/JSON.
2. **Lead** — Na landing (`/`), envie um e-mail; confirme a resposta 200 e a presença do registro no Firestore (`leads`) ou `leads.dev.json`.
3. **Agendamento** — Em `/demo`, crie um agendamento com dados de teste. Verifique:
   - resposta `ok: true`;
   - log `[whats:mock]` no terminal (ou mensagem real se estiver usando um provedor).
4. **Dashboard** — Autentique-se em `/login` e valide no `/dashboard` se o agendamento recém-criado aparece, testando filtros por profissional, serviço, período e busca. Ajuste dados do profissional em `/dashboard/professionals`.
5. **Cron** — Execute `yarn cron:reminder`; se houver agendamentos dentro da janela configurada, o comando deve registrar envios e marcar `reminderSentAt` no dashboard.
6. **Rate limit** — Use o formulário de lead repetidamente para garantir que o erro 429 seja retornado após exceder o limite (opcional, mas recomendado).

## Firebase & produção

1. Gere uma Service Account com acesso ao Firebase Admin e preencha `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` em `.env.local` (não comite esse arquivo).
2. Aplique as regras/base de índices fornecidas neste repositório:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes --project <seu-projeto>
   ```
   (ou use o painel web copiando `firebase/firestore.rules` e `firebase/firestore.indexes.json`).
3. Popular a coleção de profissionais diretamente do JSON local:
   ```bash
   yarn seed:professionals
   ```
   O script utiliza as credenciais Admin e grava/atualiza documentos `professionals/{slug}`.
4. Configure OAuth do Google (agendas):
   - Defina `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` nas variáveis de ambiente.
   - Opcional: `GOOGLE_REDIRECT_URI` (padrão é `${APP_BASE_URL}/api/google/oauth/callback`).
   - No console de APIs do Google, autorize o URI de redirecionamento.
   - Após autenticar no app, acesse `Dashboard → Minha agenda` e clique em “Conectar com Google” para listar e vincular calendários.
5. Configure um agendador para chamar `/api/cron/reminder` em produção (ex.: Vercel Scheduler ou Cloud Scheduler). Exemplo Vercel:
   - URL: `https://seu-dominio.vercel.app/api/cron/reminder`
   - Método: `POST`
   - Cabeçalho: `Authorization: Bearer <DASHBOARD_TOKEN>`
   - Frequência: conforme necessidade (ex.: a cada 15 minutos).
6. Ajuste os parâmetros de lembrete (`REMINDER_WINDOW_MINUTES`, `REMINDER_NOTIFY_OWNER`) e configure as credenciais do WhatsApp Cloud API no `.env` (`WA_META_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_WABA_ID`, `WA_VERIFY_TOKEN`, `WA_GRAPH_BASE=https://graph.facebook.com/v20.0`). Remova variáveis antigas de provedores descontinuados (Z-API/Twilio).

### Novas regras de confirmação via WhatsApp (janela de segurança 22h)

- `Appointment` nasce como `PENDING`; ao receber mensagem do cliente dentro do `holdTTL` vira `CONFIRMED` (modo automático) ou `TENTATIVE` (modo manual) até aprovação.
- Sempre gerar o link `wa.me/{numero}?text=CONFIRMAR%20{TOKEN}%20{DATA_LOCAL}` ao final do agendamento; nunca iniciar conversa. Somente enviar mensagens quando houver inbound do cliente nas últimas 22h.
- Removido o uso de templates pagos/fallback: se passaram 22h sem inbound, não enviar nada por WhatsApp.
- Logue todas as mensagens na coleção `MessageLog` com direção/status e `waMessageId` para garantir rastreabilidade.

### Guard de envio (22h) e auditoria

- Antes de qualquer envio (confirmação, lembrete), verificar: plano permite, consentimento do cliente, e sessão válida (inbound ≤ 22h) para o número correto (central/BYON).
- Modelos auxiliares:
  - SessionIndex: `{ phoneE164, tenantId, lastInboundAt, lastOutboundAt, remindersOpt }`.
  - AttemptLog: `{ attemptedAt, tenantId, phoneE164, type, allowed, reason }`.

### Pagamento no ato do agendamento (opcional)

- Habilite via `ProviderSettings.paymentAtBookingEnabled` ou por serviço; defina `paymentProvider`, `currency`/`amount` (centavos) e `paymentWebhookSecret`.
- `/api/appointment` deve sinalizar `paymentRequired=true` e devolver dados de checkout (ex.: `client_secret`) quando a flag estiver ativa.
- O PSP chama o webhook com `status in ["paid","approved"]`; confirmar `Appointment` e evento Google imediatamente (`status="confirmed"`, `paymentIntentId`).
- Mantenha `holdTTLMinutes` até o checkout; ao iniciar o pagamento, estenda até `paymentWebhookTimeoutMinutes` para evitar expiração prematura.
- Cancelamentos pagos devem registrar `refundAmount`, `refundAt` e, quando aplicável, ajustar `paymentStatus=REFUNDED`.
