"use client";

import React from "react";
import Link from "next/link";

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 08..19
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function CalendarLikeLanding() {
  const [weekAnchor, setWeekAnchor] = React.useState<Date>(() => startOfWeek(new Date()));

  const nextWeek = () => setWeekAnchor((d) => new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000));
  const prevWeek = () => setWeekAnchor((d) => new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000));
  const thisWeek = () => setWeekAnchor(startOfWeek(new Date()));

  const weekLabel = (() => {
    const end = new Date(weekAnchor.getTime() + 6 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    return `${fmt(weekAnchor)} – ${fmt(end)}`;
  })();

  // Alguns "slots" ilustrativos para dar a impressão de agenda com compromissos
  const demoEvents = [
    { day: 0, start: 10, end: 11, title: "Corte de cabelo" },
    { day: 2, start: 14, end: 15, title: "Consulta" },
    { day: 4, start: 9, end: 10, title: "Alinhamento" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* NAVBAR */}
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-400/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm4.7 7.29-5.06 5.06a1 1 0 0 1-1.41 0l-2.12-2.12a1 1 0 1 1 1.41-1.41l1.41 1.41 4.36-4.36a1 1 0 1 1 1.41 1.41Z"/></svg>
          </span>
          <span className="font-semibold tracking-tight">ZapAgenda</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">Início</Link>
          <Link href="/login" className="hover:text-white">Entrar</Link>
        </nav>
        <Link
          href="/login"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Começar agora
        </Link>
      </header>

      {/* HERO COM VISUAL DE CALENDÁRIO */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight">
              Sua semana, organizada em um só lugar.
            </h1>
            <p className="text-slate-300">
              Visual limpo inspirado em calendários profissionais, integração com Google Agenda
              e mensagens automáticas no WhatsApp. Sem atrito para você e para o cliente.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Confirmação e lembretes no WhatsApp</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Sincroniza com Google Agenda</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Pré-pagamento opcional</li>
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/login" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">Entrar ou criar conta</Link>
              <Link href="/agenda/demo" className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-slate-200 ring-1 ring-white/15 hover:bg-white/15">Ver exemplo</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-xl">
            {/* Barra de navegação de semana */}
            <div className="flex items-center justify-between px-2 py-2">
              <div className="text-sm text-slate-300">Semana</div>
              <div className="flex items-center gap-2">
                <button onClick={prevWeek} className="rounded-lg bg-white/10 px-2 py-1 text-slate-200 hover:bg-white/15">◀</button>
                <button onClick={thisWeek} className="rounded-lg bg-white/10 px-3 py-1 text-slate-200 hover:bg-white/15">Hoje</button>
                <button onClick={nextWeek} className="rounded-lg bg-white/10 px-2 py-1 text-slate-200 hover:bg-white/15">▶</button>
              </div>
              <div className="text-sm font-medium text-slate-200">{weekLabel}</div>
            </div>

            {/* Grade semanal */}
            <div className="mt-3 grid" style={{ gridTemplateColumns: "64px repeat(7, minmax(0, 1fr))" }}>
              {/* Cabeçalho dos dias */}
              <div />
              {DAYS.map((d, i) => (
                <div key={d} className="px-2 py-2 text-center text-xs font-medium text-slate-300 ring-1 ring-white/10">
                  {d}
                </div>
              ))}
              {/* Linhas de horas */}
              {HOURS.map((h) => (
                <>
                  <div key={`h-${h}`} className="px-2 py-3 text-right text-[10px] text-slate-500 ring-1 ring-white/10">
                    {String(h).padStart(2, "0")}:00
                  </div>
                  {DAYS.map((_, col) => (
                    <div key={`cell-${h}-${col}`} className="relative h-12 ring-1 ring-white/10">
                      {/* Slots de exemplo */}
                      {demoEvents.filter(ev => ev.day === col && ev.start === h).map((ev, idx) => (
                        <div
                          key={idx}
                          className="absolute inset-1 flex items-center rounded-md bg-emerald-500/20 px-2 text-[11px] text-emerald-200 ring-1 ring-emerald-400/40"
                          style={{ height: `${(ev.end - ev.start) * 48 - 8}px` }}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ZapAgenda — Visual Calendário.
      </footer>
    </div>
  );
}
