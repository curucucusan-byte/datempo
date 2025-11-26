# 🎯 Roadmap MVP para Produção

> Plano para lançamento de DaTempo em produção
> Data alvo: 2-3 semanas
> Última atualização: 26/11/2025

---

## 📊 Status Atual

**Completude:** 73%  
**MVP Viável:** ⚠️ Sim, com limitações conhecidas  
**Beta Fechado:** Pronto para 5-10 usuários convidados

---

## 🚀 Fases de Lançamento

### Fase 0: Correções Críticas (2-3 dias)
**Objetivo:** Deixar o MVP coerente e funcional

#### 0.1 Identidade Visual Consistente
- [ ] Atualizar `package.json` (nome: "datempo")
- [ ] Padronizar Dashboard para verde+madeira
- [ ] Revisar todas as páginas (checar paleta)
- [ ] Garantir tom de voz em todas mensagens

#### 0.2 Experiência Básica Completa
- [ ] Criar páginas 404 e 500
- [ ] Adicionar loading states faltantes
- [ ] Implementar rate limiting global
- [ ] Logs estruturados (erros críticos)

#### 0.3 Documentação Interna
- [ ] README.md atualizado
- [ ] Guia de setup rápido
- [ ] Variáveis de ambiente documentadas

**Tempo estimado:** 2-3 dias
**Bloqueadores:** Nenhum

---

### Fase 1: MVP Beta Fechado (1 semana)
**Objetivo:** Testar com 5-10 usuários convidados

#### 1.1 Features Mínimas
- [x] Autenticação Google ✓
- [x] Criar agendamento ✓
- [x] Sincronizar Google Calendar ✓
- [x] Notificar WhatsApp ✓
- [x] Prevenir conflitos ✓
- [x] Link compartilhável ✓
- [ ] Dashboard multi-calendários (UI básica)
- [ ] Configurar workHours no dashboard

#### 1.2 Qualidade e Estabilidade
- [ ] Testes E2E manuais (fluxo completo)
- [ ] Tratamento de erros em todas APIs
- [ ] Validações de input robustas
- [ ] Mensagens de erro amigáveis

#### 1.3 Monitoramento
- [ ] Logs estruturados (info, warn, error)
- [ ] Métricas básicas (agendamentos/dia)
- [ ] Alertas de erro (email ou slack)

**Tempo estimado:** 5-7 dias
**Usuários alvo:** 5-10 pessoas conhecidas
**Feedback:** Form Google ou conversa direta

---

### Fase 2: MVP Beta Público (2-3 semanas)
**Objetivo:** Abrir para primeiros 50-100 usuários

#### 2.1 Polimento UI/UX
- [ ] Onboarding claro (primeiro acesso)
- [ ] Tour guiado (opcional)
- [ ] FAQs na homepage
- [ ] Vídeo demo (2 min)

#### 2.2 Features Importantes
- [ ] Lembretes configuráveis (interface)
- [ ] Multi-calendários (gestão completa)
- [ ] Exportar agendamentos (.csv)
- [ ] Página de status do sistema

#### 2.3 Marketing Básico
- [ ] Landing page otimizada (SEO)
- [ ] Post em redes sociais
- [ ] Email para lista de espera (se houver)
- [ ] Press kit básico

**Tempo estimado:** 2-3 semanas
**Meta:** 50-100 usuários
**Métricas:** Taxa de ativação, retenção semanal

---

### Fase 3: Lançamento 1.0 (1-2 meses)
**Objetivo:** Produto estável para público geral

#### 3.1 Features Completas
- [ ] Pagamentos Stripe (checkout)
- [ ] Links Inteligentes (filtros funcionais)
- [ ] Analytics no dashboard
- [ ] Integrações extras (Zoom, Google Meet)

#### 3.2 Escala
- [ ] Performance otimizada
- [ ] CDN para assets
- [ ] Caching estratégico
- [ ] Testes de carga

#### 3.3 Negócio
- [ ] Planos de assinatura funcionais
- [ ] Upgrade/downgrade automático
- [ ] Faturamento transparente
- [ ] Suporte via email

**Tempo estimado:** 1-2 meses
**Meta:** 500+ usuários
**Revenue:** Primeiros pagantes

---

## 📋 Checklist Pré-Lançamento Beta

### Técnico
- [ ] Deploy em produção (Render/Vercel)
- [ ] Domínio próprio configurado (datempo.com.br?)
- [ ] SSL ativo
- [ ] Variáveis de ambiente configuradas
- [ ] Backups automáticos Firestore
- [ ] Logs centralizados
- [ ] Monitoramento uptime

### Legal/Compliance
- [ ] Termos de Uso finalizados
- [ ] Política de Privacidade (LGPD)
- [ ] Cookie consent (se aplicável)
- [ ] Contrato de assinatura (se pago)

### Produto
- [ ] Onboarding claro
- [ ] Mensagens de erro amigáveis
- [ ] Loading states em todas ações
- [ ] Mobile responsivo testado
- [ ] Browsers principais testados (Chrome, Safari, Firefox)

### Comunicação
- [ ] Email de boas-vindas
- [ ] Email de agendamento criado
- [ ] Email de lembrete (se ativado)
- [ ] FAQ atualizado
- [ ] Canal de suporte definido

---

## 🎯 Critérios de Sucesso

