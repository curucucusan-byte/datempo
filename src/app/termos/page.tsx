export const metadata = {
  title: "Termos de Serviço — ZapAgenda",
  description: "Condições de uso da plataforma ZapAgenda.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-sm text-slate-200">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold text-white">Termos de Serviço</h1>
        <p className="text-slate-400">Válidos a partir de 03 de outubro de 2025.</p>
      </header>

      <section className="space-y-4">
        <p>
          Ao criar uma conta ou utilizar o ZapAgenda, você concorda com os termos abaixo. Caso não concorde,
          interrompa o uso do serviço.
        </p>

        <h2 className="text-xl font-semibold text-white">1. Objeto</h2>
        <p>
          O ZapAgenda oferece ferramentas para agendamento online, sincronização com Google Calendar, envio de
          confirmações e lembretes via WhatsApp e gestão de pagamentos associados aos agendamentos.
        </p>

        <h2 className="text-xl font-semibold text-white">2. Conta do usuário</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Forneça informações corretas e mantenha suas credenciais em segurança.</li>
          <li>Respeite as políticas do Google e do WhatsApp Business ao conectar suas contas.</li>
          <li>
            Utilize o ZapAgenda para comunicações transacionais (confirmações e lembretes). Sempre obtenha o
            consentimento adequado dos seus clientes quando aplicável.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-white">3. Pagamentos e planos</h2>
        <p>
          Alguns recursos são oferecidos mediante assinatura. Os valores e limites vigentes estão descritos no
          painel de planos. Pagamentos recorrentes são renovados automaticamente até que sejam cancelados.
        </p>

        <h2 className="text-xl font-semibold text-white">4. Uso aceitável</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Não utilize o serviço para spam, mensagens não solicitadas ou conteúdo ilegal.</li>
          <li>Não interfira na integridade do sistema nem compartilhe acessos de forma não autorizada.</li>
          <li>Podemos suspender contas que violem estes Termos ou causem danos a terceiros.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white">5. Limitação de responsabilidade</h2>
        <p>
          Empregamos esforços para manter o serviço disponível e seguro, porém interrupções podem ocorrer. Na
          extensão permitida por lei, não nos responsabilizamos por perdas indiretas decorrentes de indisponibilidade
          ou uso indevido do serviço.
        </p>

        <h2 className="text-xl font-semibold text-white">6. Cancelamento</h2>
        <p>
          Você pode cancelar o plano a qualquer momento no painel. Planos pagos permanecem ativos até o fim do
          ciclo já cobrado. Após o cancelamento, dados poderão ser removidos conforme a Política de Privacidade.
        </p>

        <h2 className="text-xl font-semibold text-white">7. Alterações dos Termos</h2>
        <p>
          Podemos atualizar estes Termos. Notificaremos sobre mudanças relevantes por e-mail ou dentro do
          dashboard. A continuidade de uso após a comunicação representa concordância com a versão revisada.
        </p>

        <h2 className="text-xl font-semibold text-white">8. Contato</h2>
        <p>
          Dúvidas sobre estes Termos podem ser enviadas para
          {" "}
          <a className="text-emerald-300 underline" href="mailto:legal@zapagenda.com">
            legal@zapagenda.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
