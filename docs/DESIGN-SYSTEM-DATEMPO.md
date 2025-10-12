# 🕰️ Design System — DaTempo v0.1

> *"Um lugar onde tudo dá tempo. Como no escritório da vovó, onde o relógio andava devagar e sempre havia tempo para o cafezinho."*

---

## 📖 Filosofia da Marca

### O Nome

**DaTempo** não é apenas sobre agendamento. É sobre:

- ✨ **Tranquilidade** — Aqui, você sempre tem tempo
- 🏠 **Aconchego** — Como na casa da vó, onde nada era corrido
- 📚 **Simplicidade** — Antigamente tudo era mais simples
- ☕ **Pausa** — O luxo de respirar fundo e organizar sua vida

### Tom de Voz

**Como uma tia-avó sábia e carinhosa:**

- Nunca apressado, sempre gentil
- Prático sem ser frio
- Acolhedor sem ser infantil
- Retrô sem ser antiquado

**Exemplos de microcopy:**

❌ "Clique aqui agora!"  
✅ "Quando você quiser, é só tocar aqui"

❌ "Erro! Tente novamente"  
✅ "Ops, algo não saiu como esperado. Vamos tentar de novo?"

❌ "Loading..."  
✅ "Só um instantinho..."

❌ "Delete"  
✅ "Guardar na gaveta" ou "Dispensar"

---

## 🎨 Paleta de Cores

### Cores Primárias — Tons de Madeira e Papel Velho

```css
/* Madeira Envelhecida - Principal */
--madeira-escura: #8B6F47;    /* Mogno envelhecido */
--madeira-media: #B8956A;     /* Carvalho suave */
--madeira-clara: #D4C4A8;     /* Pinho claro */

/* Papel e Tecido - Neutros */
--papel-velho: #F5EFE6;       /* Papel envelhecido */
--linho-cru: #EDE5D8;         /* Tecido de linho */
--pergaminho: #FDFBF7;        /* Branco quente */

/* Tinta Sépia - Textos */
--sepia-escuro: #4A3F35;      /* Tinta antiga escura */
--sepia-medio: #6B5D52;       /* Tinta desbotada */
--sepia-claro: #9C8D7E;       /* Lápis apagado */
```

### Cores Secundárias — Detalhes Nostálgicos

```css
/* Verde Oliva - Abajur antigo */
--verde-vintage: #7D8F69;     /* Luminária de escritório */
--verde-musgo: #9CAF88;       /* Sofá da vovó */

/* Azul Desbotado - Porcelana antiga */
--azul-porcelana: #8FA5B8;    /* Xícara de chá */
--azul-lavanda: #B5C7D3;      /* Toalha bordada */

/* Terracota - Vaso de barro */
--terracota: #C97F5F;         /* Pote de açúcar */
--coral-suave: #E5A78A;       /* Tapete persa */
```

### Cores de Estado

```css
/* Sucesso - Verde musgo suave */
--sucesso: #9CAF88;
--sucesso-claro: #C8D4BD;

/* Atenção - Terracota suave */
--atencao: #C97F5F;
--atencao-claro: #E5BFA8;

/* Erro - Carmim desbotado */
--erro: #B85C5C;
--erro-claro: #D89A9A;

/* Info - Azul porcelana */
--info: #8FA5B8;
--info-claro: #C2D1DD;
```

---

## ✍️ Tipografia

### Família Principal — Nostalgia Legível

```css
/* Títulos - Serifa Clássica */
--font-titulos: 'Crimson Pro', 'Georgia', serif;
/* Peso: 600 (SemiBold) para títulos */
/* Peso: 700 (Bold) para destaques */

/* Corpo - Humanista Moderna */
--font-corpo: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
/* Peso: 400 (Regular) para texto */
/* Peso: 500 (Medium) para ênfase */

/* Monospace - Máquina de escrever */
--font-codigo: 'IBM Plex Mono', 'Courier New', monospace;
/* Uso: datas, horários, códigos */
```

