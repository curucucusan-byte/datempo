"use client";

import { useEffect, useState } from "react";
import { ACTIVE_PLANS, CALENDAR_SWAP_INTERVAL_MS } from "@/lib/plans";

type Calendar = { id: string; summary: string };
type AccountResp = {
  ok?: boolean;
  account?: {
    plan: string;
    linkedCalendars: Calendar[];
    activeCalendarId?: string | null;
    lastCalendarSwapAt?: string | null;
  };
  error?: string;
};

function formatWhen(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function CalendarsCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountResp["account"] | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [available, setAvailable] = useState<Calendar[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/account/google", { cache: "no-store" });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok || !j.account) throw new Error(j.error || `Erro ${r.status}`);
      setAccount(j.account);
      // calendars
      const cr = await fetch("/api/google/calendars", { cache: "no-store" });
      const cj = (await cr.json()) as
        | { ok?: boolean; connected?: boolean; calendars?: Calendar[]; authUrl?: string; error?: string }
        | null;
      if (cr.ok && cj?.ok && cj.connected) {
        setConnected(true);
        setAvailable(cj.calendars || []);
      } else {
        setConnected(false);
        setAvailable([]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao carregar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function linkCalendar() {
    const id = selected;
    if (!id) return;
    const summary = available.find((c) => c.id === id)?.summary || id;
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/account/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link", calendar: { id, summary } }),
      });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok) throw new Error(j.error || `Erro ${r.status}`);
      setStatus("Agenda vinculada.");
      void refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erro ao vincular");
    } finally {
      setBusy(false);
    }
  }

  async function setActive(id: string) {
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/account/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setActive", id }),
      });
      const j = (await r.json()) as AccountResp & { retryAt?: string };
      if (!r.ok || !j.ok) throw new Error(j.error || `Erro ${r.status}`);
      setStatus("Agenda ativa alterada.");
      void refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erro ao alterar");
    } finally {
      setBusy(false);
    }
  }

  async function unlink(id: string) {
    if (!confirm("Remover este vínculo?")) return;
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/account/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlink", id }),
      });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok) throw new Error(j.error || `Erro ${r.status}`);
      setStatus("Agenda desvinculada.");
      void refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erro ao remover");
    } finally {
      setBusy(false);
    }
  }

  const activeId = account?.activeCalendarId ?? null;
  const lastSwap = account?.lastCalendarSwapAt ?? null;
  const planId = account?.plan === "pro" ? "pro" : "essencial";
  const planLimit = ACTIVE_PLANS[planId].googleCalendars;
  const linkedCount = account?.linkedCalendars?.length ?? 0;
  const limitReached = linkedCount >= planLimit;
  const isPro = planId === "pro";
  const now = Date.now();
  const lastSwapMs = lastSwap ? Date.parse(lastSwap) : 0;
  const canSwapNow = !lastSwapMs || now - lastSwapMs >= CALENDAR_SWAP_INTERVAL_MS;
  const nextSwapAt = lastSwapMs ? new Date(lastSwapMs + CALENDAR_SWAP_INTERVAL_MS) : null;

  function formatRemaining(ms: number) {
    if (ms <= 0) return "";
    const m = Math.ceil(ms / 60000);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem ? `${h}h ${rem}m` : `${h}h`;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Calendários Google</h2>
          <p className="text-sm text-slate-300">
            Vincule sua agenda do Google e selecione qual usar no ZapAgenda. {linkedCount}/{planLimit} vinculadas.
          </p>
        </div>
        {!connected ? (
          <form action="/api/google/oauth/start" method="get">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Conectar com Google
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
            >
              <option value="">Selecione uma agenda…</option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>{c.summary}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={linkCalendar}
              disabled={
                busy ||
                !selected ||
                (isPro ? limitReached : (linkedCount >= 1 && !canSwapNow))
              }
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {isPro
                ? (limitReached ? "Limite atingido" : "Vincular selecionada")
                : (linkedCount > 0
                    ? (canSwapNow ? "Trocar (1x/dia)" : `Disponível em ${formatRemaining((lastSwapMs + CALENDAR_SWAP_INTERVAL_MS) - now)}`)
                    : "Vincular selecionada")}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-slate-400">Carregando…</p>
      ) : error ? (
        <p className="mt-4 text-sm text-red-300">{error}</p>
      ) : (
        <>
          {(!isPro && linkedCount <= 1) ? null : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left">Resumo</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3">Ativo</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(account?.linkedCalendars || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Nenhuma agenda vinculada.
                    </td>
                  </tr>
                ) : (
                  (account!.linkedCalendars).map((c) => (
                    <tr key={c.id} className="border-b border-white/5">
                      <td className="px-4 py-3 text-slate-200">{c.summary}</td>
                      <td className="px-4 py-3 text-slate-400">{c.id}</td>
                      <td className="px-4 py-3 text-center">
                        {activeId === c.id ? (
                          <span className="text-emerald-300">Sim</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActive(c.id)}
                            disabled={busy || !canSwapNow}
                            className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
                          >
                            Tornar ativo
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isPro ? (
                          <button
                            type="button"
                            onClick={() => unlink(c.id)}
                            disabled={busy}
                            className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
                          >
                            Remover
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Disponível no plano Pro</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>)}

          {!isPro && (
            <div className="mt-4 rounded-2xl bg-white/5 p-3 text-xs text-slate-300">
              <div>
                Agenda ativa: {account?.linkedCalendars?.[0]?.summary ?? "nenhuma"}{" "}
                {account?.linkedCalendars?.[0]?.id ? `(${account.linkedCalendars[0]!.id})` : ""}
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-slate-400">
            <p>Troca de agenda: permitida 1 vez ao dia. Última troca: {formatWhen(lastSwap)}.</p>
            {!canSwapNow && nextSwapAt && (
              <p>Próxima troca liberada: {nextSwapAt.toLocaleString("pt-BR")}.</p>
            )}
          </div>

          {isPro && linkedCount > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Desvincular todas as agendas?")) return;
                  setBusy(true);
                  setStatus(null);
                  try {
                    const r = await fetch("/api/account/google", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "unlinkAll" }),
                    });
                    const j = await r.json();
                    if (!r.ok) throw new Error(j?.error || `Erro ${r.status}`);
                    setStatus("Todas as agendas foram desvinculadas.");
                    void refresh();
                  } catch (err) {
                    setStatus(err instanceof Error ? err.message : "Erro ao desvincular");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/30"
              >
                Desvincular todas
              </button>
            </div>
          )}
          {status && <p className="mt-2 text-sm text-slate-300">{status}</p>}
        </>
      )}
    </div>
  );
}
