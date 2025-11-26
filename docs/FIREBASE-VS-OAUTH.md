# 🔥 Firebase: OAuth vs Service Account - DaTempo

> Diferença entre autenticação de usuários vs backend do Firebase

---

## 🎯 Duas Configurações Diferentes

### 1️⃣ OAuth Google Calendar (já explicado)
**Para:** Acessar calendários dos **usuários**  
**Escolha:** "Dados do usuário" (OAuth) ✅

### 2️⃣ Firebase Admin (Backend)
**Para:** App acessar **Firebase** (Firestore, Auth, etc.)  
**Escolha:** Service Account ✅

---

## 🔥 Firebase Precisa de DUAS credenciais

### Credencial 1: Firebase Admin SDK (Service Account)

**O que é:**
- Backend do DaTempo acessa Firestore
- Salva agendamentos no banco
- Gerencia autenticação
- **NÃO precisa de autorização de usuário**

**Como obter:**

```
1. Firebase Console: https://console.firebase.google.com
2. Project Settings (⚙️ engrenagem)
3. Service Accounts
4. Generate New Private Key
5. Baixa arquivo JSON
```

**Variáveis (.env.local):**
```bash
FIREBASE_PROJECT_ID=datempo-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@datempo.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**⚠️ Isso NÃO é OAuth!** É Service Account (credenciais do servidor)

---

### Credencial 2: Firebase Client SDK

**O que é:**
- Frontend (navegador) conecta ao Firebase
- Usuários fazem login (Firebase Auth)
- Acesso público ao Firebase

**Como obter:**

```
1. Firebase Console: https://console.firebase.google.com
2. Project Settings (⚙️)
3. Your apps → Web app
4. Config → Copiar valores
```

**Variáveis (.env.local):**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=datempo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=datempo-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=datempo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**⚠️ Isso também NÃO é OAuth!** São configs públicas do Firebase

---

## 📊 Resumo: 3 Autenticações Diferentes

| Serviço | Tipo | Para quê | Onde obter |
|---------|------|----------|------------|
| **Google Calendar** | OAuth (Dados do usuário) | Acessar calendários dos usuários | Google Cloud Console → OAuth Client |
| **Firebase Admin** | Service Account | Backend acessar Firestore | Firebase Console → Service Account |
| **Firebase Client** | Configuração pública | Frontend conectar Firebase | Firebase Console → App Config |

---

## 🔐 Google Cloud Console: Quando usar cada opção

### Use "Dados do usuário" (OAuth) para:
- ✅ **Google Calendar** (usuários conectam calendários)
- ✅ **Google Drive** (usuários compartilham arquivos)
- ✅ **Gmail API** (enviar emails pelo Gmail do usuário)
- ✅ Qualquer API que acessa **dados pessoais do usuário**

### Use "Dados do aplicativo" (Service Account) para:
- ✅ **Firebase Admin SDK** (backend acessa Firestore)
- ✅ **Google Cloud Storage** (app armazena arquivos)
- ✅ **BigQuery** (app faz consultas)
- ✅ **Pub/Sub** (app envia mensagens)
- ✅ Qualquer serviço do **próprio app** (sem usuário)

---

## 🎯 Para DaTempo: Você Precisa de AMBOS

### OAuth (Dados do usuário) ✅
```
Para: Google Calendar API
Por quê: Cada usuário conecta seu calendário
Onde: Google Cloud Console → Create OAuth Client ID
```

### Service Account ✅
```
Para: Firebase Admin SDK
Por quê: Backend do app acessa Firestore
Onde: Firebase Console → Generate Private Key
```

---

## 📋 Checklist Completo de Credenciais

```
OAuth Google Calendar:
☐ Google Cloud Console
☐ APIs & Services → Credentials
☐ Create Credentials → OAuth Client ID
☐ Tipo: Aplicativo da Web
☐ Escolha: "Dados do usuário" ✅
☐ Copiar: GOOGLE_CLIENT_ID
☐ Copiar: GOOGLE_CLIENT_SECRET
☐ Configurar: APP_BASE_URL

Firebase Admin (Service Account):
☐ Firebase Console
☐ Project Settings → Service Accounts
☐ Generate New Private Key
☐ Baixar arquivo .json
☐ Extrair: FIREBASE_PROJECT_ID
☐ Extrair: FIREBASE_CLIENT_EMAIL
☐ Extrair: FIREBASE_PRIVATE_KEY

