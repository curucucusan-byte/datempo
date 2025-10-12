#!/usr/bin/env node

/**
 * Script de Diagnóstico OAuth - Agende Mais
 * 
 * Verifica se as configurações do Firebase e Google Cloud estão corretas
 * e ajuda a identificar problemas de autenticação OAuth.
 */

console.log('🔍 Diagnóstico OAuth - Agende Mais\n');
console.log('═'.repeat(60));

// Verificar variáveis de ambiente
console.log('\n📋 1. Verificando Variáveis de Ambiente');
console.log('─'.repeat(60));

const requiredVars = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let allVarsPresent = true;
for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.log(`❌ ${key}: NÃO CONFIGURADA`);
    allVarsPresent = false;
  } else {
    const masked = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
      : value;
    console.log(`✅ ${key}: ${masked}`);
  }
}

if (!allVarsPresent) {
  console.log('\n⚠️  ERRO: Algumas variáveis de ambiente estão faltando!');
  console.log('   Configure-as no arquivo .env.local ou no Render.com');
  process.exit(1);
}

// Verificar valores específicos
console.log('\n🔎 2. Verificando Configurações Específicas');
console.log('─'.repeat(60));

const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const senderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;

console.log(`Auth Domain: ${authDomain}`);
console.log(`Project ID: ${projectId}`);
console.log(`Sender ID: ${senderId}`);

// Verificar consistência
const expectedAuthDomain = `${projectId}.firebaseapp.com`;
if (authDomain !== expectedAuthDomain) {
  console.log(`\n⚠️  AVISO: Auth Domain não corresponde ao padrão esperado`);
  console.log(`   Esperado: ${expectedAuthDomain}`);
  console.log(`   Atual: ${authDomain}`);
  console.log(`   Isso pode causar problemas de OAuth!`);
}

// Verificar OAuth Client ID pattern
console.log('\n🔐 3. Verificando Padrão do OAuth Client');
console.log('─'.repeat(60));

if (senderId) {
  const expectedClientIdPrefix = `${senderId}-`;
  console.log(`OAuth Client ID deve começar com: ${expectedClientIdPrefix}...`);
  console.log(`\nVá no Google Cloud Console e verifique se o Client ID começa com isso.`);
}

// Verificar URIs de redirecionamento
console.log('\n🔗 4. URIs de Redirecionamento Necessários');
console.log('─'.repeat(60));

const redirectUris = [
  `https://${authDomain}/__/auth/handler`,
  `https://zap-agenda.onrender.com/__/auth/handler`,
  `http://localhost:3000/__/auth/handler`,
];

console.log('Certifique-se que TODOS esses URIs estão no Google Cloud Console:');
console.log('(APIs & Services → Credentials → OAuth 2.0 Client → Authorized redirect URIs)');
console.log('');
redirectUris.forEach((uri, i) => {
  console.log(`${i + 1}. ${uri}`);
});

// Verificar origens JavaScript
console.log('\n🌐 5. Origens JavaScript Autorizadas Necessárias');
console.log('─'.repeat(60));

const origins = [
  `https://${authDomain}`,
  `https://zap-agenda.onrender.com`,
  `http://localhost:3000`,
];

console.log('Certifique-se que TODOS esses domínios estão no Google Cloud Console:');
console.log('(APIs & Services → Credentials → OAuth 2.0 Client → Authorized JavaScript origins)');
console.log('');
origins.forEach((origin, i) => {
  console.log(`${i + 1}. ${origin}`);
});

// Verificar domínios autorizados na tela de consentimento
console.log('\n✅ 6. Domínios Autorizados (Tela de Consentimento)');
console.log('─'.repeat(60));

const authorizedDomains = [
  authDomain?.replace('https://', ''),
  'zap-agenda.onrender.com',
];

console.log('Certifique-se que esses domínios estão autorizados:');
console.log('(APIs & Services → OAuth consent screen → Authorized domains)');
console.log('');
authorizedDomains.forEach((domain, i) => {
  console.log(`${i + 1}. ${domain}`);
});

// Checklist final
console.log('\n📝 7. Checklist de Verificação');
console.log('─'.repeat(60));

const checklist = [
  'Google Calendar API está HABILITADA no Google Cloud Console',
  'OAuth Client ID no Firebase corresponde ao do Google Cloud',
  'OAuth Client Secret no Firebase corresponde ao do Google Cloud',
  'Todos os Redirect URIs estão configurados',
  'Todos as Origens JavaScript estão configuradas',
  'Todos os Domínios Autorizados estão na tela de consentimento',
  'App OAuth está PUBLICADO (não em teste)',
  'Escopos incluem: calendar, calendar.events, userinfo.email, userinfo.profile',
];

console.log('Verifique manualmente cada item abaixo:\n');
checklist.forEach((item, i) => {
  console.log(`[ ] ${i + 1}. ${item}`);
});

// Links úteis
console.log('\n🔗 8. Links Úteis');
console.log('─'.repeat(60));

console.log(`
1. Google Cloud Console - Credentials:
   https://console.cloud.google.com/apis/credentials?project=${projectId || 'SEU_PROJECT'}

2. Google Cloud Console - OAuth Consent:
   https://console.cloud.google.com/apis/credentials/consent?project=${projectId || 'SEU_PROJECT'}

3. Firebase Console - Authentication:
   https://console.firebase.google.com/project/${projectId || 'SEU_PROJECT'}/authentication/providers

4. Google Calendar API:
   https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=${projectId || 'SEU_PROJECT'}
`);

// Comando de teste
console.log('\n🧪 9. Como Testar');
console.log('─'.repeat(60));

console.log(`
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Abra uma janela anônima
3. Vá em: https://zap-agenda.onrender.com/login
4. Clique em "Continuar com Google"
5. Observe o console do navegador (F12) se houver erros

Se o erro persistir, anote:
- A mensagem de erro completa
- O redirect_uri que aparece no erro
- Screenshot da tela de erro
`);

console.log('\n═'.repeat(60));
console.log('✅ Diagnóstico concluído!\n');
console.log('Se todas as verificações estiverem corretas e o erro persistir,');
console.log('aguarde 5-10 minutos para as mudanças propagarem no Google.');
console.log('═'.repeat(60));
