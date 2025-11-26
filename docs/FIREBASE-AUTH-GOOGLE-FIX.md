# 🔥 Firebase Auth Google Login - Erro invalid_client

> **Solução Rápida:** Adicionar redirect URI do Firebase no Google Cloud Console

---

## 🎯 O Problema

**Erro:**
```
Error getting access token from google.com
OAuth2 redirect uri is: https://zapagenda-3e479.firebaseapp.com/__/auth/handler
response: error=invalid_client&error_description=Unauthorized
```

**O que significa:**
- ✅ Firebase Auth está tentando fazer login com Google
- ❌ O redirect URI do Firebase não está autorizado
- ❌ Firebase precisa do mesmo OAuth Client que você criou para Calendar

**Este é um erro DIFERENTE do Google Calendar!**
- Google Calendar: `/api/google/oauth/callback`
- Firebase Auth: `/__/auth/handler`

---

## ✅ Solução Rápida (5 minutos)

### 1. Google Cloud Console - Adicionar Redirect URI do Firebase

```
URL: https://console.cloud.google.com/apis/credentials

1. Encontrar "DaTempo OAuth Client" (que você criou)
2. Clicar em EDITAR (ícone lápis)
3. Em "URIs de redirecionamento autorizados", ADICIONAR:

   https://zapagenda-3e479.firebaseapp.com/__/auth/handler
   http://localhost:3000/__/auth/handler

4. Em "Origens JavaScript autorizadas", ADICIONAR:

   https://zapagenda-3e479.firebaseapp.com

5. SALVAR
6. Aguardar 5-10 minutos
```

**Resultado esperado:**
```
URIs de redirecionamento autorizados:
├─ https://datempo.onrender.com/api/google/oauth/callback ← Calendar
├─ http://localhost:3000/api/google/oauth/callback ← Calendar local
├─ https://zapagenda-3e479.firebaseapp.com/__/auth/handler ← Firebase ✨ NOVO
└─ http://localhost:3000/__/auth/handler ← Firebase local ✨ NOVO
```

---

### 2. Firebase Console - Configurar mesmo Client ID

```
URL: https://console.firebase.google.com

1. Selecionar projeto: zapagenda-3e479
2. Build → Authentication
3. Sign-in method tab
4. Google → Editar (ícone lápis)
5. Web SDK configuration → Expandir
6. Selecionar: ( ● ) Use custom OAuth Client
7. Web client ID: [Cole o GOOGLE_CLIENT_ID do .env]
8. Web client secret: [Cole o GOOGLE_CLIENT_SECRET do .env]
9. SALVAR
```

**⚠️ IMPORTANTE:** Use o **MESMO Client ID** que você criou para Calendar!

---

### 3. Testar

```
1. Aguardar 5-10 minutos (propagação Google)
2. Abrir: http://localhost:3000 (ou datempo.onrender.com)
3. Fazer logout (se logado)
4. Clicar em "Login com Google"
5. Deve funcionar! ✅
```

---

## 📊 Um OAuth Client para Tudo

**Vantagem de usar o mesmo Client ID:**

```
                    GOOGLE_CLIENT_ID
                           |
          ┌────────────────┼────────────────┐
          |                                 |
    Firebase Auth                    Google Calendar
    (Login usuários)                (Acessar calendário)
          |                                 |
    /__/auth/handler         /api/google/oauth/callback
```

**Benefícios:**
- ✅ Menos configuração
- ✅ Apenas uma credencial para gerenciar
- ✅ Menos chance de erro
- ✅ Mesmas permissões compartilhadas

---

## 🔍 Verificar Configuração Atual

### Seu .env.local deve ter:

```bash
# Google OAuth (usado por Calendar E Firebase Auth)
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz...

# Firebase Client SDK (para frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zapagenda-3e479.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapagenda-3e479
# ... outras variáveis Firebase
```

### Google Cloud Console deve ter:

```
OAuth 2.0 Client ID: DaTempo OAuth Client
├─ Authorized redirect URIs:
│  ├─ https://datempo.onrender.com/api/google/oauth/callback
│  ├─ http://localhost:3000/api/google/oauth/callback  
│  ├─ https://zapagenda-3e479.firebaseapp.com/__/auth/handler ← ADICIONE
│  └─ http://localhost:3000/__/auth/handler ← ADICIONE
└─ Authorized JavaScript origins:
   ├─ https://datempo.onrender.com
   ├─ http://localhost:3000
   └─ https://zapagenda-3e479.firebaseapp.com ← ADICIONE
```

### Firebase Console deve ter:

```
Authentication → Sign-in method → Google:
├─ Enabled: ✅ Yes
└─ Web SDK configuration:
   ├─ Use custom OAuth Client: ● Yes
   ├─ Web client ID: 123456789-abc.apps.googleusercontent.com
   └─ Web client secret: GOCSPX-abc123xyz...
   (Mesmo GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET do .env)
```

---

## 🆘 Troubleshooting

### ❌ Erro ainda aparece após 5 minutos?

