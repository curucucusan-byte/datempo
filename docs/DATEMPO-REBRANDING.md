# 🕰️ Guia de Rebranding: Agende Mais → DaTempo

## 📋 Checklist de Mudanças

### 1. Identidade Visual

#### Logo e Nome
- [ ] Substituir "Agende Mais" por "DaTempo" em todos os lugares
- [ ] Atualizar logo no header
- [ ] Trocar favicon
- [ ] Atualizar meta tags (title, og:image, etc)
- [ ] Mudar nome no arquivo `package.json`

#### Cores
- [ ] Substituir paleta verde WhatsApp/Google Calendar
- [ ] Implementar paleta madeira/papel velho
- [ ] Atualizar variáveis CSS globais
- [ ] Ajustar componentes existentes

#### Tipografia
- [ ] Instalar Crimson Pro (títulos)
- [ ] Instalar Inter (corpo)
- [ ] Configurar no Tailwind/CSS
- [ ] Atualizar componentes de texto

---

### 2. Arquivos para Modificar

#### 🎨 Estilos e Configuração

```bash
# Tailwind Config
tailwind.config.js
  - Adicionar cores DaTempo
  - Configurar fontes (Crimson Pro, Inter)
  - Ajustar bordas arredondadas
  - Configurar sombras suaves

# CSS Global
src/app/globals.css
  - Importar Google Fonts
  - Definir variáveis CSS
  - Aplicar fundo papel
  - Ajustar scrollbar (opcional)
```

#### 📄 Páginas Principais

```bash
# Homepage
src/app/page.tsx
  - Trocar hero section
  - Atualizar copy ("Agende Mais" → "DaTempo")
  - Mudar CTA para tom acolhedor
  - Adicionar elementos vintage sutis

# Layout Principal
src/app/layout.tsx
  - Atualizar metadata (title, description)
  - Trocar favicon
  - Mudar nome do app
  - Atualizar Open Graph tags

# Login
src/app/login/page.tsx
  - Mudar título "Entrar na sala"
  - Ajustar copy do botão
  - Estilizar com cores DaTempo

# Dashboard
src/app/dashboard/page.tsx
  - Renomear "Dashboard" → "Sua Escrivaninha"
  - Atualizar cards com estilo papel
  - Ajustar empty states
```

#### 🧩 Componentes

```bash
# Header/Navigation
- Trocar logo
- Ajustar cores de fundo (#FDFBF7)
- Mudar links ("Dashboard" → "Escrivaninha")

# Buttons
- Aplicar gradient madeira
- Bordas arredondadas (8px)
- Sombras suaves
- Hover states tranquilos

# Cards
- Fundo papel (#FDFBF7)
- Borda sutil (#EDE5D8)
- Textura opcional
- Padding generoso (24px)

# Forms/Inputs
- Cores sépia para texto
- Placeholder itálico
- Focus state madeira
- Labels acolhedores
```

#### 📝 Textos e Copy

```bash
# Páginas de conteúdo
src/app/privacidade/page.tsx
src/app/termos/page.tsx
src/app/regras/page.tsx
  - Trocar nome da empresa
  - Ajustar tom de voz
  - Microcopy acolhedor

# README
README.md
  - Atualizar nome do projeto
  - Mudar descrição
  - Adicionar link para Design System
```

#### 🔧 Configuração

```bash
# Package.json
package.json
  - name: "datempo"
  - description: atualizar

# Vercel/Render Config
vercel.json
  - Verificar domínio
  - Meta tags

# Firebase
- Atualizar nome do app no console
- Mudar OAuth consent screen
```

---

### 3. Checklist de Microcopy

#### Navegação
```diff
- "Dashboard"
+ "Sua Escrivaninha"

- "Settings"
+ "Seus Pertences"

- "Logout"
+ "Até Logo"

- "Sign Up"
+ "Vem Tomar um Café"
```

#### Ações
```diff
- "Create Appointment"
+ "Marcar um Horário"

- "Cancel"
+ "Deixa pra Depois"

- "Confirm"
+ "Está Pronto!"

- "Delete"
+ "Dispensar"
```

#### Feedback
```diff
- "Success!"
+ "Prontinho! Tudo certo por aqui ☕"

- "Error occurred"
+ "Opa, algo não saiu como planejado..."

- "Loading..."
+ "Só um instantinho..."
```

---

### 4. Exemplo de Implementação

