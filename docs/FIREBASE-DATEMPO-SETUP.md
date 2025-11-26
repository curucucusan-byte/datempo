# 🔥 Firebase DaTempo - Setup do Zero

> Projeto novo criado: **DaTempo**  
> Vamos configurar tudo certinho desde o início!

---

## 📋 Checklist de Configuração

### ✅ Já Feito
```
✓ Projeto Firebase criado: DaTempo
```

---

## 🚀 Próximos Passos (Em Ordem)

### 1️⃣ Firestore Database (2 min)

**Onde:**
```
Firebase Console → Build → Firestore Database → Create database
```

**Configuração:**
```
Database ID: (default) ✅ Deixar assim

Location: ❓ Escolher baseado em usuários
├─ Usuários do Brasil? → southamerica-east1 (São Paulo)
└─ Usuários EUA/Internacional? → nam5 (United States)

⚠️ NÃO PODE MUDAR DEPOIS!

Start in:
( ● ) Test mode ✅ Escolher esta (por enquanto)
(   ) Production mode

Rules vão permitir read/write temporariamente.
Vamos mudar depois para produção.
```

**Clique:** Create database

---

### 2️⃣ Firebase Authentication (2 min)

**Onde:**
```
Firebase Console → Build → Authentication → Get started
```

**Configuração:**
```
1. Clicar "Get started"
2. Sign-in method tab
3. Google → Enable/Ativar
4. Configuration:
   ├─ Project support email: [seu email]
   └─ Web SDK configuration: Expandir ▼
      
5. ⚠️ IMPORTANTE:
   ( ) Use Firebase's OAuth client ← NÃO
   (●) Use custom OAuth client ← SIM
   
6. Deixar em branco por enquanto (vamos preencher depois com Google OAuth)

7. Save (pode salvar vazio, preenche depois)
```

---

### 3️⃣ Firebase Client SDK Config (1 min)

**Onde:**
```
Firebase Console → Project Settings (⚙️ engrenagem)
→ General tab
→ Your apps → Web app
```

**Se não tiver app web ainda:**
```
1. Clicar no ícone </> (Web)
2. App nickname: DaTempo Web
3. Marcar: (●) Also set up Firebase Hosting ← Opcional
4. Register app
```

**Copiar configuração:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← Copiar
  authDomain: "datempo-xyz.firebaseapp.com",  // ← Copiar
  projectId: "datempo-xyz",          // ← Copiar
  storageBucket: "datempo-xyz.appspot.com",   // ← Copiar
  messagingSenderId: "123456",       // ← Copiar
  appId: "1:123456:web:abc"         // ← Copiar
};
```

**Salvar temporariamente em:** `CREDENCIAIS-TEMP.txt`

```bash
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=datempo-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=datempo-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=datempo-xyz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc
```

---

### 4️⃣ Firebase Admin SDK (Service Account) (2 min)

**Onde:**
```
Firebase Console → Project Settings (⚙️)
→ Service Accounts tab
→ Generate New Private Key
```

**Ação:**
```
1. Clicar "Generate New Private Key"
2. Confirmar
3. Baixar arquivo .json (ex: datempo-xyz-firebase-adminsdk.json)
```

**Abrir arquivo .json e copiar:**
```json
{
  "project_id": "datempo-xyz",           // ← FIREBASE_PROJECT_ID
  "client_email": "firebase-adminsdk-abc@datempo-xyz.iam.gserviceaccount.com", // ← FIREBASE_CLIENT_EMAIL
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n" // ← FIREBASE_PRIVATE_KEY
}
```

**Salvar em:** `CREDENCIAIS-TEMP.txt`

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=datempo-xyz
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@datempo-xyz.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANTE:** 
- Mantenha as aspas duplas em `FIREBASE_PRIVATE_KEY`
- Mantenha os `\n` (quebras de linha)
- **NUNCA** commite esse arquivo no Git!

---

### 5️⃣ Google Cloud Console - OAuth (5 min)

**Antes de começar:**
```
Você precisa saber a URL do Render!
Exemplo: https://datempo.onrender.com

