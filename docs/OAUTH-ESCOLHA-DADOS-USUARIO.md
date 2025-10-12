# 🤔 OAuth vs Service Account - Qual Escolher?

> Guia visual para decidir entre "Dados do usuário" e "Dados do aplicativo"

---

## 📋 A Pergunta do Google

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Que dados você acessará?                           ┃
┃                                                     ┃
┃ ( ) Dados do usuário                               ┃
┃     Dados de um usuário do Google, como o          ┃
┃     endereço de e-mail ou a idade.                 ┃
┃     O consentimento do usuário é obrigatório.      ┃
┃     Isso vai criar um cliente OAuth.               ┃
┃                                                     ┃
┃ ( ) Dados do aplicativo                            ┃
┃     Dados do seu próprio aplicativo, como o        ┃
┃     back-end do Cloud Firestore.                   ┃
┃     Isso vai criar uma conta de serviço.           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## ✅ PARA DATEMPO: "Dados do usuário" (OAuth)

### Por que OAuth?

**Cenário do DaTempo:**

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   João      │         │   Maria     │         │   Pedro     │
│             │         │             │         │             │
│ Calendário  │         │ Calendário  │         │ Calendário  │
│ pessoal     │         │ pessoal     │         │ pessoal     │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ OAuth autoriza        │ OAuth autoriza        │ OAuth autoriza
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                        ┌──────▼──────┐
                        │   DaTempo   │
                        │     App     │
                        └─────────────┘
```

**Cada usuário:**
1. Faz login no DaTempo
2. Clica "Conectar Google Calendar"
3. Autoriza o app a acessar **SEU** calendário
4. DaTempo cria eventos **no calendário DELE**

### Características OAuth:

| Aspecto | OAuth (Dados do usuário) |
|---------|--------------------------|
| **Múltiplos usuários** | ✅ Sim |
| **Múltiplos calendários** | ✅ Sim (um por usuário) |
| **Autorização** | ✅ Cada usuário autoriza individualmente |
| **Revogação** | ✅ Usuário pode revogar a qualquer momento |
| **Privacidade** | ✅ Cada um vê apenas seus dados |
| **Uso típico** | Apps SaaS, plataformas multi-tenant |

### Use casos OAuth:

- ✅ **App de agendamento** (como DaTempo!)
- ✅ **CRM** que sincroniza calendários
- ✅ **Plataforma de reuniões** online
- ✅ **App de produtividade** pessoal
- ✅ Qualquer app onde **usuários conectam suas próprias contas**

---

## ❌ PARA DATEMPO: NÃO use "Dados do aplicativo" (Service Account)

### Por que NÃO Service Account?

**Cenário errado:**

```
┌─────────────────────────────────────────┐
│   Calendário Fixo da Empresa            │
│   (suporte@datempo.com)                 │
│                                          │
│   - Segunda 9h: João                    │
│   - Segunda 10h: Maria                  │
│   - Terça 14h: Pedro                    │
└─────────────────┬────────────────────────┘
                  │
                  │ Service Account
                  │ (sem autorização de usuário)
                  │
           ┌──────▼──────┐
           │   DaTempo   │
           │     App     │
           └─────────────┘
```

**Problema:**
- ❌ **UM único calendário** para todos
- ❌ Todos veem agendamentos de todos
- ❌ Sem privacidade
- ❌ Não é o que o DaTempo faz!

### Características Service Account:

| Aspecto | Service Account |
|---------|-----------------|
| **Múltiplos usuários** | ❌ Não (um calendário fixo) |
| **Múltiplos calendários** | ❌ Não |
| **Autorização** | ❌ Não precisa (app tem chave privada) |
| **Revogação** | ⚠️ Difícil (precisa revogar no admin) |
| **Privacidade** | ❌ Calendário compartilhado |
| **Uso típico** | Automação interna, sincronizações |

### Use casos Service Account:

- ✅ **Calendário corporativo único** (ex: "Sala de Reuniões 1")
- ✅ **Sincronização em background** (sem usuário)
- ✅ **Dashboard admin** que agrega dados de vários calendários
- ✅ **Automação interna** da empresa
- ❌ **NÃO para apps multi-usuário como DaTempo!**

---

## 📊 Comparação Visual

### OAuth (Dados do usuário) - ESCOLHA ESTA ✅

```
Usuário → Autoriza → App acessa calendário do usuário

┌─────────────┐
│  Usuário 1  │──┐
│  (João)     │  │
└─────────────┘  │
                 │     ┌──────────┐      ┌─────────────────┐