### Escala Tipográfica

```css
/* Hierarquia Harmoniosa */
--text-xs: 0.75rem;    /* 12px - Anotações */
--text-sm: 0.875rem;   /* 14px - Legendas */
--text-base: 1rem;     /* 16px - Corpo */
--text-lg: 1.125rem;   /* 18px - Destaque */
--text-xl: 1.25rem;    /* 20px - Subtítulo */
--text-2xl: 1.5rem;    /* 24px - Título */
--text-3xl: 1.875rem;  /* 30px - Título grande */
--text-4xl: 2.25rem;   /* 36px - Hero */
```

### Espaçamento de Linha

```css
--leading-relaxed: 1.75;   /* Textos longos - leitura tranquila */
--leading-normal: 1.5;     /* Parágrafos padrão */
--leading-tight: 1.25;     /* Títulos curtos */
```

---

## 🖼️ Logo & Identidade

### Logo Tipográfico "DaTempo"

**Características:**
- Serifa clássica (Crimson Pro Bold)
- Ligadura especial no "Da" (mais próximo)
- Espaçamento generoso
- Cor: `--madeira-escura` ou `--sepia-escuro`

**Variações:**

```
┌─────────────────────────────────┐
│  DaTempo                         │  ← Principal (horizontal)
│  Agende com tranquilidade       │  ← Tagline opcional
└─────────────────────────────────┘

┌─────────┐
│ DaTempo │  ← Compacta (sem tagline)
└─────────┘

┌─────────┐
│   Da    │  ← Vertical (mobile)
│  Tempo  │
└─────────┘
```

### Ícone/Símbolo Opcional (futuro)

**Conceitos:**
- 🕰️ Relógio de parede antigo (minimalista)
- 📅 Calendário de arrancar (folhinha)
- ☕ Xícara de café com vapor
- 🪑 Cadeira de balanço
- 📚 Livro de anotações com marcador

---

## 🧩 Componentes Base

### Botões

```css
/* Botão Primário - Madeira */
.btn-primary {
  background: linear-gradient(135deg, #8B6F47 0%, #B8956A 100%);
  color: #FDFBF7;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(139, 111, 71, 0.2);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.3);
}

/* Botão Secundário - Contorno */
.btn-secondary {
  background: transparent;
  border: 2px solid #B8956A;
  color: #8B6F47;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 500;
}

/* Botão Suave - Ghost */
.btn-ghost {
  background: rgba(212, 196, 168, 0.2);
  color: #4A3F35;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 400;
}
```

### Inputs e Forms

```css
.input-datempo {
  background: #FDFBF7;
  border: 2px solid #EDE5D8;
  border-radius: 6px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #4A3F35;
  transition: border-color 0.3s ease;
}

.input-datempo:focus {
  outline: none;
  border-color: #B8956A;
  box-shadow: 0 0 0 3px rgba(184, 149, 106, 0.1);
}

.input-datempo::placeholder {
  color: #9C8D7E;
  font-style: italic;
}
```

### Cards

```css
.card-datempo {
  background: #FDFBF7;
  border: 1px solid #EDE5D8;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(74, 63, 53, 0.08);
  transition: all 0.3s ease;
}

.card-datempo:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(74, 63, 53, 0.12);
}

/* Textura opcional - papel */
.card-datempo::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  border-radius: 12px;
  pointer-events: none;
}
```

### Badges e Tags

```css
.badge-datempo {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(156, 141, 126, 0.15);
  color: #6B5D52;
}
```

---

## 📐 Espaçamento e Grid

### Sistema de Espaçamento (8pt grid)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Margens Generosas

**Princípio:** Mais espaço = mais calma

```css
/* Containers */
.container-datempo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Seções */
.section-spacing {
  padding: var(--space-16) 0;
}

/* Entre elementos */
.stack > * + * {
  margin-top: var(--space-6); /* Respiro entre cards */
}
```

