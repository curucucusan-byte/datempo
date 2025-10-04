# 🎯 ESCOPOS PARA COPIAR E COLAR - Google Cloud Console

## ✅ Copie e Cole Estes Escopos (um de cada vez ou todos juntos)

Se você está na tela de **"Adicionar escopos manualmente"**, copie e cole exatamente isto:

---

### **Opção 1: Todos de uma vez (separados por vírgula)**

Copie e cole esta linha inteira:

```
https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/calendar.events,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile
```

---

### **Opção 2: Um por linha**

Ou copie e cole cada um em uma linha nova:

```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
```

---

## 📋 Passo a Passo

### 1️⃣ **Cole os Escopos**
- Na caixa de texto de "Adicionar escopos manualmente"
- Cole a opção 1 (todos de uma vez) OU opção 2 (um por linha)

### 2️⃣ **Clique em "Adicionar à tabela"**
- Os 4 escopos devem aparecer na tabela acima

### 3️⃣ **Verifique se Apareceram**
Você deve ver algo como:

```
┌──────────────────────────────────────────────────────┬──────────┐
│ Escopo                                                │ Restrição│
├──────────────────────────────────────────────────────┼──────────┤
│ https://www.googleapis.com/auth/calendar             │ Sensível │
│ https://www.googleapis.com/auth/calendar.events      │ Sensível │
│ https://www.googleapis.com/auth/userinfo.email       │ Padrão   │
│ https://www.googleapis.com/auth/userinfo.profile     │ Padrão   │
└──────────────────────────────────────────────────────┴──────────┘
```

### 4️⃣ **Clique em "ATUALIZAR"**
- Botão azul no final da lista de escopos

### 5️⃣ **Clique em "SALVAR E CONTINUAR"**
- Botão azul no final da página
- Continue clicando em "SALVAR E CONTINUAR" até finalizar

---

## ✅ Verificação

Depois de salvar, volte para a tela de consentimento e confirme que os escopos aparecem na seção "Escopos".

Você deve ver **4 escopos** listados.

---

## 🎯 O Que Cada Escopo Faz

**`.../auth/calendar`**
→ Permite criar, ler e editar eventos no Google Calendar

**`.../auth/calendar.events`**
→ Permite gerenciar eventos específicos (criar, editar, deletar)

**`.../auth/userinfo.email`**
→ Permite ler o email do usuário (para identificação)

**`.../auth/userinfo.profile`**
→ Permite ler nome e foto de perfil

---

## ⚠️ Atenção

- ✅ **Copie EXATAMENTE** como está (com `https://`)
- ✅ Não adicione espaços extras
- ✅ Se copiar separado por vírgulas, NÃO coloque espaços após as vírgulas
- ✅ Se copiar um por linha, uma linha para cada escopo

---

## 🆘 Troubleshooting

### Erro: "Escopo inválido"
**Causa**: Erro de digitação ou espaço extra
**Solução**: Copie novamente, não digite manualmente

### Erro: "Este escopo já existe"
**Causa**: Escopo já foi adicionado
**Solução**: Ignore, está correto

### Não aparece na tabela
**Causa**: Google Calendar API não habilitada
**Solução**: 
1. Vá em: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
2. Clique em "ATIVAR"
3. Aguarde 1 minuto
4. Tente adicionar os escopos novamente

---

## ✅ Depois de Adicionar

1. [ ] 4 escopos aparecem na tabela
2. [ ] Clicou em "ATUALIZAR"
3. [ ] Clicou em "SALVAR E CONTINUAR"
4. [ ] Finalizou todas as etapas da tela de consentimento

**Pronto! Escopos configurados! 🎉**

Próximo passo: Testar a conexão no dashboard
