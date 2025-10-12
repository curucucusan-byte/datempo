# 🕰️ DaTempo - Agendamento com WhatsApp e Google Calendar

> "Um lugar onde tudo dá tempo. Como no escritório da vovó, onde o relógio andava devagar e sempre havia tempo para o cafezinho."

---

## 📖 Sobre

**DaTempo** é uma plataforma de agendamento que integra:
- ✅ **Google Calendar** - Sincronização automática de agendas
- ✅ **WhatsApp** - Notificações e lembretes
- ✅ **Pagamentos** - Integração com Stripe/PIX
- ✅ **Multi-calendário** - Gerencie várias agendas

---

## 🚀 Quick Start

### Instalação

```bash
# Clone o repositório
git clone https://github.com/mgotze/zap-agenda.git
cd zap-agenda

# Instale dependências
yarn install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicie em desenvolvimento
yarn dev

# Acesse: http://localhost:3000
```

### Configuração OAuth Google

**Para configurar autenticação com Google Calendar:**

👉 **[Documentação OAuth Completa](./docs/OAUTH-INDICE.md)**

**Links rápidos:**
- ⚡ [Quick Start (5 min)](./docs/OAUTH-QUICK-START.md)
- 📋 [Template Copy-Paste](./docs/OAUTH-TEMPLATE-COPY-PASTE.md)
- 🖼️ [Guia Visual Passo a Passo](./docs/OAUTH-GUIA-VISUAL.md)
- 🔧 [Troubleshooting](./docs/OAUTH-TROUBLESHOOTING.md)

---

## 📚 Documentação

### Design System
- 📐 **[Design System DaTempo](./docs/DESIGN-SYSTEM-DATEMPO.md)** - Cores, tipografia, componentes
- 🎨 **[Design Híbrido (Verde + Madeira)](./docs/DESIGN-HIBRIDO-VERDE-MADEIRA.md)** - Paleta atual
- 🔍 **[Auditoria de Identidade Visual](./docs/AUDITORIA-IDENTIDADE-VISUAL.md)** - Consistência entre páginas

### Funcionalidades
- 🔗 **[Sistema de Links Inteligentes](./docs/SISTEMA-LINKS-INTELIGENTES.md)** - Links com filtros (semana, turno, etc.)
- 🔐 **[Configuração OAuth Google](./docs/OAUTH-INDICE.md)** - Índice completo de guias OAuth

### Regras e Desenvolvimento
- 📋 **[README First](./rules/README-FIRST-ALWAYS.md)** - Leia antes de começar
- 🎭 **[Prompt Roles](./rules/prompt-roles.md)** - Personas e tom de voz
- 📅 Changelog: [2025-10-02](./rules/2025-10-02.md) | [2025-10-04](./rules/2025-10-04.md)

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.5.4 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Backend**: Firebase (Firestore + Auth)
- **Autenticação**: Google OAuth 2.0
- **Pagamentos**: Stripe
- **Deploy**: Render (anteriormente Vercel)

---

## 🔐 Variáveis de Ambiente

### Essenciais (.env.local)

```bash
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu-secret
APP_BASE_URL=http://localhost:3000

# Firebase Admin
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# WhatsApp (Opcional)
WHATSAPP_API_KEY=sua-key
```

### Produção (Render)

Configure as mesmas variáveis em:
```
Render Dashboard → Seu serviço → Environment
```

Certifique-se de clicar em **"Save Changes"** após adicionar cada variável.

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor dev (localhost:3000)

# Build e Produção
yarn build            # Compila para produção
yarn start            # Inicia servidor de produção

# Qualidade de Código
yarn lint             # Executa ESLint
yarn type-check       # Verifica tipos TypeScript

# Utilitários
yarn trigger-reminder # Dispara lembretes manuais (script)
```

---

## 🏗️ Estrutura do Projeto

```
zapagenda/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── page.tsx           # Homepage
│   │   ├── login/             # Autenticação
│   │   ├── dashboard/         # Dashboard (protegido)
│   │   ├── agenda/[slug]/     # Página pública de agendamento
│   │   └── api/               # API Routes
│   │       ├── google/        # OAuth e Calendar API
│   │       ├── appointment/   # Gerenciamento de agendamentos
│   │       └── webhooks/      # Webhooks (Stripe, etc.)
│   ├── components/            # Componentes reutilizáveis
│   ├── lib/                   # Utilitários e configs
│   │   ├── firebaseAdmin.js   # Firebase Admin SDK
│   │   ├── firebaseClient.ts  # Firebase Client SDK
│   │   ├── google.ts          # Google OAuth e Calendar
│   │   ├── stripe.ts          # Stripe integration
│   │   └── whats.ts           # WhatsApp integration
│   └── data/                  # Dados estáticos
├── docs/                      # Documentação
│   ├── OAUTH-INDICE.md        # Índice OAuth
│   ├── DESIGN-SYSTEM-DATEMPO.md
│   └── ...
├── public/                    # Assets estáticos
├── firebase/                  # Regras Firestore
├── rules/                     # Regras de desenvolvimento
└── scripts/                   # Scripts auxiliares
```

---

## 🎨 Design System

### Paleta Híbrida (Verde WhatsApp + Madeira)

**Cores Primárias:**
- 🟢 **Verde WhatsApp**: `#10b981` (emerald-600)
- 🟤 **Madeira**: `#8B6F47`
- 📄 **Papel Velho**: `#F5EFE6`
- 🖋️ **Sépia**: `#4A3F35`