---

## 🎭 Efeitos e Detalhes

### Sombras Suaves

```css
--shadow-sm: 0 2px 8px rgba(74, 63, 53, 0.06);
--shadow-md: 0 4px 16px rgba(74, 63, 53, 0.08);
--shadow-lg: 0 8px 24px rgba(74, 63, 53, 0.12);
--shadow-xl: 0 16px 48px rgba(74, 63, 53, 0.16);
```

### Bordas Arredondadas

```css
--radius-sm: 4px;    /* Pequenos elementos */
--radius-md: 8px;    /* Botões, inputs */
--radius-lg: 12px;   /* Cards */
--radius-xl: 16px;   /* Modais */
--radius-full: 9999px; /* Pills, avatares */
```

### Transições

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

### Texturas Opcionais

```css
/* Fundo de papel */
.paper-texture {
  background-color: #F5EFE6;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E");
}

/* Fundo de madeira (sutil) */
.wood-grain {
  background: linear-gradient(90deg, 
    rgba(139, 111, 71, 0.02) 0%, 
    rgba(184, 149, 106, 0.03) 50%, 
    rgba(139, 111, 71, 0.02) 100%
  );
}
```

---

## 🖱️ Interações e Animações

### Princípios

1. **Nunca abrupto** — Sempre suave
2. **Resposta tátil** — Feedback visual sutil
3. **Sem pressa** — Animações mais lentas (300-400ms)
4. **Natural** — Easing curves orgânicas

### Exemplos

```css
/* Hover suave */
.interactive:hover {
  transform: translateY(-2px);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Click/Active */
.interactive:active {
  transform: scale(0.98);
  transition: transform 150ms ease-out;
}

/* Fade in suave */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 500ms ease-out;
}
```

---

## 📱 Responsividade Tranquila

### Breakpoints

```css
--mobile: 640px;     /* Celular */
--tablet: 768px;     /* Tablet */
--desktop: 1024px;   /* Desktop */
--wide: 1280px;      /* Tela grande */
```

### Abordagem Mobile-First

Sempre pensar: *"Como seria isso na mesa da cozinha da vovó?"*

- Elementos maiores (toque fácil)
- Espaçamento generoso
- Nunca esconder funcionalidade
- Texto sempre legível (min 16px)

---

## 🎨 Uso do Logo

### Header

```tsx
// Header Desktop
<header className="bg-[#FDFBF7] border-b border-[#EDE5D8]">
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-['Crimson_Pro'] font-bold text-3xl text-[#8B6F47]">
          DaTempo
        </h1>
        <span className="text-sm text-[#9C8D7E] font-['Inter'] italic">
          Agende com tranquilidade
        </span>
      </div>
    </div>
  </div>
</header>

// Header Mobile
<header className="bg-[#FDFBF7] border-b border-[#EDE5D8] px-4 py-3">
  <h1 className="font-['Crimson_Pro'] font-bold text-2xl text-[#8B6F47] text-center">
    DaTempo
  </h1>
</header>
```

### Favicon

```html
<!-- SVG Favicon - Tipográfico "DT" -->
<link rel="icon" type="image/svg+xml" href="/favicon-datempo.svg">

<!-- Ou PNG com fundo papel -->
<link rel="icon" type="image/png" href="/favicon-32x32.png">
```

---

## 💬 Exemplos de Microcopy

### Navegação e Ações

| Comum | DaTempo |
|-------|---------|
| "Sign up" | "Vem tomar um café" |
| "Login" | "Entrar na sala" |
| "Logout" | "Até logo" |
| "Dashboard" | "Sua escrivaninha" |
| "Settings" | "Seus pertences" |
| "Help" | "Precisa de ajuda?" |
| "Submit" | "Está pronto!" |
| "Cancel" | "Deixa pra depois" |

### Feedback