#### Tailwind Config

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        madeira: {
          escura: '#8B6F47',
          media: '#B8956A',
          clara: '#D4C4A8',
        },
        papel: {
          velho: '#F5EFE6',
          linho: '#EDE5D8',
          pergaminho: '#FDFBF7',
        },
        sepia: {
          escuro: '#4A3F35',
          medio: '#6B5D52',
          claro: '#9C8D7E',
        },
      },
      fontFamily: {
        titulo: ['"Crimson Pro"', 'Georgia', 'serif'],
        corpo: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'papel': '0 4px 16px rgba(74, 63, 53, 0.08)',
      },
    },
  },
}
```

#### Layout Atualizado

```tsx
// src/app/layout.tsx
export const metadata = {
  title: 'DaTempo - Agende com Tranquilidade',
  description: 'Um lugar onde tudo dá tempo. Organize seus compromissos com calma.',
  icons: {
    icon: '/logos/datempo-favicon.svg',
  },
  openGraph: {
    title: 'DaTempo',
    description: 'Agende com tranquilidade',
    siteName: 'DaTempo',
  },
}
```

#### Header Component

```tsx
// Novo header DaTempo
export function Header() {
  return (
    <header className="bg-papel-pergaminho border-b border-papel-linho">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logos/datempo-logo.svg" 
              alt="DaTempo" 
              width={160} 
              height={48}
            />
          </div>
          <nav className="flex gap-6">
            <Link 
              href="/dashboard" 
              className="text-sepia-medio hover:text-madeira-escura transition-colors"
            >
              Sua Escrivaninha
            </Link>
            <button className="text-sepia-claro hover:text-sepia-medio">
              Até Logo
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

#### Button Component

```tsx
// Botão DaTempo style
export function Button({ children, variant = 'primary', ...props }) {
  const styles = {
    primary: `
      bg-gradient-to-br from-madeira-escura to-madeira-media 
      text-papel-pergaminho 
      hover:shadow-lg hover:-translate-y-0.5
      transition-all duration-300
      rounded-lg px-6 py-3
      font-corpo font-medium
    `,
    secondary: `
      bg-transparent border-2 border-madeira-media
      text-madeira-escura
      hover:bg-madeira-media/10
      transition-all duration-300
      rounded-lg px-6 py-3
    `,
  }
  
  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  )
}
```

---

### 5. Assets para Criar/Substituir

#### Imagens
- [ ] `/public/logos/datempo-logo.svg` ✅ (criado)
- [ ] `/public/logos/datempo-favicon.svg` ✅ (criado)
- [ ] `/public/og-image-datempo.png` (1200x630)
- [ ] `/public/apple-touch-icon.png` (180x180)

#### Ícones
- [ ] Favicon ICO (16x16, 32x32, 48x48)
- [ ] PWA icons (192x192, 512x512)

#### Ilustrações (opcional)
- [ ] Empty states temáticos
- [ ] 404 page aconchegante
- [ ] Loading states vintage

---

### 6. Testes Pós-Rebranding

#### Visual
- [ ] Todas as páginas com nova identidade
- [ ] Favicon aparecendo corretamente
- [ ] Fontes carregando (Crimson Pro + Inter)
- [ ] Cores consistentes em todo site
- [ ] Sombras e bordas aplicadas

#### Funcional
- [ ] Login funcionando
- [ ] Criação de agendamentos
- [ ] Dashboard carregando
- [ ] Links navegando corretamente

#### Copy
- [ ] Todos os textos atualizados
- [ ] Microcopy acolhedor
- [ ] Mensagens de erro/sucesso
- [ ] Empty states

#### Técnico
- [ ] Build sem erros (`yarn build`)
- [ ] Performance mantida
- [ ] SEO atualizado
- [ ] Meta tags corretas

---

### 7. Timeline Sugerido

**Dia 1: Fundação (2-3h)**
- Instalar fontes
- Configurar Tailwind com cores DaTempo
- Criar componentes base (Button, Card, Input)
- Trocar logo e favicon

**Dia 2: Páginas (3-4h)**
- Atualizar homepage
- Redesenhar dashboard
- Ajustar login/auth pages
- Modificar header/footer

**Dia 3: Refinamento (2-3h)**
- Atualizar todo microcopy
- Ajustar espaçamentos
- Adicionar texturas sutis
- Testar em diferentes telas

**Dia 4: Polimento (1-2h)**
- Empty states personalizados
- Loading states
- 404 page
- Últimos ajustes

---

### 8. Comandos Úteis

```bash
# Build para verificar erros
yarn build

# Procurar todas ocorrências de "Agende Mais"
grep -r "Agende Mais" src/

# Procurar cores antigas (verde WhatsApp)
grep -r "#25D366" src/
grep -r "#10b981" src/

# Verificar imports de logo antigo
grep -r "agende-mais" src/
```

---

## 🎯 Prioridade de Mudanças

### 🔴 Crítico (fazer primeiro)
1. Logo e favicon
2. Nome em metadata/SEO
3. Cores primárias (madeira, papel)
4. Fontes (Crimson Pro + Inter)

### 🟡 Importante (fazer logo após)
5. Microcopy principal (nav, buttons)
6. Header e footer
7. Homepage hero
8. Dashboard

### 🟢 Desejável (quando possível)
9. Texturas sutis
10. Animações refinadas
11. Empty states personalizados
12. Ilustrações custom

---

**Precisa de ajuda com alguma parte específica?** 😊

Posso:
- Gerar mais componentes estilizados
- Criar mais variações de logo
- Ajudar com a configuração do Tailwind
- Fazer o search & replace dos textos