Firebase Client (Config Pública):
☐ Firebase Console
☐ Project Settings → Your apps → Web
☐ Copiar: NEXT_PUBLIC_FIREBASE_API_KEY
☐ Copiar: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
☐ Copiar: NEXT_PUBLIC_FIREBASE_PROJECT_ID
☐ Copiar: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
☐ Copiar: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
☐ Copiar: NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## 🔍 Como Identificar Qual Usar

### Pergunte-se:

**1. Quem vai usar a credencial?**
- **Usuário (navegador)** → OAuth ou Config Cliente
- **Servidor (backend)** → Service Account

**2. O que vai acessar?**
- **Dados pessoais do usuário** (Calendar, Drive, Gmail) → OAuth
- **Serviços do app** (Firestore, Storage, BigQuery) → Service Account

**3. Precisa de autorização do usuário?**
- **Sim** → OAuth
- **Não** → Service Account

---

## 💡 Exemplo Prático DaTempo

### Fluxo de Login e Agendamento:

```
1. Usuário acessa DaTempo
   └─> Frontend usa NEXT_PUBLIC_FIREBASE_* (Config Pública)
   
2. Usuário faz login
   └─> Firebase Auth (automático com config cliente)
   
3. Usuário clica "Conectar Google Calendar"
   └─> OAuth GOOGLE_CLIENT_ID (Dados do usuário)
   └─> Usuário autoriza acesso ao calendário
   
4. Usuário marca agendamento
   └─> Backend usa FIREBASE_PRIVATE_KEY (Service Account)
   └─> Salva no Firestore
   
5. Backend cria evento no Google Calendar
   └─> Usa token OAuth do usuário (armazenado no Firestore)
   └─> Cria evento no calendário do usuário
```

---

## 📝 Arquivo .env.local Completo

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Google OAuth (Dados do usuário)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz...
APP_BASE_URL=http://localhost:3000

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Firebase Admin SDK (Service Account)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIREBASE_PROJECT_ID=datempo-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@datempo.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Firebase Client SDK (Config Pública)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123xyz...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=datempo-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=datempo-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=datempo-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123xyz456
```

---

## 🆘 Confusão Comum

### "Mas o Firebase não precisa de OAuth?"

**Resposta:** Depende!

**Firebase Auth (login de usuários):**
- ❌ NÃO precisa de OAuth do Google Cloud
- ✅ Usa apenas NEXT_PUBLIC_FIREBASE_* (config cliente)
- ✅ Firebase gerencia autenticação automaticamente

**Firebase Admin (backend):**
- ❌ NÃO precisa de OAuth
- ✅ Usa Service Account (FIREBASE_PRIVATE_KEY)
- ✅ Backend acessa Firestore diretamente

**Google Calendar (DaTempo precisa):**
- ✅ PRECISA de OAuth (GOOGLE_CLIENT_ID)
- ✅ Cada usuário autoriza acesso ao calendário
- ✅ "Dados do usuário" no Google Cloud Console

---

## 🎯 Resposta Direta

### Para sua pergunta "E a do Firebase?"

**Firebase NÃO usa a tela que você está vendo!**

Aquela tela é só para **Google Calendar API**.

**Firebase já está configurado separadamente:**
- ✅ Firebase Console (não Google Cloud Console)
- ✅ Service Account (já gerado)
- ✅ Config Cliente (já copiado)

**Você só precisa escolher na tela atual:**
- ✅ "Dados do usuário" (para Google Calendar)

---

## 📚 Links Úteis

| Serviço | Onde Configurar | URL |
|---------|-----------------|-----|
| **OAuth Google Calendar** | Google Cloud Console | https://console.cloud.google.com/apis/credentials |
| **Firebase Admin** | Firebase Console | https://console.firebase.google.com → Settings → Service Accounts |
| **Firebase Client** | Firebase Console | https://console.firebase.google.com → Settings → Your apps |

---

## ✅ Resumo Final

```
┌────────────────────────────────────────────────────────┐
│ Serviço              Tipo              Tela Atual?    │
├────────────────────────────────────────────────────────┤
│ Google Calendar      OAuth             SIM ← Aqui!    │
│                      (Dados usuário)                   │
│                                                        │
│ Firebase Admin       Service Account   NÃO            │
│                      (Firebase Console)                │
│                                                        │
│ Firebase Client      Config Pública    NÃO            │
│                      (Firebase Console)                │
└────────────────────────────────────────────────────────┘
```

**Na tela que você está agora:**
```
( ● ) Dados do usuário  ← MARQUE ESTA
(   ) Dados do aplicativo
```

**Firebase já está configurado em outro lugar!**

---

*DaTempo - Firebase vs OAuth 🕰️*
