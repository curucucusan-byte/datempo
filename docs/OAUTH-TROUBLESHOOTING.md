# 🔧 Troubleshooting OAuth - DaTempo

> Soluções para problemas comuns ao configurar Google OAuth

---

## 🚨 Erro: "Origem inválida: o URI não pode estar vazio"

### Sintoma
```
❌ Origem inválida: o URI não pode estar vazio.
```

### Causa
Você deixou o campo **"Origens JavaScript autorizadas"** em branco.

### Solução
```bash
# Preencha com a URL do seu projeto:
https://zapagenda.vercel.app
# ou
https://seu-dominio.com.br
```

**⚠️ NÃO deixe vazio**, mesmo que pareça opcional!

---

## 🚨 Erro: "redirect_uri_mismatch"

### Sintoma
```
Error: redirect_uri_mismatch
The redirect URI in the request, https://zapagenda.vercel.app/api/google/oauth/callback, 
does not match the ones authorized for the OAuth client.
```

### Causas Comuns

#### 1️⃣ URI não está cadastrado no Google Console
```bash
# Verifique se este URI EXATO está em "URIs de redirecionamento":
https://zapagenda.vercel.app/api/google/oauth/callback
```

#### 2️⃣ Diferença sutil (espaço, barra extra, etc.)
```bash
# ❌ Errado:
https://zapagenda.vercel.app/api/google/oauth/callback/  # barra extra
https://zapagenda.vercel.app/api/google/callback         # faltou /oauth/
https://zapagenda.vercel.app /api/google/oauth/callback # espaço

# ✅ Correto:
https://zapagenda.vercel.app/api/google/oauth/callback
```

#### 3️⃣ APP_BASE_URL não configurado corretamente

```bash
# Verifique no Vercel:
# Settings → Environment Variables

# ❌ Errado:
APP_BASE_URL=zapagenda.vercel.app           # sem https://
APP_BASE_URL=https://zapagenda.vercel.app/  # com / no final

# ✅ Correto:
APP_BASE_URL=https://zapagenda.vercel.app
```

#### 4️⃣ Mudança recente (propagação)
Aguarde **5-10 minutos** após adicionar um novo redirect URI.

### Solução Rápida
1. Copie o redirect URI do erro
2. Cole exatamente no Google Console
3. Aguarde 10 minutos
4. Tente novamente

---

## 🚨 Erro: "invalid_client"

### Sintoma
```
Error: invalid_client
The OAuth client was not found.
```

### Causas

#### 1️⃣ Client ID ou Secret incorretos

```bash
# Verifique no Vercel se não tem:
- Espaços no início/fim
- Quebras de linha
- Caracteres invisíveis
```

#### 2️⃣ Variáveis não configuradas

```bash
# No Vercel, certifique-se que existem:
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

#### 3️⃣ Cliente OAuth deletado no Google

Verifique em: https://console.cloud.google.com/apis/credentials

### Solução
1. Copie Client ID novamente do Google Console
2. Cole no Vercel (Settings → Environment Variables)
3. **Redeploy** o projeto
4. Aguarde 2-3 minutos
5. Tente novamente

---

## 🚨 Erro: "access_denied"

### Sintoma
```
Error: access_denied
The user has denied access to the requested scopes.
```

### Causa
Usuário clicou em **"Negar"** ou **"Cancelar"** na tela de autorização do Google.

### Solução
Tente novamente e clique em **"Permitir"** na tela do Google.

---

## 🚨 Erro: "Scope não autorizado"

### Sintoma
```
Error: Invalid scope: https://www.googleapis.com/auth/calendar
```

### Causa
O escopo não foi adicionado na **Tela de Consentimento OAuth**.

### Solução

1. Acesse: https://console.cloud.google.com/apis/credentials/consent

2. Clique em **"Edit App"**

3. Em **"Scopes"**, adicione:
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/userinfo.email
   ```

4. Salve e aguarde 5 minutos

---

## 🚨 Funciona em Dev mas não em Produção

### Sintoma
```bash
# Funciona:
http://localhost:3000 ✅

# Não funciona:
https://zapagenda.vercel.app ❌
```

### Causas

#### 1️⃣ Faltou adicionar URL de produção

**Google Console → Origens JavaScript:**
```bash
# Certifique-se que tem:
https://zapagenda.vercel.app  # URL de produção
http://localhost:3000         # URL de dev
```

