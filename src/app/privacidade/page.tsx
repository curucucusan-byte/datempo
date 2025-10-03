export const metadata = {
  title: "Política de Privacidade — ZapAgenda",
  description: "Saiba como o ZapAgenda coleta, utiliza e protege dados pessoais.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-sm text-slate-200">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold text-white">Política de Privacidade</h1>
        <p className="text-slate-400">Vigente a partir de 03 de outubro de 2025.</p>
      </header>

      <section className="space-y-4">
        <p>
          O ZapAgenda é uma plataforma de agendamento e automação de mensagens. Esta Política explica quais
          dados coletamos, como usamos essas informações e quais são os seus direitos ao utilizar nossos
          serviços.
        </p>

        <h2 className="text-xl font-semibold text-white">1. Dados que coletamos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">Dados da conta:</span> nome, e-mail e identificadores fornecidos pelo
            Google ou por outro provedor de autenticação conectado.
          </li>
          <li>
            <span className="font-medium">Calendários e agendamentos:</span> informações necessárias para exibir
            disponibilidade e criar eventos (títulos, datas/horas e convidados), sempre dentro das permissões que
            você conceder ao Google. Não acessamos o conteúdo de e-mails ou dados fora do escopo autorizado.
          </li>
          <li>
            <span className="font-medium">Comunicações pelo WhatsApp:</span> apenas os números de telefone e o
            conteúdo das mensagens que você gerar e enviar pelo ZapAgenda (confirmações e lembretes). Não lemos
            suas conversas pessoais no WhatsApp. O acesso ocorre exclusivamente via API oficial (ex.: WhatsApp
            Business Cloud), que também nos retorna status de envio/entrega para fins operacionais.
          </li>
          <li>
            <span className="font-medium">Dados técnicos mínimos:</span> registros de acesso (ex.: endereço IP e
            identificadores de sessão) para segurança, prevenção a abusos e suporte.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-white">2. Como utilizamos os dados</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Prestar o serviço de agendamento, sincronização com calendários e envio de notificações.</li>
          <li>Processar pagamentos quando o usuário opta por planos pagos.</li>
          <li>Enviar comunicações operacionais sobre status de conta, cobrança e incidentes de segurança.</li>
          <li>Cumprir obrigações legais e prevenir fraudes.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white">3. Compartilhamento de dados</h2>
        <p>
          Compartilhamos dados apenas com provedores necessários para operar o ZapAgenda, como Google
          (sincronização de calendários), Meta/WhatsApp (envio de mensagens), provedores de pagamento e
          infraestrutura de hospedagem. Não vendemos dados pessoais.
        </p>

        <h2 className="text-xl font-semibold text-white">4. Retenção e segurança</h2>
        <p>
          Mantemos dados pelo tempo necessário para prestação do serviço ou conforme exigido por lei. Mensagens
          e logs de envio podem ser retidos por período limitado para auditoria e suporte. Utilizamos criptografia
          em trânsito e controles de acesso.
        </p>

        <h2 className="text-xl font-semibold text-white">5. Seus direitos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Acessar, atualizar ou excluir dados pessoais armazenados em sua conta.</li>
          <li>Revogar o acesso do ZapAgenda à sua conta Google a qualquer momento nas configurações do Google.</li>
          <li>Solicitar a exclusão completa da conta e dos dados associados enviando um e-mail para suporte.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white">6. Contato</h2>
        <p>
          Em caso de dúvidas sobre privacidade, entre em contato em
          {" "}
          <a className="text-emerald-300 underline" href="mailto:suporte@zapagenda.com">
            suporte@zapagenda.com
          </a>
          .
        </p>

        <p className="text-slate-400">
          Esta Política pode ser atualizada periodicamente. Notificaremos mudanças relevantes por e-mail ou no
          painel do ZapAgenda.
        </p>
      </section>
    </main>
  );
}
