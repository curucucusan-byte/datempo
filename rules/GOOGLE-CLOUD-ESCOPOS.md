# 📋 Escopos do Google Calendar - Guia Definitivo

## ✅ Escopos OBRIGATÓRIOS para o ZapAgenda

Quando você for em:
👉 https://console.cloud.google.com/apis/credentials/consent

E clicar em **"ADICIONAR OU REMOVER ESCOPOS"**, selecione ESTES:

---

## 1️⃣ **Escopos do Google Calendar** (CRÍTICOS)

### ✅ `.../auth/calendar`
**Nome completo**: `https://www.googleapis.com/auth/calendar`

**O que faz**: Permite ler e escrever no Google Calendar do usuário

**Por que precisa**: Para criar eventos de agendamento no calendário

**Justificativa (se pedir)**:
```
O ZapAgenda precisa criar eventos no Google Calendar quando 
clientes fazem agendamentos pelo WhatsApp.
```

---

### ✅ `.../auth/calendar.events`
**Nome completo**: `https://www.googleapis.com/auth/calendar.events`

**O que faz**: Permite gerenciar eventos específicos do calendário

**Por que precisa**: Para criar, editar e deletar eventos de agendamento

**Justificativa (se pedir)**:
```
Necessário para gerenciar os eventos de agendamento criados 
pelo sistema, incluindo criação, edição e cancelamento.
```

---

## 2️⃣ **Escopos de Perfil** (Já devem estar selecionados)

### ✅ `.../auth/userinfo.email`
**Nome completo**: `https://www.googleapis.com/auth/userinfo.email`

**O que faz**: Permite ler o email do usuário

**Por que precisa**: Para identificar qual calendário usar

**Justificativa (se pedir)**:
```
Usado para identificar o usuário e associar os agendamentos 
à conta correta.
```

---

### ✅ `.../auth/userinfo.profile`
**Nome completo**: `https://www.googleapis.com/auth/userinfo.profile`

**O que faz**: Permite ler informações básicas do perfil (nome, foto)

**Por que precisa**: Para exibir informações do profissional no dashboard

**Justificativa (se pedir)**:
```
Para personalizar a experiência do usuário exibindo nome 
e foto de perfil no dashboard.
```

---

## 🔍 **Como Selecionar (Passo a Passo)**

### 1. Acesse a Tela de Consentimento
👉 https://console.cloud.google.com/apis/credentials/consent

### 2. Clique em "EDITAR APLICATIVO"
(Botão azul no topo)

### 3. Role até a seção "Escopos"
Você verá algo como:
```
Escopos
Escopos para APIs do Google
```

### 4. Clique em "ADICIONAR OU REMOVER ESCOPOS"

### 5. Procure pelos Escopos do Calendar

**Opção A: Procurar manualmente**
1. Na lista que aparece, procure por "Google Calendar API"
2. Expanda clicando na setinha
3. Marque as caixinhas:
   - ☑️ `.../auth/calendar`
   - ☑️ `.../auth/calendar.events`

**Opção B: Usar o filtro**
1. Na caixa de busca no topo, digite: `calendar`
2. Marque as duas opções que aparecerem:
   - ☑️ `https://www.googleapis.com/auth/calendar`
   - ☑️ `https://www.googleapis.com/auth/calendar.events`

### 6. Verifique os Escopos de Perfil

Role para baixo e confirme que estes estão marcados:
- ☑️ `.../auth/userinfo.email`
- ☑️ `.../auth/userinfo.profile`

(Geralmente já vêm marcados por padrão)

### 7. Clique em "ATUALIZAR"
(Botão azul no final da lista)

### 8. Clique em "SALVAR E CONTINUAR"
(Botão azul no final da página)

---

## ⚠️ **Justificativa - Quando é Necessária?**

### **NÃO precisa de justificativa se:**
- ✅ App está "Em teste" (modo desenvolvimento)
- ✅ App é "Interno" (só sua organização)
- ✅ Escopos são "não sensíveis"

### **PRECISA de justificativa se:**
- ❌ App está "Em produção" (público)
- ❌ Escopos são "sensíveis" ou "restritos"
- ❌ Google solicitar verificação

**Para o ZapAgenda**: Provavelmente você **NÃO** vai precisar justificar agora, pois os escopos do Calendar são considerados "sensíveis" mas não "restritos".

---

## 📝 **Justificativas Prontas (se o Google pedir)**

Se o Google solicitar justificativa, use estas respostas:

### Para `.../auth/calendar`:
```
O ZapAgenda é um sistema de agendamentos automatizado via WhatsApp. 
Precisamos do escopo calendar para criar eventos no Google Calendar 
quando clientes fazem agendamentos, garantindo que o profissional 
veja todos os compromissos em sua agenda.
```

