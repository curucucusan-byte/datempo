# 🎨 Prompt: Auditoria de Design Visual

Use este prompt para revisar consistência visual em páginas/componentes.

---

## Objetivo
Garantir que todas páginas seguem o design system DaTempo (verde + madeira).

---

## Design System DaTempo

### Paleta Oficial
```css
/* Cores Primárias */
--verde-whatsapp: #10b981;    /* emerald-600 */
--madeira: #8B6F47;
--papel-velho: #F5EFE6;
--sepia: #4A3F35;

/* Gradientes */
--gradiente-logo: linear-gradient(to right, #10b981, #8B6F47);
--gradiente-bg: linear-gradient(135deg, #fef3e2 0%, #f5efe6 50%, #d4f1f4 100%);

/* Uso */
Botões primários: verde
Textos importantes: madeira
Backgrounds: papel velho
Títulos: gradiente verde→madeira
```

### Tipografia
- **Títulos:** `font-serif` (elegante, vintage)
- **Corpo:** `sans-serif` (legibilidade)
- **Código:** `font-mono`

### Tom de Voz
- Tranquilo: "Só um instantinho para conectar"
- Acolhedor: "Respira fundo, vamos organizar tudo"
- Sem pressa: "Onde tudo dá tempo ☕"

---

## Checklist de Auditoria

### Para Cada Página/Componente

#### 1. Cores
- [ ] Botão primário é verde (#10b981)?
- [ ] Textos importantes são madeira (#8B6F47)?
- [ ] Background é papel velho ou gradiente aprovado?
- [ ] Azul (#2563eb) só em detalhes mínimos?
- [ ] Sem cores fora da paleta?

#### 2. Tipografia
- [ ] Títulos principais usam `font-serif`?
- [ ] Corpo de texto usa `sans-serif`?
- [ ] Código usa `font-mono`?
- [ ] Hierarquia clara (h1 > h2 > h3)?

#### 3. Elementos Visuais
- [ ] Logo DaTempo aparece?
- [ ] Ícones são consistentes (lucide-react)?
- [ ] Espaçamentos seguem padrão Tailwind?
- [ ] Border-radius é consistente?

#### 4. Tom de Voz
- [ ] Mensagens são tranquilas?
- [ ] Sem palavras como "rápido", "urgente"?
- [ ] Usa ☕ ou 🕰️ onde apropriado?
- [ ] Mensagens de erro são amigáveis?

#### 5. Responsividade
- [ ] Mobile funciona bem?
- [ ] Tablet funciona bem?
- [ ] Desktop funciona bem?
- [ ] Breakpoints do Tailwind usados?

---

## Páginas para Auditar

### Alta Prioridade (Público)
1. **Homepage** (`src/app/page.tsx`)
   - Status: ✅ Verde + Madeira
   - Revisar: Tom de voz em CTAs

2. **Login** (`src/app/login/page.tsx`)
   - Status: ✅ Madeira/Vintage
   - Revisar: Responsividade mobile

3. **Agenda Pública** (`src/app/agenda/[slug]/page.tsx`)
   - Status: ⚠️ Neutro (slate)
   - Ação: Adicionar toques verde/madeira

### Média Prioridade (Autenticado)
4. **Dashboard** (`src/app/dashboard/page.tsx`)
   - Status: ❌ Azul predominante
   - Ação: URGENTE - Mudar para verde+madeira

5. **Visão Geral** (`src/app/dashboard/visao-geral/`)
   - Status: ❓ Verificar
   - Ação: Auditar

6. **Agendamentos** (`src/app/dashboard/agendamentos/`)
   - Status: ❓ Verificar
   - Ação: Auditar

7. **Configurações** (`src/app/dashboard/configuracoes/`)
   - Status: ❓ Verificar
   - Ação: Auditar

### Baixa Prioridade
8. **Termos** (`src/app/termos/`)
9. **Privacidade** (`src/app/privacidade/`)
10. **404/500** (quando criadas)

---

## Como Auditar

### Método 1: Inspeção Visual
```bash
# 1. Rodar dev server
yarn dev

# 2. Abrir cada página
# 3. Comparar com paleta oficial
# 4. Anotar discrepâncias
```

### Método 2: Busca em Código
```bash
# Buscar cores não aprovadas (azul)
grep -r "blue-" src/app/dashboard/

# Buscar gradientes não aprovados
grep -r "from-blue\|to-blue" src/

# Buscar textos urgentes
grep -ri "rápido\|urgente\|maximize" src/app/
```

### Método 3: DevTools
```
1. Abrir DevTools (F12)
2. Inspecionar elemento
3. Verificar classes Tailwind aplicadas
4. Comparar com design system
```

---

## Template de Relatório

```markdown
# Auditoria de Design - [Nome da Página]

**Data:** DD/MM/YYYY
**Página:** src/app/[caminho]
**Auditor:** [Seu nome]

## Conformidade

### Cores
- [ ] ✅ Paleta oficial
- [ ] ❌ Azul em botão principal
- [ ] ⚠️ Gradiente background não aprovado

### Tipografia
- [ ] ✅ Títulos em serif
- [ ] ✅ Corpo em sans-serif

### Tom de Voz
- [ ] ✅ Tranquilo e acolhedor
- [ ] ❌ Usa palavra "urgente"

## Ações Necessárias

1. Mudar botão de `bg-blue-600` para `bg-emerald-600`
2. Substituir "Configure agora!" por "Vamos configurar"
3. Adicionar emoji ☕ em mensagem de sucesso

## Screenshots
[Anexar antes/depois se possível]
```

---

## Correções Comuns

### Azul → Verde
```tsx
// ❌ Antes
<button className="bg-blue-600 text-white">

// ✅ Depois
<button className="bg-emerald-600 text-white">
```

### Tom Urgente → Tranquilo
```tsx
// ❌ Antes
<p>Configure agora!</p>

// ✅ Depois  
<p>Vamos configurar com calma</p>
```

### Sem Identidade → Com Identidade
```tsx
// ❌ Antes
<div className="bg-white">

// ✅ Depois
<div className="bg-gradient-to-br from-[#fef3e2] via-[#f5efe6] to-[#d4f1f4]">
```

---

## Priorização de Correções

### Crítico (fazer hoje)
- Dashboard com azul predominante
- Mensagens de erro não amigáveis
- Logo ausente em páginas principais

### Importante (fazer esta semana)
- Páginas autenticadas sem identidade
- Tom de voz inconsistente
- Falta de emojis característicos

### Desejável (fazer quando der)
- Ajustes finos de espaçamento
- Micro-interações
- Animações sutis

---

## Resultado Esperado

```
✅ 100% das páginas públicas seguem paleta
✅ 100% dos botões primários são verde
✅ 100% dos títulos usam serif ou gradiente
✅ 100% das mensagens têm tom tranquilo
✅ Dashboard padronizado (verde+madeira)
✅ Identidade visual coerente em todo projeto
```

---

*Use este prompt sempre que criar/modificar páginas*