**Google Console → URIs de Redirecionamento:**
```bash
# Certifique-se que tem:
https://zapagenda.vercel.app/api/google/oauth/callback  # Produção
http://localhost:3000/api/google/oauth/callback         # Dev
```

#### 2️⃣ APP_BASE_URL não configurado no Vercel

```bash
# Vercel → Settings → Environment Variables
# Certifique-se que tem:
APP_BASE_URL=https://zapagenda.vercel.app
```

#### 3️⃣ Variáveis no ambiente errado

```bash
# No Vercel, certifique-se que marcou:
[✓] Production   ← DEVE ESTAR MARCADO
[ ] Preview
[ ] Development
```

### Solução
1. Adicione URLs de produção no Google Console
2. Configure `APP_BASE_URL` no Vercel
3. Marque variáveis como "Production"
4. Faça **redeploy** (Deployments → Redeploy)
5. Aguarde 10 minutos
6. Teste novamente

---

## 🚨 Erro: "API not enabled"

### Sintoma
```
Error: Google Calendar API has not been used in project 123456789 
before or it is disabled.
```

### Solução

1. Acesse: https://console.cloud.google.com/apis/library

2. Busque por: **"Google Calendar API"**

3. Clique em **"Enable"** (Ativar)

4. Repita para: **"Google People API"** (opcional, para userinfo.email)

5. Aguarde 2-3 minutos

6. Tente novamente

---

## 🚨 Erro: "Token expired" ou "Refresh token invalid"

### Sintoma
```
Error: invalid_grant
Token has been expired or revoked.
```

### Causa
O refresh token armazenado no banco não é mais válido.

### Solução

1. Desconecte a conta Google:
   ```
   Dashboard → Configurações → Remover Calendário
   ```

2. Conecte novamente:
   ```
   Dashboard → Configurações → Conectar Google Calendar
   ```

3. **Importante**: O Google só fornece refresh token na primeira autorização.
   Se precisar reconectar, use `prompt: 'consent'` no código (já configurado).

---

## 🚨 Calendário não aparece na lista

### Sintoma
Autorização funciona, mas nenhum calendário é listado.

### Causas

#### 1️⃣ Usuário não tem calendários no Google

```bash
# Verifique em:
https://calendar.google.com
```

#### 2️⃣ Erro ao buscar calendários (API)

```bash
# Verifique logs no Vercel:
# Deployments → [último deploy] → Functions → api/google/calendar

# Pode aparecer:
# - "Calendar API not enabled"
# - "Invalid credentials"
# - "Token expired"
```

### Solução
1. Verifique se Google Calendar API está ativada
2. Verifique logs de erro no Vercel
3. Tente desconectar e reconectar

---

## 🚨 "Esta app não foi verificada pelo Google"

### Sintoma
Tela de aviso do Google:
```
⚠️ This app isn't verified
This app hasn't been verified by Google yet. Only continue if you 
know and trust the developer.
```

### Causa
Aplicações em desenvolvimento (não publicadas) mostram este aviso.

### Solução (Desenvolvimento)
1. Clique em **"Advanced"** (Avançado)
2. Clique em **"Go to DaTempo (unsafe)"**
3. Continue a autorização

### Solução (Produção)
Para remover o aviso em produção:

1. Acesse: https://console.cloud.google.com/apis/credentials/consent

2. Clique em **"Publish App"**

3. Pode ser necessário **verificação do Google** (leva alguns dias):
   - Política de privacidade pública
   - Termos de serviço públicos
   - Vídeo demo do app
   - Justificativa dos escopos

**Para apps pequenos:** Adicione usuários de teste (max 100) sem verificação:
```
OAuth consent screen → Test users → Add users
```

---

## 🚨 Erro 500 ao tentar conectar

### Sintoma
```
Internal Server Error (500)
```

### Causas

#### 1️⃣ Variáveis de ambiente faltando

```bash
# Certifique-se que existem:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
APP_BASE_URL
```

#### 2️⃣ Firebase não configurado

```bash
# Certifique-se que existem:
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

### Solução
1. Verifique logs no Vercel:
   ```
   Deployments → [último deploy] → Functions → Logs
   ```

2. Procure por:
   ```
   Error: Variável GOOGLE_CLIENT_ID não configurada
   ```

3. Configure variáveis faltantes

4. Redeploy

---

## 🧪 Como Debugar

### 1️⃣ Verificar variáveis de ambiente

```bash
# No terminal local:
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
echo $APP_BASE_URL

