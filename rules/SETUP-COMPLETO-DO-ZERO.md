# 🚀 Setup Completo do Zero - Agende Mais

## 📋 Visão Geral

Você vai criar uma **infraestrutura completamente nova** para o Agende Mais:
- ✅ Nova conta Google/Gmail
- ✅ Novo projeto Google Cloud
- ✅ Novo projeto Firebase
- ✅ Todas as APIs configuradas
- ✅ OAuth configurado corretamente
- ✅ Variáveis de ambiente organizadas

**Tempo estimado:** 30-40 minutos

---

## 📧 Passo 1: Criar Nova Conta Google (5 min)

### 1.1 Criar E-mail Profissional

**Opção A - Gmail:**
```
Acesse: https://accounts.google.com/signup
```

**Sugestões de e-mail:**
- `contato@agendemais.com` (se tiver domínio próprio)
- `agendemais.app@gmail.com`
- `contato.agendemais@gmail.com`
- `app.agendemais@gmail.com`

**Dados para preencher:**
- Nome: `Agende Mais`
- E-mail: Escolha um profissional
- Senha: Use gerenciador de senhas (min. 12 caracteres)
- Telefone: Seu número para recuperação
- E-mail de recuperação: Seu e-mail pessoal

### 1.2 Configurar 2FA (Recomendado)

1. Acesse: https://myaccount.google.com/security
2. Ative **"Verificação em duas etapas"**
3. Configure aplicativo autenticador (Google Authenticator, Authy, etc.)

---

## ☁️ Passo 2: Criar Projeto Google Cloud (10 min)

### 2.1 Criar Novo Projeto

**Acesse:**
```
https://console.cloud.google.com/projectcreate
```

**Configuração:**
```
Nome do projeto: Agende Mais
ID do projeto: agende-mais-XXXXX (será gerado automaticamente)
Organização: Sem organização (se não tiver)
```

**Anote o Project ID!** Exemplo: `agende-mais-123456`

### 2.2 Habilitar APIs Necessárias

Acesse cada link abaixo e clique em **"ATIVAR"**:

#### Google Calendar API (OBRIGATÓRIO)
```
https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
```

#### Google+ API (para informações do usuário)
```
https://console.cloud.google.com/apis/library/plus.googleapis.com
```

#### People API (para perfil do usuário)
```
https://console.cloud.google.com/apis/library/people.googleapis.com
```

**Aguarde 2-3 minutos** para as APIs propagarem.

### 2.3 Configurar OAuth Consent Screen

**Acesse:**
```
https://console.cloud.google.com/apis/credentials/consent
```

**Configuração:**

#### Tipo de usuário:
```
○ Interno (só para workspace Google - NÃO)
● Externo (qualquer conta Google - SIM)
```

Clique em **"CRIAR"**

#### Informações do app:

```
Nome do app: Agende Mais

E-mail de suporte do usuário: [seu novo email]

Logotipo do app: (OPCIONAL - pode adicionar depois)
```

#### Domínio do app:

```
Domínio da página inicial do app:
https://zap-agenda.onrender.com

Link da política de privacidade:
https://zap-agenda.onrender.com/privacidade

Link dos termos de serviço:
https://zap-agenda.onrender.com/termos
```

#### Domínios autorizados:

```
zap-agenda.onrender.com
agende-mais-XXXXX.firebaseapp.com (substitua XXXXX pelo ID do Firebase)
```

#### Informações de contato do desenvolvedor:

```
[seu novo email]
```

Clique em **"SALVAR E CONTINUAR"**

#### Escopos:

Clique em **"ADICIONAR OU REMOVER ESCOPOS"**

**Marque estes escopos:**
```
✅ .../auth/userinfo.email
✅ .../auth/userinfo.profile
✅ openid
```

**Adicione manualmente estes escopos do Calendar:**
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
```

Cole cada um na caixa de texto e clique em **"ADICIONAR À TABELA"**

Clique em **"ATUALIZAR"** → **"SALVAR E CONTINUAR"**

#### Usuários de teste:

**Adicione seu e-mail pessoal** (para testar antes de publicar)

Clique em **"SALVAR E CONTINUAR"**

#### Resumo:

Revise tudo e clique em **"VOLTAR AO PAINEL"**

### 2.4 Criar OAuth Client ID

**Acesse:**
```
https://console.cloud.google.com/apis/credentials
```

**Passos:**

1. Clique em **"+ CRIAR CREDENCIAIS"**
2. Selecione **"ID do cliente OAuth"**

**Configure:**

```
Tipo de aplicativo: Aplicativo da Web

