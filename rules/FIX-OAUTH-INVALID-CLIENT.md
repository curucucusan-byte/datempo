# 🔧 Correção: Erro OAuth "invalid_client" no Login Google

## ❌ Erro Atual

```
Firebase: Error getting access token from google.com
OAuth2 redirect uri is: https://zapagenda-3e479.firebaseapp.com/__/auth/handler
response: OAuth2TokenResponse{params: error=invalid_client&error_description=Unauthorized
httpMetadata: HttpMetadata{status=401
```

**Causa**: As credenciais OAuth no Google Cloud Console não correspondem ao Firebase Auth.

---

## ✅ Solução Passo a Passo

### 1️⃣ **Verificar o OAuth Client ID no Firebase**

📍 **Firebase Console**: https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers

**Passos:**
1. Vá em **Authentication** → **Sign-in method**
2. Clique em **Google** na lista de provedores
3. Anote os valores:
   - **Web SDK configuration** → **Web client ID**
   - **Web client secret**

**Exemplo:**
```
Web client ID: 966992499199-XXXXXXXXXXXX.apps.googleusercontent.com
Web client secret: GOCSPX-XXXXXXXXXXXXXXXXXXXXX
```

---

### 2️⃣ **Atualizar OAuth Client no Google Cloud Console**

📍 **Google Cloud Console**: https://console.cloud.google.com/apis/credentials?project=project-966992499199

#### Passo A: Encontrar o OAuth Client correto

1. Vá em **APIs & Services** → **Credentials**
2. Procure na seção **"OAuth 2.0 Client IDs"**
3. Encontre o client que tem o ID que você anotou acima
4. Clique no nome dele (ex: "Web client 1" ou "zapagenda-3e479")

#### Passo B: Verificar URIs Autorizados

Na tela de edição, verifique se TODOS esses URIs estão na lista:

**Origens JavaScript autorizadas:**
```
https://zapagenda-3e479.firebaseapp.com
https://zap-agenda.onrender.com
http://localhost:3000
http://localhost:5173
```

**URIs de redirecionamento autorizados:**
```
https://zapagenda-3e479.firebaseapp.com/__/auth/handler
https://zap-agenda.onrender.com/__/auth/handler
http://localhost:3000/__/auth/handler
http://localhost:5173/__/auth/handler
```

#### Passo C: Copiar as credenciais

1. Após salvar, você verá:
   - **Client ID**: `966992499199-XXXXXXXXXXXX.apps.googleusercontent.com`
   - **Client secret**: `GOCSPX-XXXXXXXXXXXXXXXXXXXXX`
2. **Copie esses valores**

---

### 3️⃣ **Atualizar Firebase Auth com as credenciais corretas**

📍 **Firebase Console**: https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers

**Passos:**
1. Vá em **Authentication** → **Sign-in method**
2. Clique em **Google**
3. No campo **"Web SDK configuration"**, cole:
   - **Web client ID**: (o que você copiou do Google Cloud)
   - **Web client secret**: (o que você copiou do Google Cloud)
4. Clique em **"Salvar"**

---

### 4️⃣ **Verificar variáveis de ambiente no Render.com**

📍 **Render.com**: https://dashboard.render.com/

**Passos:**
1. Vá no seu serviço `zap-agenda`
2. Clique em **"Environment"**
3. Verifique se existem estas variáveis:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapagenda-3e479
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zapagenda-3e479.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=966992499199
   NEXT_PUBLIC_FIREBASE_APP_ID=1:966992499199:web:...
   ```

4. Se alguma estiver diferente, atualize e faça **"Manual Deploy"**

---

### 5️⃣ **Limpar Cache do Firebase Auth**

Às vezes o Firebase cacheia configurações antigas.

**Opção A: Forçar nova autenticação**
```typescript
// No código do login, adicione:
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
auth.settings.appVerificationDisabledForTesting = false; // Force new auth
```

**Opção B: Limpar localStorage no navegador**
1. Abra DevTools (F12)
2. Vá em **Application** → **Local Storage**
3. Delete todos os itens do domínio `zap-agenda.onrender.com`
4. Tente fazer login novamente

---

### 6️⃣ **Verificar se o projeto está correto**

📍 **Google Cloud Console**: https://console.cloud.google.com

**Problema comum**: Ter múltiplos projetos e estar configurando o errado.

**Passos:**
1. No topo da página, clique no nome do projeto
2. Verifique se está em: **"project-966992499199"**
3. Se não estiver, troque para o projeto correto
4. Repita os passos 2 e 3 acima

---

## 🔍 Diagnóstico: Como identificar o problema específico

### Teste 1: Verificar se o OAuth Client existe

```bash
curl -X GET \
  "https://oauth2.googleapis.com/tokeninfo?id_token=SEU_ID_TOKEN_AQUI"
