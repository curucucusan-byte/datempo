import Image from "next/image";
import Link from "next/link";
import { ACTIVE_PLANS, type ActivePlanId } from "@/lib/plans";

export default function RedesignHome() {
  const planOrder: ActivePlanId[] = ["free", "starter", "pro"];
  const plans = planOrder.map((id) => ACTIVE_PLANS[id]);

  function formatNumber(n: number) {
    return new Intl.NumberFormat("pt-BR").format(n);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-[22px] bg-emerald-50 ring-1 ring-emerald-100">
            <Image src="/logos/whats-logo-and-name-green.svg" alt="DaTempo" width={34} height={34} />
          </span>
          <span className="font-semibold tracking-tight text-slate-900">DaTempo</span>
        </div>

        <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900">Recursos</a>
          <a href="#pricing" className="hover:text-slate-900">Preços</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
          <Link href="/login" className="hover:text-slate-900">Entrar</Link>
        </nav>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="inline-flex rounded-full px-4 py-2 font-medium border border-slate-200 hover:bg-slate-50"
          >
            Entrar
          </Link>
          <a
            href="#pricing"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Ver planos
          </a>
        </div>

        {/* Mobile quick actions: full width CTAs under header when on small screens */}
        <div className="sm:hidden mt-4 w-full flex flex-col gap-3">
          <a href="#pricing" className="w-full inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold">Ver planos</a>
          <Link href="/login" className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-slate-800">Entrar</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Agendamentos inteligentes para seu negócio
              <span className="ml-3 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-base font-medium text-emerald-700">WhatsApp + Google Calendar</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-700 max-w-xl">Uma página de agendamento simplificada: compartilhe um link, o cliente escolhe horário e confirma via WhatsApp — sem instalar nada.</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#pricing" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-500 text-base">Testar 3 dias</a>
              <Link href="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-slate-800 hover:bg-slate-50">Acessar painel</Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-emerald-50 p-5 shadow-sm">
                <div className="text-sm text-emerald-700 font-semibold">Conecte</div>
                <div className="mt-1 font-medium">Google Calendar</div>
                <p className="mt-2 text-base text-slate-600">Sincronização bidirecional para evitar conflitos.</p>
              </div>
              <div className="rounded-[20px] bg-sky-50 p-5 shadow-sm">
                <div className="text-sm text-sky-600 font-semibold">Notifique</div>
                <div className="mt-1 font-medium">WhatsApp</div>
                <p className="mt-2 text-base text-slate-600">Lembretes e confirmações automáticas.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[24px] border border-slate-100 bg-white p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Demo</div>
                <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Online
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
                    <div className="text-base font-medium">Próximos horários</div>
                    <ul className="mt-3 text-base text-slate-600 space-y-3">
                    <li className="flex items-center justify-between"><span>Ter 10:00</span><span className="text-emerald-600 font-semibold">Livre</span></li>
                    <li className="flex items-center justify-between"><span>Qua 14:30</span><span className="text-slate-400">Ocupado</span></li>
                    <li className="flex items-center justify-between"><span>Qui 09:00</span><span className="text-emerald-600 font-semibold">Livre</span></li>
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
                  <div className="text-base font-medium">Cliente</div>
                  <div className="mt-2 text-base text-slate-700">Nome: Ana Silva • WhatsApp: +55 11 9xxxx-xxxx</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-12">
          <h2 className="text-3xl font-semibold">Recursos principais</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: "Reservas por link", d: "Compartilhe um link direto no WhatsApp e deixe o cliente agendar." },
              { t: "Sincronização", d: "Evita double-booking com locks e checagens." },
              { t: "Lembretes", d: "Envio via WhatsApp com templates configuráveis." },
            ].map((f) => (
              <div key={f.t} className="rounded-[20px] p-6 bg-[rgba(250,250,250,0.9)] border border-slate-100">
                <h3 className="font-medium text-lg">{f.t}</h3>
                <p className="mt-3 text-base text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-12">
          <h2 className="text-3xl font-semibold">Planos</h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="p-6 rounded-[20px] border border-slate-100 bg-[rgba(250,250,250,0.9)] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base text-slate-500">{plan.label}</div>
                    <div className="mt-1 text-3xl font-bold">{plan.priceDisplay}</div>
                    {plan.trialDays > 0 && <div className="text-sm text-slate-500">Teste grátis: {plan.trialDays} dias</div>}
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <div>Agendas: <span className="font-semibold text-slate-800">{plan.limits.maxConnectedCalendars}</span></div>
                    <div>Reservas/mês: <span className="font-semibold text-slate-800">{formatNumber(plan.limits.maxAppointmentsPerMonth)}</span></div>
                  </div>
                </div>

                <div className="mt-4 text-base text-slate-700">
                  <ul className="space-y-2">
                    {plan.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 h-3 w-3 rounded-full bg-slate-300" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="rounded-md bg-white/60 p-3 border border-slate-100">
                    <div className="font-medium">Mensagens incluídas</div>
                    <div className="mt-1">{formatNumber(plan.limits.whatsappMessagesIncludedPerMonth)} / mês</div>
                    {plan.overage.whatsappMessageBRL !== null && (
                      <div className="mt-1 text-emerald-700">Overage: R$ {plan.overage.whatsappMessageBRL?.toFixed(2)} / msg</div>
                    )}
                  </div>
                  <div className="rounded-md bg-white/60 p-3 border border-slate-100">
                    <div className="font-medium">Lembretes</div>
                    <div className="mt-1">{plan.limits.maxAutoRemindersPerAppointment > 0 ? `${plan.limits.maxAutoRemindersPerAppointment} por agendamento` : "Não incluso"}</div>
                  </div>
                </div>


                <div className="mt-6 flex items-center justify-between">
                  <a href="#" className="rounded-full bg-slate-900 px-5 py-3 text-white text-base font-semibold">Escolher {plan.label}</a>
                  <a href="#" className="text-sm text-slate-500">Mais detalhes</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-12">
          <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[20px] p-4 bg-slate-50 border border-slate-100">
              <div className="font-medium">Precisa instalar app?</div>
              <p className="mt-1 text-sm text-slate-600">Não, o cliente final usa apenas o link que você compartilha.</p>
            </div>
          </div>
        </section>

        <section id="cta" className="mt-12 py-8">
          <div className="rounded-[24px] p-8 bg-gradient-to-r from-emerald-50 to-sky-50 border border-slate-100 text-center">
            <h3 className="text-2xl font-semibold">Pronto para transformar sua agenda?</h3>
            <p className="mt-3 text-lg text-slate-700">Teste por 3 dias e veja como automatizar confirmações e reduzir faltas.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="#pricing" className="rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold">Testar grátis</a>
              <Link href="/login" className="rounded-full border border-slate-200 px-6 py-3 text-slate-800">Entrar</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} DaTempo — Agendamentos via WhatsApp
      </footer>
    </div>
  );
}
