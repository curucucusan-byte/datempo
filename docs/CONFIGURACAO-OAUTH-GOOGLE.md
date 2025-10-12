# 🔐 Configuração OAuth Google - DaTempo

> Guia completo para criar e configurar o OAuth Client ID no Google Cloud Console

---

## 📋 Informações para Configuração

### 🌐 Tipo de Aplicativo
**Aplicativo da Web** (Web Application)

### 📝 Nome do Cliente
```
DaTempo - Agendamento com WhatsApp
```
ou
```
DaTempo OAuth Client
```

---

## 🔗 URLs de Configuração

### 🌍 Domínios do Projeto

**Produção (Vercel):**
- `https://datempo.vercel.app` (se for o domínio padrão)
- `https://www.datempo.com.br` (se tiver domínio customizado)
- `https://datempo.com.br` (versão sem www)

**Desenvolvimento:**
- `http://localhost:3000`

---

## ⚙️ Configuração Passo a Passo

### 1️⃣ Origens JavaScript Autorizadas
*Para usar com solicitações de um navegador*

**Produção:**
```
https://datempo.vercel.app
```
ou (se tiver domínio customizado):
```
https://www.datempo.com.br
https://datempo.com.br
```

**Desenvolvimento (opcional):**
```
http://localhost:3000
```

**⚠️ IMPORTANTE:**
- ❌ NÃO deixe vazio (erro mostrado)
- ❌ NÃO adicione paths (`/api`, `/callback`)
- ✅ Apenas a origem (protocolo + domínio + porta se necessário)
- ✅ HTTPS em produção, HTTP apenas em localhost

---

### 2️⃣ URIs de Redirecionamento Autorizados
*Para usar com solicitações de um servidor da Web*

Baseado no código em `/src/lib/google.ts`, o callback é:

**Produção:**
```
https://datempo.vercel.app/api/google/oauth/callback
```
ou (se tiver domínio customizado):
```
https://www.datempo.com.br/api/google/oauth/callback
https://datempo.com.br/api/google/oauth/callback
```

**Desenvolvimento (opcional):**
```
http://localhost:3000/api/google/oauth/callback
```

**⚠️ IMPORTANTE:**
- ✅ Deve terminar exatamente com `/api/google/oauth/callback`
- ✅ Deve incluir o protocolo (`https://` ou `http://`)
- ✅ Pode ter múltiplos (produção + dev)
- ⏱️ Pode levar 5 minutos a algumas horas para ativar

---

## 📝 Exemplo Completo de Configuração

### Cenário 1: Usando Vercel (sem domínio customizado)

**Origens JavaScript:**
```
https://datempo.vercel.app
http://localhost:3000
```

**URIs de Redirecionamento:**
```
https://datempo.vercel.app/api/google/oauth/callback
http://localhost:3000/api/google/oauth/callback
```

---

### Cenário 2: Com Domínio Customizado

**Origens JavaScript:**
```
https://www.datempo.com.br
https://datempo.com.br
http://localhost:3000
```

**URIs de Redirecionamento:**
```
https://www.datempo.com.br/api/google/oauth/callback
https://datempo.com.br/api/google/oauth/callback
http://localhost:3000/api/google/oauth/callback
```

---

## 🔑 Variáveis de Ambiente

Após criar o Client ID, você receberá:
- **Client ID**: `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abc123...`

### Configuração no Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables

2. Adicione as variáveis:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui

# URL base da aplicação (para construir redirect URI)
APP_BASE_URL=https://datempo.vercel.app

# (Opcional) Para sobrescrever o redirect URI calculado
# GOOGLE_REDIRECT_URI=https://datempo.vercel.app/api/google/oauth/callback
```

3. **Ambientes:**
   - ✅ Marque: Production
   - ✅ Marque: Preview (opcional)
   - ❌ Development (use `.env.local`)

### Configuração Local (.env.local)

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Google OAuth (Desenvolvimento)
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
APP_BASE_URL=http://localhost:3000

# Firebase (se ainda não tiver)
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
# ... outras variáveis Firebase
```

**⚠️ NÃO commitar** este arquivo! Já deve estar no `.gitignore`.

---

## 🧪 Testando a Configuração

### 1. Testar Localmente

```bash
# Certifique-se que .env.local está configurado
cat .env.local | grep GOOGLE

# Inicie o servidor dev
yarn dev

# Acesse e tente conectar Google Calendar
http://localhost:3000/dashboard/configuracoes
```

### 2. Testar em Produção

```bash
# Deploy no Vercel
vercel --prod

# Ou via Git (push para main)
git add .
git commit -m "feat: configurar Google OAuth"
git push origin main

# Acesse sua URL de produção
https://datempo.vercel.app/dashboard/configuracoes
```

---

## 🔍 Verificação do Callback