Nome: Agende Mais - Web Client

Origens JavaScript autorizadas:
http://localhost:3000
https://agende-mais-XXXXX.firebaseapp.com
https://zap-agenda.onrender.com

URIs de redirecionamento autorizados:
https://agende-mais-XXXXX.firebaseapp.com/__/auth/handler
https://zap-agenda.onrender.com/api/google/oauth/callback
```

**⚠️ SUBSTITUA `XXXXX` pelo ID real do seu Firebase Project!**

3. Clique em **"CRIAR"**

**💾 COPIE E SALVE:**
```
Client ID: 123456789-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
Client Secret: GOCSPX-XXXXXXXXXXXXXXXXXXXX
```

**⚠️ GUARDE ESSES VALORES COM SEGURANÇA!**

---

## 🔥 Passo 3: Criar Projeto Firebase (10 min)

### 3.1 Criar Projeto Firebase

**Acesse:**
```
https://console.firebase.google.com/
```

**Passos:**

1. Clique em **"Adicionar projeto"**
2. Nome: `Agende Mais`
3. **IMPORTANTE:** Selecione **"Usar um projeto existente do Google Cloud"**
4. Escolha o projeto: `agende-mais-XXXXX`
5. Confirme o plano Blaze (NECESSÁRIO para Functions)
6. Aceite os termos
7. Clique em **"Criar projeto"**

**Aguarde 1-2 minutos...**

### 3.2 Registrar Aplicativo Web

Na tela inicial do Firebase:

1. Clique no ícone **"</>  Web"**
2. Apelido: `Agende Mais Web`
3. **✅ Marque:** "Configurar também o Firebase Hosting"
4. Clique em **"Registrar app"**

**💾 COPIE AS CREDENCIAIS:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "agende-mais-XXXXX.firebaseapp.com",
  projectId: "agende-mais-XXXXX",
  storageBucket: "agende-mais-XXXXX.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:XXXXXXXXXXXXXXXX"
};
```

**⚠️ GUARDE ESSES VALORES!**

Clique em **"Continuar no console"**

### 3.3 Habilitar Authentication

**Acesse:**
```
https://console.firebase.google.com/project/SEU_PROJECT_ID/authentication
```

1. Clique em **"Começar"**
2. Clique em **"Google"** (na lista de provedores)
3. **Ative** o switch
4. Configure:

```
Nome público do projeto: Agende Mais

E-mail de suporte do projeto: [seu novo email]

ID do cliente da Web (opcional):
[Cole o Client ID do Google Cloud criado no Passo 2.4]

Chave secreta do cliente da Web (opcional):
[Cole o Client Secret do Google Cloud criado no Passo 2.4]
```

5. Clique em **"Salvar"**

### 3.4 Configurar Firestore Database

**Acesse:**
```
https://console.firebase.google.com/project/SEU_PROJECT_ID/firestore
```

1. Clique em **"Criar banco de dados"**
2. Modo: **"Modo de produção"** (vamos configurar regras depois)
3. Local: **"southamerica-east1 (São Paulo)"**
4. Clique em **"Ativar"**

**Aguarde 1-2 minutos...**

### 3.5 Criar Service Account (para Admin SDK)

**Acesse:**
```
https://console.firebase.google.com/project/SEU_PROJECT_ID/settings/serviceaccounts/adminsdk
```

1. Clique em **"Gerar nova chave privada"**
2. Confirme clicando em **"Gerar chave"**
3. **Baixe o arquivo JSON**
4. **⚠️ RENOMEIE para:** `firebase-service-account.json`
5. **⚠️ NUNCA COMMITE ESSE ARQUIVO NO GIT!**

---

## 📦 Passo 4: Configurar Variáveis de Ambiente (5 min)

### 4.1 Criar Arquivo .env.local

No seu projeto, crie o arquivo `.env.local`:

```bash
# Firebase Client (NEXT_PUBLIC = visível no browser)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agende-mais-XXXXX.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agende-mais-XXXXX
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agende-mais-XXXXX.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:XXXXXXXXXXXXXXXX

# Firebase Admin (Server-side ONLY)
FIREBASE_PROJECT_ID=agende-mais-XXXXX
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@agende-mais-XXXXX.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXXX\n-----END PRIVATE KEY-----\n"

# Ou use o arquivo JSON completo (melhor opção):
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"agende-mais-XXXXX",...}

# Google OAuth (Server-side)
GOOGLE_CLIENT_ID=123456789-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXX

# Stripe (caso use)
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXX

# WhatsApp Business API (se usar)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=

# URL Base da Aplicação
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
```

