# 🔄 Workflow: Criar Novo Chat com Context

> Sistema para transferir contexto entre chats do Cline
> Criado: 26/11/2025

---

## 🎯 Objetivo

Transferir contexto essencial entre chats quando:
- Context window > 80% (160K tokens)
- Respostas lentas/travando
- Fim de dia de trabalho intenso
- Você solicitar

---

## 📝 Passo a Passo

### 1. **Solicitar Resumão** (no chat atual)

```
Você: "Crie o resumão para próximo chat"
```

**O que acontece:**
- IA sobrescreve `docs/CHAT-REFERENCE.md`
- Resume estado atual em < 2000 tokens
- Documenta próximos passos
- Faz commit automático

---

### 2. **Criar Novo Chat**

**Opção A: Automática (via Task VSCode)**
```bash
# Pressione: Ctrl+Shift+P → "Tasks: Run Task" → "Novo Chat DaTempo"
# Abre CHAT-REFERENCE.md automaticamente
```

**Opção B: Alias Shell**
```bash
# Terminal:
novochat

# Abre o arquivo automaticamente
```

**Opção C: Manual**
```bash
# Abra no VSCode:
code docs/CHAT-REFERENCE.md

# Ou simplesmente navegue até o arquivo
```

---

### 3. **Mencionar no Novo Chat**

```
Você: @CHAT-REFERENCE.md
Vamos continuar o Dia 5 do MVP?
```

**Pronto!** ✅ Context transferido, pode continuar trabalhando!

---

## ⚙️ Setup Inicial (1x, 5 min)

### **Opção A: VSCode Task** (RECOMENDADO)

Criar `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Novo Chat DaTempo",
      "type": "shell",
      "command": "code ${workspaceFolder}/docs/CHAT-REFERENCE.md",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

**Como usar:**
1. `Ctrl+Shift+P` → "Tasks: Run Task"
2. Selecionar "Novo Chat DaTempo"
3. Arquivo abre automaticamente
4. Mencionar no chat Cline

**Bind para atalho (opcional):**
```json
// keybindings.json
{
  "key": "ctrl+shift+n",
  "command": "workbench.action.tasks.runTask",
  "args": "Novo Chat DaTempo"
}
```

---

### **Opção B: Shell Alias**

Adicionar ao `~/.bashrc` ou `~/.zshrc`:

```bash
# Alias para novo chat DaTempo
alias novochat='cd ~/Dispensary/zapagenda && code docs/CHAT-REFERENCE.md && echo "📌 Mencione @CHAT-REFERENCE.md no novo chat Cline!"'
```

**Como usar:**
```bash
novochat
# → Abre o arquivo
# → Você menciona no chat
```

---

### **Opção C: Manual** (SEM SETUP)

1. Abrir `docs/CHAT-REFERENCE.md` no VSCode
2. Novo chat Cline
3. Mencionar o arquivo com `@`

---

## 🔌 Plugins Úteis (EXTRAS)

### **Para VSCode:**

**1. Project Manager** (alefragnani.project-manager)
```
✅ Salva workspaces específicos
✅ Troca rápido entre projetos
✅ Pode incluir tasks customizadas
```

**2. Bookmarks** (alefragnani.Bookmarks)
```
✅ Marca arquivos importantes
✅ Acesso rápido (Ctrl+Alt+K)
✅ Útil para CHAT-REFERENCE.md
```

**3. Todo Tree** (Gruntfuggly.todo-tree)
```
✅ Mostra TODOs do projeto
✅ Integra com comments
✅ Visão geral tasks pendentes
```

---

### **Para Cline (Futuro):**

Atualmente Cline **não tem marketplace de plugins**, mas:

**Recursos nativos úteis:**
- ✅ Mention files com `@` (já usamos!)
- ✅ Context from previous chats
- ✅ Custom instructions (.clinerules)
- ✅ Task progress tracking

**Roadmap Cline** (possível futuro):
- 🔄 Plugin system (em discussão)
- 🔄 Templates de workflow
- 🔄 Context presets

---

## 📊 Monitorar Context Window

**Visual (no Cline):**
```
Canto inferior: "166K / 200K tokens"
```

**Regra:**
- < 140K (70%) → ✅ Tranquilo
- 140-160K (70-80%) → ⚠️ Atenção
- > 160K (80%) → 🚨 Criar novo chat

---

## 🎓 Dicas de Uso

### **Quando Solicitar Resumão:**

✅ **Bons momentos:**
- Fim de dia de trabalho (ex: completou Dia 4)
- Antes de tarefa grande (ex: Dia 5 inteiro)
- Context > 160K tokens
- Chat começando a travar

❌ **Não precisa:**
- A cada 10 mensagens
- Micro-tasks (corrigir typo)
- Chat ainda < 140K tokens

---

### **Customizar o Resumo:**

Você pode pedir:
```
"Crie resumão focando em X"
"Resumão só com decisões técnicas"
"Resumão para outro dev entender"
```

---

## 🚀 Resultado Esperado

**Antes:**
```
Chat 1: 180K tokens → Lento, travando
Chat 2: Começar do zero, sem context
```

**Depois (com sistema):**
```
Chat 1: 180K tokens → "Crie resumão"
Chat 2: Menciona CHAT-REFERENCE.md → Context completo!
Chat 2: 20K tokens → Rápido, eficiente ✨
```

---

## 📚 Arquivos do Sistema

```
docs/CHAT-REFERENCE.md        ← Resumo (sempre sobrescrito)
.clinerules                    ← Regras + economia tokens
scripts/workflow-novo-chat.md  ← Este guia
```

---

## 🐛 Troubleshooting

**"Não encontro o arquivo"**
→ Abra no terminal: `code docs/CHAT-REFERENCE.md`

**"IA não lê o arquivo mencionado"**
→ Use `@` no início: `@CHAT-REFERENCE.md texto aqui`

**"Task não aparece no VSCode"**
→ Recarregue window: `Ctrl+Shift+P` → "Reload Window"

**"Resumão muito grande (> 2000 tokens)"**
→ Peça versão concisa: "Resumão mais curto, só essencial"

---

**Criado por:** Sistema DaTempo
**Mantido por:** Você + IA
**Última atualização:** 26/11/2025
