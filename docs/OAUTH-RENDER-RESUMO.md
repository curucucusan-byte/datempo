# ✅ RESUMO FINAL - OAuth Google com Render

---

## 🎯 SUA SITUAÇÃO AGORA

Você está na tela do Google Cloud Console com esta pergunta:

```
Que dados você acessará?

( ) Dados do usuário
    O consentimento do usuário é obrigatório.
    Isso vai criar um cliente OAuth.

( ) Dados do aplicativo
    Isso vai criar uma conta de serviço.
```

---

## ✅ RESPOSTA IMEDIATA

### Marque: **( ● ) Dados do usuário**

### Por quê?

O DaTempo precisa que **cada usuário** conecte **seu próprio** Google Calendar:

- ✅ João conecta o calendário do João
- ✅ Maria conecta o calendário da Maria
- ✅ Cada um autoriza o app individualmente
- ✅ Cada um vê apenas seus próprios agendamentos

**Isso é OAuth!** = Múltiplos usuários, múltiplos calendários.

### NÃO escolha "Dados do aplicativo"

Seria para:
- ❌ Um único calendário corporativo fixo
- ❌ App rodando sozinho em background
- ❌ Sem interação com usuários

**Não é o caso do DaTempo!**

---

## 🚀 PRÓXIMOS PASSOS

### 1️⃣ Descobrir URL Render

```bash
# Opção 1: Dashboard
https://dashboard.render.com
→ Seu serviço
→ URL aparece no topo

# Opção 2: Email de deploy
Render te enviou email com a URL

# Formato típico:
https://datempo.onrender.com
```

---

### 2️⃣ Preencher Google Console

Após escolher "Dados do usuário":

**Tipo:** `Aplicativo da Web`

**Nome:** `DaTempo OAuth Client`

**Origens JavaScript:**
```
https://datempo.onrender.com
```
*(sua URL Render)*

**Redirects:**
```
https://datempo.onrender.com/api/google/oauth/callback
```
*(sua URL + `/api/google/oauth/callback`)*

---

### 3️⃣ Copiar Credenciais

Google vai mostrar:
```
Client ID: 123456-abc.apps.googleusercontent.com
Client Secret: GOCSPX-abc123xyz...
```

**Copie AMBOS!**

---

### 4️⃣ Configurar Render

**Acesse:** https://dashboard.render.com

1. Clique no seu serviço
2. Clique em **"Environment"** (menu lateral)
3. Adicione 3 variáveis:

```
Key: GOOGLE_CLIENT_ID
Value: [cole o Client ID]

Key: GOOGLE_CLIENT_SECRET
Value: [cole o Client Secret]

Key: APP_BASE_URL
Value: https://datempo.onrender.com
```

4. Clique **"Save Changes"**
5. Render fará **redeploy automático** (5-10 min)

---

### 5️⃣ Aguardar

- ⏱️ **5-10 min**: Render deploy
- ⏱️ **5-10 min**: Google propagação
- **Total**: ~15 minutos

---

### 6️⃣ Testar

```
1. Acesse: https://datempo.onrender.com/dashboard/configuracoes
2. Clique: "Conectar Google Calendar"
3. Autorize na tela do Google
4. Pronto! ✅
```

---

## 📋 CHECKLIST COMPLETO

```
Google Console:
☐ Escolheu "Dados do usuário" (OAuth)
☐ Tipo: "Aplicativo da Web"
☐ Nome: "DaTempo OAuth Client"
☐ Origem: https://datempo.onrender.com
☐ Redirect: https://datempo.onrender.com/api/google/oauth/callback
☐ Copiou Client ID
☐ Copiou Client Secret

Render:
☐ Descobriu URL (.onrender.com)
☐ Acessou Dashboard → Environment
☐ Adicionou GOOGLE_CLIENT_ID
☐ Adicionou GOOGLE_CLIENT_SECRET
☐ Adicionou APP_BASE_URL
☐ Clicou "Save Changes"
☐ Aguardou redeploy (5-10 min)

Teste:
☐ Aguardou 15 minutos total
☐ Acessou /dashboard/configuracoes
☐ Clicou "Conectar Google Calendar"
☐ Autorizou
☐ Funcionou! ✅
```

---

## 🆘 SE DER ERRO

### "redirect_uri_mismatch"
```
1. Copie a URL do erro
2. Vá no Google Console
3. Adicione essa URL EXATA em "URIs de redirecionamento"
4. Aguarde 10 minutos
5. Tente novamente
```

### "invalid_client"
```
1. Verifique Client ID e Secret no Render
2. Não pode ter espaços ou quebras de linha
3. Corrija se necessário
4. Render fará redeploy automático
```

### "Variáveis não aparecem"
```
1. Render Dashboard → Logs
2. Veja se redeploy completou
3. Se não, force: Manual Deploy → "Clear build cache & deploy"
```

---

## 📚 DOCUMENTAÇÃO

**Criada para você:**

1. **[OAUTH-RENDER-RESPOSTA-IMEDIATA.md](./OAUTH-RENDER-RESPOSTA-IMEDIATA.md)**
   - ⚡ Resposta para sua pergunta específica
   - Passo a passo com Render

2. **[OAUTH-RENDER-VS-VERCEL.md](./OAUTH-RENDER-VS-VERCEL.md)**
   - 🔄 Diferenças Render vs Vercel
   - Guia completo de migração
   - Troubleshooting Render

3. **Docs OAuth anteriores** (atualizados para Render):
   - OAUTH-QUICK-START.md
   - OAUTH-GUIA-VISUAL.md
   - OAUTH-TROUBLESHOOTING.md
   - Etc.

---

## 🎯 RESUMO DE 30 SEGUNDOS

1. **Google:** Escolha "Dados do usuário" (OAuth)
2. **Tipo:** Aplicativo da Web
3. **Origem:** `https://datempo.onrender.com`
4. **Redirect:** `https://datempo.onrender.com/api/google/oauth/callback`
5. **Render:** Adicione 3 variáveis (Client ID, Secret, APP_BASE_URL)
6. **Aguarde:** 15 minutos
7. **Teste:** Funciona! ✅

---

## 🔗 LINKS RÁPIDOS

| Onde | URL |
|------|-----|
| **Render Dashboard** | https://dashboard.render.com |
| **Google Console** | https://console.cloud.google.com/apis/credentials |
| **Sua app (depois)** | https://datempo.onrender.com |

---

## ✅ TUDO PRONTO!

Agora é só:
1. Escolher "Dados do usuário" no Google ← **VOCÊ ESTÁ AQUI**
2. Seguir os 6 passos acima
3. Aguardar 15 minutos
4. Testar!

**Se tiver qualquer erro, consulte:**
- [OAUTH-RENDER-VS-VERCEL.md](./OAUTH-RENDER-VS-VERCEL.md) (troubleshooting completo)

---

*DaTempo + Render - Outubro 2025 🕰️*
