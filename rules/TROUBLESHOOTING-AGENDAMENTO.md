# 🔧 TROUBLESHOOTING - Agendamento e Sincronização Google Calendar

**Data:** 04 de Outubro de 2025  
**Problema Reportado:** Erro ao tentar agendar horário + evento não aparece no Google Calendar

---

## 🐛 PROBLEMA 1: Erro ao Agendar em Produção

### Possíveis Causas:

1. **Variáveis de ambiente ausentes/incorretas**
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `FIREBASE_*` credentials
   - `WA_META_TOKEN` e relacionados

2. **Token OAuth do Google expirado**
   - Refresh token não está sendo renovado
   - Usuário precisa reconectar conta Google

3. **Erro na função `getAuthenticatedClient`**
   - Tokens não encontrados no Firestore
   - Credenciais inválidas

4. **Rate limit do Google Calendar API**
   - Excedeu quota de requests

5. **Firestore não configurado**
   - Dados indo para arquivos locais (não funciona em Vercel)

---

## 🐛 PROBLEMA 2: Evento Não Aparece no Google Calendar

### Possíveis Causas:

1. **CalendarId incorreto**
   - `linkedCalendar.id` não é o ID real do Google Calendar
   - Deve ser algo como `primary` ou `email@gmail.com`

2. **Permissões insuficientes**
   - OAuth scope `https://www.googleapis.com/auth/calendar` não concedido
   - Precisa de `calendar.events` scope

3. **Erro silencioso na API**
   - `calendar.events.insert` falha mas não lança erro
   - Response não é verificado

4. **Timezone mismatch**
   - Evento criado mas em horário diferente do esperado

---

## ✅ CHECKLIST DE DIAGNÓSTICO

### 1. Verificar Logs do Servidor

```bash
# Vercel
vercel logs --follow

# Ou local
yarn dev
# E tentar agendar, observando console
```

**Procurar por:**
- `[google:event:create:start]` - Evento sendo criado
- `[google:event:create:ok]` - Sucesso
- `[apt:create] unexpected failure` - Erro capturado
- Stack traces de erros

---

### 2. Verificar Conexão Google Calendar

**No Dashboard (`/dashboard?tab=agenda`):**
- [ ] Botão "Conectar com Google" funcionando?
- [ ] Após conectar, aparece lista de calendários?
- [ ] Consegue ativar/desativar calendários?
- [ ] Ao ativar, gerou um `slug` único?

**Dados esperados em `linkedCalendars`:**
```typescript
{
  id: "primary", // OU email@gmail.com
  summary: "Nome do Calendário",
  ownerUid: "firebase-uid-123",
  slug: "medico-joao",
  active: true,
  whatsappNumber: "+5553999999999"
}
```

---

### 3. Verificar Scopes OAuth

**Arquivo:** `src/lib/google.ts`

```typescript
const SCOPES = [
  "https://www.googleapis.com/auth/calendar", // ✅ DEVE TER
  "https://www.googleapis.com/auth/calendar.events", // ✅ DEVE TER
];
```

**Se não tiver, adicionar e pedir re-autenticação.**

---

### 4. Testar Manualmente a API

**Criar arquivo de teste:** `scripts/test-google-event.mjs`

```javascript
import { google } from 'googleapis';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/google/oauth/callback'
);

// Cole aqui o access_token do Firestore
auth.setCredentials({
  access_token: 'ya29....',
  refresh_token: '1//...',
});

const calendar = google.calendar({ version: 'v3', auth });

const event = {
  summary: 'TESTE via Script',
  start: {
    dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    timeZone: 'America/Sao_Paulo',
  },
  end: {
    dateTime: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    timeZone: 'America/Sao_Paulo',
  },
};

try {
  const res = await calendar.events.insert({
    calendarId: 'primary', // ou seu email
    requestBody: event,
  });
  console.log('✅ Evento criado:', res.data.htmlLink);
} catch (err) {
  console.error('❌ Erro:', err.message);
  console.error('Detalhes:', err.response?.data);
}
```

**Executar:**
```bash
node scripts/test-google-event.mjs
```

---

## 🔨 CORREÇÕES NECESSÁRIAS

### Correção 1: Adicionar Tratamento de Erro Detalhado

**Problema:** Erros são capturados mas não informados ao usuário.

