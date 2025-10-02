"use client";

import Link from "next/link";

import { ACTIVE_PLANS } from "@/lib/plans";
import VerticalFAQCarousel from "@/components/VerticalFAQCarousel";

const FAQ_ITEMS = [
  {
    q: "Precisa instalar app?",
    a: "Não. Você compartilha um link ZapAgenda e o cliente conclui o agendamento direto no WhatsApp.",
  },
  {
    q: "Como funciona com Google Agenda?",
    a: "Basta autorizar com sua conta do Google. Sem a autorização, a sincronização pausa para evitar conflitos.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. São planos mensais sem fidelidade. Você controla tudo pelo painel com apenas alguns cliques.",
  },
  {
    q: "E os lembretes automáticos?",
    a: "No plano Pro você ativa lembretes no WhatsApp, escolhe antecedência e decide se quer copiar o time.",
  },
  {
    q: "Como proteger contra não comparecimento?",
    a: "Ative o pré-pagamento direto no ZapAgenda: configure valores, Pix ou cartão e só confirma a reserva após o cliente pagar.",
  },
  {
    q: "O cliente vê qual tela ao agendar?",
    a: "Ele acessa um formulário limpo com nome, WhatsApp, serviço e horários livres — igual ao exemplo acima e ao demo na seção FAQ.",
  },
];

// Landing minimalista para validar interesse no Micro‑SaaS: Agendamento via WhatsApp
// Estilo: Tailwind (classes utilitárias), sem dependências externas.
// Componente único, pronto para colar em app/page.tsx (App Router, Next.js 13+) ou pages/index.tsx (modelo antigo).

