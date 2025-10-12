# 🚀 Guia de Preenchimento - Variáveis de Ambiente

## ✅ Já Preenchidas

- `GOOGLE_CLIENT_ID` ✅
- `GOOGLE_CLIENT_SECRET` ✅
- `NEXT_PUBLIC_BASE_URL` ✅
- `SESSION_COOKIE_NAME` ✅
- `NODE_ENV` ✅

---

## 🔴 Próximos Passos - Ordem de Prioridade

### 1️⃣ **FIREBASE** (Essencial - 15 min)

**Onde encontrar:**
1. Acesse: https://console.firebase.google.com
2. Crie novo projeto (ou use existente)
3. Project Settings (⚙️) > General

**Variáveis:**
```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=       # Ex: agende-mais-prod
NEXT_PUBLIC_FIREBASE_API_KEY=          # Ex: AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=      # Ex: agende-mais-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=   # Ex: agende-mais-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=  # Ex: 123456789
NEXT_PUBLIC_FIREBASE_APP_ID=           # Ex: 1:123456:web:abc123
```

---

### 2️⃣ **FIREBASE ADMIN SDK** (Essencial - 5 min)

**Onde encontrar:**
1. Firebase Console > Project Settings (⚙️)
2. Service Accounts tab
3. Click "Generate New Private Key"
4. Baixa um arquivo JSON

**Como usar:**
```bash
# Opção 1: JSON em uma linha (remova quebras de linha)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Opção 2: Criar arquivo separado e referenciar
# Salve como firebase-admin-key.json e configure no código
```

---

### 3️⃣ **SESSION SECRET** (Essencial - 1 min)

**Gerar:**
```bash
# No terminal:
openssl rand -base64 32
```

**Adicionar:**
```bash
SESSION_SECRET=sua_string_aleatoria_gerada_aqui
```

---

### 4️⃣ **STRIPE** (Pagamentos - 10 min)

**Onde encontrar:**
1. Acesse: https://dashboard.stripe.com
2. Developers > API Keys

**Variáveis:**
```bash
STRIPE_SECRET_KEY=sk_live_...          # Use sk_test_... para testes
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Use pk_test_... para testes
```

**Webhook Secret:**
1. Developers > Webhooks
2. Add endpoint: `https://zap-agenda.onrender.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`
4. Copie o Signing Secret

**Produtos (criar manualmente no Stripe):**
```bash
STRIPE_PRICE_ID_BASIC=price_...        # Produto Básico
STRIPE_PRICE_ID_PRO=price_...          # Produto Pro
STRIPE_PRICE_ID_PREMIUM=price_...      # Produto Premium
```

---

### 5️⃣ **WHATSAPP** (Opcional - se usar notificações)

**Onde encontrar:**
1. Meta for Developers: https://developers.facebook.com
2. WhatsApp > Getting Started

```bash
WHATSAPP_ACCESS_TOKEN=EAAxxxxx...
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_VERIFY_TOKEN=sua_string_secreta  # Você define isso
```

---

### 6️⃣ **RATE LIMITING** (Opcional - recomendado)

**Recomendação:** Use Upstash (tem plano grátis)
1. Acesse: https://upstash.com
2. Crie Redis database
3. Copy REST URL e Token

```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AxxxYyy...
```

---

## 📋 Checklist de Deploy

### Antes de subir para produção:

- [ ] Firebase projeto criado
- [ ] Firestore Database criado (modo production)
- [ ] Firestore Rules configuradas
- [ ] Google Calendar API habilitada no Google Cloud
- [ ] OAuth Consent Screen configurado
- [ ] OAuth Client criado e callbacks configurados
- [ ] Service Account criado e baixado
- [ ] Stripe configurado (ou modo test)
- [ ] Session secret gerado
- [ ] Todas variáveis preenchidas no Render.com
- [ ] Build local funcionando (`yarn build`)

### Após deploy:

- [ ] Testar login com Google
- [ ] Testar criação de agendamento
- [ ] Testar sincronização com Google Calendar
- [ ] Testar pagamento (modo test primeiro!)
- [ ] Verificar logs no Render.com
- [ ] Testar em diferentes navegadores

---

## 🔧 Comandos Úteis

### Testar localmente:
```bash
# Copie o template
cp .env.production.template .env.local

# Preencha as variáveis
nano .env.local

# Teste
yarn dev
```

### Deploy no Render.com:
```bash
# Não precisa fazer nada - Render pega do Git automaticamente
# Mas configure as Environment Variables no dashboard do Render
```

### Verificar build:
```bash
yarn build
```

---

## ⚠️ IMPORTANTE

1. **NUNCA** commite arquivos `.env` no Git
2. **SEMPRE** use `.env.production.template` como referência
3. **TESTE** em ambiente local antes de produção
4. **BACKUP** das credenciais em local seguro (1Password, Bitwarden, etc)
5. **ROTATE** secrets periodicamente (a cada 6 meses)

---

## 🆘 Problemas Comuns

### "Error: GOOGLE_CLIENT_ID is not defined"
→ Variável não configurada no Render.com

### "Firebase: Error (auth/invalid-api-key)"
→ API Key incorreta ou projeto errado

### "Stripe: No such price"
→ Price ID não existe no Stripe ou está no modo errado (test vs live)

### "OAuth redirect_uri_mismatch"
→ URI não está cadastrada no Google Cloud Console

---

**Precisa de ajuda com algum passo específico?** 😊
