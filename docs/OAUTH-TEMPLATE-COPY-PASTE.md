# 📋 Template Copy-Paste - Google OAuth Console

> Copie e cole os valores abaixo diretamente no Google Cloud Console

---

## 🔹 Tipo de aplicativo
```
Aplicativo da Web
```

---

## 🔹 Nome
```
DaTempo OAuth Client
```

---

## 🔹 Origens JavaScript autorizadas

### ⚠️ ESCOLHA UMA DAS OPÇÕES:

### Opção A: Vercel (padrão)
**Substitua `SEU-PROJETO` pelo nome do seu projeto no Vercel**

```
https://SEU-PROJETO.vercel.app
```

Exemplo:
```
https://zapagenda.vercel.app
```

### Opção B: Domínio Customizado
**Se você tem domínio próprio (ex: datempo.com.br)**

```
https://www.datempo.com.br
https://datempo.com.br
```

### Opção C: Desenvolvimento Local (adicione também)
```
http://localhost:3000
```

---

## 🔹 URIs de redirecionamento autorizados

### ⚠️ IMPORTANTE: Adicione `/api/google/oauth/callback` no final

### Opção A: Vercel (padrão)
**Substitua `SEU-PROJETO` pelo nome do seu projeto no Vercel**

```
https://SEU-PROJETO.vercel.app/api/google/oauth/callback
```

Exemplo:
```
https://zapagenda.vercel.app/api/google/oauth/callback
```

### Opção B: Domínio Customizado

```
https://www.datempo.com.br/api/google/oauth/callback
https://datempo.com.br/api/google/oauth/callback
```

### Opção C: Desenvolvimento Local (adicione também)

```
http://localhost:3000/api/google/oauth/callback
```

---

## ✅ Configuração Completa Recomendada

### Para Produção + Desenvolvimento:

**Origens JavaScript:**
```
https://SEU-PROJETO.vercel.app
http://localhost:3000
```

**URIs de Redirecionamento:**
```
https://SEU-PROJETO.vercel.app/api/google/oauth/callback
http://localhost:3000/api/google/oauth/callback
```

---

## 🎯 Como Descobrir "SEU-PROJETO"

### Via Vercel Dashboard:
1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto
3. A URL está em **"Domains"** (ex: `zapagenda.vercel.app`)

### Via Terminal:
```bash
vercel ls
```

---

## 🔐 Após Criar o Client ID

Você receberá:
```
Client ID: 123456789-abc123xyz.apps.googleusercontent.com
Client Secret: GOCSPX-abc123xyz...
```

### Configure no Vercel:

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables

2. Adicione (uma por vez):

```
Nome: GOOGLE_CLIENT_ID
Valor: [cole o Client ID aqui]
Environment: Production ✓

Nome: GOOGLE_CLIENT_SECRET
Valor: [cole o Client Secret aqui]
Environment: Production ✓

Nome: APP_BASE_URL
Valor: https://SEU-PROJETO.vercel.app
Environment: Production ✓
```

3. **Redeploy** o projeto

---

## 🧪 Teste

1. Aguarde 5-10 minutos (propagação das configurações)
2. Acesse: `https://SEU-PROJETO.vercel.app/dashboard/configuracoes`
3. Clique em **"Conectar Google Calendar"**
4. Autorize as permissões
5. Deve retornar para o dashboard com calendários listados ✅

---

## 🆘 Deu Erro?

### "Origem inválida: o URI não pode estar vazio"
- ✅ Você esqueceu de preencher o campo
- ✅ Cole: `https://SEU-PROJETO.vercel.app`

### "redirect_uri_mismatch"
- ✅ Verifique se adicionou `/api/google/oauth/callback` no final
- ✅ Aguarde 10 minutos (pode estar em propagação)
- ✅ Certifique-se que não tem espaços ou `/` extra no final

### "invalid_client"
- ✅ Verifique Client ID e Secret no Vercel
- ✅ Não pode ter espaços no início/fim
- ✅ Certifique-se que está no ambiente "Production"

---

*Template criado para DaTempo 🕰️*