**Checklist:**
```
☐ Client ID no Firebase é EXATAMENTE o mesmo do .env?
☐ Client Secret no Firebase é EXATAMENTE o mesmo do .env?
☐ Adicionou https://zapagenda-3e479.firebaseapp.com/__/auth/handler?
☐ Adicionou https://zapagenda-3e479.firebaseapp.com nas origens?
☐ Salvou no Google Cloud Console?
☐ Aguardou 5-10 minutos completos?
☐ Limpou cache do navegador (Ctrl+Shift+Delete)?
☐ Fez logout completo e tentou novamente?
```

---

### ❌ "redirect_uri_mismatch"

**Erro:**
```
The redirect URI in the request does not match
the ones authorized for the OAuth client
```

**Solução:**
```
1. Copiar EXATAMENTE este URI do erro:
   https://zapagenda-3e479.firebaseapp.com/__/auth/handler
   
2. Google Cloud Console → OAuth Client → Edit
   
3. Colar no campo de redirect URIs
   (sem adicionar/remover nada, nem espaços!)
   
4. Salvar e aguardar 5-10 min
```

**⚠️ Atenção aos detalhes:**
- ✅ `/__/auth/handler` (duas barras no início)
- ❌ `/auth/handler` (falta uma barra)
- ❌ `/__/auth/handler/` (barra extra no final)

---

### ❌ "invalid_client" ou "Unauthorized"

**Possíveis causas:**

**1. Client ID errado no Firebase:**
```
Solução:
1. Abrir .env.local
2. Copiar GOOGLE_CLIENT_ID (com Ctrl+C)
3. Firebase Console → Google → Web SDK → Web client ID
4. Colar (Ctrl+V) - substituir completamente
5. Salvar
```

**2. Client Secret errado no Firebase:**
```
Solução:
1. Abrir .env.local
2. Copiar GOOGLE_CLIENT_SECRET (com Ctrl+C)
3. Firebase Console → Google → Web SDK → Web client secret
4. Colar (Ctrl+V) - substituir completamente
5. Salvar
```

**3. Espaços ou quebras de linha:**
```
❌ Errado:
GOOGLE_CLIENT_ID = 123456789-abc.apps.googleusercontent.com
                 ^
            (espaço extra)

✅ Correto:
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

---

### ❌ "Access blocked: This app's request is invalid"

**Motivo:**
- OAuth Consent Screen incompleta

**Solução:**
```
Google Cloud Console → OAuth consent screen

1. Adicionar domínios autorizados:
   datempo.onrender.com
   zapagenda-3e479.firebaseapp.com

2. Verificar escopos adicionados:
   ✅ userinfo.email
   ✅ userinfo.profile
   ✅ calendar (se já configurou)

3. Adicionar test users (se app em teste):
   - Seu email
   - Emails de quem vai testar

4. Salvar
```

---

## 📋 Checklist Completo

### Google Cloud Console
```
☐ OAuth Client ID criado
☐ 4 redirect URIs configurados:
  ☐ Calendar produção (.onrender.com/api/google/oauth/callback)
  ☐ Calendar local (localhost/api/google/oauth/callback)
  ☐ Firebase Auth produção (.firebaseapp.com/__/auth/handler)
  ☐ Firebase Auth local (localhost/__/auth/handler)
☐ 3 JavaScript origins configurados:
  ☐ Produção (.onrender.com)
  ☐ Firebase (.firebaseapp.com)
  ☐ Local (localhost)
☐ Mudanças salvas
☐ Aguardou 5-10 minutos
```

### Firebase Console
```
☐ Google sign-in habilitado
☐ "Use custom OAuth Client" selecionado
☐ Client ID colado (verificar sem espaços)
☐ Client Secret colado (verificar sem espaços)
☐ Configuração salva
```

### Testes
```
☐ Logout completo (limpar sessão)
☐ Limpar cache do navegador
☐ Tentar login com Google
☐ Popup abre sem erro
☐ Consegue selecionar conta
☐ Redireciona de volta logado
☐ Sem erros no console do navegador (F12)
```

---

## ✅ Resumo da Solução

**1 OAuth Client para 2 serviços:**

```
       GOOGLE_CLIENT_ID (um só)
              |
      ┌───────┴────────┐
      |                |
Firebase Auth    Google Calendar
   (Login)       (Criar eventos)
```

**Passos:**
1. ✅ Adicionar redirect URIs do Firebase no Google Cloud
2. ✅ Configurar Firebase para usar mesmo Client ID
3. ✅ Aguardar propagação (5-10 min)
4. ✅ Testar login

**Resultado:**
- ✅ Login com Google funciona
- ✅ Google Calendar continua funcionando
- ✅ Apenas uma credencial para gerenciar

---

## 📚 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| `FIREBASE-VS-OAUTH.md` | Diferença Firebase vs Google Calendar OAuth |
| `OAUTH-RENDER-RESPOSTA-IMEDIATA.md` | Configurar OAuth Google Calendar |
| `OAUTH-TROUBLESHOOTING.md` | Erros comuns OAuth |

---

## 🔗 Links Úteis

- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **Firebase Console:** https://console.firebase.google.com
- **Render Dashboard:** https://dashboard.render.com

---

*DaTempo - Firebase Auth Google Fix 🔥*

<function_calls>
<invoke name="grep_search">
<parameter name="query">GOOGLE_CLIENT_ID