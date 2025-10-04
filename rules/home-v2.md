# Redesign: Home V2 (route /home-v2)

Data: 2025-10-04

## Objetivo
Criar uma landing page moderna e completa em uma nova rota `/home-v2`, sem alterar a página principal ou a rota `/redesign`.

## Decisões de design

### Visual
- Fundo branco com gradientes sutis (slate-50, emerald-50, sky-50) para dar profundidade
- Header fixo com backdrop blur para navegação fluida
- Cards com bordas arredondadas grandes (rounded-3xl) e sombras suaves
- Tipografia grande e legível: headings em 4xl-7xl, body text em base-xl
- Sem vermelhos: palette focada em emerald (positivo), sky (secundário), slate (neutro)
- Badges e pills arredondados para destacar features e planos

### Estrutura
- **Header**: sticky, com logo, nav e CTAs
- **Hero**: duas colunas, título impactante, logos strip de integrações, demo visual
- **Recursos**: grid 3-col com ícones emoji, cards hover com elevação
- **Planos**: grid 3-col, plano Starter destacado ("Mais popular"), dados dinâmicos via ACTIVE_PLANS
- **FAQ**: acordeão visual com perguntas comuns
- **CTA final**: gradiente suave, dois CTAs (Ver planos / Entrar)
- **Footer**: links de termos, privacidade, copyright

### Dados
- Consome `ACTIVE_PLANS` de `src/lib/plans.ts` para garantir consistência
- Preços, limites e features renderizados dinamicamente
- Formatação de números em pt-BR (Intl.NumberFormat)
- Proteção de quebra de linha em valores monetários (whitespace-nowrap)

### Responsividade
- Grid adapta para 1-col em mobile, 2-col em tablet, 3-col em desktop
- Header empilha CTAs em mobile
- Tipografia reduz em breakpoints menores (text-5xl → text-4xl em mobile)
- Hero usa layout vertical em mobile, horizontal em lg+

### Acessibilidade
- Todas as imagens com alt descritivo
- Ícones SVG inline para evitar dependências externas
- Contraste adequado (WCAG AA): texto escuro em fundos claros
- Links e botões com estados hover claros

## Assunções
- Tailwind CSS está configurado (package.json mostra tailwindcss@4.1.13)
- Imagens em `/public/logos` existem (calendar.png, whatsapp-green-filled.png)
- Next.js 15.5.4 com App Router ativo
- Rota será acessível em `/home-v2` sem conflitos

## Impacto
- Nenhuma alteração em rotas existentes (`/`, `/redesign`)
- Nova rota independente para testes A/B ou validação com usuários
- Build não deve quebrar (componente usa apenas imports padrão do Next.js)

## Migração / Próximos passos
1. Testar a rota em dev: `yarn dev` → http://localhost:3000/home-v2
2. Se aprovado, decidir:
   - Mover para `/` (substituir home atual)
   - Usar como alternativa permanente
   - Configurar roteamento condicional via feature flag
3. Adicionar testes de snapshot ou E2E para garantir estabilidade
4. Corrigir caminhos de imagens se necessário (verificar `/public/logos/whatsapp-green-filled.png` vs `whats-logo-and-name-green.svg`)

## Registro de commit
- `feat(home-v2): create modern landing page redesign at /home-v2`