export default function LandingWhatsApp() {
  const faqPreviewItems = FAQ_ITEMS.map((faq) => (
    <div key={faq.q} className="space-y-1">
      <div className="font-semibold text-slate-200">{faq.q}</div>
      <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
    </div>
  ));

  const scrollToFaqSection = () => {
    const faqSection = document.getElementById("faq");
    faqSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* NAVBAR */}
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-400/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm4.7 7.29l-5.06 5.06a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41 4.36-4.36a1 1 0 1 1 1.41 1.41Z"/></svg>
          </span>
          <span className="font-semibold tracking-tight">ZapAgenda</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-slate-300">
          <a href="#features" className="hover:text-white">Recursos</a>
          <a href="#pricing" className="hover:text-white">Preços</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <Link href="/login" className="hover:text-white">Entrar</Link>
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-xl px-4 py-2 font-medium ring-1 ring-white/15 hover:bg-white/10"
          >
            Entrar
          </Link>
          <a
            href="#pricing"
            className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Experimentar grátis
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
              Agendamentos com <span className="text-emerald-400">WhatsApp</span> + Google Agenda.
            </h1>
            {/* Destaque da integração: logos maiores e peso igual */}
            <div className="mt-4 inline-flex items-center gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.826 31.676 29.317 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c4.02 0 7.66 1.52 10.44 4.01l5.66-5.66C35.9 3.59 30.27 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22c12.15 0 22-9.85 22-22 0-1.47-.15-2.9-.389-4.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.814C14.757 16.064 19.04 13 24 13c4.02 0 7.66 1.52 10.44 4.01l5.66-5.66C35.9 3.59 30.27 1 24 1 15.317 1 7.91 5.69 4.053 12.69z"/>
                  <path fill="#4CAF50" d="M24 45c5.232 0 10.02-2.003 13.627-5.273l-6.287-5.316C29.193 35.46 26.725 36 24 36c-5.29 0-9.787-3.37-11.396-8.065l-6.54 5.04C9.862 40.566 16.39 45 24 45z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.627 4.676-6.136 8-11.303 8-5.29 0-9.787-3.37-11.396-8.065l-6.54 5.04C9.862 40.566 16.39 45 24 45c12.15 0 22-9.85 22-22 0-1.47-.15-2.9-.389-4.917z"/>
                </svg>
              </span>
              <span className="text-sm font-medium text-emerald-200">Google Agenda + WhatsApp</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M24 4C13.526 4 5 12.178 5 22.417c0 4.694 1.889 8.973 4.992 12.143L8 43l8.662-2.832C18.61 41.127 21.243 41 24 41c10.474 0 19-8.178 19-18.583C43 12.178 34.474 4 24 4Zm0 33c-2.44 0-4.81-.59-6.916-1.71l-.495-.264-4.879 1.597 1.548-5.083-.323-.518C11.227 28.187 10 25.4 10 22.417 10 14.74 16.933 9 24 9s14 5.74 14 13.417C38 31.093 31.067 37 24 37Zm7.441-11.351c-.408-.204-2.415-1.189-2.79-1.323-.375-.136-.647-.204-.92.204-.273.409-1.052 1.324-1.288 1.597-.238.273-.476.307-.884.102-.409-.204-1.728-.633-3.293-2.018-1.218-1.085-2.04-2.423-2.277-2.831-.238-.409-.026-.631.179-.835.183-.183.409-.477.612-.715.204-.238.273-.409.409-.681.136-.273.068-.511-.034-.715-.102-.204-.92-2.22-1.26-3.041-.332-.798-.669-.688-.92-.703-.238-.015-.511-.019-.784-.019-.273 0-.716.102-1.09.511-.375.409-1.427 1.393-1.427 3.398 0 2.006 1.461 3.947 1.665 4.221.204.273 2.872 4.392 6.955 6.16.971.419 1.73.668 2.321.856.976.311 1.865.267 2.567.162.782-.117 2.415-.987 2.753-1.939.34-.952.34-1.767.238-1.939-.102-.171-.374-.273-.782-.477Z"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-slate-300">
              Link único para agendar. Sincroniza com o Google Agenda e confirma no WhatsApp. Simples e direto.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#pricing" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Ver planos</a>
              <a href="#features" className="rounded-xl px-5 py-3 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/10">Como funciona</a>
              <Link
                href="/login"
                className="rounded-xl px-5 py-3 text-sm font-semibold ring-1 ring-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
              >
                Acessar painel
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              3 dias para testar com tranquilidade. Depois, escolha o plano que fizer sentido para você.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-emerald-500/10 blur-2xl"/>
            <div className="relative rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
               <button
                  type="button"
                  onClick={scrollToFaqSection}
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  Dúvidas?
                </button>
                </div>
               
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                  <VerticalFAQCarousel
                    items={faqPreviewItems}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Recursos essenciais</h2>
        <p className="mt-2 text-slate-300">Foco no que dá resultado rápido para negócios locais.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "Integra Google + WhatsApp", d: "Conecte o Google Agenda (OAuth) e envie confirmações e lembretes pelo WhatsApp." },
            { t: "Fluxo prático para o cliente", d: "Um link simples para escolher dia e horário. Sem atrito." },
            { t: "Planos sob medida", d: "Essencial: 1 agenda (troca diária). Pro: até 10 agendas." },
            { t: "Lembretes configuráveis", d: "No Pro, escolha se e quando o lembrete será enviado." },
            { t: "Painel direto ao ponto", d: "Gerencie horários e acompanhe agendamentos em poucos cliques." },
            { t: "Teste sem custo", d: "Ative em minutos e continue apenas se fizer sentido." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/30">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm4.7 7.29l-5.06 5.06a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41 4.36-4.36a1 1 0 1 1 1.41 1.41Z"/></svg>
              </div>
              <h3 className="font-medium">{f.t}</h3>
              <p className="mt-1 text-sm text-slate-300">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Planos simples</h2>
        <p className="mt-2 text-slate-300">Preço acessível e transparente, sem surpresas.</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          {Object.values(ACTIVE_PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border ${plan.id === "pro" ? "border-emerald-400/60 bg-emerald-500/5" : "border-white/10 bg-slate-900/60"} p-6`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{plan.label}</h3>
                <span className={`text-xs ${plan.id === "pro" ? "text-emerald-300" : "text-slate-400"}`}>
                  {plan.id === "pro" ? "recomendado" : ""}
                </span>
              </div>
              <div className="mt-3 text-2xl font-bold">{plan.priceDisplay}</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {plan.bullets.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-emerald-400"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm4.7 7.29l-5.06 5.06a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41 4.36-4.36a1 1 0 1 1 1.41 1.41Z"/></svg>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${plan.id === "pro" ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "ring-1 ring-white/15 hover:bg-white/10"}`}
              >
                Experimentar grátis
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-sm text-slate-300">
            “Eu perdia clientes porque esquecia de responder na hora. Com o link do ZapAgenda, o cliente já marca o horário e eu só confirmo. Simples e direto.”
          </p>
          <div className="mt-3 text-xs text-slate-400">— Beta tester, Pelotas/RS</div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Perguntas frequentes</h2>
        <div className="mt-6 grid gap-4">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <div className="font-medium">{faq.q}</div>
              <p className="mt-1 text-sm text-slate-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-8 text-center">
          <h3 className="text-xl font-semibold">Pronto para automatizar sua agenda?</h3>
          <p className="mt-2 text-slate-200">
            Com poucos cliques você configura profissionais, sincroniza com o Google Agenda e envia o link para seus
            clientes reservarem horários.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Entrar ou criar conta
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/40 hover:bg-emerald-500/30"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ZapAgenda — Plataforma de agendamentos automatizados.
      </footer>
    </div>
  );
}
