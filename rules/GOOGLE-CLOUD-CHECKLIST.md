# ✅ Checklist Google Cloud - ZapAgenda

## 📍 Como Acessar o Projeto

### 1. Acesse o Google Cloud Console
👉 **URL**: https://console.cloud.google.com/apis/credentials

### 2. Identifique o Projeto Correto
- Procure pelo **Client ID** que tem as URIs que você configurou
- Deve aparecer algo como: `xxxxxxxx.apps.googleusercontent.com`
- Verifique se tem as URIs de redirecionamento corretas

---

## ✅ Configurações Atuais (Confirmadas)

### **Origens JavaScript Autorizadas**
```
✅ http://localhost
✅ https://zapagenda-3e479.firebaseapp.com
✅ https://zap-agenda.onrender.com
```

### **URIs de Redirecionamento Autorizados**
```
✅ https://zapagenda-3e479.firebaseapp.com/__/auth/handler
✅ https://zap-agenda.onrender.com/api/google/oauth/callback
```

---

## 🔍 Itens para Verificar no Google Cloud

### 1️⃣ **APIs Habilitadas**
📍 **URL**: https://console.cloud.google.com/apis/library

Verifique se estas APIs estão **HABILITADAS**:
- [ ] **Google Calendar API** ← MAIS IMPORTANTE
- [ ] **Google+ API** (ou People API)
- [ ] **Cloud Resource Manager API** (opcional)

**Como verificar:**
1. Vá em: https://console.cloud.google.com/apis/dashboard
2. Procure por "Google Calendar API"
3. Se aparecer "API habilitada" ✅ está OK
4. Se não estiver, clique em "ATIVAR API"

---

### 2️⃣ **Tela de Consentimento OAuth**
📍 **URL**: https://console.cloud.google.com/apis/credentials/consent

Verifique:
- [ ] **Tipo de usuário**: Externo (para qualquer pessoa usar) ou Interno (só sua organização)
- [ ] **Status de publicação**: 
  - Se "Em produção" ✅ = Qualquer pessoa pode usar
  - Se "Em teste" ⚠️ = Só usuários de teste podem usar (limite de 100 usuários)
- [ ] **Escopos configurados**:
  - `https://www.googleapis.com/auth/calendar` ← OBRIGATÓRIO
  - `https://www.googleapis.com/auth/calendar.events` ← OBRIGATÓRIO
  - `email` e `profile` (padrão)

**Como verificar escopos:**
1. Vá em: https://console.cloud.google.com/apis/credentials/consent
2. Clique em "EDITAR APLICATIVO"
3. Role até "Escopos" → Veja se tem os escopos do Calendar

---

### 3️⃣ **Credenciais OAuth 2.0**
📍 **URL**: https://console.cloud.google.com/apis/credentials

Verifique:
- [ ] **Nome do Client**: Pode ser qualquer coisa (ex: "ZapAgenda Web")
- [ ] **Client ID**: Copie e confira se está igual no Render
- [ ] **Client Secret**: Copie e confira se está igual no Render

**Variáveis de Ambiente no Render:**
```bash
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_REDIRECT_URI=https://zap-agenda.onrender.com/api/google/oauth/callback
```

---

### 4️⃣ **Usuários de Teste (Se app está "Em teste")**
📍 **URL**: https://console.cloud.google.com/apis/credentials/consent

Se o app está **"Em teste"** (não publicado):
- [ ] Adicione os emails dos usuários que vão testar
- [ ] Máximo de 100 usuários de teste
- [ ] **Alternativa**: Publicar o app (botão "PUBLICAR APLICATIVO")

**⚠️ IMPORTANTE**: Se seu app está "Em teste" e você tenta conectar uma conta que NÃO está na lista de teste, vai dar erro:
```
Error 403: access_denied
This app is blocked
```

---

## 🐛 Problemas Comuns e Soluções

### ❌ Problema 1: "Error 403: access_denied"
**Causa**: App em modo teste e usuário não está na lista
**Solução**:
1. Vá em: https://console.cloud.google.com/apis/credentials/consent
2. Adicione o email do usuário em "Usuários de teste"
3. OU clique em "PUBLICAR APLICATIVO"

### ❌ Problema 2: "redirect_uri_mismatch"
**Causa**: URI de redirecionamento não configurada
**Solução**:
1. Vá em: https://console.cloud.google.com/apis/credentials
2. Clique no seu Client ID
3. Em "URIs de redirecionamento autorizados", adicione:
   ```
   https://zap-agenda.onrender.com/api/google/oauth/callback
   ```

