# 🧭 Onde Estou Agora - Checklist de Configuração

> **Respira fundo ☕** Vamos organizar tudo que você está fazendo

---

## 📋 Status Atual das Configurações

### ✅ Já Configurado (Antes)

```
✓ Projeto Next.js rodando
✓ Firebase projeto criado (zapagenda-3e479)
✓ Código funcionando em desenvolvimento
✓ Git configurado
✓ Render deploy configurado (provavelmente)
```

---

## 🔄 Configurando AGORA (Você está aqui)

### 1. Google Cloud Console

**O que fazer:**
```
☐ Criar OAuth Client ID para Google Calendar
  URL: https://console.cloud.google.com/apis/credentials
  
  Escolha na tela atual:
  ( ● ) Dados do usuário  ← MARQUE ESTA
  (   ) Dados do aplicativo
  
☐ Preencher formulário:
  - Tipo: Aplicativo da Web
  - Nome: DaTempo OAuth Client
  - Origens autorizadas: (descubra URL do Render)
  - Redirect URIs: (descubra URL do Render + /api/google/oauth/callback)
  
☐ Copiar credenciais:
  - Client ID
  - Client Secret
```

**Documentação:** `/docs/OAUTH-RENDER-RESPOSTA-IMEDIATA.md`

---

### 2. Firebase Console (Múltiplas Coisas)

#### A. Firestore Database

**Você está fazendo agora:**
```
☐ Create database
☐ Database ID: (default) ← OK, deixar assim
☐ Location: nam5 (United States) ← OK, CONFIRMAR
☐ Start mode: [Production/Test] ← ???
```

**⚠️ ATENÇÃO:** 
- Location **NÃO PODE MUDAR** depois
- `nam5` é bom se usuários forem dos EUA
- Se usuários do Brasil: considere `southamerica-east1`

**Minha recomendação:**
```
Database ID: (default)
Location: southamerica-east1 (São Paulo) ← Melhor para Brasil
Start mode: Test mode (por enquanto)
```

---

#### B. Firebase Authentication

**Ainda precisa fazer:**
```
☐ Build → Authentication
☐ Sign-in method → Google
☐ Ativar Google sign-in
☐ Web SDK configuration:
  - Use custom OAuth Client
  - Client ID: [mesmo do Google Calendar]
  - Client Secret: [mesmo do Google Calendar]
```

**Documentação:** `/docs/FIREBASE-AUTH-GOOGLE-FIX.md`

---

#### C. Firebase Admin SDK (Service Account)

**Ainda precisa fazer:**
```
☐ Project Settings (⚙️)
☐ Service Accounts tab
☐ Generate New Private Key
☐ Baixar arquivo .json
☐ Extrair 3 variáveis:
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL  
  - FIREBASE_PRIVATE_KEY
```

---

#### D. Firebase Client SDK (Config Pública)

**Ainda precisa fazer:**
```
☐ Project Settings (⚙️)
☐ Your apps → Web app
☐ Copiar config:
  - NEXT_PUBLIC_FIREBASE_API_KEY
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - NEXT_PUBLIC_FIREBASE_APP_ID
```

---

### 3. Render Dashboard

**Ainda precisa fazer:**
```
☐ Descobrir URL do seu serviço (.onrender.com)
☐ Configurar Environment Variables:
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - APP_BASE_URL
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY
  - NEXT_PUBLIC_FIREBASE_API_KEY
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## 🎯 Ordem Recomendada (Passo a Passo)

### Faça AGORA (em ordem):

```
1. Firebase Firestore Database
   ├─ Location: southamerica-east1 (Brasil)
   ├─ Start mode: Test mode
   └─ Create database
   
2. Firebase Client SDK (Config)
   ├─ Project Settings → Your apps
   ├─ Copiar todas variáveis NEXT_PUBLIC_*
   └─ Salvar num arquivo temporário
   
3. Firebase Admin SDK (Service Account)
   ├─ Project Settings → Service Accounts
   ├─ Generate New Private Key
   ├─ Baixar .json
   └─ Salvar num arquivo temporário
   
4. Google Cloud Console (OAuth)
   ├─ Descobrir URL do Render PRIMEIRO
   ├─ Criar OAuth Client ID
   ├─ Escolher "Dados do usuário"
   ├─ Preencher formulário
   └─ Copiar Client ID e Secret
   
5. Firebase Authentication (Google)
   ├─ Authentication → Google → Enable
   ├─ Web SDK: Use custom OAuth Client
   ├─ Colar Client ID/Secret (do passo 4)
   └─ Salvar
   
6. Render Environment Variables
   ├─ Colar TODAS variáveis
   └─ Save Changes (auto-deploy)
```

---

## 🆘 Você está AGORA na tela do Firestore?

**Se SIM:**

```
ANTES DE CLICAR "CREATE":

Pergunta: Seus usuários são principalmente do Brasil?

( ) Sim → Location: southamerica-east1 (São Paulo)
( ) Não → Location: nam5 (United States)

Start mode: Test mode (pode mudar depois)

Database ID: (default) ← Deixar assim mesmo
```

**Se NÃO:**

```
Me diga em qual tela você está que eu te guio!

Opções:
1. Firebase Console - Firestore
2. Google Cloud Console - OAuth
3. Render Dashboard
4. Outra
```

---

## 📝 Template para Organizar Credenciais

**Crie um arquivo temporário (NÃO COMMITAR!):**

```bash
# CREDENCIAIS-TEMPORARIO.txt (DELETE DEPOIS!)

# ━━━━ GOOGLE OAUTH ━━━━
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ━━━━ FIREBASE ADMIN ━━━━
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# ━━━━ FIREBASE CLIENT ━━━━
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ━━━━ RENDER ━━━━
APP_BASE_URL=https://[SEU-APP].onrender.com
```

À medida que for copiando, cole aqui. No final, copia tudo pro Render.

---

## 🧘 Dica: Faça Um de Cada Vez

**NÃO tente fazer tudo junto!**

```
1. Terminar Firestore (1 min)
2. Pausar, respirar ☕
3. Copiar Firebase Client (2 min)
4. Pausar, respirar ☕
5. Copiar Firebase Admin (2 min)
6. Pausar, respirar ☕
7. OAuth Google (5 min)
8. Pausar, respirar ☕
9. Firebase Auth (3 min)
10. Pausar, respirar ☕
11. Render Variables (5 min)
12. PRONTO! 🎉
```

**Total:** 20 minutos (com pausas!)

---

## 🎯 Me Diga:

**1. Você está AGORA na tela do Firestore criando database?**
   - ( ) Sim → Te oriento sobre Location
   - ( ) Não → Me diz onde está

**2. Você já tem URL do Render?**
   - ( ) Sim → Qual é?
   - ( ) Não → Vamos descobrir juntos

**3. Seus usuários são do Brasil?**
   - ( ) Sim → Firebase: southamerica-east1
   - ( ) Não → Firebase: nam5 (USA)

---

**Responde essas 3 perguntas que eu te guio passo a passo! 🧭**

*DaTempo - Vamos com calma, dá tempo! ☕*
