#!/bin/bash

# 🧪 Script de Teste - Google Calendar Integration
# Execute após configurar as variáveis no Render

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testando Integração Google Calendar - ZapAgenda"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BASE_URL="https://zap-agenda.onrender.com"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Teste 1: App está rodando?
echo -e "${BLUE}[1/4]${NC} Testando se o app está rodando..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✅ App está rodando!${NC} (HTTP $HTTP_CODE)"
else
  echo -e "${RED}❌ App não está acessível${NC} (HTTP $HTTP_CODE)"
  echo "   Verifique se o deploy terminou no Render"
  exit 1
fi
echo ""

# Teste 2: API de sessão responde?
echo -e "${BLUE}[2/4]${NC} Testando API de sessão..."
SESSION_RESPONSE=$(curl -s "$BASE_URL/api/session")
if echo "$SESSION_RESPONSE" | grep -q "user"; then
  echo -e "${GREEN}✅ API de sessão funcionando!${NC}"
  echo "   Resposta: $SESSION_RESPONSE"
else
  echo -e "${RED}❌ API de sessão não responde corretamente${NC}"
  echo "   Resposta: $SESSION_RESPONSE"
fi
echo ""

# Teste 3: Variáveis de ambiente configuradas?
echo -e "${BLUE}[3/4]${NC} Verificando se variáveis de ambiente estão configuradas..."
echo -e "${YELLOW}⚠️  Este teste só funciona se você estiver logado${NC}"
echo "   Faça login em: $BASE_URL/dashboard"
echo ""
read -p "Você já fez login no dashboard? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo "   Testando health check do Google Calendar..."
  HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health/google")
  
  if echo "$HEALTH_RESPONSE" | grep -q '"ok":true'; then
    echo -e "${GREEN}✅ Google Calendar conectado!${NC}"
    CALENDAR_COUNT=$(echo "$HEALTH_RESPONSE" | grep -o '"calendarsCount":[0-9]*' | grep -o '[0-9]*')
    echo "   📅 Calendários encontrados: $CALENDAR_COUNT"
  elif echo "$HEALTH_RESPONSE" | grep -q "não conectado"; then
    echo -e "${YELLOW}⚠️  Google Calendar não conectado ainda${NC}"
    echo "   Vá em: $BASE_URL/dashboard"
    echo "   Clique em 'Conectar Google Calendar'"
  elif echo "$HEALTH_RESPONSE" | grep -q "error"; then
    echo -e "${RED}❌ Erro ao conectar Google Calendar${NC}"
    ERROR_MSG=$(echo "$HEALTH_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "   Erro: $ERROR_MSG"
    echo ""
    echo "   Possíveis causas:"
    echo "   - GOOGLE_CLIENT_ID não configurado"
    echo "   - GOOGLE_CLIENT_SECRET não configurado"
    echo "   - Google Calendar API não habilitada"
  else
    echo -e "${RED}❌ Resposta inesperada${NC}"
    echo "   Resposta: $HEALTH_RESPONSE"
  fi
else
  echo -e "${YELLOW}⏭️  Pulando teste de Google Calendar${NC}"
  echo "   Faça login e execute o script novamente"
fi
echo ""

# Teste 4: Resumo
echo -e "${BLUE}[4/4]${NC} Resumo dos Testes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Checklist de Configuração:"
echo ""
echo "No Render (https://dashboard.render.com):"
echo "  [ ] GOOGLE_CLIENT_ID configurado"
echo "  [ ] GOOGLE_CLIENT_SECRET configurado"
echo "  [ ] GOOGLE_REDIRECT_URI configurado"
echo "  [ ] APP_BASE_URL configurado"
echo ""
echo "No Google Cloud (https://console.cloud.google.com):"
echo "  [ ] Google Calendar API habilitada"
echo "  [ ] Escopos do Calendar configurados"
echo "  [ ] App publicado (ou usuários de teste adicionados)"
echo "  [ ] Nome mudado para 'ZapAgenda'"
echo ""
echo "No Dashboard ($BASE_URL/dashboard):"
echo "  [ ] Login feito"
echo "  [ ] Google Calendar conectado"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentação:"
echo "  - Render Config: rules/RENDER-CONFIG-RAPIDA.md"
echo "  - Google Cloud: rules/GOOGLE-CLOUD-PROXIMAS-ACOES.md"
echo "  - Troubleshooting: rules/TROUBLESHOOTING-AGENDAMENTO.md"
echo ""
echo "🧪 Próximo teste: Criar agendamento em $BASE_URL/agenda/[seu-slug]"
echo ""
