# 🎨 Rebranding: ZapAgenda → Agende Mais

## 📋 Checklist Completo de Mudanças

### 🔴 **CRÍTICO - Mudar AGORA**

#### 1. **Google Cloud Console**
- [ ] Nome do app: `ZapAgenda` → `Agende Mais`
- [ ] Descrição: Atualizar menções
- 👉 https://console.cloud.google.com/apis/credentials/consent

#### 2. **package.json**
- [ ] `"name": "zapagenda"` → `"name": "agende-mais"`

#### 3. **Layout Principal** (`src/app/layout.tsx`)
- [ ] `title`: "ZapAgenda" → "Agende Mais"
- [ ] `siteName`: "ZapAgenda" → "Agende Mais"
- [ ] `description`: Atualizar

#### 4. **Páginas Públicas**
- [ ] Homepage (`src/app/page.tsx`)
- [ ] Dashboard (`src/app/dashboard/page.tsx`)
- [ ] Formulário de Agendamento (`src/app/agenda/[slug]/page.tsx`)
- [ ] Privacidade (`src/app/privacidade/page.tsx`)
- [ ] Termos (`src/app/termos/page.tsx`)

#### 5. **Mensagens WhatsApp**
- [ ] `src/app/api/appointment/route.ts` - Confirmação de agendamento
- [ ] `src/app/api/cron/reminder/route.ts` - Lembretes

---

### 🟡 **IMPORTANTE - Mudar em Seguida**

#### 6. **Domínio/URL**
Considere registrar:
- ✅ `agendemais.com.br` (recomendado)
- ✅ `agendemais.com`
- ⚠️ Verificar disponibilidade

#### 7. **Variáveis de Ambiente (Render)**
Atualizar quando mudar domínio:
```bash
APP_BASE_URL=https://agendemais.com.br  # ou agende-mais.onrender.com
GOOGLE_REDIRECT_URI=https://agendemais.com.br/api/google/oauth/callback
```

#### 8. **Google Cloud - URIs**
Quando mudar domínio, atualizar:
- JavaScript Origins: `https://agendemais.com.br`
- Redirect URIs: `https://agendemais.com.br/api/google/oauth/callback`

#### 9. **Firebase Project**
- Opcional: Criar novo projeto `agende-mais`
- Ou manter `zapagenda-3e479` (apenas internamente)

---

### 🟢 **RECOMENDADO - Identidade Visual**

#### 10. **Logotipo**
Criar novo logo com "Agende Mais":
- [ ] Tamanho: 120x120px (para Google Cloud)
- [ ] Formatos: PNG, SVG, WebP
- [ ] Salvar em: `public/logos/agende-mais.png`

#### 11. **Favicon**
- [ ] Atualizar `src/app/favicon.ico`
- [ ] Criar variações para PWA

#### 12. **Cores da Marca**
Definir paleta:
```css
/* Sugestão */
--primary: #10b981;      /* Verde emerald */
--secondary: #059669;    /* Verde escuro */
--accent: #34d399;       /* Verde claro */
```

---

### 📄 **DOCUMENTAÇÃO - Atualizar Depois**

#### 13. **README.md**
- [ ] Título do projeto
- [ ] Descrição
- [ ] Screenshots

#### 14. **Arquivos em /rules/**
- [ ] ROADMAP-COMPLETO.md
- [ ] GOOGLE-CLOUD-*.md
- [ ] TROUBLESHOOTING-*.md
- [ ] 2025-10-02.md (regras de negócio)

#### 15. **Comentários no Código**
Buscar e substituir:
```bash
# Buscar referências antigas
grep -r "ZapAgenda" src/
grep -r "zapagenda" src/
```

---

## 🚀 **Ordem de Execução Recomendada**

### **Fase 1: Mudanças Imediatas (30 min)**

1. ✅ Google Cloud Console - Nome do app
2. ✅ package.json - Nome do pacote
3. ✅ Layout e páginas principais
4. ✅ Mensagens WhatsApp
5. ✅ Commit e deploy

### **Fase 2: Domínio e Infraestrutura (1-2 dias)**

1. ⏳ Registrar domínio `agendemais.com.br`
2. ⏳ Configurar DNS no Render
3. ⏳ Atualizar variáveis de ambiente
4. ⏳ Atualizar Google Cloud URIs
5. ⏳ Testar fluxo completo

### **Fase 3: Identidade Visual (1 semana)**

1. 🎨 Criar novo logotipo
2. 🎨 Atualizar favicon
3. 🎨 Definir paleta de cores
4. 🎨 Atualizar assets visuais

### **Fase 4: Documentação (contínuo)**

1. 📝 Atualizar README
2. 📝 Atualizar guias
3. 📝 Limpar comentários antigos

---

## 📊 **Arquivos Principais a Modificar**

### **Alta Prioridade** (atualize hoje)