**Solução:** Logar detalhes e retornar mensagens específicas.

```typescript
// src/app/api/appointment/route.ts

try {
  const googleEvent = await createGoogleCalendarEvent(
    linkedCalendar.ownerUid,
    linkedCalendar.id,
    eventSummary,
    eventDescription,
    start,
    end,
    attendees,
    timeZone,
  );
  
  console.info("[apt:google:event:created]", { 
    eventId: googleEvent.id, 
    htmlLink: googleEvent.htmlLink 
  });
  
} catch (googleError) {
  console.error("[apt:google:event:failed]", {
    ownerUid: linkedCalendar.ownerUid,
    calendarId: linkedCalendar.id,
    error: googleError instanceof Error ? googleError.message : googleError,
    stack: googleError instanceof Error ? googleError.stack : undefined,
  });
  
  // IMPORTANTE: Não falhar o agendamento, mas avisar
  // O agendamento fica salvo, mas sem evento no Google
  return NextResponse.json({
    ok: true,
    id: appt.id,
    warning: "Agendamento criado, mas falha ao sincronizar com Google Calendar. Entre em contato com o suporte.",
    // ... resto da resposta
  });
}
```

---

### Correção 2: Verificar Autenticação Antes de Criar Evento

```typescript
// src/lib/google.ts - Modificar createGoogleCalendarEvent

export async function createGoogleCalendarEvent(...args) {
  const auth = await getAuthenticatedClient(ownerUid);
  
  if (!auth) {
    console.error("[google:event:no-auth]", { ownerUid, calendarId });
    throw new Error(
      `Proprietário da agenda não conectou o Google Calendar. ` +
      `ID do proprietário: ${ownerUid}`
    );
  }
  
  // Testar se o token é válido
  try {
    const calendar = google.calendar({ version: "v3", auth });
    
    // Tentar listar calendários como teste de conexão
    await calendar.calendarList.list({ maxResults: 1 });
    
  } catch (testError) {
    console.error("[google:event:auth-test-failed]", {
      ownerUid,
      error: testError.message,
    });
    
    throw new Error(
      `Token do Google Calendar expirado ou inválido. ` +
      `Proprietário precisa reconectar em /dashboard?tab=agenda`
    );
  }
  
  // ... resto da função
}
```

---

### Correção 3: Garantir CalendarId Correto

**Problema:** `linkedCalendar.id` pode não ser o ID válido do Google.

**Solução:** Armazenar `googleCalendarId` separado do `id` do documento.

```typescript
// src/lib/google.ts - Modificar estrutura

type LinkedCalendar = {
  id: string; // ID do documento Firestore
  googleCalendarId: string; // "primary" ou "email@gmail.com" ✅ NOVO
  summary: string;
  ownerUid: string;
  slug: string;
  // ... resto
};

// Ao vincular calendário
export async function linkGoogleCalendar(
  ownerUid: string,
  googleCalendarId: string,
  slug: string
) {
  const db = getDb();
  
  const docId = `${ownerUid}_${slug}`; // ID único do documento
  
  await db.collection("linkedCalendars").doc(docId).set({
    id: docId,
    googleCalendarId, // ✅ SALVAR O ID REAL DO GOOGLE
    ownerUid,
    slug,
    active: true,
    createdAt: new Date().toISOString(),
  });
}

// Ao criar evento
export async function createGoogleCalendarEvent(ownerUid, linkedCalendar, ...) {
  const calendar = google.calendar({ version: "v3", auth });
  
  const res = await calendar.events.insert({
    calendarId: linkedCalendar.googleCalendarId, // ✅ USAR O ID DO GOOGLE
    requestBody: event,
  });
}
```

---

### Correção 4: Adicionar Retry Logic

**Problema:** APIs externas podem ter falhas temporárias.

**Solução:** Retry com backoff exponencial.

```typescript
// src/lib/retry.ts (NOVO ARQUIVO)

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        const delay = delayMs * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Uso:
import { retryWithBackoff } from "@/lib/retry";

const googleEvent = await retryWithBackoff(() =>
  createGoogleCalendarEvent(...)
);
```

---

## 🧪 PLANO DE TESTES

### Teste 1: Fluxo Completo Local

