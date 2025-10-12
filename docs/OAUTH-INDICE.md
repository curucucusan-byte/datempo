# 📚 Documentação OAuth Google - DaTempo

> Índice completo de guias para configurar autenticação Google Calendar

---

## 🎯 Escolha seu Guia

### Para Iniciantes (Começa Aqui!)
👉 **[Quick Start - Resposta Rápida](./OAUTH-QUICK-START.md)**
- ⚡ Configuração em 5 minutos
- 📋 Copy-paste direto
- ✅ Exemplo prático

### Para Seguir Passo a Passo
👉 **[Guia Visual Completo](./OAUTH-GUIA-VISUAL.md)**
- 🖼️ Diagramas ASCII da interface
- 📸 Representações visuais
- 🔍 Anatomia das URLs
- ✅ Checklist completo

### Para Copy-Paste
👉 **[Template Copy-Paste](./OAUTH-TEMPLATE-COPY-PASTE.md)**
- 📋 Valores prontos para colar
- 🎯 Exemplos substituíveis
- ⚙️ Configuração Vercel incluída

### Para Entender Tudo
👉 **[Configuração Completa](./CONFIGURACAO-OAUTH-GOOGLE.md)**
- 📖 Documentação detalhada (400+ linhas)
- 🔐 Variáveis de ambiente
- 🧪 Testes local e produção
- 🛡️ Tela de consentimento
- 📞 Suporte e links úteis

### Para Resolver Problemas
👉 **[Troubleshooting](./OAUTH-TROUBLESHOOTING.md)**
- 🚨 Erros comuns e soluções
- 🔧 Diagnóstico passo a passo
- 📊 Checklist de verificação
- 🆘 O que fazer quando nada funciona

---

## 📖 Fluxo Recomendado

```
1️⃣ Começar
   └─> Quick Start (5 min)
       └─> Copiar valores do Template Copy-Paste

2️⃣ Configurar
   └─> Seguir Guia Visual
       └─> Colar valores no Google Console

3️⃣ Integrar
   └─> Configuração Completa (seção Vercel)
       └─> Adicionar variáveis de ambiente

4️⃣ Testar
   └─> Testar localmente
       └─> Testar em produção

5️⃣ Resolver (se necessário)
   └─> Troubleshooting
       └─> Buscar erro específico
```

---

## 🎯 Situações Específicas

### "Preciso configurar AGORA"
→ [Quick Start](./OAUTH-QUICK-START.md) + [Template](./OAUTH-TEMPLATE-COPY-PASTE.md)

### "Nunca fiz isso antes"
→ [Guia Visual](./OAUTH-GUIA-VISUAL.md) + [Configuração Completa](./CONFIGURACAO-OAUTH-GOOGLE.md)

### "Está dando erro"
→ [Troubleshooting](./OAUTH-TROUBLESHOOTING.md)

### "Quero entender como funciona"
→ [Configuração Completa](./CONFIGURACAO-OAUTH-GOOGLE.md) seção "Verificação do Callback"

