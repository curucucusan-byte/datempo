# 🚨 SOLUÇÃO RÁPIDA: Erro OAuth "invalid_client"

## 🎯 O Problema

Você está vendo este erro ao tentar fazer login com Google:
```
Firebase: Error getting access token from google.com
OAuth2 redirect uri is: https://zapagenda-3e479.firebaseapp.com/__/auth/handler
error=invalid_client&error_description=Unauthorized
```

**Causa Principal**: As credenciais OAuth do Google Cloud Console não correspondem às configuradas no Firebase Authentication.

---

## ✅ SOLUÇÃO PASSO A PASSO (15 minutos)

### 🔥 Passo 1: Pegar as credenciais corretas do Firebase

1. Acesse: https://console.firebase.google.com/project/zapagenda-3e479/settings/general

2. Role para baixo até **"Seus apps"**

3. Clique no ícone do app Web (</>) - deve ser algo como "zapagenda-3e479 (web)"

4. **COPIE** esses valores (você vai precisar):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",                           // 👈 Copie isso
     authDomain: "zapagenda-3e479.firebaseapp.com", // 👈 E isso
     projectId: "zapagenda-3e479",                  // 👈 E isso
     storageBucket: "zapagenda-3e479.firebasestorage.app",
     messagingSenderId: "966992499199",             // 👈 E isso
     appId: "1:966992499199:web:..."                // 👈 E isso
   };
   ```

---

### ☁️ Passo 2: Encontrar seu projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com

2. No topo da página, clique no **dropdown do projeto** (ao lado de "Google Cloud")

3. Procure por: **"zapagenda-3e479"** ou **"project-966992499199"**

4. **SELECIONE** o projeto correto

5. Confirme que o número do projeto (966992499199) corresponde ao `messagingSenderId` do Firebase ✅

---

### 🔑 Passo 3: Pegar as credenciais OAuth do Google Cloud

1. **AINDA NO PROJETO CORRETO**, vá em:
   https://console.cloud.google.com/apis/credentials

2. Procure na seção **"OAuth 2.0 Client IDs"**

3. Você deve ver algo como:
   - **Web client (Auto-created for Google Sign-in)** OU
   - **Client for Web application zapagenda-3e479**

4. **CLIQUE NO NOME** desse OAuth Client

5. **COPIE** esses valores:
   ```
   Client ID: 966992499199-XXXXXXXXXXXX.apps.googleusercontent.com
   Client secret: GOCSPX-XXXXXXXXXXXXXXXXXXXXX
   ```

---

### 🔧 Passo 4: Verificar/Adicionar URIs no Google Cloud

**AINDA NA TELA DO OAUTH CLIENT** (do passo 3):

#### 4A. Origens JavaScript autorizadas

Na seção **"Authorized JavaScript origins"**, verifique se TODOS esses estão listados:

```
https://zapagenda-3e479.firebaseapp.com
https://zap-agenda.onrender.com
http://localhost:3000
```

**Se algum estiver faltando:**
1. Clique em **"ADD URI"**
2. Cole o URI faltante
3. Clique em **"SAVE"** (no final da página)

#### 4B. URIs de redirecionamento autorizados

Na seção **"Authorized redirect URIs"**, verifique se TODOS esses estão listados:

```
https://zapagenda-3e479.firebaseapp.com/__/auth/handler
https://zap-agenda.onrender.com/__/auth/handler
http://localhost:3000/__/auth/handler
```

**Se algum estiver faltando:**
1. Clique em **"ADD URI"**
2. Cole o URI faltante (COM `/__/auth/handler` no final)
3. Clique em **"SAVE"**

---

### 🔐 Passo 5: Atualizar credenciais no Firebase Auth

1. Acesse: https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers

2. Procure **"Google"** na lista de provedores

3. Clique no **ícone de lápis** (editar) no provedor Google

4. Na seção **"Web SDK configuration"**, cole:
   - **Web client ID**: (o Client ID que você copiou no Passo 3)
   - **Web client secret**: (o Client secret que você copiou no Passo 3)

5. Clique em **"Save"**

---

### 🌐 Passo 6: Adicionar domínios autorizados na tela de consentimento

1. Vá em: https://console.cloud.google.com/apis/credentials/consent

2. Clique em **"EDIT APP"** (Editar aplicativo)

3. Role até a seção **"Authorized domains"** (Domínios autorizados)

4. Verifique se estes domínios estão na lista:
   ```
   zapagenda-3e479.firebaseapp.com
   zap-agenda.onrender.com
   ```

5. **Se algum estiver faltando:**
   - Clique no campo de texto
   - Digite o domínio (SEM `https://`, APENAS o domínio)
   - Pressione Enter
   - Clique em **"SAVE AND CONTINUE"** (no final da página)

---

### 📱 Passo 7: Verificar escopos do Google Calendar

**AINDA NA TELA DE CONSENTIMENTO** (do passo 6):

1. Clique em **"EDIT APP"** se saiu

2. Role até **"Scopes"** (Escopos)

3. Clique em **"ADD OR REMOVE SCOPES"**

4. Na busca, digite: `calendar`

5. Marque estes escopos:
   ```
   ✅ https://www.googleapis.com/auth/calendar
   ✅ https://www.googleapis.com/auth/calendar.events
   ```

6. Também marque (se não estiverem):
   ```
   ✅ https://www.googleapis.com/auth/userinfo.email
   ✅ https://www.googleapis.com/auth/userinfo.profile
   ```

7. Clique em **"UPDATE"** (no rodapé do modal)

8. Clique em **"SAVE AND CONTINUE"**

---

### 🚀 Passo 8: Publicar o app OAuth (IMPORTANTE!)

**AINDA NA TELA DE CONSENTIMENTO**:

