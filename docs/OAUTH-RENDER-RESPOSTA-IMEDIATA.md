# ⚡ RESPOSTA IMEDIATA - OAuth Google (Render)

## 🎯 Sua Pergunta: Qual opção escolher?

Na tela do Google Cloud Console:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Que dados você acessará?                   ┃
┃                                             ┃
┃ ( ) Dados do usuário                       ┃
┃     Dados de um usuário do Google          ┃
┃     O consentimento do usuário é           ┃
┃     obrigatório. Isso vai criar um         ┃
┃     cliente OAuth.                          ┃
┃                                             ┃
┃ ( ) Dados do aplicativo                    ┃
┃     Dados do seu próprio aplicativo        ┃
┃     Isso vai criar uma conta de serviço.   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## ✅ ESCOLHA: **Dados do usuário**

**Marque:** `( ● ) Dados do usuário`

### Por quê?

O DaTempo precisa:
- ✅ Acessar calendários **de cada usuário** (não um calendário fixo)
- ✅ Cada cliente conecta **seu próprio** Google Calendar
- ✅ Criar eventos **no calendário do usuário**
- ✅ Pedir permissão para cada usuário

**Isso é OAuth!** Cada usuário autoriza o app a acessar seus próprios dados.

---

## ❌ NÃO escolha "Dados do aplicativo"

**Service Account** seria para:
- ❌ Acessar um único calendário fixo do app
- ❌ Operações em background sem usuário
- ❌ Sincronização de calendário corporativo único

**Não é o caso do DaTempo!**

---

## 🚀 Próximos Passos (depois de escolher OAuth)

### 1️⃣ Descubra sua URL no Render

**Opção A: Dashboard Render**
```
1. Acesse: https://dashboard.render.com
2. Clique no seu serviço (DaTempo)
3. Copie a URL (ex: datempo.onrender.com)
```

**Opção B: Configurações do Deploy**
```
Render → Services → [seu-app] → Settings → URL
```

**Exemplo de URL:**
```
https://datempo.onrender.com
```

ou (se tiver domínio customizado):
```
https://www.datempo.com.br
```

---

### 2️⃣ Preencha no Google Console

Após escolher "Dados do usuário", você verá:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Criar ID do cliente do OAuth               ┃
┃                                             ┃
┃ Tipo de aplicativo: [ Aplicativo da Web ]  ┃
┃                                             ┃
┃ Nome: [                                 ]  ┃
┃                                             ┃
┃ Origens JavaScript autorizadas:            ┃
┃ URIs: [                                 ]  ┃
┃                                             ┃
┃ URIs de redirecionamento autorizados:      ┃
┃ URIs: [                                 ]  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Preencha:**

**Tipo de aplicativo:**
```
Aplicativo da Web
```

**Nome:**
```
DaTempo OAuth Client
```

**Origens JavaScript autorizadas (URIs 1):**
```
https://datempo.onrender.com
```
*(substitua por sua URL do Render)*

**URIs de redirecionamento autorizados (URIs 1):**
```
https://datempo.onrender.com/api/google/oauth/callback
```
*(sua URL + `/api/google/oauth/callback`)*

---

### 3️⃣ Configure no Render

**Acesse:** https://dashboard.render.com → Seu serviço → Environment

**Adicione 3 variáveis:**

```
Nome: GOOGLE_CLIENT_ID
Valor: [cole o Client ID que o Google dará]

Nome: GOOGLE_CLIENT_SECRET
Valor: [cole o Client Secret que o Google dará]

Nome: APP_BASE_URL
Valor: https://datempo.onrender.com
```

**Importante:**
- ✅ Clique em **"Save Changes"** após adicionar cada variável
- ✅ O Render vai fazer **redeploy automático**

---

## 📋 Exemplo Completo (Render)

### Se sua URL Render é: `https://datempo.onrender.com`

**Google Console:**
```
Tipo: Aplicativo da Web
Nome: DaTempo OAuth Client

Origens JS:
  1. https://datempo.onrender.com
  2. http://localhost:3000 (opcional, para dev local)

Redirects:
  1. https://datempo.onrender.com/api/google/oauth/callback
  2. http://localhost:3000/api/google/oauth/callback (opcional)
```

**Render Environment Variables:**
```
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz...
APP_BASE_URL=https://datempo.onrender.com
```

---

## ⏱️ Timeline

```
1. Escolher "Dados do usuário"              ← Você está aqui
2. Preencher formulário OAuth                (2 min)
3. Copiar credenciais                        (1 min)
4. Configurar Render Environment Variables   (3 min)
5. Aguardar redeploy Render                  (5-10 min)
6. Aguardar propagação Google                (5-10 min)
7. Testar!                                   (2 min)

Total: ~20-30 minutos
```

---

## 🆘 Diferenças: Vercel vs Render

| Aspecto | Vercel | Render |
|---------|--------|--------|
| **URL padrão** | `.vercel.app` | `.onrender.com` |
| **Variáveis** | Dashboard → Settings → Env | Dashboard → Environment |
| **Redeploy** | Manual ou Git push | Automático ao salvar env vars |
| **Tempo deploy** | 2-3 min | 5-10 min |

**No seu caso:** Use URLs `.onrender.com` em vez de `.vercel.app`!

---

## ✅ Checklist Rápido

```
Google Console:
☐ Selecionou "Dados do usuário" (OAuth)
☐ Tipo: "Aplicativo da Web"
☐ Nome: "DaTempo OAuth Client"
☐ Origem: https://datempo.onrender.com
☐ Redirect: https://datempo.onrender.com/api/google/oauth/callback
☐ Copiou Client ID
☐ Copiou Client Secret

Render:
☐ Acessou dashboard.render.com
☐ Selecionou seu serviço
☐ Clicou em "Environment"
☐ Adicionou GOOGLE_CLIENT_ID
☐ Adicionou GOOGLE_CLIENT_SECRET
☐ Adicionou APP_BASE_URL
☐ Salvou (Save Changes)
☐ Aguardou redeploy

Teste:
☐ Aguardou 10-15 minutos total
☐ Acessou https://datempo.onrender.com/dashboard/configuracoes
☐ Clicou "Conectar Google Calendar"
☐ Autorizou
☐ Funcionou! ✅
```

---

## 💡 Resumo de 10 Segundos

1. **Escolha:** "Dados do usuário" (OAuth)
2. **URL Render:** `https://datempo.onrender.com`
3. **Redirect:** `https://datempo.onrender.com/api/google/oauth/callback`
4. **Render Env:** Adicione 3 variáveis
5. **Aguarde:** 15 minutos
6. **Teste:** Funciona! ✅

---

*DaTempo no Render - Configuração OAuth 🕰️*