O código em `/src/lib/google.ts` constrói o redirect URI assim:

```typescript
function getRedirectUri() {
  const fromEnv = process.env.GOOGLE_REDIRECT_URI;
  if (fromEnv) return fromEnv;
  const base = required("APP_BASE_URL", process.env.APP_BASE_URL).replace(/\/$/, "");
  return `${base}/api/google/oauth/callback`;
}
```

**Lógica:**
1. Se `GOOGLE_REDIRECT_URI` existir → usa direto
2. Senão, pega `APP_BASE_URL` + `/api/google/oauth/callback`

**Então certifique-se:**
- ✅ `APP_BASE_URL` está definido
- ✅ Não tem `/` no final (é removido automaticamente)
- ✅ Protocolo correto (`https://` em prod, `http://` em dev)

---

## 🛡️ Tela de Consentimento OAuth

Os domínios adicionados nas **Origens JavaScript Autorizadas** serão automaticamente adicionados à tela de consentimento como **domínios autorizados**.

### Configuração da Tela de Consentimento

1. Acesse: https://console.cloud.google.com/apis/credentials/consent

2. Configure:
   - **Nome do app**: `DaTempo`
   - **Email de suporte**: seu-email@exemplo.com
   - **Logo** (opcional): Upload do logo DaTempo
   - **Domínios autorizados**: (já preenchido automaticamente)
   - **Link da política de privacidade**: `https://datempo.vercel.app/privacidade`
   - **Link dos termos de serviço**: `https://datempo.vercel.app/termos`

3. **Escopos necessários**:
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/userinfo.email
   ```

---

## ❓ Troubleshooting

### Erro: "Origem inválida: o URI não pode estar vazio"
✅ **Solução**: Preencha com a URL completa (ex: `https://datempo.vercel.app`)

### Erro: "redirect_uri_mismatch"
✅ **Solução**: 
1. Verifique se o redirect URI está exatamente como configurado no Google Console
2. Espere 5-10 minutos após adicionar um novo URI
3. Verifique `APP_BASE_URL` nas variáveis de ambiente

### Erro: "invalid_client"
✅ **Solução**:
1. Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
2. Certifique-se de copiar sem espaços extras
3. No Vercel, verifique se as variáveis estão no ambiente correto (Production)

### OAuth funciona em dev mas não em produção
✅ **Solução**:
1. Adicione a URL de produção nas **Origens JavaScript Autorizadas**
2. Adicione o callback de produção nos **URIs de Redirecionamento**
3. Configure `APP_BASE_URL` no Vercel com a URL de produção
4. Aguarde 5-10 minutos para propagação

---

## 📊 Checklist de Configuração

### Google Cloud Console
- [ ] Criar projeto no Google Cloud (se não existir)
- [ ] Ativar Google Calendar API
- [ ] Ativar Google People API (para userinfo.email)
- [ ] Criar OAuth 2.0 Client ID (Web Application)
- [ ] Adicionar Origens JavaScript Autorizadas
- [ ] Adicionar URIs de Redirecionamento Autorizados
- [ ] Configurar Tela de Consentimento OAuth
- [ ] Copiar Client ID e Client Secret

### Vercel (Produção)
- [ ] Adicionar `GOOGLE_CLIENT_ID`
- [ ] Adicionar `GOOGLE_CLIENT_SECRET`
- [ ] Adicionar `APP_BASE_URL` (sua URL de produção)
- [ ] Marcar variáveis como "Production"
- [ ] Fazer redeploy (ou aguardar próximo deploy)

### Local (Desenvolvimento)
- [ ] Criar `.env.local` na raiz
- [ ] Adicionar `GOOGLE_CLIENT_ID`
- [ ] Adicionar `GOOGLE_CLIENT_SECRET`
- [ ] Adicionar `APP_BASE_URL=http://localhost:3000`
- [ ] Verificar que `.env.local` está no `.gitignore`
- [ ] Testar login com Google Calendar

### Teste Final
- [ ] Acessar `/dashboard/configuracoes`
- [ ] Clicar em "Conectar Google Calendar"
- [ ] Autorizar permissões na tela do Google
- [ ] Verificar se retorna para dashboard com sucesso
- [ ] Confirmar que calendários aparecem listados

---

## 🔗 Links Úteis

- **Google Cloud Console**: https://console.cloud.google.com
- **APIs & Services → Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Calendar API**: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Google OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs do Vercel**: 
   - https://vercel.com/seu-projeto/deployments → selecione deploy → Functions

2. **Verifique logs locais**:
   ```bash
   yarn dev
   # Tente fazer login e veja os erros no terminal
   ```

3. **Erros comuns já documentados acima** em "Troubleshooting"

---

*Guia criado em Outubro 2025*  
*DaTempo - Onde tudo dá tempo 🕰️*
