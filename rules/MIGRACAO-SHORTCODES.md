# 🔗 Migração: Slugs → Shortcodes

## 📋 Visão Geral

Migrar de slugs legíveis (`joao-silva`) para shortcodes aleatórios (`a7k2m9p5`) melhora:

✅ **Segurança**: Impossível adivinhar outros profissionais  
✅ **Privacidade**: Não expõe nome do profissional  
✅ **Unicidade**: Colisões praticamente impossíveis (218 trilhões de combinações)  
✅ **Profissionalismo**: Links mais limpos e modernos  

---

## 🎯 Antes e Depois

### Antes (Slugs Legíveis)
```
https://zap-agenda.onrender.com/agenda/joao-silva
https://zap-agenda.onrender.com/agenda/dra-maria-santos
https://zap-agenda.onrender.com/agenda/personal-trainer-carlos
```

❌ Problemas:
- Fácil adivinhar: basta mudar o nome
- Possível conflito: "João Silva" vs "João Silva Jr"
- Expõe informação: nome do profissional visível
- Vulnerável a scraping automatizado

### Depois (Shortcodes)
```
https://zap-agenda.onrender.com/agenda/a7k2m9p5
https://zap-agenda.onrender.com/agenda/x4j8n2q1
https://zap-agenda.onrender.com/agenda/b3h9k5m2
```

✅ Vantagens:
- Impossível adivinhar
- 100% único garantido
- Privado: só quem tem o link acessa
- Profissional e moderno

---

## 🛠️ Como Implementar

### Opção 1: Migração Gradual (Recomendado)

Mantenha os slugs antigos funcionando e gere shortcodes apenas para novos calendários.

**Vantagens:**
- Sem quebra de links existentes
- Migração suave
- Tempo para avisar usuários

**Passos:**

1. **Manter backward compatibility** (já implementado em `src/lib/google.ts`):
   ```typescript
   export async function getLinkedCalendarBySlug(slug: string) {
     // Tenta buscar na nova coleção (por shortcode)
     const bySlug = await db.collection("linkedCalendars").doc(slug).get();
     if (bySlug.exists) return bySlug.data();
     
     // Se não encontrar, tenta buscar no array antigo (slug legível)
     const snapshot = await db.collection("accounts")
       .where("linkedCalendars.slug", "==", slug)
       .limit(1)
       .get();
     
     if (!snapshot.empty) {
       const account = snapshot.docs[0].data();
       return account.linkedCalendars.find(cal => cal.slug === slug);
     }
     
     return null;
   }
   ```

2. **Gerar shortcodes apenas para novos calendários**:
   
   Atualizar `src/app/api/account/google/route.ts`:
   ```typescript
   import { generateUniqueShortcode } from "@/lib/shortcode";
   
   // Quando criar novo linkedCalendar:
   const slug = await generateUniqueShortcode(); // ← Usar isso ao invés de slug manual
   
   const newLinkedCalendar = {
     id: calendarId,
     summary: calendarSummary,
     ownerUid: user.uid,
     slug: slug, // ← Agora é um shortcode
     description: "",
     whatsappNumber: "",
     active: true,
     createdAt: new Date().toISOString(),
   };
   ```

3. **Adicionar campo de migração** no dashboard:
   
   Criar botão "Gerar novo link" para usuários migrarem manualmente:
   ```tsx
   // src/app/dashboard/minha-agenda/CalendarsCard.tsx
   
   async function handleGenerateNewLink(calendarId: string) {
     const response = await fetch("/api/calendar/regenerate-link", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ calendarId }),
     });
     
     const { newLink } = await response.json();
     alert(`Novo link gerado: ${newLink}`);
   }
   ```

4. **Criar endpoint de regeneração**:
   ```typescript
   // src/app/api/calendar/regenerate-link/route.ts
   
   import { generateUniqueShortcode, migrateSlugToShortcode } from "@/lib/shortcode";
   
   export async function POST(req: Request) {
     const { calendarId } = await req.json();
     const user = await getAuthenticatedUser();
     
     // Buscar calendário atual
     const account = await getAccountByUid(user.uid);
     const calendar = account.linkedCalendars.find(c => c.id === calendarId);
     
     if (!calendar) {
       return Response.json({ error: "Calendar not found" }, { status: 404 });
     }
     
     // Migrar slug para shortcode
     const newShortcode = await migrateSlugToShortcode(calendar.slug);
     
     return Response.json({
       oldLink: `/agenda/${calendar.slug}`,
       newLink: `/agenda/${newShortcode}`,
       shortcode: newShortcode,
     });
   }
   ```

