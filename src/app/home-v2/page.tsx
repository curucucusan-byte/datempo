import Image from "next/image";
import Link from "next/link";
import { ACTIVE_PLANS, type ActivePlanId } from "@/lib/plans";

export default function HomeV2() {
  const planOrder: ActivePlanId[] = ["free", "starter", "pro"];
  const plans = planOrder.map((id) => ACTIVE_PLANS[id]);

  function formatNumber(n: number) {
    return new Intl.NumberFormat("pt-BR").format(n);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">ZapAgenda</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#recursos" className="hover:text-slate-900 transition-colors">Recursos</a>
              <a href="#planos" className="hover:text-slate-900 transition-colors">Planos</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
              <Link href="/login" className="hover:text-slate-900 transition-colors">Entrar</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Entrar
              </Link>
              <a
                href="#planos"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Ver planos
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Integração completa WhatsApp + Google
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Agendamentos automáticos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 mt-2">
                  via WhatsApp
                </span>
              </h1>

              <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-2xl">
                Compartilhe um link único. O cliente escolhe o horário disponível e confirma direto no WhatsApp. Sincronização automática com Google Agenda.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#planos"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-500 transition-all hover:scale-105"
                >
                  Começar agora
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 px-8 py-4 text-lg font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Acessar painel
                </Link>
              </div>

              {/* Logos Strip */}
              <div className="mt-12 flex items-center gap-6 flex-wrap">
                <span className="text-sm font-medium text-slate-500">Conecta com:</span>
                <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 px-4 py-2 shadow-sm">
                  <Image src="/logos/calendar.png" alt="Google Calendar" width={24} height={24} className="rounded" />
                  <span className="text-sm font-medium text-slate-700">Google Calendar</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 px-4 py-2 shadow-sm">
                  <Image src="/logos/whatsapp-green-filled.png" alt="WhatsApp" width={24} height={24} className="rounded" />
                  <span className="text-sm font-medium text-slate-700">WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative lg:pl-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-sky-100 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-slate-500">Agenda Online</span>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Disponível
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="text-base font-semibold text-slate-900 mb-3">Próximos horários</div>
                    <ul className="space-y-3 text-base">
                      <li className="flex items-center justify-between">
                        <span className="text-slate-700">Ter, 10h00</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Livre</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-slate-700">Qua, 14h30</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500">Ocupado</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-slate-700">Qui, 09h00</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Livre</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-sky-50 p-5">
                    <div className="text-base font-semibold text-slate-900 mb-2">Cliente</div>
                    <div className="text-base text-slate-700">Ana Silva • +55 11 9xxxx-xxxx</div>
                    <button className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-colors">
                      Confirmar via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Tudo que você precisa para automatizar
            </h2>
            <p className="text-xl text-slate-600">
              Recursos pensados para negócios locais que querem profissionalizar sem complicação
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔗",
                title: "Link de agendamento",
                description: "Compartilhe um link único no WhatsApp. Cliente escolhe horário e confirma na hora.",
                color: "emerald"
              },
              {
                icon: "📅",
                title: "Sincronização Google",
                description: "Integração bidirecional automática com Google Calendar para evitar conflitos.",
                color: "sky"
              },
              {
                icon: "💬",
                title: "Lembretes automáticos",
                description: "Configure lembretes por WhatsApp antes do compromisso (planos Starter e Pro).",
                color: "violet"
              },
              {
                icon: "💳",
                title: "Pagamento antecipado",
                description: "Opcional: exija pagamento via Pix ou cartão para confirmar a reserva.",
                color: "amber"
              },
              {
                icon: "📊",
                title: "Painel completo",
                description: "Gerencie horários, veja reservas e acompanhe métricas em tempo real.",
                color: "rose"
              },
              {
                icon: "⭐",
                title: "Reviews Google",
                description: "Solicite avaliações no Google automaticamente após o atendimento (plano Pro).",
                color: "indigo"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}-50 text-3xl mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-xl text-slate-600">
              Escolha o plano ideal para o seu volume de agendamentos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 p-8 bg-white transition-all hover:scale-105 ${
                  plan.id === "starter"
                    ? "border-emerald-300 shadow-xl shadow-emerald-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {plan.id === "starter" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                    Mais popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.label}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-slate-900 whitespace-nowrap">
                      {plan.priceDisplay.split("/")[0]}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-lg text-slate-500">/mês</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-slate-700">
                      <svg className="h-6 w-6 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 border-t border-slate-100 pt-6 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Agendas conectadas</span>
                    <span className="font-semibold text-slate-900">{plan.limits.maxConnectedCalendars}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Reservas/mês</span>
                    <span className="font-semibold text-slate-900">{formatNumber(plan.limits.maxAppointmentsPerMonth)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Mensagens incluídas</span>
                    <span className="font-semibold text-slate-900">{formatNumber(plan.limits.whatsappMessagesIncludedPerMonth)}</span>
                  </div>
                </div>

                {plan.features.paymentAtBooking && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Pagamento na reserva
                    </span>
                    {plan.features.reviewsGoogle && (
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                        Reviews Google
                      </span>
                    )}
                  </div>
                )}

                <a
                  href="#"
                  className={`block w-full rounded-xl px-6 py-3 text-center text-base font-semibold transition-colors ${
                    plan.id === "starter"
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Escolher {plan.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Precisa instalar algum app?",
                a: "Não. Você compartilha um link e o cliente agenda direto no navegador. A confirmação chega no WhatsApp dele."
              },
              {
                q: "Como funciona a integração com Google Agenda?",
                a: "Você autoriza uma vez com sua conta Google. Todos os agendamentos sincronizam automaticamente e evitamos conflitos de horário."
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim, são planos mensais sem fidelidade. Você pode cancelar pelo painel com poucos cliques."
              },
              {
                q: "Os lembretes são automáticos?",
                a: "Nos planos Starter e Pro você configura lembretes automáticos por WhatsApp com antecedência personalizável."
              },
              {
                q: "Como funciona o pagamento antecipado?",
                a: "Você ativa a opção no painel, configura o valor e escolhe Pix ou cartão. O horário só é confirmado após o pagamento."
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Pronto para automatizar sua agenda?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Comece grátis no plano Free e faça upgrade quando precisar de mais agendas ou recursos avançados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#planos"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-slate-800 transition-all hover:scale-105"
            >
              Ver planos
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-900 hover:bg-white transition-colors"
            >
              Entrar agora
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="font-bold text-slate-900">ZapAgenda</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link href="/termos" className="hover:text-slate-900">Termos</Link>
              <Link href="/privacidade" className="hover:text-slate-900">Privacidade</Link>
              <Link href="/regras" className="hover:text-slate-900">Regras</Link>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} ZapAgenda — Agendamentos automatizados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