### 4.2 Adicionar ao .gitignore

Verifique se `.env.local` está no `.gitignore`:

```gitignore
# Environments
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
firebase-service-account.json
*-service-account.json
```

### 4.3 Configurar no Render.com

**Acesse:**
```
https://dashboard.render.com/web/SEU_SERVICE/env
```

**Adicione TODAS as variáveis** (exceto as que começam com `NEXT_PUBLIC_` - essas vão no `.env.local` e build):

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

**Para as variáveis NEXT_PUBLIC_**, adicione também no Render em formato de **Build Command**:

```bash
Build Command:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza... NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agende... npm run build
```

Ou configure como variáveis de ambiente normais (Render vai injetá-las no build).

---

## 🔧 Passo 5: Atualizar Código do Projeto (5 min)

### 5.1 Atualizar firebaseClient.ts

Abra `src/lib/firebaseClient.ts` e atualize:

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa apenas se não existir
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
```

### 5.2 Verificar firebaseAdmin.js

Certifique-se de que usa a variável correta:

```javascript
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
);
```

---

## ✅ Passo 6: Testar Tudo (10 min)

### 6.1 Testar Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

**Abra:** http://localhost:3000

**Testes:**
- [ ] Página carrega sem erros
- [ ] Ir para `/login`
- [ ] Clicar em "Entrar com Google"
- [ ] Tela OAuth mostra "Agende Mais"
- [ ] Login completa com sucesso
- [ ] Redirecionamento funciona
- [ ] Dashboard carrega

### 6.2 Verificar Firestore

**Acesse:**
```
https://console.firebase.google.com/project/SEU_PROJECT_ID/firestore/data
```

Após fazer login, verifique se criou:
- [ ] Coleção `users`
- [ ] Documento com seu UID
- [ ] Dados do perfil

### 6.3 Deploy para Produção

```bash
# Fazer commit
git add .
git commit -m "feat: migração completa para novo Firebase e Google Cloud"

# Push (Render vai fazer auto-deploy)
git push origin main
```

**Aguarde 5-10 minutos** para o deploy completar.

### 6.4 Testar em Produção

**Acesse:** https://zap-agenda.onrender.com/login

**Testes:**
- [ ] Login com Google funciona
- [ ] Nome "Agende Mais" aparece
- [ ] Dashboard carrega
- [ ] Criar calendário funciona
- [ ] Agendamentos funcionam

---

## 📝 Checklist Final

### Google Cloud
- [ ] Projeto criado: `agende-mais-XXXXX`
- [ ] Calendar API habilitada
- [ ] OAuth Consent configurado
- [ ] OAuth Client criado
- [ ] Credentials anotadas

### Firebase
- [ ] Projeto criado e linkado ao Google Cloud
- [ ] App Web registrado
- [ ] Authentication Google habilitada
- [ ] Firestore Database criado
- [ ] Service Account baixado

### Código
- [ ] `.env.local` configurado
- [ ] `.gitignore` atualizado
- [ ] `firebaseClient.ts` atualizado
- [ ] Variáveis no Render.com configuradas

### Testes
- [ ] Login local funciona
- [ ] Login produção funciona
- [ ] Firestore salvando dados
- [ ] OAuth mostra "Agende Mais"

---

## 🎯 Próximos Passos

Após tudo funcionando:

1. **Publicar OAuth App** (remover modo teste)
2. **Configurar domínio customizado** (opcional)
3. **Configurar Firestore Rules** (segurança)
4. **Configurar Storage Rules** (se usar uploads)
5. **Habilitar Analytics** (monitoramento)

---

## 🆘 Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique URIs no OAuth Client
- Aguarde 5 minutos após alterações

### Erro: "invalid_client"
- Confira Client ID no Render.com
- Confira Client Secret no Render.com
- Certifique-se que são do MESMO OAuth Client

### Erro: "Firebase: Error (auth/configuration-not-found)"
- Verifique variáveis NEXT_PUBLIC_FIREBASE_*
- Reconstrua o app (`npm run build`)

### Firestore retorna vazio
- Verifique regras do Firestore
- Verifique Service Account Key

---

## 📞 Documentação Oficial

- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

✅ **Parabéns!** Você agora tem uma infraestrutura completamente nova e profissional para o Agende Mais! 🎉