| Situação | Mensagem |
|----------|----------|
| Sucesso | "Prontinho! Tudo certo por aqui ☕" |
| Erro | "Opa, algo não saiu como planejado..." |
| Loading | "Só um instantinho enquanto preparo tudo..." |
| Vazio | "Nada por aqui ainda. Que tal começar?" |
| Confirmação | "Tem certeza? Podemos voltar atrás se quiser" |

### Tempo e Agendamento

| Contexto | Copy |
|----------|------|
| Agendar | "Marcar um horário" ou "Reservar um tempo" |
| Reagendar | "Mudar de ideia" |
| Cancelar | "Dispensar esse horário" |
| Confirmar | "Está confirmado!" |
| Lembrete | "Um lembrete amigável..." |

---

## 🏠 Layout: Princípios de Design

### 1. Respiração Visual

- Nunca apertar elementos
- Margem mínima: 24px entre seções
- Padding generoso: 32px em cards

### 2. Hierarquia Clara mas Suave

- Títulos grandes, mas não gritantes
- Contraste de peso, não de cor agressiva
- Guiar o olho naturalmente

### 3. Assimetria Orgânica

- Nem tudo precisa ser centralizado
- Layouts ligeiramente assimétricos são mais humanos
- Como objetos numa escrivaninha

### 4. Elementos Decorativos Sutis

- Divisores suaves (linhas sépia clara)
- Ornamentos minimalistas (opcional)
- Texturas de papel (muito sutis)

---

## 📦 Componentes Especiais DaTempo

### Relógio Analógico Decorativo

```tsx
// Relógio no canto do header (opcional)
<div className="analog-clock">
  <div className="hour-hand"></div>
  <div className="minute-hand"></div>
</div>
```

### Quote Box (Pensamento do Dia)

```tsx
<div className="quote-box">
  <p className="italic text-[#6B5D52]">
    "O tempo não para, mas você pode escolher como usá-lo."
  </p>
  <span className="text-sm text-[#9C8D7E]">— DaTempo</span>
</div>
```

### Empty State Acolhedor

```tsx
<div className="empty-state">
  <div className="text-6xl mb-4">☕</div>
  <h3 className="text-xl text-[#8B6F47] mb-2">
    Nada agendado ainda
  </h3>
  <p className="text-[#9C8D7E]">
    Tudo tranquilo por aqui. Quando quiser, é só marcar algo.
  </p>
</div>
```

---

## 🎯 Checklist de Implementação

### Fase 1: Fundação
- [ ] Instalar fontes (Crimson Pro + Inter)
- [ ] Configurar variáveis CSS de cores
- [ ] Criar componentes base (Button, Input, Card)
- [ ] Definir espaçamentos globais

### Fase 2: Identidade
- [ ] Criar logo tipográfico "DaTempo"
- [ ] Gerar favicon (SVG ou PNG)
- [ ] Atualizar header e footer
- [ ] Ajustar microcopy em toda aplicação

### Fase 3: Refinamento
- [ ] Adicionar texturas sutis
- [ ] Implementar animações suaves
- [ ] Testar em diferentes telas
- [ ] Ajustar contrastes (acessibilidade)

### Fase 4: Detalhes
- [ ] Empty states personalizados
- [ ] Loading states temáticos
- [ ] 404 page aconchegante
- [ ] Guia de uso para desenvolvedores

---

## 🔗 Recursos Externos

### Fontes (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Inspiração Visual

- **Pinterest:** "vintage office aesthetic"
- **Dribbble:** "warm nostalgic UI"
- **Behance:** "retro web design"

---

## 💭 Filosofia Final

> **DaTempo** não é sobre correr contra o relógio.  
> É sobre aquele momento na casa da vó, onde o tempo parecia mais lento,  
> as coisas eram mais simples, e sempre dava tempo para tudo.

**Cada pixel deve transmitir:** calma, conforto, confiança.

---

*Design System v0.1 — Outubro 2025*  
*"Onde tudo dá tempo, com carinho."*
