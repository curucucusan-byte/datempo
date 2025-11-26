# 📌 Referência Rápida - DaTempo Chat Context

> **Última atualização:** 26/11/2025 08:03
> **Context Window:** Este arquivo deve ter < 2000 tokens para ser eficiente
> **Como usar:** Mencione este arquivo (`@CHAT-REFERENCE.md`) ao iniciar novo chat

---

## 🎯 Estado Atual do Projeto

**Nome:** DaTempo  
**Repo:** https://github.com/curucucusan-byte/datempo  
**Branch:** main  
**Último Commit:** `7ec0920` - Context transfer system

**Progresso MVP:** 4/7 dias completos (57%)

---

## ✅ O Que Está PRONTO

### Dia 1-3: Base Sólida
- ✅ Documentação estratégica (3 docs principais)
- ✅ Sistema de planos atualizado (30/200/1000 agendamentos)
- ✅ Features fantasma removidas (Reviews Google, Links Inteligentes UI, Stripe UI)
- ✅ Dashboard 100% padronizado (verde #10b981 + madeira #8B6F47)

### Dia 4: Multi-Calendários + Context System ⭐
- ✅ WorkHoursSelector component (templates + UI visual)
- ✅ Integrado em CalendarsCard
- ✅ CHAT-REFERENCE.md (sistema de resumos)
- ✅ .clinerules v1.2.0 (economia de tokens)
- ✅ workflow-novo-chat.md (guia completo)

**Sistema:** Context transfer entre chats funcionando! Use `@CHAT-REFERENCE.md` em novo chat.

---

## 🎨 Design System (OBRIGATÓRIO)

**Paleta de Cores:**
```
Verde WhatsApp: #10b981 (emerald-600)
Madeira:        #8B6F47
Papel Velho:    #F5EFE6
Sépia:          #4A3F35
Gradiente Logo: linear-gradient(to right, #10b981, #8B6F47)
```

**NUNCA usar azul predominante!** Apenas detalhes mínimos se necessário.

---

## 📊 Planos e Limites

| Plano | Preço | Agendamentos/mês | Calendários | Features |
|-------|-------|------------------|-------------|----------|
| Free | R$ 0 | 30 | 1 | Básico |
| Starter | R$ 39 | 200 | 5 | + WhatsApp |
| Pro | R$ 79 | 1000 | 10 | + Tudo |

**Removido:** reviewsGoogle de todas features  
**Oculto:** Stripe checkout (código mantido para futuro)

---

## 🚀 PRÓXIMO: Dia 5 (4-6h)

### Páginas Legais + GA4

1. Termos de Uso (`src/app/termos/page.tsx`)
2. Privacidade LGPD (`src/app/privacidade/page.tsx`)
3. 404/500 customizadas
4. Google Analytics 4 + 5 eventos críticos

**Estimativa:** 4-6h

---

## 📁 Arquivos Chave para Consultar

**Documentação:**
- `docs/MVP-PRODUCAO-DEFINITIVO.md` - Roadmap completo 7 dias
- `docs/DECISOES-TECNICAS.md` - Todas decisões tomadas
- `docs/ANALISE-PRODUTO-COMPLETA.md` - Análise completa como produto
- `.clinerules` - Regras de desenvolvimento (v1.1.0)

**Código Principal:**
- `src/lib/plans.ts` - Sistema de planos
- `src/lib/google.ts` - Integração Google Calendar
- `src/app/dashboard/minha-agenda/CalendarsCard.tsx` - Gerenciamento multi-calendários
- `src/app/dashboard/components/WorkHoursSelector.tsx` - Seletor visual horários

---

## 🐛 Problemas Conhecidos

**NENHUM** - Código estável após Dia 4!

---

## 🔧 Stack Técnica

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilo:** TailwindCSS
- **Backend:** Firebase (Firestore + Admin)
- **Auth:** Google OAuth 2.0
- **API:** Google Calendar API
- **Notificações:** WhatsApp Click-to-Chat
- **Deploy:** Vercel (planejado Dia 7)

---

## 💬 Tom de Voz do Projeto

**DaTempo = Tranquilidade + Aconchego**

✅ "Só um instantinho para conectar"  
✅ "Respira fundo, vamos organizar tudo"  
✅ "Onde tudo dá tempo ☕"  

❌ "Rápido! Configure agora!"  
❌ "Maximize sua produtividade"

---

## 📈 Roadmap Restante

- ⏳ **Dia 5:** Páginas legais + GA4 (PRÓXIMO)
- ⏳ **Dia 6:** Testes completos (8h)
- ⏳ **Dia 7:** Deploy + Soft Launch (4-6h)

**Prazo MVP:** 7-14 dias (iniciado 26/11/2025)

---

## 🎯 Ao Iniciar Novo Chat

**Você:**
```
@CHAT-REFERENCE.md
Continuar Dia 5?
```

**IA:**
- Lê este arquivo
- Entende context
- Continua trabalho
- Segue .clinerules v1.2.0

---

**🚨 CRIAR NOVO CHAT AGORA:**
- Context: 84% (168K/200K) ⚠️
- Sistema pronto para usar
- Dia 4 completo