```
package.json                                    ← Nome do pacote
src/app/layout.tsx                             ← Meta tags principais
src/app/page.tsx                               ← Homepage
src/app/dashboard/page.tsx                     ← Dashboard
src/app/agenda/[slug]/page.tsx                 ← Formulário público
src/app/privacidade/page.tsx                   ← Política de privacidade
src/app/api/appointment/route.ts               ← Mensagem WhatsApp
src/app/api/cron/reminder/route.ts             ← Lembretes
```

### **Média Prioridade** (atualize esta semana)

```
README.md                                       ← Documentação principal
rules/ROADMAP-COMPLETO.md                      ← Roadmap
rules/GOOGLE-CLOUD-*.md                        ← Guias Google Cloud
public/logos/                                  ← Assets visuais
```

### **Baixa Prioridade** (atualize conforme necessário)

```
rules/2025-10-02.md                            ← Regras de negócio
Comentários em arquivos .tsx/.ts              ← Limpar gradualmente
```

---

## 🎯 **Recomendações Estratégicas**

### **1. Posicionamento da Marca**

**Agende Mais** comunica:
- ✅ **Ação**: "Agende" é verbo direto
- ✅ **Benefício**: "Mais" sugere quantidade/frequência
- ✅ **Simplicidade**: Fácil de falar e lembrar
- ✅ **SEO**: Boa para busca ("agendar", "agendamento")

**Slogan sugerido**:
- "Agende Mais, Trabalhe Menos"
- "Mais Agendamentos, Menos Esforço"
- "Automatize seus Agendamentos"

### **2. Domínio**

**Opções por ordem de preferência**:
1. `agendemais.com.br` ⭐ (melhor para Brasil)
2. `agende.mais.br` (se disponível)
3. `agendemais.com` (internacional)
4. `agendemais.app` (moderno)

**Verificar disponibilidade**:
- 👉 https://registro.br (para .br)
- 👉 https://www.godaddy.com (para .com)

### **3. Identidade Visual**

**Elementos visuais**:
- 📅 **Ícone de calendário** (já tem em `public/logos/calendar.png`)
- ✅ **Check/plus symbol** (representa "mais")
- 💬 **Integração WhatsApp** (manter verde)

**Paleta de cores sugerida**:
```
Verde Primário: #10b981 (emerald-500)
Verde Escuro:   #059669 (emerald-600)
Verde Claro:    #d1fae5 (emerald-100)
Cinza Texto:    #1e293b (slate-800)
Cinza BG:       #f8fafc (slate-50)
```

### **4. Diferenciação**

**"Agende Mais" vs "ZapAgenda"**:
- ✅ Mais genérico (não só WhatsApp)
- ✅ Mais profissional
- ✅ Permite expandir para SMS, email, etc
- ✅ Foco no resultado ("mais agendamentos")

### **5. SEO e Marketing**

**Keywords alvo**:
- "sistema de agendamento"
- "agendamento online"
- "agendar consultas"
- "agendamento automático"
- "agendamento whatsapp"

**Meta description sugerida**:
```
Agende Mais - Sistema de agendamento automático com WhatsApp e 
Google Calendar. Reduza no-shows e aumente seus agendamentos.
```

---

## ⚠️ **Cuidados Importantes**

### **1. Migração Gradual**

Se já tem usuários:
- ✅ Mantenha ambos os nomes por 30-60 dias
- ✅ Adicione aviso no dashboard: "Agora somos Agende Mais!"
- ✅ Redirecione domínio antigo (se existir)

### **2. Comunicação**

Para usuários existentes:
- 📧 Email avisando mudança
- 💬 Mensagem no WhatsApp
- 🎨 Banner no dashboard

### **3. Backups**

Antes de mudar:
- ✅ Backup do Firebase/Firestore
- ✅ Backup das variáveis de ambiente
- ✅ Tag/release no Git: `v1.0-zapagenda`

---

## ✅ **Checklist de Lançamento**

Antes de anunciar o rebranding:

- [ ] Nome mudado em TODAS as páginas
- [ ] Google Cloud atualizado
- [ ] Mensagens WhatsApp atualizadas
- [ ] Novo logo criado e instalado
- [ ] Domínio registrado e configurado
- [ ] Variáveis de ambiente atualizadas
- [ ] README e docs atualizados
- [ ] Testes completos (agendamento, lembretes)
- [ ] Deploy em produção
- [ ] Comunicação enviada (se tiver usuários)

---

## 🎉 **Quando Estiver Pronto**

Anuncie nas redes:
- LinkedIn: "Rebranding: Agora somos Agende Mais!"
- Instagram/Facebook: Post com novo logo
- WhatsApp Business: Status sobre mudança
- Google Meu Negócio: Atualizar nome

**Tempo estimado total**: 1-2 semanas para transição completa