1. Procure **"Publishing status"** (Status de publicação) no topo

2. Se mostrar **"Testing"** (Em teste):
   - Clique em **"PUBLISH APP"**
   - Confirme clicando em **"CONFIRM"**

3. Se mostrar **"In production"** (Em produção):
   - ✅ Tudo certo! Pule para o Passo 9

**Por que isso importa:**
- App em teste = só 100 usuários, tokens expiram em 7 dias
- App publicado = usuários ilimitados, tokens não expiram

---

### 🌐 Passo 9: Atualizar variáveis no Render.com

1. Acesse: https://dashboard.render.com/

2. Clique no serviço **"zap-agenda"** (ou o nome do seu serviço)

3. Vá em **"Environment"** (no menu lateral)

4. Verifique/Atualize estas variáveis (use os valores do Passo 1):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapagenda-3e479
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zapagenda-3e479.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=966992499199
NEXT_PUBLIC_FIREBASE_APP_ID=1:966992499199:web:...
```

5. Clique em **"Save Changes"**

6. O Render vai fazer **deploy automático** - aguarde 2-3 minutos

---

### 🧪 Passo 10: TESTAR!

1. Aguarde 5-10 minutos para tudo propagar

2. Abra uma **janela anônima** (Ctrl+Shift+N)

3. Vá em: https://zap-agenda.onrender.com/login

4. Abra o **DevTools** (F12) → aba **Console**

5. Clique em **"Continuar com Google"**

6. **Deve funcionar!** ✅

Se ainda der erro, veja a seção de troubleshooting abaixo ⬇️

---

## 🔍 Troubleshooting: Se ainda não funcionar

### Erro: "redirect_uri_mismatch"

**Problema**: URI de redirecionamento não autorizado

**Solução**:
1. Anote o URI que aparece no erro (ex: `https://zapagenda-3e479.firebaseapp.com/__/auth/handler`)
2. Vá no Google Cloud Console → OAuth Client (Passo 3)
3. Adicione **EXATAMENTE** esse URI (copia e cola)
4. Salve e aguarde 5 minutos

### Erro: "invalid_client" ainda persiste

**Problema**: Client ID ou Secret incorretos

**Solução**:
1. Vá no Google Cloud Console → OAuth Client (Passo 3)
2. Clique nos 3 pontinhos → **"Reset secret"**
3. Copie o NOVO secret
4. Atualize no Firebase Auth (Passo 5)
5. Aguarde 5 minutos e teste

### Erro: "access_denied"

**Problema**: App em modo teste e usuário não adicionado

**Solução**:
1. Opção A: Publique o app (Passo 8)
2. Opção B: Adicione o email do usuário em "Test users":
   - Google Cloud Console → OAuth consent screen
   - Role até "Test users"
   - Clique em "ADD USERS"
   - Adicione o email do Google que vai fazer login
   - Salve

### Erro: "unauthorized_client"

**Problema**: Domínio não autorizado

**Solução**:
1. Vá no Google Cloud Console → OAuth consent screen (Passo 6)
2. Verifique se `zapagenda-3e479.firebaseapp.com` está em "Authorized domains"
3. Se não estiver, adicione
4. Salve e aguarde 5 minutos

---

## 📋 Checklist Final

Marque cada item que você completou:

```
☐ 1. Copiei as credenciais do Firebase (Passo 1)
☐ 2. Selecionei o projeto correto no Google Cloud (Passo 2)
☐ 3. Copiei Client ID e Secret do Google Cloud (Passo 3)
☐ 4. Adicionei TODOS os URIs autorizados (Passo 4A e 4B)
☐ 5. Atualizei credenciais no Firebase Auth (Passo 5)
☐ 6. Adicionei domínios autorizados na tela de consentimento (Passo 6)
☐ 7. Adicionei escopos do Google Calendar (Passo 7)
☐ 8. Publiquei o app OAuth (Passo 8)
☐ 9. Atualizei variáveis no Render.com (Passo 9)
☐ 10. Aguardei 5-10 minutos e testei (Passo 10)
```

---

## 🎯 Atalho Rápido (se você tiver pressa)

Se você conhece bem o Google Cloud Console:

1. **Firebase** → Settings → Copie `apiKey`, `authDomain`, etc
2. **Google Cloud** → OAuth Client → Copie Client ID e Secret
3. **Google Cloud** → OAuth Client → Adicione URIs:
   - JS origins: `https://zapagenda-3e479.firebaseapp.com`, `https://zap-agenda.onrender.com`
   - Redirect URIs: `https://zapagenda-3e479.firebaseapp.com/__/auth/handler`, `https://zap-agenda.onrender.com/__/auth/handler`
4. **Firebase** → Authentication → Google → Cole Client ID e Secret
5. **Google Cloud** → OAuth Consent → Authorized domains: `zapagenda-3e479.firebaseapp.com`, `zap-agenda.onrender.com`
6. **Google Cloud** → OAuth Consent → Publish app
7. **Render.com** → Environment → Atualize variáveis `NEXT_PUBLIC_FIREBASE_*`
8. Aguarde 5 min → Teste!

---

## 📞 Ainda com problemas?

Se após seguir TODOS os passos ainda não funcionar:

1. Tire screenshots de:
   - OAuth Client no Google Cloud (URIs configurados)
   - Provedor Google no Firebase (Client ID mascarado)
   - OAuth Consent Screen (domínios autorizados)
   - Erro completo no console do navegador (F12)

2. Mande aqui ou abra uma issue com:
   - Screenshots acima
   - URL exata onde o erro acontece
   - Horário do último teste

---

**Criado em**: 14 de janeiro de 2025  
**Status**: Guia completo de solução  
**Tempo estimado**: 15 minutos seguindo todos os passos
