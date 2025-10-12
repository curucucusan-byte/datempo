# 🔄 Guia Completo: Render vs Vercel - DaTempo

> Diferenças e como configurar OAuth no Render

---

## 🎯 Mudança de Plataforma

**Antes:** Vercel (`.vercel.app`)  
**Agora:** Render (`.onrender.com`)

---

## 🔍 Comparação Render vs Vercel

| Aspecto | Vercel | Render |
|---------|--------|--------|
| **URL padrão** | `projeto.vercel.app` | `projeto.onrender.com` |
| **Deploy** | Git push ou CLI | Git push (automático) |
| **Env Vars** | Settings → Environment Variables | Environment tab |
| **Redeploy** | Manual ou automático | Automático ao salvar env |
| **Tempo deploy** | 2-3 minutos | 5-10 minutos |
| **Free tier** | Hobby (bom) | Free (limitado) |
| **Domínio custom** | Fácil | Fácil |

---

## 🚀 Configuração OAuth no Render

### 1️⃣ Descubra sua URL Render

**Dashboard:**
```
https://dashboard.render.com
→ Services
→ [Seu App DaTempo]
→ URL aparece no topo (ex: https://datempo.onrender.com)
```

**Exemplos de URL:**
- Padrão: `https://datempo.onrender.com`
- Custom: `https://www.datempo.com.br`

---

### 2️⃣ Configure Google OAuth

**Acesse:** https://console.cloud.google.com/apis/credentials

**Pergunta do Google:**
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Que dados você acessará?           ┃
┃                                     ┃
┃ ( ● ) Dados do usuário             ┃  ← ESCOLHA ESTA
┃ (   ) Dados do aplicativo          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Escolha:** `Dados do usuário` (OAuth)

**Por quê?**
- ✅ Cada cliente conecta seu próprio Google Calendar
- ✅ App acessa calendários de múltiplos usuários
- ✅ Requer autorização de cada usuário

**NÃO escolha "Dados do aplicativo" (Service Account):**
- ❌ Seria para um único calendário fixo do app
- ❌ Não funciona para multi-usuário

---

### 3️⃣ Preencha Formulário OAuth

**Tipo de aplicativo:**
```
Aplicativo da Web
```

**Nome:**
```
DaTempo OAuth Client
```

**Origens JavaScript autorizadas:**
```
https://datempo.onrender.com
```
*(substitua por sua URL Render)*

**Para desenvolvimento local, adicione também:**
```
http://localhost:3000
```

**URIs de redirecionamento autorizados:**
```
https://datempo.onrender.com/api/google/oauth/callback
```

**Para desenvolvimento local, adicione também:**
```
http://localhost:3000/api/google/oauth/callback
```

---

### 4️⃣ Configure Variáveis no Render

**Acesse:**
```
https://dashboard.render.com
→ Seu serviço
→ Environment (tab lateral esquerda)
```

**Adicione 3 variáveis:**

#### Variável 1: GOOGLE_CLIENT_ID
```
Key: GOOGLE_CLIENT_ID
Value: [cole o Client ID do Google]
```

#### Variável 2: GOOGLE_CLIENT_SECRET
```
Key: GOOGLE_CLIENT_SECRET
Value: [cole o Client Secret do Google]
```

#### Variável 3: APP_BASE_URL
```
Key: APP_BASE_URL
Value: https://datempo.onrender.com
```
*(sua URL Render, SEM barra no final)*

**Importante:**
- ✅ Clique em **"Save Changes"** depois de adicionar as 3
- ✅ Render fará **redeploy automático** (aguarde 5-10 min)

---

## 📋 Exemplo Completo

### Render URL: `https://datempo.onrender.com`

**Google Console:**
```
✓ Dados do usuário (OAuth)
✓ Tipo: Aplicativo da Web
✓ Nome: DaTempo OAuth Client

Origens JS:
  1. https://datempo.onrender.com
  2. http://localhost:3000 (dev)

Redirects:
  1. https://datempo.onrender.com/api/google/oauth/callback
  2. http://localhost:3000/api/google/oauth/callback (dev)
```

**Render Environment:**
```
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz...
APP_BASE_URL=https://datempo.onrender.com
```

---

## ⚙️ Diferenças Importantes

### Variáveis de Ambiente

**Vercel:**
```
1. Settings → Environment Variables
2. Adiciona cada variável
3. Escolhe ambiente: Production / Preview / Development
4. Redeploy manual ou via Git
```

**Render:**
```
1. Environment tab
2. Adiciona cada variável
3. NÃO precisa escolher ambiente (sempre produção)
4. Redeploy AUTOMÁTICO ao salvar
```

### Deploy

**Vercel:**
```bash
# Opção 1: Git
git push origin main

# Opção 2: CLI
vercel --prod
```

**Render:**
```bash
# Apenas Git (Render monitora branch)
git push origin main

# Deploy automático!
```

### URLs de Callback

**Vercel:**
```
https://seu-projeto.vercel.app/api/google/oauth/callback
```

