# 🚀 Google Cloud - Próximas Ações

## ✅ O que você JÁ TEM configurado:
- ✅ Projeto: `project-966992499199`
- ✅ OAuth Client: `966992499199-54vv...`
- ✅ Domínios autorizados: `zap-agenda.onrender.com`, `zapagenda-3e479.firebaseapp.com`
- ✅ URIs de redirecionamento configuradas
- ✅ Páginas de Privacidade e Termos

---

## 🔧 O que você PRECISA FAZER AGORA:

### 1️⃣ **Mudar o Nome do App** (Obrigatório)
📍 **Onde**: https://console.cloud.google.com/apis/credentials/consent

**Passos:**
1. Clique em **"EDITAR APLICATIVO"**
2. No campo **"Nome do app"**, troque de:
   ```
   project-966992499199
   ```
   Para:
   ```
   ZapAgenda
   ```
3. Clique em **"SALVAR E CONTINUAR"**

**Por que**: O nome atual é genérico e confunde os usuários na tela de consentimento.

---

### 2️⃣ **Verificar Google Calendar API** (CRÍTICO)
📍 **Onde**: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com

**Passos:**
1. Acesse o link acima
2. Se aparecer **"GERENCIAR"** → API já está habilitada ✅
3. Se aparecer **"ATIVAR"** → Clique para ativar ⚠️
4. Aguarde 1-2 minutos para propagar

**Por que**: Sem a Calendar API habilitada, os agendamentos não criam eventos no Google Calendar.

---

### 3️⃣ **Verificar Escopos do Calendar** (CRÍTICO)
📍 **Onde**: https://console.cloud.google.com/apis/credentials/consent

**Passos:**
1. Clique em **"EDITAR APLICATIVO"**
2. Role para baixo até **"Escopos"**
3. Clique em **"ADICIONAR OU REMOVER ESCOPOS"**
4. Na caixa de busca, digite: `calendar`
5. Marque estas opções:
   - ✅ `https://www.googleapis.com/auth/calendar`
   - ✅ `https://www.googleapis.com/auth/calendar.events`
6. Role para baixo e marque também (se ainda não estiverem):
   - ✅ `https://www.googleapis.com/auth/userinfo.email`
   - ✅ `https://www.googleapis.com/auth/userinfo.profile`
7. Clique em **"ATUALIZAR"**
8. Clique em **"SALVAR E CONTINUAR"**

**Por que**: Sem os escopos corretos, o app não consegue criar eventos no Google Calendar.

---

### 4️⃣ **Verificar Status de Publicação** (IMPORTANTE)
📍 **Onde**: https://console.cloud.google.com/apis/credentials/consent

**Passos:**
1. Na tela de consentimento, veja o **"Status de publicação"**
2. Se está **"Em teste"**:
   - Você precisa adicionar cada usuário manualmente
   - Limite de 100 usuários
   - Tokens expiram em 7 dias
   - **SOLUÇÃO**: Clique em **"PUBLICAR APLICATIVO"**
3. Se está **"Em produção"**:
   - ✅ Sem limite de usuários
   - ✅ Tokens não expiram

**Por que**: Se o app está "Em teste" e você não adicionar os usuários, eles verão erro 403.

---

### 5️⃣ **Adicionar Logotipo** (Recomendado)
📍 **Onde**: https://console.cloud.google.com/apis/credentials/consent

**Passos:**
1. Clique em **"EDITAR APLICATIVO"**
2. Procure **"Logotipo do app"**
3. Clique em **"Escolher arquivo"**
4. Faça upload do arquivo:
   ```
   /home/zola/Dispensary/zapagenda/public/logos/calendar.png
   ```
   (128x128 pixels - tamanho ideal)
5. Clique em **"SALVAR E CONTINUAR"**

**Por que**: O logotipo deixa o app mais profissional e confiável.

⚠️ **IMPORTANTE**: Depois do upload, pode ser necessário enviar o app para verificação do Google (se estiver em produção).

---

## 🧪 Como Testar Depois das Mudanças

### Teste 1: Health Check
Depois de fazer as configurações acima, teste se o Google Calendar está conectado:

```bash
# Faça login no dashboard primeiro em:
# https://zap-agenda.onrender.com/dashboard

# Depois teste:
curl https://zap-agenda.onrender.com/api/health/google
```

**Resposta esperada (SUCESSO)**:
```json
{
  "ok": true,
  "calendarsCount": 1
}
```

**Resposta com erro**:
```json
{
  "error": "Google Calendar não conectado"
}
```

Se der erro, você precisa **reconectar** o Google Calendar no dashboard.

---

### Teste 2: Criar Agendamento de Teste
1. Acesse: https://zap-agenda.onrender.com/agenda/[seu-slug]
2. Preencha o formulário com dados de teste
3. Clique em "Agendar"
4. Abra seu Google Calendar: https://calendar.google.com
5. Verifique se o evento apareceu

**Se o evento NÃO apareceu**, verifique os logs no Render:
1. Vá em: https://dashboard.render.com
2. Selecione o serviço "zap-agenda"
3. Clique em "Logs"
4. Procure por:
   - `[apt:google:event:failed]` ← Erro ao criar evento
   - `[google:event:create:error]` ← Detalhes do erro

---

## 📊 Ordem de Prioridade

Execute nesta ordem:

1. **CRÍTICO**: Verificar Google Calendar API habilitada (5 min)
2. **CRÍTICO**: Verificar escopos do Calendar configurados (5 min)
3. **IMPORTANTE**: Publicar o app (se estiver em teste) (2 min)
4. **RECOMENDADO**: Mudar nome do app para "ZapAgenda" (2 min)
5. **OPCIONAL**: Adicionar logotipo (5 min)

**Tempo total**: ~20 minutos

---

## 🆘 Se der erro depois das configurações

### Erro: "Error 403: access_denied"
**Causa**: App em modo teste e usuário não está na lista
**Solução**: Clique em "PUBLICAR APLICATIVO"

### Erro: "invalid_grant" ou "Token has been expired or revoked"
**Causa**: Token expirado ou revogado
**Solução**: 
1. Vá em: https://zap-agenda.onrender.com/dashboard
2. Reconecte o Google Calendar (botão "Conectar Google Calendar")

### Erro: "Calendar API has not been used in project"
**Causa**: Calendar API não habilitada
**Solução**: Acesse https://console.cloud.google.com/apis/library/calendar-json.googleapis.com e clique em "ATIVAR"

---

## 📝 Depois de Configurar Tudo

Execute o commit das mudanças no código:

```bash
cd /home/zola/Dispensary/zapagenda
git add rules/GOOGLE-CLOUD-*.md
git commit -m "docs: Adiciona guias de configuração do Google Cloud Console"
git push origin main
```

E faça um deploy manual no Render (se necessário):
1. Vá em: https://dashboard.render.com
2. Selecione "zap-agenda"
3. Clique em "Manual Deploy" → "Deploy latest commit"

---

## ✅ Checklist Final

Antes de considerar concluído, verifique:

- [ ] Google Calendar API habilitada
- [ ] Escopos do Calendar configurados
- [ ] Nome do app mudado para "ZapAgenda"
- [ ] App publicado (se quiser usuários ilimitados)
- [ ] Logotipo adicionado
- [ ] Health check retorna `{"ok": true}`
- [ ] Agendamento de teste criou evento no Google Calendar
- [ ] Logs do Render mostram `[apt:google:event:success]`

**Quando tudo estiver ✅, seu Google Calendar sync estará funcionando perfeitamente!** 🎉