```bash
# 1. Limpar cache e reinstalar
rm -rf node_modules .next
yarn install

# 2. Verificar .env.local
cat .env.local | grep -E "GOOGLE|FIREBASE"

# 3. Iniciar em dev
yarn dev

# 4. Abrir dashboard
# http://localhost:3000/dashboard

# 5. Conectar Google Calendar
# Clicar em "Minha Agenda" > "Conectar com Google"

# 6. Ativar um calendário
# Gerar slug e salvar

# 7. Abrir link público
# http://localhost:3000/agenda/SEU-SLUG

# 8. Fazer agendamento de teste
# Preencher formulário e enviar

# 9. Verificar logs no terminal
# Deve aparecer:
# [google:event:create:start]
# [google:event:create:ok]
# [apt:create] { slug: '...', when: '...' }

# 10. Verificar Google Calendar
# Abrir https://calendar.google.com
# Procurar evento criado
```

---

### Teste 2: Debug em Produção (Vercel)

```bash
# 1. Deploy
git push

# 2. Ver logs em tempo real
vercel logs --follow

# 3. Fazer agendamento de teste

# 4. Procurar por erros:
# - "Cliente Google não autenticado"
# - "Token expirado"
# - "Calendar not found"
```

---

### Teste 3: Validar Firestore

```javascript
// No console do Firebase:
// https://console.firebase.google.com

// 1. Ir em Firestore Database

// 2. Verificar coleção "accounts"
// Deve ter documento com seu UID

// 3. Verificar campo "googleTokens"
// Deve ter { access_token, refresh_token, expiry_date }

// 4. Verificar coleção "linkedCalendars"
// Deve ter documentos com:
// - id
// - googleCalendarId (ou apenas "id" como calendarId)
// - ownerUid
// - slug
// - active: true

// 5. Verificar coleção "appointments"
// Após teste, deve aparecer novo documento
```

---

## 📋 PRÓXIMOS PASSOS

1. **Adicionar Healthcheck Endpoint**

```typescript
// src/app/api/health/google/route.ts (NOVO)

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const auth = await getAuthenticatedClient(user.uid);
    if (!auth) {
      return NextResponse.json({
        ok: false,
        error: "Google não conectado",
        action: "Conecte em /dashboard?tab=agenda"
      });
    }
    
    const calendar = google.calendar({ version: "v3", auth });
    const list = await calendar.calendarList.list({ maxResults: 1 });
    
    return NextResponse.json({
      ok: true,
      connected: true,
      calendarsCount: list.data.items?.length || 0,
    });
    
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error.message,
      action: "Reconecte em /dashboard?tab=agenda"
    });
  }
}
```

2. **Adicionar Botão de Teste no Dashboard**

```typescript
// src/app/dashboard/page.tsx

<button
  onClick={async () => {
    const res = await fetch("/api/health/google");
    const data = await res.json();
    alert(data.ok ? "✅ Google conectado!" : `❌ ${data.error}`);
  }}
  className="btn"
>
  Testar Conexão Google
</button>
```

3. **Monitoramento de Erros**

Instalar Sentry ou similar:
```bash
yarn add @sentry/nextjs
```

---

## 🎯 AÇÕES IMEDIATAS

### Para o Desenvolvedor:

1. [ ] Executar Teste 1 (Fluxo Completo Local)
2. [ ] Verificar se evento aparece no Google Calendar
3. [ ] Se não aparecer, executar script de teste manual
4. [ ] Adicionar logs detalhados conforme Correção 1
5. [ ] Fazer deploy e testar em produção
6. [ ] Verificar logs com `vercel logs`

### Para o Usuário (Você):

1. [ ] Me enviar logs do erro específico que aparece
2. [ ] Informar: erro aparece em dev local ou só em produção?
3. [ ] Verificar se Google Calendar está conectado no dashboard
4. [ ] Tentar desconectar e reconectar Google
5. [ ] Fazer novo teste de agendamento

---

## 📞 INFORMAÇÕES PARA DEBUG

**Por favor, forneça:**

1. **Screenshot do erro** (se houver UI)
2. **Logs do console** (F12 > Console)
3. **Logs do servidor** (`vercel logs` ou terminal local)
4. **URL da agenda** que está tentando agendar
5. **Está usando Firestore ou arquivos locais?**
6. **Em qual ambiente:** localhost ou produção (Vercel)?

---

**Autor:** AI Assistant  
**Última atualização:** 2025-10-04
