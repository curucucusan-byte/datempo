# ⚡ Resposta IMEDIATA - Configuração OAuth Google

> **Para preencher o formulário do Google Console AGORA**

---

## 🎯 Você está vendo esta tela:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Criar ID do cliente do OAuth                         ┃
┃                                                       ┃
┃ Tipo de aplicativo: [ Aplicativo da Web ▼ ]         ┃
┃                                                       ┃
┃ Nome: [                                          ]   ┃
┃                                                       ┃
┃ Origens JavaScript autorizadas:                      ┃
┃ URIs: [                                          ]   ┃
┃                                                       ┃
┃ URIs de redirecionamento autorizados:                ┃
┃ URIs: [                                          ]   ┃
┃                                                       ┃
┃                            [ Criar ]  [ Cancelar ]   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## ✅ PREENCHA ASSIM:

### 1️⃣ Tipo de aplicativo
```
Aplicativo da Web
```
*(já deve estar selecionado)*

---

### 2️⃣ Nome
```
DaTempo OAuth Client
```
*(ou qualquer nome que você preferir - é só para identificação interna)*

---

### 3️⃣ Origens JavaScript autorizadas

**⚠️ PRIMEIRO: Descubra sua URL Vercel**

Execute no terminal:
```bash
cd /home/zola/Dispensary/zapagenda
vercel ls
```

Ou acesse: https://vercel.com/dashboard e veja a URL do projeto.

**Exemplo de resultado:**
```
zapagenda-123abc.vercel.app
```

**AGORA PREENCHA:**

**Campo "URIs 1":**
```
https://zapagenda-123abc.vercel.app
```
*(substitua "zapagenda-123abc" pela URL que você descobriu)*

**Se quiser testar localmente também, clique "+ Adicionar URI" e adicione:**

**Campo "URIs 2":**
```
http://localhost:3000
```

---

### 4️⃣ URIs de redirecionamento autorizados

**Campo "URIs 1":**
```
https://zapagenda-123abc.vercel.app/api/google/oauth/callback
```
*(mesma URL de antes + `/api/google/oauth/callback`)*

**Se quiser testar localmente também, clique "+ Adicionar URI" e adicione:**

**Campo "URIs 2":**
```
http://localhost:3000/api/google/oauth/callback
```

---

## 📋 Exemplo COMPLETO Preenchido:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Criar ID do cliente do OAuth                               ┃
┃                                                             ┃
┃ Tipo de aplicativo: [ Aplicativo da Web ▼ ]               ┃
┃                                                             ┃
┃ Nome: [ DaTempo OAuth Client                           ]   ┃
┃                                                             ┃
┃ Origens JavaScript autorizadas:                            ┃
┃ URIs 1: [ https://zapagenda-123abc.vercel.app         ]   ┃
┃ URIs 2: [ http://localhost:3000                        ]   ┃
┃         [+ Adicionar URI]                                  ┃
┃                                                             ┃
┃ URIs de redirecionamento autorizados:                      ┃
┃ URIs 1: [ https://zapagenda-123abc.vercel.app/api/     ]   ┃
┃         [ google/oauth/callback                        ]   ┃
┃ URIs 2: [ http://localhost:3000/api/google/oauth/      ]   ┃
┃         [ callback                                     ]   ┃
┃         [+ Adicionar URI]                                  ┃
┃                                                             ┃
┃                            [ Criar ]  [ Cancelar ]         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🚀 Depois de Clicar "Criar"

Você verá uma tela com:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Cliente OAuth criado                         ┃
┃                                               ┃
┃ ID do cliente:                                ┃
┃ [ 123456-abc.apps.googleusercontent.com ]    ┃
┃                                      [Copiar] ┃
┃                                               ┃
┃ Secret do cliente:                            ┃
┃ [ GOCSPX-abc123xyz456...               ]     ┃
┃                                      [Copiar] ┃
┃                                               ┃
┃                    [ OK ]  [ Fazer download ] ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### ✅ COPIE AMBOS:
1. Clique em **[Copiar]** ao lado do "ID do cliente"
2. Cole num editor de texto (temporariamente)
3. Clique em **[Copiar]** ao lado do "Secret do cliente"
4. Cole num editor de texto (temporariamente)

---

## 🔐 Configure no Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables

2. Adicione **3 variáveis** (uma por vez):

**Variável 1:**
```
Nome: GOOGLE_CLIENT_ID
Valor: [cole o Client ID que copiou]
Environment: ☑ Production
```

**Variável 2:**
```
Nome: GOOGLE_CLIENT_SECRET
Valor: [cole o Client Secret que copiou]
Environment: ☑ Production
```

**Variável 3:**
```
Nome: APP_BASE_URL
Valor: https://zapagenda-123abc.vercel.app
Environment: ☑ Production
```
*(mesma URL que usou nas "Origens JavaScript")*

3. Clique em **"Redeploy"** no último deploy

---

## ⏱️ Aguarde

- **5-10 minutos** para as configurações do Google propagarem
- **2-3 minutos** para o Vercel fazer redeploy

---

## 🧪 Teste

1. Acesse: `https://zapagenda-123abc.vercel.app/dashboard/configuracoes`
2. Clique em **"Conectar Google Calendar"**
3. Deve abrir tela do Google pedindo autorização
4. Clique em **"Permitir"**
5. Deve retornar para o dashboard com calendários listados ✅

---

## 🆘 Se Der Erro

**Erro comum:** `redirect_uri_mismatch`

**Solução:**
1. Copie a URL do erro (geralmente mostra qual redirect_uri foi usado)
2. Volte no Google Console
3. Adicione essa URL EXATA em "URIs de redirecionamento"
4. Aguarde 10 minutos
5. Tente novamente

**Outros erros:**
→ [Troubleshooting Completo](./OAUTH-TROUBLESHOOTING.md)

---

## 📊 Checklist Rápido

```
Google Console:
☐ Tipo: "Aplicativo da Web"
☐ Nome: qualquer (ex: "DaTempo OAuth Client")
☐ Origem JS: https://sua-url-vercel.vercel.app
☐ Origem JS (opcional): http://localhost:3000
☐ Redirect: https://sua-url-vercel.vercel.app/api/google/oauth/callback
☐ Redirect (opcional): http://localhost:3000/api/google/oauth/callback
☐ Copiou Client ID
☐ Copiou Client Secret

Vercel:
☐ Adicionou GOOGLE_CLIENT_ID
☐ Adicionou GOOGLE_CLIENT_SECRET
☐ Adicionou APP_BASE_URL
☐ Marcou "Production" nas 3
☐ Fez redeploy

Teste:
☐ Aguardou 10 minutos
☐ Acessou /dashboard/configuracoes
☐ Clicou "Conectar Google Calendar"
☐ Funcionou ✅
```

---

## 🎯 Resumo Ultra-Rápido

**Preencha no Google Console:**
1. Tipo: `Aplicativo da Web`
2. Nome: `DaTempo OAuth Client`
3. Origem: `https://SUA-URL.vercel.app`
4. Redirect: `https://SUA-URL.vercel.app/api/google/oauth/callback`

**Configure no Vercel:**
1. `GOOGLE_CLIENT_ID` = (copie do Google)
2. `GOOGLE_CLIENT_SECRET` = (copie do Google)
3. `APP_BASE_URL` = `https://SUA-URL.vercel.app`

**Teste:**
1. Aguarde 10 min
2. Acesse `/dashboard/configuracoes`
3. Clique "Conectar Google Calendar"
4. Pronto! ✅

---

*DaTempo - Configuração em 10 minutos 🕰️*