### "Funciona em dev mas não em produção"
→ [Troubleshooting](./OAUTH-TROUBLESHOOTING.md#-funciona-em-dev-mas-não-em-produção)

---

## 📋 Resumo Ultra-Rápido

### O que você precisa:

**1. Google Cloud Console:**
```
✓ Criar OAuth Client ID (Aplicativo da Web)
✓ Adicionar origem: https://seu-projeto.vercel.app
✓ Adicionar redirect: https://seu-projeto.vercel.app/api/google/oauth/callback
✓ Copiar Client ID e Secret
```

**2. Vercel:**
```
✓ Adicionar GOOGLE_CLIENT_ID
✓ Adicionar GOOGLE_CLIENT_SECRET
✓ Adicionar APP_BASE_URL
✓ Marcar "Production"
✓ Redeploy
```

**3. Teste:**
```
✓ Aguardar 5-10 minutos
✓ Acessar /dashboard/configuracoes
✓ Clicar "Conectar Google Calendar"
✓ Autorizar
✓ Verificar calendários listados
```

---

## 🔗 Links Úteis Externos

| Recurso | URL |
|---------|-----|
| Google Cloud Console | https://console.cloud.google.com |
| OAuth Credentials | https://console.cloud.google.com/apis/credentials |
| Consent Screen | https://console.cloud.google.com/apis/credentials/consent |
| Calendar API | https://console.cloud.google.com/apis/library/calendar-json.googleapis.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| OAuth 2.0 Docs | https://developers.google.com/identity/protocols/oauth2 |

---

## 📂 Estrutura da Documentação

```
/docs/
├── OAUTH-INDICE.md                    ← Você está aqui
├── OAUTH-QUICK-START.md               ← ⚡ Resposta rápida (5 min)
├── OAUTH-TEMPLATE-COPY-PASTE.md       ← 📋 Valores para colar
├── OAUTH-GUIA-VISUAL.md               ← 🖼️ Passo a passo visual
├── CONFIGURACAO-OAUTH-GOOGLE.md       ← 📖 Documentação completa
└── OAUTH-TROUBLESHOOTING.md           ← 🔧 Solução de problemas
```

---

## 🎓 Níveis de Conhecimento

### 🟢 Iniciante
**Nunca configurei OAuth antes**
- Leia: [Quick Start](./OAUTH-QUICK-START.md)
- Siga: [Guia Visual](./OAUTH-GUIA-VISUAL.md)
- Use: [Template](./OAUTH-TEMPLATE-COPY-PASTE.md)

### 🟡 Intermediário
**Já configurei OAuth mas preciso lembrar**
- Leia: [Template](./OAUTH-TEMPLATE-COPY-PASTE.md)
- Consulte: [Configuração Completa](./CONFIGURACAO-OAUTH-GOOGLE.md)

### 🔴 Avançado
**Sei o que fazer, só preciso dos valores**
- Use: [Template](./OAUTH-TEMPLATE-COPY-PASTE.md)
- Consulte se necessário: [Troubleshooting](./OAUTH-TROUBLESHOOTING.md)

---

## ❓ FAQ Rápido

### Qual domínio usar?
O domínio do seu deploy no Vercel (ex: `zapagenda.vercel.app`)

### Preciso adicionar localhost?
Sim, se quiser testar em desenvolvimento local.

### Quanto tempo para funcionar?
5-10 minutos após configurar (propagação do Google).

### Por que redirect_uri_mismatch?
URL no Google Console não bate com a usada no código.
Solução: Copie exatamente como está no erro e adicione no Console.

### Por que invalid_client?
Client ID ou Secret errados/não configurados no Vercel.
Solução: Verifique variáveis de ambiente.

### Funciona em dev mas não em produção?
Faltou adicionar URL de produção no Google Console.
Solução: Adicione `https://seu-projeto.vercel.app` nas origens e redirects.

---

## 🆘 Precisa de Ajuda?

### 1. Busque no Troubleshooting
[OAUTH-TROUBLESHOOTING.md](./OAUTH-TROUBLESHOOTING.md) tem soluções para 95% dos problemas.

### 2. Verifique os Logs
```bash
# Vercel:
Deployments → [último deploy] → Functions → Logs

# Local:
yarn dev  # e tente fazer login
```

### 3. Compare Configurações
Use o **Checklist de Diagnóstico** em [Troubleshooting](./OAUTH-TROUBLESHOOTING.md#-checklist-de-diagnóstico)

---

## 🎯 Objetivo Final

Ao completar a configuração, você terá:

✅ Usuários podem fazer login com Google  
✅ App pode acessar Google Calendar do usuário  
✅ Usuários podem escolher quais calendários compartilhar  
✅ DaTempo pode criar eventos nos calendários autorizados  
✅ Tudo funciona em produção (Vercel)  
✅ Tudo funciona em desenvolvimento (localhost)  

---

## 📊 Progresso Típico

```
┌─────────────────────────────────────────────────────────┐
│ Etapa                          Tempo    Dificuldade     │
├─────────────────────────────────────────────────────────┤
│ Criar OAuth Client ID          5 min   🟢 Fácil        │
│ Configurar URLs                3 min   🟢 Fácil        │
│ Copiar credenciais             1 min   🟢 Fácil        │
│ Configurar Vercel              5 min   🟡 Médio        │
│ Aguardar propagação            10 min  ⏳ Espera       │
│ Testar integração              2 min   🟢 Fácil        │
│ (Troubleshooting se necessário 15 min  🔴 Variável)    │
├─────────────────────────────────────────────────────────┤
│ TOTAL (sem problemas)          ~26 min                  │
│ TOTAL (com troubleshooting)    ~41 min                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🏆 Checklist Geral

```
Google Cloud:
[ ] Projeto criado
[ ] Calendar API ativada
[ ] OAuth Client ID criado (Web)
[ ] Origens JavaScript configuradas
[ ] URIs de redirecionamento configurados
[ ] Credenciais copiadas

Vercel:
[ ] GOOGLE_CLIENT_ID adicionado
[ ] GOOGLE_CLIENT_SECRET adicionado
[ ] APP_BASE_URL adicionado
[ ] Variáveis marcadas como "Production"
[ ] Deploy realizado

Teste:
[ ] Aguardou 10 minutos
[ ] Login com Google funciona
[ ] Calendários aparecem
[ ] Funciona em produção
[ ] Funciona em dev (opcional)
```

---

## 🎉 Pronto!

Escolha um dos guias acima e comece!

**Sugestão:** Se é sua primeira vez, comece pelo [Quick Start](./OAUTH-QUICK-START.md) e depois siga o [Guia Visual](./OAUTH-GUIA-VISUAL.md).

---

*Documentação DaTempo 🕰️ - Outubro 2025*  
*Onde tudo dá tempo, inclusive para configurar OAuth! ☕*
