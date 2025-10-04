# 🔐 Configuração de Credenciais Google Cloud no Render

## 📝 Informações do seu OAuth Client

**Client ID**: `966992499199-54vvrq2q3rngcnrp3c1rilu4oj4cf3n2.apps.googleusercontent.com`

---

## 🚀 Como Configurar no Render

### 1️⃣ **Acesse o Dashboard do Render**
👉 https://dashboard.render.com

### 2️⃣ **Selecione o serviço ZapAgenda**
- Procure por "zap-agenda" ou o nome do seu serviço
- Clique no serviço

### 3️⃣ **Vá em Environment Variables**
- No menu lateral, clique em **"Environment"**
- Ou acesse direto: `https://dashboard.render.com/web/[seu-service-id]/env`

### 4️⃣ **Adicione/Verifique estas variáveis:**

#### Abra o arquivo `client_secret_...json` e copie os valores:

```bash
# Do arquivo JSON, copie:
# - web.client_id → GOOGLE_CLIENT_ID
# - web.client_secret → GOOGLE_CLIENT_SECRET
```

#### No Render, adicione ou verifique:

| Key | Value | Descrição |
|-----|-------|-----------|
| `GOOGLE_CLIENT_ID` | `966992499199-54vvrq2q3rngcnrp3c1rilu4oj4cf3n2.apps.googleusercontent.com` | ID do cliente OAuth |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxxxxx...` | Secret do OAuth (do arquivo JSON) |
| `GOOGLE_REDIRECT_URI` | `https://zap-agenda.onrender.com/api/google/oauth/callback` | URI de callback |
| `APP_BASE_URL` | `https://zap-agenda.onrender.com` | URL base do app |

---

## 🔍 Como Copiar do Arquivo JSON

### Opção 1: Via Terminal (se o arquivo estiver no seu computador)

```bash
# Vá até a pasta onde está o arquivo
cd ~/Downloads  # ou onde você baixou

# Mostre o conteúdo do arquivo
cat client_secret_966992499199-54vvrq2q3rngcnrp3c1rilu4oj4cf3n2.apps.googleusercontent.com.json

# Ou use jq para formatar bonito (se tiver instalado)
cat client_secret_*.json | jq .
```

### Opção 2: Abrir no Editor

1. Abra o arquivo com qualquer editor de texto
2. Procure por `"client_id"` e copie o valor
3. Procure por `"client_secret"` e copie o valor

---

## ⚙️ Script para Extrair Automaticamente

Se o arquivo estiver na sua máquina, você pode usar este script:

```bash
#!/bin/bash

# Substitua pelo caminho do seu arquivo
ARQUIVO="client_secret_966992499199-54vvrq2q3rngcnrp3c1rilu4oj4cf3n2.apps.googleusercontent.com.json"

if [ -f "$ARQUIVO" ]; then
  echo "📋 Credenciais Google Cloud"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "GOOGLE_CLIENT_ID:"
  cat "$ARQUIVO" | grep -o '"client_id"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4
  echo ""
  echo "GOOGLE_CLIENT_SECRET:"
  cat "$ARQUIVO" | grep -o '"client_secret"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4
  echo ""
  echo "GOOGLE_REDIRECT_URI:"
  cat "$ARQUIVO" | grep -o '"redirect_uris"[[:space:]]*:[[:space:]]*\[[^]]*\]' | grep -o 'https://[^"]*' | grep 'onrender'
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Copie estes valores e cole no Render"
else
  echo "❌ Arquivo não encontrado: $ARQUIVO"
  echo "Certifique-se de que o arquivo está no diretório atual"
fi
```

Salve como `extrair-credenciais.sh` e execute:

```bash
chmod +x extrair-credenciais.sh
./extrair-credenciais.sh
```

---

## 🔐 Segurança - IMPORTANTE

### ❌ **NÃO FAÇA:**
- ❌ Não commite o arquivo JSON no Git
- ❌ Não compartilhe o `client_secret` publicamente
- ❌ Não coloque as credenciais em arquivos `.env` que vão pro Git

### ✅ **FAÇA:**
- ✅ Mantenha o arquivo JSON em local seguro (fora do repositório)
- ✅ Adicione `client_secret*.json` no `.gitignore`
- ✅ Use as credenciais apenas nas variáveis de ambiente do Render
- ✅ Se comprometer o secret, regenere as credenciais no Google Cloud

---

## 🧪 Testar Depois de Configurar

Depois de adicionar as variáveis no Render:

### 1. Aguarde o Redeploy
O Render vai fazer redeploy automático (1-2 minutos)

### 2. Teste o Health Check
```bash
curl https://zap-agenda.onrender.com/api/health/google
```

**Resposta esperada:**
```json
{
  "ok": true,
  "calendarsCount": 1
}
```

Se der erro, você precisa:
1. Ir em: https://zap-agenda.onrender.com/dashboard
2. Fazer login
3. Clicar em "Conectar Google Calendar"
4. Autorizar o acesso

### 3. Teste um Agendamento
1. Acesse: https://zap-agenda.onrender.com/agenda/[seu-slug]
2. Preencha o formulário
3. Clique em "Agendar"
4. Verifique se o evento apareceu no Google Calendar

---

## 📊 Checklist de Configuração

- [ ] Abri o arquivo `client_secret_*.json`
- [ ] Copiei o `client_id`
- [ ] Copiei o `client_secret`
- [ ] Adicionei `GOOGLE_CLIENT_ID` no Render
- [ ] Adicionei `GOOGLE_CLIENT_SECRET` no Render
- [ ] Adicionei `GOOGLE_REDIRECT_URI` no Render
- [ ] Adicionei `APP_BASE_URL` no Render
- [ ] Aguardei o redeploy (1-2 min)
- [ ] Testei o health check
- [ ] Conectei Google Calendar no dashboard
- [ ] Testei um agendamento

---

## 🆘 Problemas Comuns

### Erro: "GOOGLE_CLIENT_ID is required"
**Causa**: Variável não configurada no Render
**Solução**: Adicione a variável e aguarde o redeploy

### Erro: "invalid_client"
**Causa**: `client_secret` errado ou não configurado
**Solução**: Verifique se copiou corretamente do arquivo JSON

### Erro: "redirect_uri_mismatch"
**Causa**: URI de redirecionamento não bate com o Google Cloud
**Solução**: Verifique se `GOOGLE_REDIRECT_URI` é exatamente:
```
https://zap-agenda.onrender.com/api/google/oauth/callback
```

---

## 📞 Próximos Passos

Depois de configurar as credenciais no Render:

1. ✅ Configure o Google Cloud Console (veja: `GOOGLE-CLOUD-PROXIMAS-ACOES.md`)
2. ✅ Teste o fluxo completo de agendamento
3. ✅ Verifique os logs no Render para confirmar que não há erros
4. ✅ Documente as credenciais em local seguro (LastPass, 1Password, etc.)

**Quando tudo estiver funcionando, faça um agendamento de teste e veja se aparece no Google Calendar!** 🎉