Se não souber ainda, vamos descobrir:
1. https://dashboard.render.com
2. Encontrar seu serviço
3. Copiar URL
```

**Onde:**
```
Google Cloud Console → APIs & Services → Credentials
URL: https://console.cloud.google.com/apis/credentials
```

**⚠️ Projeto correto:**
```
No topo do Google Cloud Console, verificar:
Projeto selecionado: DaTempo (ou datempo-xyz)

Se não existir projeto no Google Cloud:
1. Create Project
2. Nome: DaTempo
3. Aguardar criação
```

**Habilitar APIs:**
```
APIs & Services → Library

Buscar e habilitar:
☐ Google Calendar API
☐ Google+ API (ou People API)
```

**Criar OAuth Client ID:**
```
APIs & Services → Credentials → Create Credentials → OAuth Client ID

Vai pedir OAuth Consent Screen primeiro:
1. Configure Consent Screen
2. User Type: External
3. App name: DaTempo
4. User support email: [seu email]
5. Developer contact: [seu email]
6. Save and Continue
7. Scopes: Add or Remove Scopes
   ├─ .../auth/userinfo.email
   ├─ .../auth/userinfo.profile
   └─ .../auth/calendar (buscar "calendar")
8. Save and Continue
9. Test users: Add users (seu email)
10. Back to Dashboard
```

**Agora criar OAuth Client:**
```
Create Credentials → OAuth Client ID

Tela "Que dados você acessará?":
( ● ) Dados do usuário ✅ ESTA!
(   ) Dados do aplicativo

Application type: Web application

Name: DaTempo OAuth Client

Authorized JavaScript origins:
├─ http://localhost:3000
├─ https://datempo.onrender.com (SUBSTITUIR pela sua URL)
└─ https://datempo-xyz.firebaseapp.com (SUBSTITUIR pelo seu projeto)

Authorized redirect URIs:
├─ http://localhost:3000/api/google/oauth/callback
├─ https://datempo.onrender.com/api/google/oauth/callback (SUBSTITUIR)
├─ http://localhost:3000/__/auth/handler
└─ https://datempo-xyz.firebaseapp.com/__/auth/handler (SUBSTITUIR)

Create
```

**Copiar credenciais:**
```
Client ID: 123456-abc.apps.googleusercontent.com
Client Secret: GOCSPX-abc123...
```

**Salvar em:** `CREDENCIAIS-TEMP.txt`

```bash
# Google OAuth
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

---

### 6️⃣ Firebase Auth - Configurar Google OAuth (1 min)

**Voltar ao Firebase Console:**
```
Authentication → Sign-in method → Google → Edit

Web SDK configuration:
( ● ) Use custom OAuth client

Web client ID: [Colar GOOGLE_CLIENT_ID]
Web client secret: [Colar GOOGLE_CLIENT_SECRET]

Save
```

---

### 7️⃣ Configurar .env.local (Desenvolvimento)

**Criar arquivo:** `.env.local` na raiz do projeto

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌐 URL Base
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP_BASE_URL=http://localhost:3000

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔐 Google OAuth
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔥 Firebase Admin SDK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIREBASE_PROJECT_ID=datempo-xyz
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@datempo-xyz.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔥 Firebase Client SDK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=datempo-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=datempo-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=datempo-xyz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc
```

**Testar local:**
```bash
yarn dev
# Abrir: http://localhost:3000
# Testar login com Google
```

---

### 8️⃣ Render - Environment Variables (3 min)

**Onde:**
```
https://dashboard.render.com
→ Seu serviço
→ Environment tab
```

**Adicionar TODAS as variáveis:**
```bash
# Copiar do .env.local, MAS mudar APP_BASE_URL:
APP_BASE_URL=https://datempo.onrender.com (sua URL real)

