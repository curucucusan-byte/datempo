import Image from "next/image";
import Link from "next/link";
import { ACTIVE_PLANS, type ActivePlanId } from "@/lib/plans";
import ImageCarousel from "./ImageCarousel";
import Header from "@/components/Header";

export default function HomeV2() {
  const planOrder: ActivePlanId[] = ["free", "starter", "pro"];
  const plans = planOrder.map((id) => ACTIVE_PLANS[id]);

  function formatNumber(n: number) {
    return new Intl.NumberFormat("pt-BR").format(n);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* HEADER LIMPO */}
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Fundo com gradiente verde + madeira */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-[#F5EFE6] to-amber-50 opacity-60"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge com logos (sem texto) */}
              <div className="inline-flex items-center gap-3 rounded-full border-2 border-emerald-200 bg-white px-5 py-2.5 shadow-sm mb-6">
                <Image src="/logos/whatsapp-green-filled.png" alt="WhatsApp" width={28} height={28} className="rounded" />
                <div className="h-5 w-px bg-slate-200"></div>
                <Image src="/logos/calendar.png" alt="Google Calendar" width={28} height={28} className="rounded" />
              </div>
              
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2D3748] leading-tight">
                Onde tudo
                <span className="block bg-gradient-to-r from-emerald-600 to-[#8B6F47] bg-clip-text text-transparent mt-2">
                  dá tempo
                </span>
              </h1>

              <p className="mt-6 text-xl text-[#4A5568] leading-relaxed max-w-2xl">
                Agendamentos automáticos via WhatsApp. Sem pressa, sem complicação. 
                Como no escritório da vovó, onde sempre havia tempo para o cafezinho ☕
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Começar agora
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#planos"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[#8B6F47] bg-transparent px-8 py-4 text-lg font-semibold text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-all"
                >
                  Ver planos
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative lg:pl-8">
              <div className="absolute -inset-4 bg-[#EDE5D8] rounded-3xl opacity-30 blur-3xl"></div>
              <div className="relative">
                <ImageCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2D3748] mb-4">
              Tudo tranquilo, tudo no tempo certo
            </h2>
            <p className="text-xl text-[#4A5568]">
              Recursos pensados para quem valoriza o tempo (seu e do cliente)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔗",
                title: "Link de agendamento",
                description: "Cliente escolhe o horário e confirma pelo WhatsApp. Simples assim.",
                color: "emerald"
              },
              {
                icon: "📅",
                title: "Google Calendar",
                description: "Sincronização automática. Sem conflitos, sem preocupação.",
                color: "blue"
              },
              {
                icon: "💬",
                title: "Lembretes gentis",
                description: "Avisos automáticos pelo WhatsApp. Quando quiser configurar.",
                color: "emerald"
              },
              {
                icon: "💳",
                title: "Pagamento opcional",
                description: "Pix ou cartão antecipado. Se fizer sentido pro seu negócio.",
                color: "amber"
              },
              {
                icon: "📊",
                title: "Painel simples",
                description: "Tudo que você precisa ver, sem firula. Direto ao ponto.",
                color: "slate"
              }
            ].map((feature, idx) => {
              const colorClasses = {
                emerald: "bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100",
                blue: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-blue-100",
                amber: "bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-100",
                slate: "bg-slate-50 border-slate-200 hover:border-slate-400 hover:shadow-slate-100",
                yellow: "bg-yellow-50 border-yellow-200 hover:border-yellow-400 hover:shadow-yellow-100"
              };
              
              return (
                <div
                  key={idx}
                  className={`group rounded-2xl border-2 p-8 hover:shadow-xl transition-all ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white border-2 border-current opacity-80 text-3xl mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#2D3748] mb-3">{feature.title}</h3>
                  <p className="text-base text-[#4A5568] leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-20 bg-gradient-to-br from-amber-50 via-white to-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2D3748] mb-4">
              Planos sem enrolação
            </h2>
            <p className="text-xl text-[#4A5568]">
              Escolha conforme cresce. Tudo muito claro.
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
      <footer className="border-t border-emerald-100 bg-gradient-to-br from-emerald-50 to-amber-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <span className="text-xl">🕰️</span>
              </div>
              <span className="font-serif font-bold text-xl bg-gradient-to-r from-emerald-700 to-[#8B6F47] bg-clip-text text-transparent">
                DaTempo
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link href="/termos" className="hover:text-emerald-600 transition-colors">Termos</Link>
              <Link href="/privacidade" className="hover:text-emerald-600 transition-colors">Privacidade</Link>
              <Link href="/regras" className="hover:text-emerald-600 transition-colors">Regras</Link>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} DaTempo — Onde tudo dá tempo ☕
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