**Render:**
```
https://seu-projeto.onrender.com/api/google/oauth/callback
```

---

## 🔧 Migrando de Vercel para Render

Se você já tinha configurado no Vercel:

### 1. Copie variáveis do Vercel

**Acesse Vercel:**
```
https://vercel.com/seu-projeto/settings/environment-variables
```

**Copie:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APP_BASE_URL`
- Todas as outras variáveis (Firebase, Stripe, etc.)

### 2. Cole no Render

**Acesse Render:**
```
https://dashboard.render.com/seu-servico → Environment
```

**Cole todas as variáveis**

**⚠️ Atualize `APP_BASE_URL`:**
```
# Antes (Vercel):
APP_BASE_URL=https://zapagenda.vercel.app

# Depois (Render):
APP_BASE_URL=https://datempo.onrender.com
```

### 3. Atualize Google Console

**Adicione novas URLs Render:**
```
Origens JS:
  https://datempo.onrender.com (ADICIONE)
  https://zapagenda.vercel.app (pode deixar ou remover)

Redirects:
  https://datempo.onrender.com/api/google/oauth/callback (ADICIONE)
  https://zapagenda.vercel.app/api/google/oauth/callback (pode deixar)
```

### 4. Teste

```bash
# Aguarde 10-15 minutos
# - 5-10 min: Render deploy
# - 5-10 min: Google propagação

# Acesse:
https://datempo.onrender.com/dashboard/configuracoes

# Teste OAuth
```

---

## 🆘 Troubleshooting Render

### Erro: "redirect_uri_mismatch"

**Causa:** URL Render não cadastrada no Google

**Solução:**
```
1. Copie a URL do erro
2. Vá no Google Console
3. Adicione EXATAMENTE essa URL em "URIs de redirecionamento"
4. Aguarde 10 minutos
5. Tente novamente
```

### Variáveis não aparecem no app

**Causa:** Render não fez redeploy

**Solução:**
```
1. Render Dashboard → Seu serviço
2. Manual Deploy → "Clear build cache & deploy"
3. Aguarde deploy completar
```

### App não inicia após adicionar variáveis

**Causa:** Variável com valor errado

**Solução:**
```
1. Verifique logs: Dashboard → Logs
2. Procure erros como:
   - "Variável X não configurada"
   - "Firebase error"
   - "Invalid credentials"
3. Corrija a variável
4. Render fará redeploy automático
```

### Deploy muito lento

**Normal no Render Free Tier:**
- First deploy: 10-15 min
- Deploys seguintes: 5-10 min
- Cold start: 1-2 min (após inatividade)

**Render Paid:**
- Deploys: 3-5 min
- Sem cold start

---

## 📊 Checklist Migração

```
Preparação:
☐ Copiou todas variáveis do Vercel
☐ Descobriu URL Render
☐ Atualizou APP_BASE_URL

Google Console:
☐ Adicionou URL Render nas Origens JS
☐ Adicionou callback Render nos Redirects
☐ Aguardou 10 minutos

Render:
☐ Colou todas as variáveis
☐ Salvou (Save Changes)
☐ Aguardou redeploy (5-10 min)

Teste:
☐ Acessou URL Render
☐ Testou OAuth
☐ Funcionou ✅

Limpeza (opcional):
☐ Removeu variáveis do Vercel
☐ Removeu URLs Vercel do Google Console
☐ Pausou/deletou projeto Vercel
```

---

## 🔗 Links Úteis

| Recurso | URL |
|---------|-----|
| Render Dashboard | https://dashboard.render.com |
| Render Docs | https://render.com/docs |
| Google Cloud Console | https://console.cloud.google.com |
| OAuth Credentials | https://console.cloud.google.com/apis/credentials |

---

## 💡 Dicas Render

### 1. Variáveis Sensíveis
```
Render suporta "Secret Files" para chaves privadas longas
Environment → Secret Files → Add Secret File

Use para:
- FIREBASE_PRIVATE_KEY (se muito longo)
- Certificados SSL
```

### 2. Health Check
```
Render faz health check em:
GET /

Certifique-se que / responde 200 OK
```

### 3. Auto-Deploy
```
Render → Settings → Build & Deploy
☑ Auto-Deploy: Yes (recomendado)

Cada push no branch main = deploy automático
```

### 4. Logs
```
Dashboard → Logs → Ver em tempo real

Útil para debug de OAuth e variáveis
```

---

## ✅ Resumo

**Render vs Vercel para OAuth:**

| Tarefa | Vercel | Render |
|--------|--------|--------|
| Descobrir URL | vercel.app | onrender.com |
| Adicionar env vars | Settings → Env | Environment tab |
| Redeploy | Manual | Automático |
| Tempo deploy | 2-3 min | 5-10 min |
| OAuth callback | `.vercel.app/api/...` | `.onrender.com/api/...` |

**Diferença principal:** Render faz **redeploy automático** ao salvar variáveis!

---

*DaTempo - Render Configuration Guide 🕰️*  
*Outubro 2025*
