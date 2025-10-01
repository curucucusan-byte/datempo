"use client";

import Link from "next/link";

import { ACTIVE_PLANS } from "@/lib/plans";

// Landing minimalista para validar interesse no Micro‑SaaS: Agendamento via WhatsApp
// Estilo: Tailwind (classes utilitárias), sem dependências externas.
// Componente único, pronto para colar em app/page.tsx (App Router, Next.js 13+) ou pages/index.tsx (modelo antigo).

export default function LandingWhatsApp() {
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
            Começar sem custo
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
              Sua agenda automática no <span className="text-emerald-400">WhatsApp</span>.
            </h1>
            <p className="mt-4 text-slate-300">
              ZapAgenda centraliza agendamentos: compartilhe um link, obrigue a conexão com o Google Agenda para manter
              os horários atualizados e automatize confirmações e lembretes pelo WhatsApp.
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
              3 dias sem custo em todos os planos. Plano ativo obrigatório após o período de teste.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-emerald-500/10 blur-2xl"/>
            <div className="relative rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"/> demo
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Link do seu negócio</div>
                    <span className="text-xs text-slate-400">zapagenda.app/joaobarber</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="font-medium">Calendário básico</div>
                  <p className="text-slate-300">Cliente escolhe dia/horário disponível. Bloqueio automático.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="font-medium">Confirmação no WhatsApp</div>
                  <p className="text-slate-300">Mensagem com dados do agendamento enviada para você e para o cliente.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="font-medium">Sem dor de cabeça</div>
                  <p className="text-slate-300">Nada de app pesado. Só um link. Planos simples e sem taxa oculta.</p>
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
            { t: "Google Agenda obrigatório", d: "O profissional conecta via OAuth e só então libera os horários para clientes." },
            { t: "WhatsApp automático", d: "O cliente responde ao link e recebe confirmações e lembretes sem sair da conversa." },
            { t: "Planos com limite de agendas", d: "Essencial: 1 agenda (troca diária). Pro: até 10 agendas sincronizadas." },
            { t: "Lembretes configuráveis", d: "No plano Pro, ajuste se e quando o lembrete será enviado." },
            { t: "Painel simples", d: "Gerencie serviços, horários e acompanhe agendamentos em tempo real." },
            { t: "3 dias sem custo", d: "Ative em minutos e continue somente se fizer sentido." },
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
        <p className="mt-2 text-slate-300">Preço baixo para validar. Sem pegadinha.</p>

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
                Começar sem custo
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
          {[
            { q: "Precisa instalar app?", a: "Não. Você terá um link para compartilhar e o cliente finaliza a conversa no WhatsApp." },
            { q: "Como funciona com Google Agenda?", a: "O profissional precisa autorizar via OAuth. Sem a permissão, o sistema bloqueia o uso para evitar conflitos." },
            { q: "Posso cancelar quando quiser?", a: "Sim. Planos mensais, sem fidelidade. Ao cancelar, o acesso é suspenso." },
            { q: "E os lembretes?", a: "No plano Pro você ativa lembretes automáticos e escolhe a antecedência diretamente no dashboard." },
          ].map((faq) => (
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