# Resto igual ao .env.local:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Salvar:**
```
Save Changes → Auto-deploy (aguardar 5-10 min)
```

---

## 📝 Template CREDENCIAIS-TEMP.txt

**Criar arquivo temporário (NÃO COMMITAR!):**

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CREDENCIAIS TEMPORÁRIAS - DaTempo
# ⚠️ DELETAR APÓS CONFIGURAR TUDO!
# ⚠️ NUNCA COMMITAR NO GIT!
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ━━━━ Informações Básicas ━━━━
FIREBASE_PROJECT_ID_REAL=datempo-xyz
FIREBASE_AUTH_DOMAIN=datempo-xyz.firebaseapp.com
RENDER_URL=https://datempo.onrender.com

# ━━━━ Google OAuth ━━━━
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ━━━━ Firebase Admin SDK ━━━━
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# ━━━━ Firebase Client SDK ━━━━
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## ✅ Checklist Final

### Firebase Console
```
☐ Firestore Database criado
☐ Authentication habilitado (Google)
☐ Web app registrado
☐ Client SDK config copiado (NEXT_PUBLIC_*)
☐ Service Account gerado (.json baixado)
☐ Firebase Auth configurado com Google OAuth
```

### Google Cloud Console
```
☐ Projeto DaTempo criado (ou selecionado)
☐ Calendar API habilitada
☐ OAuth Consent Screen configurado
☐ OAuth Client ID criado
☐ Redirect URIs configurados (4 URIs)
☐ JavaScript origins configurados (3 origens)
☐ Client ID e Secret copiados
```

### Código
```
☐ .env.local criado com todas variáveis
☐ .gitignore tem .env.local
☐ CREDENCIAIS-TEMP.txt criado (lembrar de deletar!)
```

### Render
```
☐ URL do serviço descoberta
☐ Environment variables configuradas (11 variáveis)
☐ Save Changes (auto-deploy iniciado)
☐ Deploy completo (5-10 min)
```

### Testes
```
☐ yarn dev roda sem erros
☐ Login local funciona (localhost:3000)
☐ Login produção funciona (render)
☐ Conectar Google Calendar funciona
☐ Firestore salva dados
```

---

## 🆘 Ajuda Rápida

**Qual o ID do seu projeto Firebase?**
```
Firebase Console → Project Settings → Project ID
Exemplo: datempo-xyz, datempo-12345, etc.
```

**Qual a URL do authDomain?**
```
Firebase Console → Project Settings → Your apps → Config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=datempo-xyz.firebaseapp.com
```

**Precisa usar ESSA URL em:**
1. Google OAuth (Authorized JavaScript origins)
2. Google OAuth (Redirect URIs: /__/auth/handler)

---

## 🎯 Por Onde Começar AGORA

**Se você acabou de criar o projeto:**

```
1. Firestore Database (2 min)
   └─ Escolher Location (Brasil ou EUA?)
   
2. Pausar ☕

3. Firebase Client SDK (1 min)
   └─ Copiar variáveis NEXT_PUBLIC_*
   
4. Pausar ☕

5. Firebase Admin SDK (2 min)
   └─ Baixar .json, copiar 3 variáveis
   
6. Pausar ☕

7. Google OAuth (5 min)
   └─ Criar Client ID (precisa saber URL do Render antes!)
   
8. Pausar ☕

9. Tudo no .env.local (2 min)

10. Testar local (1 min)

11. Render variables (3 min)

PRONTO! 🎉
```

**Total:** 20 minutos (com pausas!)

---

**Me diga:**
1. Você já sabe se usuários são do Brasil ou EUA? (para Location)
2. Você já tem URL do Render? Se sim, qual?
3. Quer fazer tudo agora ou pausar em algum ponto?

*DaTempo - Projeto novo, configuração limpa! 🔥*