┌─────────────┐  │     │          │      │ Google Calendar │
│  Usuário 2  │──┼────>│ DaTempo  │─────>│                 │
│  (Maria)    │  │     │   App    │      │ - João: cal1    │
└─────────────┘  │     │          │      │ - Maria: cal2   │
                 │     └──────────┘      │ - Pedro: cal3   │
┌─────────────┐  │                       └─────────────────┘
│  Usuário 3  │──┘
│  (Pedro)    │
└─────────────┘

Cada um autoriza ✅
Cada um tem seu calendário ✅
Privacidade garantida ✅
```

### Service Account (Dados do aplicativo) - NÃO USE ❌

```
App → Acessa → Calendário fixo único

                     ┌──────────┐      ┌─────────────────┐
┌─────────────┐      │          │      │ Google Calendar │
│  DaTempo    │─────>│ Service  │─────>│                 │
│    App      │      │ Account  │      │ Calendário      │
│             │      │          │      │ Único/Fixo      │
└─────────────┘      └──────────┘      │                 │
                                        │ - 9h: João      │
Sem autorização ❌                      │ - 10h: Maria    │
Calendário único ❌                     │ - 14h: Pedro    │
Sem privacidade ❌                      └─────────────────┘
```

---

## 🎯 Decisão Rápida

### Você precisa de OAuth SE:

- ✅ Cada usuário tem sua própria conta Google
- ✅ Cada usuário quer conectar seu calendário pessoal
- ✅ Usuários precisam autorizar o acesso
- ✅ Dados são privados por usuário

**→ DATEMPO SE ENCAIXA AQUI!** ✅

### Você precisa de Service Account SE:

- ✅ Só UM calendário para toda aplicação
- ✅ Calendário corporativo/compartilhado
- ✅ Automação sem interação de usuário
- ✅ Backend rodando sozinho

**→ DATEMPO NÃO SE ENCAIXA AQUI!** ❌

---

## 💡 Exemplos Práticos

### OAuth (Multi-usuário) ✅

**DaTempo:**
- João agenda consulta → vai no calendário do João
- Maria agenda consulta → vai no calendário da Maria
- Privacidade: João não vê agenda da Maria

**Outros exemplos:**
- **Calendly**: cada usuário conecta seu calendário
- **Doodle**: participantes conectam seus calendários
- **Zoom**: cada host conecta seu calendário

### Service Account (Calendário único) ❌

**Exemplos válidos (mas NÃO DaTempo):**
- **Reserva de salas**: "Sala 1", "Sala 2", "Sala 3" (calendários fixos da empresa)
- **Dashboard analytics**: coleta dados de vários calendários para análise
- **Sincronização automática**: copia eventos entre sistemas sem usuário

---

## 📋 Checklist de Decisão

```
Marque OAuth ("Dados do usuário") SE:
☑ App tem múltiplos usuários
☑ Cada usuário tem sua conta Google
☑ Cada usuário conecta SEU calendário
☑ Precisa de autorização individual
☑ Dados são privados por usuário
☑ Usuários podem revogar acesso

↓
✅ DATEMPO SE ENCAIXA EM TODOS!
↓
✅ ESCOLHA: "Dados do usuário" (OAuth)
```

---

## 🆘 Ainda em Dúvida?

### Perguntas Simples:

**1. Cada cliente do DaTempo tem seu próprio Google Calendar?**
- ✅ Sim → OAuth

**2. DaTempo acessa UM calendário fixo da empresa?**
- ❌ Não → Não é Service Account

**3. Usuários precisam autorizar individualmente?**
- ✅ Sim → OAuth

**4. Cada usuário vê apenas seus próprios eventos?**
- ✅ Sim → OAuth

**→ RESPOSTA DEFINITIVA: OAuth ("Dados do usuário")** ✅

---

## ✅ CONCLUSÃO

### Para DaTempo:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                         ┃
┃   ESCOLHA: ( ● ) Dados do usuário      ┃
┃                                         ┃
┃   ✅ OAuth Client                       ┃
┃   ✅ Multi-usuário                      ┃
┃   ✅ Multi-calendário                   ┃
┃   ✅ Autorização individual             ┃
┃   ✅ Privacidade garantida              ┃
┃                                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Próximo passo:** [OAUTH-RENDER-RESUMO.md](./OAUTH-RENDER-RESUMO.md)

---

*DaTempo - OAuth Decision Guide 🕰️*