# No Vercel:
# Settings → Environment Variables → Ver todas
```

### 2️⃣ Verificar logs

**Vercel:**
```
Deployments → [deploy] → Functions → api/google/oauth/callback
```

**Local:**
```bash
yarn dev
# Tente fazer login e veja os logs no terminal
```

### 3️⃣ Testar redirect URI

```bash
# Abra no navegador (substitua valores):
https://accounts.google.com/o/oauth2/v2/auth?client_id=SEU_CLIENT_ID&redirect_uri=https://zapagenda.vercel.app/api/google/oauth/callback&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline

# Se aparecer erro de redirect_uri_mismatch, 
# copie o redirect_uri da URL e adicione no Google Console
```

### 4️⃣ Verificar configuração do Google

```bash
# Google Console → Credentials
# Clique no seu OAuth Client ID
# Verifique:
# - Origens JavaScript: lista tem sua URL?
# - URIs de redirecionamento: lista tem seu callback?
# - Client ID e Secret estão corretos?
```

---

## 📊 Checklist de Diagnóstico

```
Google Cloud Console:
┌─────────────────────────────────────────────┐
│ [ ] Projeto criado                          │
│ [ ] Google Calendar API ativada             │
│ [ ] Google People API ativada               │
│ [ ] OAuth Client ID criado                  │
│ [ ] Tipo: "Aplicativo da Web"               │
│ [ ] Origens JS têm sua URL                  │
│ [ ] Redirects têm /api/google/oauth/callback│
│ [ ] Client ID copiado corretamente          │
│ [ ] Client Secret copiado corretamente      │
│ [ ] Tela de consentimento configurada       │
│ [ ] Escopos calendar e userinfo.email       │
└─────────────────────────────────────────────┘

Vercel:
┌─────────────────────────────────────────────┐
│ [ ] GOOGLE_CLIENT_ID configurado            │
│ [ ] GOOGLE_CLIENT_SECRET configurado        │
│ [ ] APP_BASE_URL configurado                │
│ [ ] Variáveis em "Production"               │
│ [ ] Sem espaços/quebras nas variáveis       │
│ [ ] Deploy recente (após config)            │
└─────────────────────────────────────────────┘

Teste:
┌─────────────────────────────────────────────┐
│ [ ] Aguardou 5-10 min após config           │
│ [ ] URL bate: Vercel = Google Console       │
│ [ ] Acessa /dashboard/configuracoes         │
│ [ ] Clica "Conectar Google Calendar"        │
│ [ ] Redireciona para Google                 │
│ [ ] Permite acesso                          │
│ [ ] Retorna para DaTempo                    │
│ [ ] Calendários aparecem listados           │
└─────────────────────────────────────────────┘
```

---

## 🆘 Ainda não funciona?

### 1. Documente o erro exato
```bash
# Copie o erro completo, exemplo:
Error: redirect_uri_mismatch
The redirect URI in the request: https://...
did not match a registered redirect URI
```

### 2. Verifique logs completos
```bash
# Vercel: Deployments → Functions → Logs
# Copie todo o stack trace
```

### 3. Compare configurações

**Google Console:**
```
Origens JS: https://zapagenda.vercel.app
Redirects: https://zapagenda.vercel.app/api/google/oauth/callback
```

**Vercel:**
```
APP_BASE_URL: https://zapagenda.vercel.app
GOOGLE_CLIENT_ID: 123...-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET: GOCSPX-...
```

**Devem estar IDÊNTICOS!**

---

## 📚 Recursos Adicionais

- **Google OAuth 2.0 Docs**: https://developers.google.com/identity/protocols/oauth2
- **Vercel Env Vars**: https://vercel.com/docs/concepts/projects/environment-variables
- **Google Calendar API**: https://developers.google.com/calendar/api/guides/overview
- **Guia Completo DaTempo**: `/docs/CONFIGURACAO-OAUTH-GOOGLE.md`
- **Guia Visual**: `/docs/OAUTH-GUIA-VISUAL.md`

---

*Troubleshooting DaTempo 🕰️ - Outubro 2025*