```

Se retornar erro 401, as credenciais estão erradas.

### Teste 2: Verificar redirect URI

No erro, você vê:
```
OAuth2 redirect uri is: https://zapagenda-3e479.firebaseapp.com/__/auth/handler
```

Vá no Google Cloud Console e confirme que **exatamente** esse URI está na lista de "URIs de redirecionamento autorizados".

### Teste 3: Verificar se o domínio está autorizado

1. Vá em: https://console.cloud.google.com/apis/credentials/consent
2. Procure **"Domínios autorizados"**
3. Confirme que `zapagenda-3e479.firebaseapp.com` está na lista
4. Se não estiver, adicione:
   - Clique em **"EDITAR APLICATIVO"**
   - Vá em **"Domínios autorizados"**
   - Adicione: `zapagenda-3e479.firebaseapp.com`
   - Clique em **"SALVAR E CONTINUAR"**

---

## 🎯 Checklist Completo

Use esta lista para verificar tudo:

### Google Cloud Console
- [ ] Projeto: `project-966992499199` está selecionado
- [ ] OAuth Client ID existe e tem as credenciais corretas
- [ ] Origens JavaScript incluem: `https://zapagenda-3e479.firebaseapp.com`
- [ ] Redirect URIs incluem: `https://zapagenda-3e479.firebaseapp.com/__/auth/handler`
- [ ] Domínios autorizados incluem: `zapagenda-3e479.firebaseapp.com`
- [ ] Google Calendar API está **HABILITADA**
- [ ] Escopos incluem: `calendar`, `calendar.events`, `userinfo.email`, `userinfo.profile`

### Firebase Console
- [ ] Provedor Google está **HABILITADO**
- [ ] Web client ID corresponde ao Google Cloud Console
- [ ] Web client secret corresponde ao Google Cloud Console
- [ ] Auth domain é: `zapagenda-3e479.firebaseapp.com`

### Render.com (ou servidor de produção)
- [ ] Variáveis de ambiente estão corretas
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com`
- [ ] Deploy foi feito após mudanças

### Código
- [ ] Firebase config em `src/lib/firebaseClient.ts` está correto
- [ ] Login usa `signInWithPopup` ou `signInWithRedirect` corretamente
- [ ] Não há cache forçando configurações antigas

---

## 🚨 Erros Comuns e Soluções

### Erro: "invalid_client"
**Causa**: Client ID ou Secret incorretos.  
**Solução**: Passo 2 e 3 acima (atualizar credenciais no Firebase).

### Erro: "redirect_uri_mismatch"
**Causa**: URI de redirecionamento não está autorizado.  
**Solução**: Passo 2B acima (adicionar URI no Google Cloud).

### Erro: "access_denied"
**Causa**: App em modo "Teste" e usuário não foi adicionado.  
**Solução**: Publicar o app ou adicionar o email do usuário em "Test users".

### Erro: "unauthorized_client"
**Causa**: Domínio não está na lista de domínios autorizados.  
**Solução**: Teste 3 acima (adicionar domínio na tela de consentimento).

---

## 🔄 Passo a Passo Rápido (5 minutos)

Se você tiver pressa, faça isso:

1. **Google Cloud**: https://console.cloud.google.com/apis/credentials?project=project-966992499199
   - Clique no OAuth Client
   - Copie **Client ID** e **Client Secret**

2. **Firebase**: https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers
   - Clique em Google
   - Cole o Client ID e Secret
   - Salvar

3. **Google Cloud**: https://console.cloud.google.com/apis/credentials/consent?project=project-966992499199
   - EDITAR APLICATIVO
   - Domínios autorizados: adicionar `zapagenda-3e479.firebaseapp.com`
   - SALVAR E CONTINUAR

4. **Testar**:
   - Abra uma janela anônima
   - Vá em https://zap-agenda.onrender.com/login
   - Clique em "Entrar com Google"
   - Deve funcionar! ✅

---

## 📞 Se ainda não funcionar

Mande aqui as seguintes informações:

1. **Screenshot do erro** no navegador (console do DevTools - F12)
2. **Screenshot da tela** de OAuth Client no Google Cloud
3. **Screenshot da configuração** do provedor Google no Firebase
4. **URL exata** que você está acessando quando tenta fazer login

Com essas informações, consigo diagnosticar exatamente o problema! 🔍

---

**Última atualização**: 14 de janeiro de 2025  
**Status**: Aguardando correção ⏳
