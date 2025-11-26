# 🧪 Prompt: Teste Completo de Agendamento

Use este prompt para testar o fluxo end-to-end de agendamento.

---

## Objetivo
Testar todo o fluxo de agendamento como um usuário real faria.

---

## Pré-requisitos
- [ ] Servidor dev rodando (`yarn dev`)
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase e Google OAuth funcionando
- [ ] WhatsApp API configurada (opcional)

---

## Passo a Passo

### 1. Preparação
```bash
# Terminal 1: Rodar servidor
yarn dev

# Terminal 2: Logs em tempo real
tail -f .next/server/app/api/appointment/route.log
```

### 2. Como Proprietário (Dono da Agenda)

1. **Login**
   - Acessar: http://localhost:3000/login
   - Login com Google
   - Verificar redirecionamento para dashboard

2. **Conectar Calendário**
   - Dashboard → Conectar Google Calendar
   - Autorizar acesso
   - Verificar lista de calendários aparece

3. **Criar Agenda**
   - Selecionar calendário
   - Definir:
     - Nome/descrição
     - Duração do slot (ex: 60 min)
     - Horários de trabalho
     - WhatsApp para notificações
   - Salvar

4. **Obter Link**
   - Copiar link compartilhável
   - Verificar QR Code é gerado
   - Testar preview do link

### 3. Como Cliente (Quem Agenda)

1. **Acessar Link Público**
   - Colar link em aba anônima
   - OU escanear QR Code

2. **Ver Disponibilidade**
   - Verificar calendário mostra horários livres
   - Verificar horários ocupados não aparecem
   - Testar diferentes datas

3. **Preencher Formulário**
   - Nome completo
   - WhatsApp (+55DDDNÚMERO)
   - Selecionar data/hora
   - Confirmar

4. **Verificar Confirmação**
   - Mensagem de sucesso aparece
   - Link .ics para download
   - Opção de adicionar ao calendário

### 4. Verificações Backend

1. **Firestore**
   ```
   - Abrir Firebase Console
   - Verificar coleção "appointments"
   - Conferir dados salvos corretamente
   ```

2. **Google Calendar**
   ```
   - Abrir Google Calendar
   - Verificar evento foi criado
   - Conferir título, horário, descrição
   ```

3. **WhatsApp (se configurado)**
   ```
   - Cliente recebe confirmação
   - Proprietário recebe notificação
   - Verificar texto está correto
   ```

---

## Testes de Edge Cases

### Conflitos
- [ ] Tentar agendar no mesmo horário (deve falhar)
- [ ] Agendar em horário fora do expediente
- [ ] Agendar em horário passado (deve falhar)

### Validações
- [ ] WhatsApp inválido (sem +55)
- [ ] Nome vazio
- [ ] Data/hora inválida
- [ ] Slug inexistente

### Rate Limiting
- [ ] Fazer 8+ requisições em 1 minuto
- [ ] Verificar erro 429

---

## Checklist Final

### Funcional
- [ ] Login funciona
- [ ] OAuth autoriza corretamente
- [ ] Calendário sincroniza
- [ ] Agendamento cria
- [ ] Evento aparece no Google Calendar
- [ ] WhatsApp notifica (se config)
- [ ] Conflitos são prevenidos

### UX
- [ ] Loading states aparecem
- [ ] Mensagens de erro são claras
- [ ] Formulário é intuitivo
- [ ] Mobile funciona bem
- [ ] QR Code é legível

### Performance
- [ ] Página carrega < 3s
- [ ] API responde < 2s
- [ ] Sem erros no console

---

## Bugs Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| "redirect_uri_mismatch" | OAuth mal configurado | Verificar URLs no Google Console |
| "invalid_client" | Client Secret errado | Verificar .env.local |
| Evento não cria no Calendar | Escopo faltando | Adicionar `calendar` scope |
| WhatsApp não envia | API key inválida | Verificar WHATSAPP_API_KEY |

---

## Resultado Esperado

```
✅ Usuário faz login
✅ Conecta Google Calendar
✅ Cria agenda
✅ Cliente acessa link
✅ Cliente agenda horário
✅ Evento aparece no Google Calendar
✅ WhatsApp notifica ambas partes
✅ Dados salvos no Firestore
```

---

*Use este prompt sempre que fizer mudanças no fluxo de agendamento*
