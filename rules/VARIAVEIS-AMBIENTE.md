# 🔑 Variáveis de Ambiente - Guia Rápido

## ⚠️ ATENÇÃO: São DUAS credenciais DIFERENTES!

### 1️⃣ Credenciais do Google OAuth (para server-side)
**Onde pegar**: Google Cloud Console → Credentials → OAuth Client  
**Onde usar**: Render.com (Environment Variables)

```bash
GOOGLE_CLIENT_ID=966992499199-XXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXXX
```

### 2️⃣ Configuração do Firebase (para client-side)
**Onde pegar**: Firebase Console → Project Settings → General  
**Onde usar**: Render.com (Environment Variables)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapagenda-3e479
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zapagenda-3e479.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=966992499199
NEXT_PUBLIC_FIREBASE_APP_ID=1:966992499199:web:...
```

---

## 🎯 ERRO "invalid_client" = Problema nas variáveis do grupo 1️⃣

Se você está vendo:
```
error=invalid_client&error_description=Unauthorized
```

**Causa**: As variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no Render.com não correspondem ao Google Cloud Console.

---

## ✅ SOLUÇÃO RÁPIDA (5 minutos)

### Passo 1: Pegar credenciais do Google Cloud

1. Abra: https://console.cloud.google.com/apis/credentials?project=project-966992499199

2. Na seção **"OAuth 2.0 Client IDs"**, clique no nome do client

3. **COPIE** estes valores:
   ```
   Client ID: 966992499199-XXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
   Client secret: GOCSPX-XXXXXXXXXXXXXXXXXXXXX
   ```

### Passo 2: Atualizar no Firebase

1. Abra: https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers

2. Clique no provedor **"Google"**

3. **COLE** os valores do Passo 1:
   - Web client ID: [Cole o Client ID]
   - Web client secret: [Cole o Client Secret]

4. Clique em **"Salvar"**

### Passo 3: Atualizar no Render.com

1. Abra: https://dashboard.render.com/

2. Clique no serviço **"zap-agenda"**

3. Vá em **"Environment"**

4. Procure/Adicione estas variáveis:

   ```bash
   # ESTAS SÃO AS IMPORTANTES PARA O ERRO!
   GOOGLE_CLIENT_ID=966992499199-XXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXXX
   ```

5. Clique em **"Save Changes"**

6. Aguarde o deploy (2-3 minutos)

### Passo 4: Testar

1. Aguarde 5 minutos

2. Janela anônima → https://zap-agenda.onrender.com/login

3. Clique em "Continuar com Google"

4. ✅ Deve funcionar!

---

## 📊 Checklist Completo de Variáveis

### No Render.com, você DEVE ter TODAS estas:

```bash
# ═══════════════════════════════════════════════════════════
# 1. GOOGLE OAUTH (do Google Cloud Console)
# ═══════════════════════════════════════════════════════════
GOOGLE_CLIENT_ID=966992499199-XXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXXX
APP_BASE_URL=https://zap-agenda.onrender.com
GOOGLE_REDIRECT_URI=https://zap-agenda.onrender.com/api/google/oauth/callback

# ═══════════════════════════════════════════════════════════
# 2. FIREBASE CLIENT (do Firebase Console → Settings)
# ═══════════════════════════════════════════════════════════
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapagenda-3e479
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zapagenda-3e479.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=966992499199
NEXT_PUBLIC_FIREBASE_APP_ID=1:966992499199:web:...

# ═══════════════════════════════════════════════════════════
# 3. FIREBASE ADMIN (Service Account JSON)
# ═══════════════════════════════════════════════════════════
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"zapagenda-3e479",...}

# ═══════════════════════════════════════════════════════════
# 4. OUTRAS (opcionais mas recomendadas)
# ═══════════════════════════════════════════════════════════
DEFAULT_CALENDAR_TIMEZONE=America/Sao_Paulo
DASHBOARD_TOKEN=seu-token-secreto-aqui
```

---

## 🔍 Como Verificar se as Variáveis Estão Corretas

### Método 1: Comparar Client IDs

```bash
# O GOOGLE_CLIENT_ID do Render deve começar com:
966992499199-

# E terminar com:
.apps.googleusercontent.com

# Exemplo completo:
966992499199-abc123xyz789.apps.googleusercontent.com
```

### Método 2: Verificar no código

O sistema usa estas variáveis em:
- `src/lib/google.ts` → usa `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- `src/lib/firebaseClient.ts` → usa `NEXT_PUBLIC_FIREBASE_*`

---

## 🚨 Erros Comuns

### ❌ Erro: "Variável não configurada"
**Causa**: Falta alguma variável no Render  
**Solução**: Adicione todas as variáveis do checklist acima

### ❌ Erro: "invalid_client"
**Causa**: `GOOGLE_CLIENT_ID` ou `GOOGLE_CLIENT_SECRET` incorretos  
**Solução**: Siga os Passos 1-3 acima

### ❌ Erro: "redirect_uri_mismatch"
**Causa**: URIs não autorizados no Google Cloud  
**Solução**: Adicione estes URIs no OAuth Client:
```
https://zapagenda-3e479.firebaseapp.com/__/auth/handler
https://zap-agenda.onrender.com/__/auth/handler
```

### ❌ Erro: "Firebase não configurado"
**Causa**: Faltam variáveis `NEXT_PUBLIC_FIREBASE_*`  
**Solução**: Adicione todas as 6 variáveis do Firebase

---

## 📝 Template para Render.com

Copie e cole no Render.com (Environment), substituindo os valores:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=966992499199-COLE_AQUI.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-COLE_AQUI
APP_BASE_URL=https://zap-agenda.onrender.com
GOOGLE_REDIRECT_URI=https://zap-agenda.onrender.com/api/google/oauth/callback

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy_COLE_AQUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapagenda-3e479
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zapagenda-3e479.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=966992499199
NEXT_PUBLIC_FIREBASE_APP_ID=1:966992499199:web:COLE_AQUI

# Firebase Admin (JSON completo em uma linha)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"zapagenda-3e479","private_key_id":"COLE_AQUI","private_key":"-----BEGIN PRIVATE KEY-----\nCOLE_AQUI\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-XXXXX@zapagenda-3e479.iam.gserviceaccount.com","client_id":"COLE_AQUI","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"COLE_AQUI"}

# Outras
DEFAULT_CALENDAR_TIMEZONE=America/Sao_Paulo
```

---

## 🎯 Links Úteis

| Recurso | Link |
|---------|------|
| Google Cloud Credentials | https://console.cloud.google.com/apis/credentials?project=project-966992499199 |
| Firebase Console | https://console.firebase.google.com/project/zapagenda-3e479 |
| Firebase Auth Providers | https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers |
| Render Dashboard | https://dashboard.render.com/ |
| OAuth Consent Screen | https://console.cloud.google.com/apis/credentials/consent?project=project-966992499199 |

---

**Última atualização**: 14 de janeiro de 2025  
**Status**: Guia completo de configuração