### Beta Fechado (5-10 usuários)
```
Sucesso se:
✓ 80%+ completam primeiro agendamento
✓ 0 bugs críticos reportados
✓ 3+ feedback positivos
✓ Tempo médio de setup < 10 min
```

### Beta Público (50-100 usuários)
```
Sucesso se:
✓ 50%+ retornam na semana seguinte
✓ 5+ agendamentos/usuário/mês
✓ NPS > 8
✓ < 5% taxa de churn mensal
```

### Lançamento 1.0 (500+ usuários)
```
Sucesso se:
✓ 10%+ convertem para plano pago
✓ MRR > R$ 1000
✓ 60%+ retenção após 3 meses
✓ < 1% bugs críticos
```

---

## 🚫 O Que NÃO Fazer Agora

**Features que podem esperar:**
- ❌ Reviews Google (complexo, baixo impacto)
- ❌ Analytics avançado (usar Google Analytics)
- ❌ Integrações com calendários não-Google
- ❌ App móvel nativo
- ❌ Whitelabel/multi-tenant
- ❌ API pública

**Razão:** Foco no core, validar demanda primeiro

---

## 📊 Métricas Principais

### Produto
```
1. Taxa de Ativação
   = Usuários que criam 1º agendamento / Total cadastros
   Meta: > 70%

2. Retenção Semanal
   = Usuários ativos semana N / Ativos semana N-1
   Meta: > 60%

3. Agendamentos por Usuário
   = Total agendamentos / Total usuários ativos
   Meta: > 5/mês

4. Tempo Médio de Setup
   = Tempo entre cadastro e 1º agendamento
   Meta: < 10 minutos
```

### Negócio
```
1. Conversão para Pago
   = Usuários pagos / Total usuários
   Meta: > 10%

2. MRR (Monthly Recurring Revenue)
   = Soma de todas assinaturas mensais
   Meta: R$ 1000 (mês 3)

3. Churn Rate
   = Usuários que cancelaram / Total usuários
   Meta: < 5%/mês

4. CAC (Customer Acquisition Cost)
   = Gasto em marketing / Novos usuários
   Meta: < R$ 20
```

---

## 🔧 Stack de Ferramentas

### Monitoramento
- [ ] **Sentry** - Rastreamento de erros
- [ ] **Google Analytics** - Métricas de uso
- [ ] **LogRocket** (opcional) - Session replay

### Comunicação
- [ ] **Postmark/SendGrid** - Emails transacionais
- [ ] **Intercom/Crisp** - Chat de suporte
- [ ] **WhatsApp Business API** - Notificações

### Infraestrutura
- [x] **Render/Vercel** - Hosting
- [x] **Firebase** - Database + Auth
- [ ] **Cloudflare** - CDN + DDoS protection

---

## 🗓️ Timeline Realista

```
Semana 1 (Fase 0):
├─ Dias 1-2: Correções visuais + package.json
├─ Dia 3: Páginas erro + loading states
└─ Dias 4-5: Logs + rate limiting

Semana 2 (Fase 1 - parte 1):
├─ Dias 1-3: Multi-calendários UI
├─ Dia 4: WorkHours no dashboard
└─ Dia 5: Testes E2E manuais

Semana 3 (Fase 1 - parte 2):
├─ Dias 1-2: Deploy produção + domínio
├─ Dia 3: Convidar 5 beta testers
├─ Dias 4-5: Corrigir bugs reportados

Semana 4-6 (Fase 2):
├─ Semana 4: Polimento UI + onboarding
├─ Semana 5: Lembretes configuráveis
└─ Semana 6: Marketing + 50 usuários

Mês 2-3 (Fase 3):
├─ Mês 2: Pagamentos Stripe funcionais
├─ Mês 3: Links inteligentes + analytics
└─ Lançamento 1.0 🎉
```

---

## 💡 Aprendizados Esperados

### Beta Fechado
- Fluxo de onboarding está claro?
- Quais features são mais usadas?
- Onde usuários travam?
- Bugs críticos não previstos

### Beta Público
- Qual perfil de usuário converte melhor?
- Preço dos planos está adequado?
- Quais integrações faltam?
- Documentação está completa?

### Lançamento 1.0
- Product-market fit alcançado?
- Escala técnica está ok?
- Suporte consegue atender demanda?
- Revenue model é sustentável?

---

## 🆘 Plano B

**Se algo der muito errado:**

### Cenário 1: Bugs críticos no beta
→ Pausar novos cadastros  
→ Corrigir urgente  
→ Comunicar transparência  
→ Relançar em 48h

### Cenário 2: Baixa adoção (< 10 usuários/semana)
→ Revisar proposta de valor  
→ Melhorar landing page  
→ Fazer entrevistas com não-usuários  
→ Pivotar se necessário

### Cenário 3: Problemas técnicos de escala
→ Implementar fila de jobs  
→ Caching agressivo  
→ Rate limiting mais restritivo  
→ Upgrade infraestrutura

---

## 📞 Próximos Passos Imediatos

1. **Hoje:** Corrigir package.json + padronizar dashboard
2. **Amanhã:** Criar páginas 404/500 + logs estruturados
3. **Dia 3:** Multi-calendários UI básica
4. **Dia 4-5:** Testes completos + deploy produção
5. **Semana 2:** Convidar primeiros beta testers

---

*DaTempo - Onde tudo dá tempo para fazer bem feito 🕰️*  
*Roadmap v1.0 - 26/11/2025*
