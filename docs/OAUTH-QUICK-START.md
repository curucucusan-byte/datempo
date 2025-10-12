# ⚡ Quick Start - OAuth Google (DaTempo)

## 🎯 Resposta Rápida para o Console Google

### ✅ Configure assim:

```
┌─────────────────────────────────────────────────────────────┐
│ Tipo de aplicativo: Aplicativo da Web                      │
├─────────────────────────────────────────────────────────────┤
│ Nome: DaTempo OAuth Client                                  │
├─────────────────────────────────────────────────────────────┤
│ Origens JavaScript autorizadas:                             │
│                                                              │
│ 1. https://seu-dominio-vercel.vercel.app                   │
│ 2. http://localhost:3000                    (opcional)      │
│                                                              │
│ ⚠️ Substitua "seu-dominio-vercel" pelo seu domínio real    │
├─────────────────────────────────────────────────────────────┤
│ URIs de redirecionamento autorizados:                       │
│                                                              │
│ 1. https://seu-dominio-vercel.vercel.app/api/google/oauth/callback │
│ 2. http://localhost:3000/api/google/oauth/callback (opcional)      │
│                                                              │
│ ⚠️ Substitua "seu-dominio-vercel" pelo seu domínio real    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Como Descobrir Seu Domínio Vercel

### Opção 1: Vercel Dashboard
```bash
# Acesse: https://vercel.com/dashboard
# Clique no seu projeto
# Veja a URL em "Domains"
```

### Opção 2: Terminal
```bash
# No diretório do projeto:
vercel ls

# Ou veja o último deploy:
vercel inspect
```

### Opção 3: Git
```bash
# Se você fez deploy via Git, a URL é:
https://nome-do-repositorio.vercel.app
# ou
https://nome-do-repositorio-usuario.vercel.app
```

---

## 📋 Exemplo Real

Se seu projeto se chama `zapagenda` e está no Vercel:

```
Origens JavaScript autorizadas:
┌────────────────────────────────────────┐
│ https://zapagenda.vercel.app           │
│ http://localhost:3000                  │
└────────────────────────────────────────┘

URIs de redirecionamento autorizados:
┌──────────────────────────────────────────────────────────────┐
│ https://zapagenda.vercel.app/api/google/oauth/callback      │
│ http://localhost:3000/api/google/oauth/callback             │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Depois de Criar o Client ID

1. **Copie** Client ID e Client Secret

2. **Configure no Vercel**:
   ```
   Projeto → Settings → Environment Variables
   
   Nome: GOOGLE_CLIENT_ID
   Valor: seu-client-id.apps.googleusercontent.com
   
   Nome: GOOGLE_CLIENT_SECRET
   Valor: GOCSPX-seu-secret
   
   Nome: APP_BASE_URL
   Valor: https://zapagenda.vercel.app
   ```

3. **Redeploy** (ou aguarde próximo deploy)

4. **Teste**: Acesse `/dashboard/configuracoes` → "Conectar Google Calendar"

---

## 🚨 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "URI não pode estar vazio" | Campo em branco | Preencha com `https://seu-dominio.vercel.app` |
| "redirect_uri_mismatch" | URL não cadastrada | Verifique se `/api/google/oauth/callback` está exato |
| "invalid_client" | Credenciais erradas | Verifique Client ID e Secret no Vercel |
| Funciona em dev, não em prod | Faltou adicionar URL prod | Adicione `https://...vercel.app` nas origens |

---

## ⏱️ Importante

- ⏳ Pode levar **5 minutos a algumas horas** para funcionar
- 🔄 Se não funcionar imediatamente, aguarde 10 minutos e tente novamente
- 🧪 Teste em dev primeiro (`http://localhost:3000`)

---

## 📚 Documentação Completa

Para guia detalhado: `/docs/CONFIGURACAO-OAUTH-GOOGLE.md`

---

*DaTempo - Configuração rápida 🕰️*
