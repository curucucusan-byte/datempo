import Link from "next/link";

export const metadata = {
  title: "Termos de Serviço — ZapAgenda",
  description: "Condições de uso da plataforma ZapAgenda.",
};

export default function TermsPage() {
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
              <span className="text-lg font-bold text-slate-900">ZapAgenda</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/privacidade" className="hover:text-slate-900">Privacidade</Link>
              <Link href="/" className="hover:text-slate-900">Home</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-base text-slate-700">
        <header className="mb-12 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Termos de Serviço</h1>
          <p className="text-lg text-slate-500">Válidos a partir de 03 de outubro de 2025.</p>
        </header>

      <section className="space-y-4">
        <p>
          Ao criar uma conta ou utilizar o ZapAgenda, você concorda com os termos abaixo. Caso não concorde,
          interrompa o uso do serviço.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">1. Objeto</h2>
        <p>
          O ZapAgenda oferece ferramentas para agendamento online, sincronização com Google Calendar, envio de
          confirmações e lembretes via WhatsApp e gestão de pagamentos associados aos agendamentos.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">2. Conta do usuário</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Forneça informações corretas e mantenha suas credenciais em segurança.</li>
          <li>Respeite as políticas do Google e do WhatsApp Business ao conectar suas contas.</li>
          <li>
            Utilize o ZapAgenda para comunicações transacionais (confirmações e lembretes). Sempre obtenha o
            consentimento adequado dos seus clientes quando aplicável.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">3. Pagamentos e planos</h2>
        <p>
          Alguns recursos são oferecidos mediante assinatura. Os valores e limites vigentes estão descritos no
          painel de planos. Pagamentos recorrentes são renovados automaticamente até que sejam cancelados.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">4. Uso aceitável</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Não utilize o serviço para spam, mensagens não solicitadas ou conteúdo ilegal.</li>
          <li>Não interfira na integridade do sistema nem compartilhe acessos de forma não autorizada.</li>
          <li>Podemos suspender contas que violem estes Termos ou causem danos a terceiros.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">5. Limitação de responsabilidade</h2>
        <p>
          Empregamos esforços para manter o serviço disponível e seguro, porém interrupções podem ocorrer. Na
          extensão permitida por lei, não nos responsabilizamos por perdas indiretas decorrentes de indisponibilidade
          ou uso indevido do serviço.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">6. Cancelamento</h2>
        <p>
          Você pode cancelar o plano a qualquer momento no painel. Planos pagos permanecem ativos até o fim do
          ciclo já cobrado. Após o cancelamento, dados poderão ser removidos conforme a Política de Privacidade.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">7. Alterações dos Termos</h2>
        <p>
          Podemos atualizar estes Termos. Notificaremos sobre mudanças relevantes por e-mail ou dentro do
          dashboard. A continuidade de uso após a comunicação representa concordância com a versão revisada.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">8. Contato</h2>
        <p>
          Dúvidas sobre estes Termos podem ser enviadas para
          {" "}
          <a className="text-emerald-600 hover:text-emerald-500 font-medium underline" href="mailto:legal@zapagenda.com">
            legal@zapagenda.com
          </a>
          .
        </p>
        </section>
      </main>
    </div>
  );
}
