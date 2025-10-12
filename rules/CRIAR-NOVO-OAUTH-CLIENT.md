# 🆕 Criar Novo OAuth Client - Agende Mais

## 🎯 Por que criar um novo?

Ao invés de editar o client existente (`Web client (auto created by Google Service)`), vamos criar um **novo OAuth Client** com configurações limpas e nome correto desde o início.

**Vantagens:**
- ✅ Não afeta o client em produção
- ✅ Nome profissional desde o início
- ✅ Configuração limpa
- ✅ Fácil rollback se necessário

---

## 📋 Passo a Passo Completo

### 1️⃣ **Criar o Novo OAuth Client**

**Acesse:**
```
https://console.cloud.google.com/apis/credentials?project=project-966992499199
```

**Passos:**

1. Clique em **"+ CRIAR CREDENCIAIS"** (no topo)
2. Selecione **"ID do cliente OAuth"**
3. Configure:

#### Tipo de aplicativo:
```
Aplicativo da Web
```

#### Nome:
```
Agende Mais - Web Client
```

#### Origens JavaScript autorizadas:
```
http://localhost:3000
https://zapagenda-3e479.firebaseapp.com
https://zap-agenda.onrender.com
```

#### URIs de redirecionamento autorizados:
```
https://zapagenda-3e479.firebaseapp.com/__/auth/handler
https://zap-agenda.onrender.com/api/google/oauth/callback
```

4. Clique em **"CRIAR"**

---

### 2️⃣ **Copiar as Novas Credenciais**

Após criar, uma janela popup vai aparecer com:

```
ID do cliente:
966992499199-XXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com

Chave secreta do cliente:
GOCSPX-XXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANTE:** Copie e salve em local seguro! Você precisará desses valores.

---

### 3️⃣ **Atualizar Firebase Authentication**

**Acesse:**
```
https://console.firebase.google.com/project/zapagenda-3e479/authentication/providers
```

**Passos:**
1. Clique no provedor **"Google"**
2. Clique em **"Editar"** (ícone de lápis)
3. **Substitua** os valores antigos pelos novos:
   - **ID do cliente da Web**: Cole o novo Client ID
   - **Chave secreta do cliente da Web**: Cole o novo Secret
4. Clique em **"Salvar"**

---

### 4️⃣ **Atualizar Render.com**

**Acesse:**
```
https://dashboard.render.com
```

**Passos:**
1. Vá para seu serviço `zap-agenda`
2. Clique em **"Environment"** (menu lateral)
3. **Atualize as variáveis:**

```bash
GOOGLE_CLIENT_ID=966992499199-NOVO_ID_AQUI.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-NOVO_SECRET_AQUI
```

4. Clique em **"Save Changes"**
5. O Render vai fazer **auto-deploy** (aguarde 2-3 min)

---

### 5️⃣ **Testar Login**

Aguarde 5 minutos após salvar no Render e teste:

1. Acesse em **janela anônima**: `https://zap-agenda.onrender.com/login`
2. Clique em **"Entrar com Google"**
3. Verifique se aparece **"Agende Mais"** na tela de consentimento
4. Complete o login
5. Verifique se foi redirecionado para o dashboard

---

### 6️⃣ **Desativar o Client Antigo** (Após 24h de testes)

Só faça isso **depois** de confirmar que tudo funciona:

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Localize o client antigo: `Web client (auto created by Google Service)`
3. Clique nele
4. Role até **"Chaves secretas do cliente"**
5. Desative e exclua os secrets antigos
6. Você pode manter o client desabilitado como backup

---

## 📝 Checklist de Migração

### Antes de Começar
- [ ] Anote o Client ID atual (para rollback se necessário)
- [ ] Anote o Secret atual (para rollback se necessário)
- [ ] Tenha acesso ao Firebase Console
- [ ] Tenha acesso ao Render.com

### Durante a Criação
- [ ] Criar novo OAuth Client no Google Cloud
- [ ] Copiar novo Client ID
- [ ] Copiar novo Client Secret
- [ ] Salvar credenciais em local seguro (ex: gerenciador de senhas)

### Atualização de Serviços
- [ ] Atualizar Firebase Authentication
- [ ] Atualizar variáveis no Render.com
- [ ] Aguardar deploy do Render (2-3 min)
- [ ] Aguardar propagação (5 min total)

### Testes
- [ ] Login em janela anônima funciona
- [ ] Nome "Agende Mais" aparece na tela OAuth
- [ ] Redirecionamento pós-login funciona
- [ ] Dashboard carrega corretamente
- [ ] Integração com Google Calendar funciona

### Limpeza (após 24h)
- [ ] Desativar secrets do client antigo
- [ ] Excluir secrets do client antigo
- [ ] Documentar as novas credenciais
- [ ] Remover credenciais antigas de backups locais

---

## 🔄 Rollback (se algo der errado)

Se precisar voltar atrás:

1. **Firebase**: Restaure Client ID e Secret antigos
2. **Render.com**: Restaure variáveis antigas
3. Aguarde 5 minutos
4. Teste login novamente

---

## 💡 Dicas Importantes

1. **Não delete o client antigo imediatamente** - mantenha como backup
2. **Teste em janela anônima** - evita cache de cookies
3. **Aguarde 5 minutos** após mudanças antes de testar
4. **Faça em horário de baixo tráfego** - evita afetar usuários ativos
5. **Tenha os valores antigos anotados** - facilita rollback

---

## 📞 Suporte

Se encontrar erros:
- **Error 400: redirect_uri_mismatch** → Confira URIs de redirecionamento
- **Error 401: invalid_client** → Confira Client ID e Secret no Render
- **Error 403: access_denied** → Usuário cancelou ou app não verificado

Consulte: `/rules/FIX-OAUTH-INVALID-CLIENT.md` para troubleshooting detalhado.

---

✅ **Pronto!** Seguindo esses passos, você terá um OAuth Client novo e profissional chamado "Agende Mais".
