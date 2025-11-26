# 📝 Prompts Especializados - DaTempo

> Prompts prontos para usar em tarefas específicas do projeto

---

## 🎯 O Que São Prompts?

São instruções estruturadas que você pode usar para:
- Guiar tarefas repetitivas
- Manter padrão de qualidade
- Documentar processos
- Acelerar desenvolvimento

---

## 📚 Prompts Disponíveis

### 1. 🧪 [test-appointment-flow.md](./test-appointment-flow.md)
**Quando usar:** Após mudanças no fluxo de agendamento

**O que faz:**
- Testa fluxo end-to-end como usuário real
- Verifica integração Google Calendar
- Testa notificações WhatsApp
- Valida edge cases (conflitos, rate limiting)

**Tempo:** ~20-30 minutos

---

### 2. 🎨 [design-review.md](./design-review.md)
**Quando usar:** Ao criar/modificar páginas ou componentes

**O que faz:**
- Audita consistência visual (paleta verde+madeira)
- Verifica tipografia e tom de voz
- Identifica cores fora do padrão
- Gera relatório de conformidade

**Tempo:** ~10-15 minutos por página

---

## 🚀 Como Usar

### Método 1: Copiar e Colar
```
1. Abrir arquivo do prompt
2. Copiar conteúdo relevante
3. Colar no chat com Cline
4. Seguir instruções
```

### Método 2: Referenciar
```
No chat com Cline:
"Use o prompt test-appointment-flow.md para testar 
o fluxo completo de agendamento"
```

### Método 3: Customizar
```
1. Copiar prompt base
2. Adaptar para necessidade específica
3. Salvar como novo prompt (opcional)
```

---

## ✅ Boas Práticas

### Quando Criar Novo Prompt

Crie um prompt quando:
- [ ] Tarefa é repetitiva (> 3 vezes)
- [ ] Processo tem múltiplas etapas
- [ ] Requer conhecimento específico
- [ ] Outros devs precisam fazer igual

### Template Básico

```markdown
# [Emoji] Prompt: [Nome da Tarefa]

## Objetivo
[O que este prompt faz]

## Pré-requisitos
- [ ] Item 1
- [ ] Item 2

## Passo a Passo
1. Fazer X
2. Verificar Y
3. Confirmar Z

## Checklist Final
- [ ] Resultado esperado 1
- [ ] Resultado esperado 2

## Problemas Comuns
| Problema | Solução |
|----------|---------|
| X        | Y       |
```

---

## 📊 Status dos Prompts

| Prompt | Status | Última Atualização |
|--------|--------|-------------------|
| test-appointment-flow | ✅ Pronto | 26/11/2025 |
| design-review | ✅ Pronto | 26/11/2025 |

---

## 🔮 Prompts Planejados

### Alta Prioridade
- [ ] **deploy-production.md** - Checklist de deploy
- [ ] **debug-oauth.md** - Troubleshoot OAuth erros
- [ ] **performance-audit.md** - Análise de performance

### Média Prioridade
- [ ] **create-new-page.md** - Template para novas páginas
- [ ] **api-endpoint.md** - Template para novas APIs
- [ ] **database-migration.md** - Migrar dados Firestore

### Baixa Prioridade
- [ ] **onboard-developer.md** - Onboarding de novos devs
- [ ] **security-review.md** - Auditoria de segurança
- [ ] **seo-optimization.md** - Checklist SEO

---

## 💡 Dicas

### Para Manutenção
- Revisar prompts a cada 2-3 meses
- Deletar prompts obsoletos
- Atualizar com aprendizados novos
- Manter formato consistente

### Para Eficiência
- Nomear claramente (verbo + substantivo)
- Incluir tempo estimado
- Adicionar exemplos práticos
- Linkar documentação relevante

### Para Qualidade
- Testar prompt antes de salvar
- Pedir feedback de outros devs
- Incluir checklist de resultado
- Documentar problemas comuns

---

## 🆘 Suporte

**Problemas com prompts?**
1. Verificar se pré-requisitos estão ok
2. Consultar "Problemas Comuns" no prompt
3. Adaptar para seu contexto específico
4. Criar issue se prompt está desatualizado

**Sugestões de novos prompts?**
1. Descrever tarefa repetitiva
2. Listar passos necessários
3. Abrir PR com novo prompt
4. Seguir template básico

---

## 🔗 Links Relacionados

- [.clinerules](../.clinerules) - Regras de desenvolvimento
- [Estado Atual](../docs/1-ESTADO-ATUAL/README.md) - Status do projeto
- [Roadmap](../docs/2-ROADMAP/MVP-PRODUCAO.md) - Próximos passos
- [MCP Config](../.mcp/config.json) - Configuração MCP servers

---

*DaTempo - Onde tudo dá tempo para fazer bem feito 🕰️*
