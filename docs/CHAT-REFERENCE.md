# 📌 Referência Rápida - DaTempo Chat Context

> **Última atualização:** 26/11/2025 07:46
> **Context Window:** Este arquivo deve ter < 2000 tokens para ser eficiente
> **Como usar:** Mencione este arquivo (`@CHAT-REFERENCE.md`) ao iniciar novo chat

---

## 🎯 Estado Atual do Projeto

**Nome:** DaTempo  
**Repo:** https://github.com/curucucusan-byte/datempo  
**Branch:** main  
**Último Commit:** `1cd2daf` - WorkHours visual selector

**Progresso MVP:** 4/7 dias completos (57%)

---

## ✅ O Que Está PRONTO

### Dia 1-3: Base Sólida
- ✅ Documentação estratégica (3 docs principais)
- ✅ Sistema de planos atualizado (30/200/1000 agendamentos)
- ✅ Features fantasma removidas (Reviews Google, Links Inteligentes UI, Stripe UI)
- ✅ Dashboard 100% padronizado (verde #10b981 + madeira #8B6F47)

### Dia 4: Multi-Calendários UX ⭐
- ✅ WorkHoursSelector component criado
- ✅ Modo Simples (templates + seletor visual)
- ✅ Modo Avançado (JSON editor)
- ✅ 3 templates prontos (Comercial, Flexível, Tarde/Noite)
- ✅ Integrado em CalendarsCard (já tinha 90% do sistema pronto!)

**Descoberta importante:** Sistema de multi-calendários já estava quase completo, só precisava de melhor UX para WorkHours!

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

## 🚀 PRÓXIMO: Dia 5 (4-6h de trabalho)

### Páginas Legais + Analytics

**Criar:**
1. `src/app/termos/page.tsx` - Termos de Uso (template básico)
2. `src/app/privacidade/page.tsx` - Política Privacidade (LGPD)
3. `src/app/not-found.tsx` - 404 customizada (identidade DaTempo)
4. `src/app/error.tsx` - 500 genérica

**Implementar Google Analytics 4:**
- Instalar no `src/app/layout.tsx`
- 5 eventos críticos:
  - `sign_up` (após OAuth)
  - `calendar_connected` (primeiro calendário)
  - `first_appointment_created`
  - `link_shared` (copiar/QR/native)
  - `booking_completed` (cliente agenda)

**Estimativa:** Meio dia de trabalho

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

**Você diz:**
```
@CHAT-REFERENCE.md
Vamos continuar o Dia 5 do MVP?
```

**Eu vou:**
1. Ler este arquivo
2. Entender contexto completo
3. Continuar de onde paramos
4. Seguir todas regras do .clinerules

---

**🚨 Criar Novo Chat SE:**
- Context > 160K tokens (80%)
- Respostas > 30 segundos
- Fim de dia de trabalho grande
- Você solicitar resumão atualizado