### Para `.../auth/calendar.events`:
```
Este escopo é necessário para gerenciar os eventos de agendamento 
criados pelo sistema, incluindo a capacidade de editar horários 
(em caso de remarcação) e cancelar eventos quando necessário.
```

### Para `.../auth/userinfo.email`:
```
Usado para identificar o usuário que está conectando sua conta 
Google e associar os agendamentos ao calendário correto.
```

### Para `.../auth/userinfo.profile`:
```
Para personalizar a experiência do usuário exibindo seu nome e 
foto de perfil no dashboard do sistema.
```

---

## 🎯 **Checklist de Escopos**

Marque conforme for adicionando:

- [ ] `https://www.googleapis.com/auth/calendar` ← CRÍTICO
- [ ] `https://www.googleapis.com/auth/calendar.events` ← CRÍTICO
- [ ] `https://www.googleapis.com/auth/userinfo.email` ← Deve estar marcado
- [ ] `https://www.googleapis.com/auth/userinfo.profile` ← Deve estar marcado

**Total**: 4 escopos

---

## 🚨 **EVITE Selecionar Estes Escopos**

❌ **NÃO selecione escopos que você não precisa:**

- ❌ `.../auth/calendar.readonly` - Só leitura (muito limitado)
- ❌ `.../auth/calendar.settings.readonly` - Configurações (não precisa)
- ❌ `.../auth/drive` - Google Drive (não precisa)
- ❌ `.../auth/gmail` - Gmail (não precisa)
- ❌ `.../auth/contacts` - Contatos (não precisa)

**Por que evitar**: Quanto mais escopos, maior a chance de o Google pedir verificação completa (processo demorado).

---

## 🔍 **Como Saber se Deu Certo**

Depois de salvar os escopos:

### 1. Verifique na Tela de Consentimento
Role até "Escopos" e confirme que aparecem:
```
✅ https://www.googleapis.com/auth/calendar
✅ https://www.googleapis.com/auth/calendar.events
✅ https://www.googleapis.com/auth/userinfo.email
✅ https://www.googleapis.com/auth/userinfo.profile
```

### 2. Teste a Conexão
1. Vá em: https://zap-agenda.onrender.com/dashboard
2. Clique em "Conectar Google Calendar"
3. Você deve ver uma tela do Google pedindo permissão
4. A tela deve mencionar:
   - "Ver, editar, compartilhar e excluir permanentemente todos os calendários que você acessa usando o Google Agenda"
   - "Ver seu endereço de e-mail principal do Google"
   - "Ver suas informações pessoais, inclusive informações pessoais que você disponibilizou publicamente"

### 3. Autorize e Teste
1. Clique em "Continuar" / "Permitir"
2. Você será redirecionado para o dashboard
3. Faça um agendamento de teste
4. Verifique se o evento aparece no Google Calendar

---

## 📊 **Resumo Visual**

```
┌─────────────────────────────────────────┐
│   Escopos do ZapAgenda                  │
├─────────────────────────────────────────┤
│                                         │
│ ✅ CRÍTICOS (Google Calendar):          │
│   • calendar                            │
│   • calendar.events                     │
│                                         │
│ ✅ PADRÃO (Perfil):                     │
│   • userinfo.email                      │
│   • userinfo.profile                    │
│                                         │
│ ❌ NÃO PRECISA:                         │
│   • drive, gmail, contacts, etc.       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🆘 **Problemas Comuns**

### Problema: "Não encontro os escopos do Calendar"
**Solução**: 
1. Certifique-se de que a Google Calendar API está habilitada
2. Vá em: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
3. Clique em "ATIVAR"
4. Aguarde 1-2 minutos
5. Tente adicionar os escopos novamente

### Problema: "Google pede verificação do app"
**Solução**: 
1. Se o app está em teste, ignore (não precisa verificar)
2. Se está em produção, você pode:
   - Manter em "teste" com 100 usuários
   - OU solicitar verificação (processo de 1-2 semanas)

### Problema: "Usuários veem aviso de 'app não verificado'"
**Solução**:
1. Isso é normal para apps em teste
2. Clique em "Avançado" → "Ir para ZapAgenda (não seguro)"
3. OU publique o app e solicite verificação

---

## ✅ **Checklist Final**

Antes de sair da tela de consentimento:

- [ ] Calendar API habilitada
- [ ] 4 escopos selecionados e salvos
- [ ] Clicou em "SALVAR E CONTINUAR"
- [ ] Testou a conexão no dashboard
- [ ] Agendamento de teste funcionou

**Quando tudo estiver ✅, os escopos estão corretos!** 🎉