---

### Opção 2: Migração Forçada (Mais rápido)

Migrar TODOS os calendários existentes de uma vez.

**Vantagens:**
- Implementação imediata
- Todos os links padronizados
- Segurança máxima desde o início

**Desvantagens:**
- ⚠️ Quebra links existentes compartilhados
- Precisa avisar TODOS os usuários
- Precisa atualizar links em materiais impressos

**Script de Migração:**

```typescript
// scripts/migrate-to-shortcodes.mjs

import { getDb } from "../src/lib/firebaseAdmin.js";
import { generateUniqueShortcode } from "../src/lib/shortcode.js";

async function migrateAllCalendars() {
  const db = getDb();
  
  console.log("🔄 Iniciando migração de slugs para shortcodes...\n");
  
  // Buscar todas as contas
  const accountsSnapshot = await db.collection("accounts").get();
  
  let migrated = 0;
  let errors = 0;
  
  for (const accountDoc of accountsSnapshot.docs) {
    const accountData = accountDoc.data();
    const linkedCalendars = accountData.linkedCalendars || [];
    
    if (linkedCalendars.length === 0) continue;
    
    const updatedCalendars = [];
    
    for (const calendar of linkedCalendars) {
      try {
        // Verificar se já é um shortcode válido
        if (isValidShortcode(calendar.slug)) {
          console.log(`✅ ${calendar.summary}: já usa shortcode (${calendar.slug})`);
          updatedCalendars.push(calendar);
          continue;
        }
        
        // Gerar novo shortcode
        const newShortcode = await generateUniqueShortcode();
        
        console.log(`🔄 ${calendar.summary}: ${calendar.slug} → ${newShortcode}`);
        
        // Atualizar calendário
        const updatedCalendar = {
          ...calendar,
          slug: newShortcode,
          legacySlug: calendar.slug, // Manter referência ao slug antigo
          migratedAt: new Date().toISOString(),
        };
        
        updatedCalendars.push(updatedCalendar);
        
        // Criar documento na coleção linkedCalendars
        await db.collection("linkedCalendars").doc(newShortcode).set(updatedCalendar);
        
        // Opcional: criar redirect do slug antigo
        await db.collection("linkedCalendars").doc(calendar.slug).set({
          redirectTo: newShortcode,
          deprecated: true,
          originalSummary: calendar.summary,
        });
        
        migrated++;
      } catch (error) {
        console.error(`❌ Erro migrando ${calendar.summary}:`, error);
        errors++;
        updatedCalendars.push(calendar); // Manter o original se falhar
      }
    }
    
    // Atualizar account com novos slugs
    await accountDoc.ref.update({
      linkedCalendars: updatedCalendars,
    });
  }
  
  console.log(`\n✅ Migração concluída!`);
  console.log(`   Migrados: ${migrated}`);
  console.log(`   Erros: ${errors}`);
  console.log(`   Total de contas: ${accountsSnapshot.size}`);
}

migrateAllCalendars().catch(console.error);
```

**Executar:**
```bash
node scripts/migrate-to-shortcodes.mjs
```

---

## 🧪 Testes

### Testar geração de shortcode

```bash
# No terminal Node.js
node -e "
const { generateShortcode, isValidShortcode } = require('./src/lib/shortcode');

// Gerar 10 shortcodes
for (let i = 0; i < 10; i++) {
  const code = generateShortcode();
  console.log(code, '→', isValidShortcode(code) ? '✅' : '❌');
}
"
```

### Testar unicidade

```bash
# Gerar 1000 códigos e verificar duplicatas
node -e "
const { generateShortcode } = require('./src/lib/shortcode');

const codes = new Set();
for (let i = 0; i < 1000; i++) {
  codes.add(generateShortcode());
}

console.log('Gerados: 1000');
console.log('Únicos:', codes.size);
console.log('Duplicatas:', 1000 - codes.size);
"
```

