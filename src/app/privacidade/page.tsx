import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — Agende Mais",
  description: "Saiba como o Agende Mais coleta, utiliza e protege dados pessoais.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">Agende Mais</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/termos" className="hover:text-slate-900">Termos</Link>
              <Link href="/" className="hover:text-slate-900">Home</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-base text-slate-700">
        <header className="mb-12 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Política de Privacidade</h1>
          <p className="text-lg text-slate-500">Vigente a partir de 03 de outubro de 2025.</p>
        </header>

      <section className="space-y-4">
        <p>
          O ZapAgenda é uma plataforma de agendamento e automação de mensagens. Esta Política explica quais
          dados coletamos, como usamos essas informações e quais são os seus direitos ao utilizar nossos
          serviços.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">1. Dados que coletamos</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          <li>
            <span className="font-semibold">Dados da conta:</span> nome, e-mail e identificadores fornecidos pelo
            Google ou por outro provedor de autenticação conectado.
          </li>
          <li>
            <span className="font-semibold">Calendários e agendamentos:</span> informações necessárias para exibir
            disponibilidade e criar eventos (títulos, datas/horas e convidados), sempre dentro das permissões que
            você conceder ao Google. Não acessamos o conteúdo de e-mails ou dados fora do escopo autorizado.
          </li>
          <li>
            <span className="font-semibold">Comunicações pelo WhatsApp:</span> apenas os números de telefone e o
            conteúdo das mensagens que você gerar e enviar pelo ZapAgenda (confirmações e lembretes). Não lemos
            suas conversas pessoais no WhatsApp. O acesso ocorre exclusivamente via API oficial (ex.: WhatsApp
            Business Cloud), que também nos retorna status de envio/entrega para fins operacionais.
          </li>
          <li>
            <span className="font-semibold">Dados técnicos mínimos:</span> registros de acesso (ex.: endereço IP e
            identificadores de sessão) para segurança, prevenção a abusos e suporte.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">2. Como utilizamos os dados</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          <li>Prestar o serviço de agendamento, sincronização com calendários e envio de notificações.</li>
          <li>Processar pagamentos quando o usuário opta por planos pagos.</li>
          <li>Enviar comunicações operacionais sobre status de conta, cobrança e incidentes de segurança.</li>
          <li>Cumprir obrigações legais e prevenir fraudes.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">3. Compartilhamento de dados</h2>
        <p>
          Compartilhamos dados apenas com provedores necessários para operar o ZapAgenda, como Google
          (sincronização de calendários), Meta/WhatsApp (envio de mensagens), provedores de pagamento e
          infraestrutura de hospedagem. Não vendemos dados pessoais.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">4. Retenção e segurança</h2>
        <p>
          Mantemos dados pelo tempo necessário para prestação do serviço ou conforme exigido por lei. Mensagens
          e logs de envio podem ser retidos por período limitado para auditoria e suporte. Utilizamos criptografia
          em trânsito e controles de acesso.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">5. Seus direitos</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          <li>Acessar, atualizar ou excluir dados pessoais armazenados em sua conta.</li>
          <li>Revogar o acesso do ZapAgenda à sua conta Google a qualquer momento nas configurações do Google.</li>
          <li>Solicitar a exclusão completa da conta e dos dados associados enviando um e-mail para suporte.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">6. Contato</h2>
        <p>
          Em caso de dúvidas sobre privacidade, entre em contato em
          {" "}
          <a className="text-emerald-600 hover:text-emerald-500 font-medium underline" href="mailto:suporte@zapagenda.com">
            suporte@zapagenda.com
          </a>
          .
        </p>

        <p className="text-slate-500 mt-8">
          Esta Política pode ser atualizada periodicamente. Notificaremos mudanças relevantes por e-mail ou no
          painel do ZapAgenda.
        </p>
      </section>
      </main>
    </div>
  );
}