**Gradientes:**
```css
/* Logo e Títulos */
background: linear-gradient(to right, #10b981, #8B6F47);

/* Backgrounds */
background: linear-gradient(135deg, #fef3e2 0%, #f5efe6 50%, #d4f1f4 100%);
```

**Filosofia:**
- ✨ Tranquilidade e aconchego
- 🏠 "Como na casa da vó"
- 📚 Simplicidade e clareza
- ☕ Sempre há tempo

📖 **[Ver Design System Completo](./docs/DESIGN-SYSTEM-DATEMPO.md)**

---

## 🔗 Links e Recursos

### Produção
- 🌐 **Website**: https://datempo.onrender.com (substituir pelo domínio real)
- 📊 **Dashboard**: https://datempo.onrender.com/dashboard

### Desenvolvimento
- 🔥 **Firebase Console**: https://console.firebase.google.com
- ☁️ **Google Cloud**: https://console.cloud.google.com
- 💳 **Stripe Dashboard**: https://dashboard.stripe.com
- 🚀 **Render Dashboard**: https://dashboard.render.com

### Documentação Externa
- 📘 **Next.js**: https://nextjs.org/docs
- 🔐 **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- 📅 **Calendar API**: https://developers.google.com/calendar
- 💰 **Stripe Docs**: https://stripe.com/docs

---

## 🧪 Testes

### Teste Local

1. Configure `.env.local` com credenciais de desenvolvimento
2. Inicie: `yarn dev`
3. Acesse: http://localhost:3000
4. Teste fluxo completo:
   - Login com Google
   - Conectar calendário
   - Criar agendamento
   - Receber notificação WhatsApp (se configurado)

### Teste em Produção

1. Configure variáveis no Render (Environment)
2. Deploy: `git push origin main` (Render faz deploy automático)
3. Aguarde 5-10 minutos (propagação OAuth + deploy Render)
4. Teste em: https://seu-dominio.onrender.com

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"
→ [Solução](./docs/OAUTH-TROUBLESHOOTING.md#-erro-redirect_uri_mismatch)

### Erro: "invalid_client"
→ [Solução](./docs/OAUTH-TROUBLESHOOTING.md#-erro-invalid_client)

### Funciona em dev mas não em produção
→ [Solução](./docs/OAUTH-TROUBLESHOOTING.md#-funciona-em-dev-mas-não-em-produção)

### Outros problemas
→ **[Troubleshooting Completo](./docs/OAUTH-TROUBLESHOOTING.md)**

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m "feat: adiciona nova funcionalidade"`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

**Convenções:**
- Commits: [Conventional Commits](https://www.conventionalcommits.org/)
- Code Style: Prettier + ESLint
- Tipos: TypeScript strict mode

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 🆘 Suporte

### Documentação
- 📚 [Índice Geral de Docs](./docs/)
- 🔐 [OAuth Google](./docs/OAUTH-INDICE.md)
- 🎨 [Design System](./docs/DESIGN-SYSTEM-DATEMPO.md)

### Contato
- 📧 Email: [seu-email@exemplo.com]
- 💬 Issues: [GitHub Issues](https://github.com/mgotze/zap-agenda/issues)

---

## ✅ Status do Projeto

- ✅ **Homepage**: Híbrido (verde + madeira) implementado
- ✅ **Autenticação**: Google OAuth funcionando
- ✅ **Calendários**: Sincronização Google Calendar
- ✅ **Agendamentos**: CRUD completo
- ✅ **WhatsApp**: Notificações configuradas
- ✅ **Pagamentos**: Stripe/PIX integrados
- ⚠️ **Links Inteligentes**: UI completa, filtros pendentes
- ⚠️ **Visual Identity**: 20% consistência (80% a padronizar)

📊 **[Ver Auditoria Completa](./docs/AUDITORIA-IDENTIDADE-VISUAL.md)**

---

*DaTempo - Onde tudo dá tempo 🕰️*  
*Desenvolvido com ☕ e tranquilidade*