### Testar backward compatibility

```typescript
// Verificar se slugs antigos ainda funcionam
const oldSlugCalendar = await getLinkedCalendarBySlug("joao-silva");
console.log(oldSlugCalendar); // Deve retornar o calendário

const newShortcodeCalendar = await getLinkedCalendarBySlug("a7k2m9p5");
console.log(newShortcodeCalendar); // Deve retornar o calendário
```

---

## 📊 Estatísticas

### Probabilidade de Colisão

Com **8 caracteres** e **32 caracteres válidos** (a-z exceto l/o + 2-9):

- Total de combinações: **32^8 = 1.099.511.627.776** (1 trilhão)
- Com 1.000 códigos gerados: **0,00000009%** de colisão
- Com 1.000.000 códigos: **0,09%** de colisão
- Com 10.000.000 códigos: **9%** de colisão

**Conclusão**: Para até 1 milhão de usuários, colisões são extremamente raras.

### Comparação de Tamanhos

| Comprimento | Combinações     | Adequado para        |
|-------------|-----------------|----------------------|
| 6 chars     | 1 bilhão        | Até 10k usuários     |
| 8 chars     | 1 trilhão       | Até 1M usuários ✅   |
| 10 chars    | 1 quatrilhão    | Até 100M usuários    |

---

## 🎨 UI: Exibir Shortcode

### Componente de compartilhamento

```tsx
// src/components/ShareableLink.tsx

"use client";

import { useState } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import { formatShortcode, getShareableLink, getQRCodeUrl } from "@/lib/shortcode";

export function ShareableLink({ shortcode, token }: { shortcode: string; token?: string | null }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const link = getShareableLink(shortcode, token);
  const formattedCode = formatShortcode(shortcode);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Link de Compartilhamento</h3>
      
      {/* Link Completo */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={link}
          readOnly
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-mono"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      
      {/* Código Curto */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Código: <strong className="font-mono">{formattedCode}</strong></span>
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
      </div>
      
      {/* QR Code */}
      {showQR && (
        <div className="mt-4 p-4 border-t border-gray-200">
          <img
            src={getQRCodeUrl(shortcode, token)}
            alt="QR Code"
            className="mx-auto w-48 h-48"
          />
          <p className="text-center text-xs text-gray-500 mt-2">
            Escaneie para acessar a agenda
          </p>
        </div>
      )}
    </div>
  );
}
```

### Uso no Dashboard

```tsx
// src/app/dashboard/minha-agenda/CalendarsCard.tsx

import { ShareableLink } from "@/components/ShareableLink";

function CalendarCard({ calendar }) {
  return (
    <div className="border rounded-lg p-6">
      <h3>{calendar.summary}</h3>
      
      <ShareableLink 
        shortcode={calendar.slug} 
        token={calendar.publicToken}
      />
    </div>
  );
}
```

---

## 🚀 Próximos Passos

1. **Implementar** o sistema de shortcodes (arquivo `src/lib/shortcode.ts` ✅)
2. **Atualizar** criação de calendários para usar `generateUniqueShortcode()`
3. **Adicionar** componente `ShareableLink` no dashboard
4. **Testar** geração e validação de códigos
5. **Decidir**: migração gradual ou forçada
6. **Executar** migração (se optar por forçada)
7. **Avisar** usuários sobre novos links
8. **Monitorar** uso e colisões

---

## 📝 Checklist de Implementação

- [ ] Arquivo `src/lib/shortcode.ts` criado
- [ ] Função `generateUniqueShortcode()` testada
- [ ] Função `isValidShortcode()` testada
- [ ] Backward compatibility em `getLinkedCalendarBySlug()` verificada
- [ ] Componente `ShareableLink` criado
- [ ] Atualizada criação de calendários para usar shortcodes
- [ ] Script de migração criado (se necessário)
- [ ] Testes de unicidade executados (1000+ códigos)
- [ ] Documentação para usuários criada
- [ ] Deploy realizado
- [ ] Monitoramento de colisões configurado

---

**Criado em**: 14 de janeiro de 2025  
**Status**: Pronto para implementação  
**Tempo estimado**: 2-3 horas (implementação) + 1 hora (migração)