### ❌ Problema 3: Google Calendar API não funciona
**Causa**: API não habilitada
**Solução**:
1. Vá em: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
2. Clique em "ATIVAR"
3. Aguarde 1-2 minutos para propagar

### ❌ Problema 4: Token expirado/revogado
**Causa**: Usuário revogou acesso ou token expirou
**Solução**:
1. Usuário precisa reconectar no Dashboard
2. Vá em: https://zap-agenda.onrender.com/dashboard
3. Clique em "Conectar Google Calendar" novamente

---

## 🧪 Como Testar se Está Funcionando

### Teste 1: Health Check
```bash
# Faça login no dashboard primeiro
curl https://zap-agenda.onrender.com/api/health/google
```

**Resposta esperada (SUCESSO)**:
```json
{
  "ok": true,
  "calendarsCount": 3
}
```

**Resposta com erro**:
```json
{
  "error": "Google Calendar não conectado"
}
```

### Teste 2: Criar Agendamento
1. Abra: https://zap-agenda.onrender.com/agenda/[seu-slug]
2. Preencha o formulário
3. Clique em "Agendar"
4. Verifique no Google Calendar se o evento apareceu

### Teste 3: Ver Logs no Render
1. Vá em: https://dashboard.render.com
2. Selecione o serviço "zap-agenda"
3. Clique em "Logs"
4. Procure por:
   - `[apt:google:event:success]` ✅ = Evento criado
   - `[apt:google:event:failed]` ❌ = Erro ao criar evento
   - `[google:event:create:error]` ❌ = Erro na API

---

## 📋 Checklist Completo de Configuração

### No Google Cloud Console
- [x] Projeto criado ✅ `project-966992499199`
- [ ] **VERIFICAR**: Google Calendar API habilitada
- [x] OAuth Client criado ✅ `966992499199-54vv...` (tipo: Aplicativo da Web)
- [x] URIs de origem autorizadas ✅ `zap-agenda.onrender.com`, `zapagenda-3e479.firebaseapp.com`
- [x] URIs de redirecionamento ✅ `/api/google/oauth/callback`
- [x] Tela de consentimento configurada ✅
  - [x] Nome: `project-966992499199` ⚠️ **TROCAR PARA "ZapAgenda"**
  - [x] Email: `mgotze@gmail.com` ✅
  - [x] Página inicial: `https://zap-agenda.onrender.com` ✅
  - [x] Privacidade: `https://zap-agenda.onrender.com/privacidade` ✅
  - [x] Termos: `https://zap-agenda.onrender.com/termos` ✅
  - [ ] **ADICIONAR**: Logotipo (usar `public/logos/calendar.png`)
- [ ] **VERIFICAR**: Escopos do Calendar adicionados
  - [ ] `https://www.googleapis.com/auth/calendar`
  - [ ] `https://www.googleapis.com/auth/calendar.events`
- [ ] **VERIFICAR**: App publicado OU usuários de teste adicionados

### No Render Dashboard
- [ ] `GOOGLE_CLIENT_ID` configurado
- [ ] `GOOGLE_CLIENT_SECRET` configurado
- [ ] `GOOGLE_REDIRECT_URI` configurado
- [ ] `APP_BASE_URL` configurado (https://zap-agenda.onrender.com)

### No Firebase/Firestore
- [ ] Coleção `linkedCalendars` existe
- [ ] Documentos têm campo `tokens` com `access_token` e `refresh_token`
- [ ] Campo `calendarId` está preenchido (ex: `primary` ou `email@gmail.com`)

---

## 🔗 Links Úteis

- **Google Cloud Console**: https://console.cloud.google.com
- **APIs Habilitadas**: https://console.cloud.google.com/apis/dashboard
- **Credenciais OAuth**: https://console.cloud.google.com/apis/credentials
- **Tela de Consentimento**: https://console.cloud.google.com/apis/credentials/consent
- **Calendar API**: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
- **Render Dashboard**: https://dashboard.render.com
- **Troubleshooting Completo**: ./TROUBLESHOOTING-AGENDAMENTO.md

---

## 💡 Dica Final

Se você ainda não consegue encontrar o projeto no Google Cloud:

1. **Vá direto nas credenciais**: https://console.cloud.google.com/apis/credentials
2. **Procure pelo Client ID** que está no Render (variável `GOOGLE_CLIENT_ID`)
3. Ao clicar nele, você verá o nome do projeto no topo
4. Pronto! Agora você sabe qual é o projeto 🎯
