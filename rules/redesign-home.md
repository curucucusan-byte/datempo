# Redesign: Home (route /redesign)

Data: 2025-10-04

Objetivo
- Fornecer uma rota alternativa `/redesign` que contenha uma versão modernizada da landing page sem tocar na `app/page.tsx` atual.

Decisões
- Criar `src/app/redesign/page.tsx` para manter a landing original intacta.
- Estilo: cores claras (fundo branco), cards pastéis, bordas arredondadas maiores e botões em pílula — alinhado com guia visual do projeto.
- Não adicionar novas dependências; usar Tailwind classes já presentes no projeto.

Assunções
- Tailwind está configurado e disponível globalmente (ver `src/app/globals.css`).
- Imagens referenciadas (`/logos/whats-logo-and-name-green.svg`) já existem em `public/logos`.
- Rota será acessível em desenvolvimento e produção sem ajustes extras.

Impacto
- Nenhuma alteração na rota principal `/` — isso evita regressões.
- Facilita testes A/B manuais apontando tráfego para `/redesign` quando desejado.


Migração / Próximos passos
- Se o redesign for aprovado, mover o conteúdo para `app/page.tsx` ou configurar roteamento condicional via feature flag.
- Adicionar testes de snapshot e verificação de build (CI) para garantir que a nova rota não quebre o build.
- A nova rota consome `ACTIVE_PLANS` de `src/lib/plans.ts` e mostra detalhes completos de cada plano (limites, bullets, overage, features).

Alterações visuais recentes
- Ajustei tipografia para tamanhos maiores na rota `/redesign` (headings, textos e bullets) para melhorar legibilidade.
- Substituí tonalidades "rose/red" por variantes verdes/emerald (badges, botões principais e backgrounds) para evitar associação negativa.
 - Aprimorei responsividade para mobile: header empilha, CTAs se tornam full-width no mobile, cards e paddings ajustados para toque e leitura.

Registro de commit
- feat(redesign): add /redesign route and documentation
