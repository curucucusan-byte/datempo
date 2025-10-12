# 🎨 Logotipos Agende Mais - Guia de Uso

## 📁 Arquivos Criados

Criei 5 versões diferentes de logotipos em SVG:

### **Versão 1: Calendário com Check** ✅
- Arquivo: `agende-mais-logo-v1.svg`
- Estilo: Clássico e profissional
- Elementos: Calendário verde + check mark branco + plus azul
- Melhor para: Identidade corporativa, documentos formais

### **Versão 2: Minimalista "A+"** 🔤
- Arquivo: `agende-mais-logo-v2.svg`
- Estilo: Moderno e limpo
- Elementos: Letra A + símbolo +
- Melhor para: App icons, favicons, redes sociais

### **Versão 3: Relógio** ⏰
- Arquivo: `agende-mais-logo-v3.svg`
- Estilo: Conceitual (tempo + agendamento)
- Elementos: Relógio circular + check pequeno
- Melhor para: Headers, apresentações

### **Versão 4: Grid de Calendário** 📅
- Arquivo: `agende-mais-logo-v4.svg`
- Estilo: Clean e organizado
- Elementos: Círculo + grade de calendário + plus central
- Melhor para: Website, marketing materials

### **Versão 5: Hexágono "AM"** 🔷
- Arquivo: `agende-mais-logo-v5.svg`
- Estilo: Super moderno e tech
- Elementos: Forma hexagonal + letras AM
- Gradiente tri-color (verde → azul → roxo)
- Melhor para: Startups, tech brands, apps modernos

---

## 🎨 Paleta de Cores Usada

```css
Verde Principal: #10b981 (Emerald 500)
Verde Escuro:    #059669 (Emerald 600)
Azul Céu:        #0ea5e9 (Sky 500)
Roxo (v5):       #8b5cf6 (Violet 500)
Branco:          #ffffff
```

---

## 📐 Como Usar os Logos

### No React/Next.js (Componente Image):

```tsx
import Image from "next/image";

<Image 
  src="/logos/agende-mais-logo-v1.svg" 
  alt="Agende Mais" 
  width={40} 
  height={40} 
/>
```

### Como Favicon:

1. Escolha a versão (recomendo v2 ou v5 para favicon)
2. Converta para PNG 32x32 e 192x192
3. Adicione no `layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: '/logos/agende-mais-logo-v2.svg',
  },
}
```

### Como SVG Inline (melhor performance):

```tsx
<svg width="40" height="40" viewBox="0 0 200 200">
  <!-- Cole o conteúdo do SVG aqui -->
</svg>
```

### No Header:

```tsx
<div className="flex items-center gap-3">
  <Image 
    src="/logos/agende-mais-logo-v2.svg" 
    alt="Agende Mais" 
    width={40} 
    height={40} 
  />
  <span className="text-lg font-bold">Agende Mais</span>
</div>
```

---

## 🎯 Recomendações de Uso

| Contexto | Versão Recomendada | Por quê |
|----------|-------------------|---------|
| **Favicon** | V2 ou V5 | Simples e reconhecível em tamanho pequeno |
| **Header do Site** | V1 ou V4 | Profissional e detalhado |
| **App Mobile** | V2 | Minimalista, funciona em todos os tamanhos |
| **Email Signature** | V1 ou V3 | Conceitual e memorável |
| **Redes Sociais** | V5 | Moderno, chama atenção |
| **Documentos/Print** | V1 ou V4 | Clássico e corporativo |

---

## 🔧 Customização

### Mudar Cores:

Edite o gradiente dentro do SVG:

```svg
<linearGradient id="gradient1">
  <stop offset="0%" style="stop-color:#SUA_COR_1" />
  <stop offset="100%" style="stop-color:#SUA_COR_2" />
</linearGradient>
```

### Mudar Tamanho:

Apenas mude `width` e `height` - SVG escala perfeitamente!

```tsx
width={100} height={100}  // Grande
width={24} height={24}    // Pequeno
```

### Exportar para PNG:

1. Abra o SVG no navegador
2. Tire screenshot OU
3. Use ferramenta online: https://cloudconvert.com/svg-to-png

---

## 📱 Versões para Diferentes Plataformas

### Para PWA/App Manifest:

Crie versões PNG em:
- 192x192px
- 512x512px
- 1024x1024px (para iOS)

### Para Open Graph (redes sociais):

Crie PNG em:
- 1200x630px (landscape)
- Fundo colorido ou branco

---

## ✨ Próximos Passos

1. **Escolha sua versão favorita**
2. **Atualize o header do site**
3. **Configure o favicon**
4. **Crie versões PNG para redes sociais**
5. **Documente o brand guide** (cores, usos, etc.)

---

## 🎨 Ferramentas Úteis

- **Converter SVG → PNG**: https://cloudconvert.com/svg-to-png
- **Editar SVG visualmente**: https://boxy-svg.com/
- **Criar favicon multi-formato**: https://realfavicongenerator.net/
- **Comprimir SVG**: https://jakearchibald.github.io/svgomg/

---

**Dica:** Todos os SVGs são vetoriais, então escalam infinitamente sem perder qualidade! 🚀
