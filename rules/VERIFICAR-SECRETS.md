# 🔐 Verificação de Secrets OAuth

## 📋 Situação Atual

Você tem **2 Client Secrets ativos** no Google Cloud Console:

1. **Secret 1**: `****uYky` (criado em 04/10/2025 02:45)
2. **Secret 2**: `****PKn0` (criado em 04/10/2025 02:47)

## ⚠️ AÇÃO NECESSÁRIA

### Passo 1: Verificar qual secret está em produção

**Acesse Render.com:**
```
https://dashboard.render.com/web/srv-YOUR_SERVICE_ID/env
```

**Procure pela variável:**
```
GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXXX
```

**Compare os últimos 4 caracteres:**
- Se termina em `uYky` → Usando Secret 1
- Se termina em `PKn0` → Usando Secret 2

### Passo 2: Desativar o secret não usado

**Por segurança**, você deve ter **apenas 1 secret ativo**:

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Clique no seu OAuth Client
3. Na seção **"Chaves secretas do cliente"**:
   - Identifique qual secret **NÃO** está sendo usado
   - Clique nos 3 pontos (⋮) ao lado dele
   - Clique em **"Desativar"**
   - Depois clique em **"Excluir"**

**⚠️ IMPORTANTE:** Só exclua o secret que você TEM CERTEZA que não está em uso!

## 🎯 Recomendação

Como você criou os 2 secrets com 2 minutos de diferença, provavelmente:
- O primeiro (`uYky`) foi um teste
- O segundo (`PKn0`) é o que está em produção

**Verifique no Render.com qual está configurado antes de excluir qualquer um!**

---

## ✅ Checklist de Segurança

- [ ] Verificar qual secret está no Render.com
- [ ] Confirmar que o secret está funcionando (fazer teste de login)
- [ ] Desativar e excluir o secret não utilizado
- [ ] Manter apenas 1 secret ativo por segurança
- [ ] Nunca compartilhar ou commitar secrets no Git

---

## 📚 Referência

**Google recomenda:**
> "Ter mais de um secret aumenta os riscos à segurança. Desative e exclua o secret antigo quando verificar que o aplicativo está usando o novo."

**Link:** https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key
