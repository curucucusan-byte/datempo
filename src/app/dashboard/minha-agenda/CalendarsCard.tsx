// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/dashboard/minha-agenda/CalendarsCard.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { ACTIVE_PLANS, CALENDAR_SWAP_INTERVAL_MS } from "@/lib/plans";
import { LinkedCalendar } from "@/lib/google"; // Importar o tipo LinkedCalendar

const DEFAULT_SERVICES = [{ name: "Atendimento padrão", minutes: 60 }];
const DEFAULT_WORK_HOURS: Record<string, string[]> = {
  monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
  saturday: [],
  sunday: [],
};

const SERVICES_EXAMPLE = '[{"name":"Consulta","minutes":60}]';
const WORK_HOURS_EXAMPLE = '{"monday":["09:00","10:00"],"tuesday":[]}';

type Calendar = { id: string; summary: string };
type AccountResp = {
  ok?: boolean;
  account?: {
    plan: string;
    linkedCalendars: LinkedCalendar[]; // Usar LinkedCalendar
    activeCalendarId?: string | null;
    lastCalendarSwapAt?: string | null;
  };
  error?: string;
};

type CalendarDraft = {
  description: string;
  whatsappNumber: string;
  services: string;
  workHours: string;
  requiresPrepayment: boolean;
  prepaymentMode: "manual" | "stripe";
  prepaymentAmountCents: string;
  prepaymentCurrency: string;
  manualPixKey: string;
  manualInstructions: string;
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
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [linkRequiresPrepayment, setLinkRequiresPrepayment] = useState(false);
  const [linkPrepaymentMode, setLinkPrepaymentMode] = useState<"manual" | "stripe">("manual");
  const [linkPrepaymentAmount, setLinkPrepaymentAmount] = useState("0");
  const [linkPrepaymentCurrency, setLinkPrepaymentCurrency] = useState("brl");
  const [linkManualPixKey, setLinkManualPixKey] = useState("");
  const [linkManualInstructions, setLinkManualInstructions] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, CalendarDraft>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/account/google", { cache: "no-store" });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok || !j.account) throw new Error(j.error || `Erro ${r.status}`);
      setAccount(j.account);
      const draftMap: Record<string, CalendarDraft> = {};
      for (const calendar of j.account.linkedCalendars ?? []) {
        draftMap[calendar.id] = {
          description: calendar.description ?? "",
          whatsappNumber: calendar.whatsappNumber ?? "",
          services: JSON.stringify(calendar.services?.length ? calendar.services : DEFAULT_SERVICES, null, 2),
          workHours: JSON.stringify(calendar.workHours && Object.keys(calendar.workHours).length ? calendar.workHours : DEFAULT_WORK_HOURS, null, 2),
          requiresPrepayment: Boolean(calendar.requiresPrepayment),
          prepaymentMode: calendar.prepaymentMode === "stripe" ? "stripe" : "manual",
          prepaymentAmountCents: String(calendar.prepaymentAmountCents ?? 0),
          prepaymentCurrency: calendar.prepaymentCurrency ?? "brl",
          manualPixKey: calendar.manualPixKey ?? "",
          manualInstructions: calendar.manualInstructions ?? "",
        };
      }
      setDrafts(draftMap);
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
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function linkCalendar() {
    const id = selectedCalendarId;
    if (!id || !description || !whatsappNumber) return; // Validar novos campos
    const summary = available.find((c) => c.id === id)?.summary || id;
    const amountCents = Math.max(0, Math.round(Number(linkPrepaymentAmount || "0")));
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/account/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "link",
          calendar: {
            id,
            summary,
            description,
            whatsappNumber,
            services: undefined,
            workHours: undefined,
            requiresPrepayment: linkRequiresPrepayment,
            prepaymentMode: linkPrepaymentMode,
            prepaymentAmountCents: amountCents,
            prepaymentCurrency: linkPrepaymentCurrency,
            manualPixKey: linkManualPixKey,
            manualInstructions: linkManualInstructions,
          },
        }),
      });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok) throw new Error(j.error || `Erro ${r.status}`);
      setStatus("Agenda vinculada.");
      setDescription("");
      setWhatsappNumber("");
      setSelectedCalendarId("");
      setLinkRequiresPrepayment(false);
      setLinkPrepaymentMode("manual");
      setLinkPrepaymentAmount("0");
      setLinkPrepaymentCurrency("brl");
      setLinkManualPixKey("");
      setLinkManualInstructions("");
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

  function ensureDraft(prev: Record<string, CalendarDraft>, id: string): CalendarDraft {
    const existing = prev[id];
    if (existing) return existing;
    return {
      description: "",
      whatsappNumber: "",
      services: JSON.stringify(DEFAULT_SERVICES, null, 2),
      workHours: JSON.stringify(DEFAULT_WORK_HOURS, null, 2),
      requiresPrepayment: false,
      prepaymentMode: "manual",
      prepaymentAmountCents: "0",
      prepaymentCurrency: "brl",
      manualPixKey: "",
      manualInstructions: "",
    };
  }

  function updateDraft(id: string, patch: Partial<CalendarDraft>) {
    setDrafts((prev) => {
      const base = ensureDraft(prev, id);
      return {
        ...prev,
        [id]: { ...base, ...patch },
      };
    });
  }

  function handleDraftChange(id: string, field: keyof CalendarDraft, value: string) {
    updateDraft(id, { [field]: value } as Partial<CalendarDraft>);
  }

  function handleDraftToggle(id: string, field: keyof CalendarDraft, checked: boolean) {
    updateDraft(id, { [field]: checked } as Partial<CalendarDraft>);
  }

  function handleDraftMode(id: string, mode: "manual" | "stripe") {
    updateDraft(id, { prepaymentMode: mode });
  }

  async function saveDraft(id: string) {
    const draft = drafts[id];
    if (!draft) return;

    let servicesPayload: unknown;
    let workHoursPayload: unknown;

    const amountValue = Math.max(0, Math.round(Number(draft.prepaymentAmountCents || "0")));
    if (draft.requiresPrepayment && amountValue <= 0) {
      setStatus("Informe um valor em centavos maior que zero para o pré-pagamento.");
      return;
    }

    try {
      servicesPayload = JSON.parse(draft.services || "[]");
      if (!Array.isArray(servicesPayload)) {
        throw new Error("Informe uma lista de serviços em formato JSON válido.");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "JSON de serviços inválido.");
      return;
    }

    try {
      workHoursPayload = JSON.parse(draft.workHours || "{}");
      if (!workHoursPayload || typeof workHoursPayload !== "object" || Array.isArray(workHoursPayload)) {
        throw new Error("Informe os horários em formato de objeto JSON (por dia da semana).");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "JSON de horários inválido.");
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/account/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateCalendar",
          id,
          description: draft.description,
          whatsappNumber: draft.whatsappNumber,
          services: servicesPayload,
          workHours: workHoursPayload,
          requiresPrepayment: draft.requiresPrepayment,
          prepaymentMode: draft.prepaymentMode,
          prepaymentAmountCents: amountValue,
          prepaymentCurrency: draft.prepaymentCurrency,
          manualPixKey: draft.manualPixKey,
          manualInstructions: draft.manualInstructions,
        }),
      });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok) throw new Error(j.error || `Erro ${r.status}`);
      setStatus("Agenda atualizada.");
      void refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erro ao salvar alterações");
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

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || "";

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
          <div className="flex flex-col gap-2">
            <select
              value={selectedCalendarId}
              onChange={(e) => setSelectedCalendarId(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
            >
              <option value="">Selecione uma agenda…</option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>{c.summary}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Descrição da agenda (ex: Meu Salão de Beleza)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <input
              type="text"
              placeholder="Número de WhatsApp (ex: +5511987654321)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <div className="rounded-xl bg-white/5 p-3 text-xs text-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">Exigir pagamento antecipado?</label>
                <input
                  type="checkbox"
                  checked={linkRequiresPrepayment}
                  onChange={(e) => setLinkRequiresPrepayment(e.target.checked)}
                  className="h-4 w-4 rounded border border-white/20"
                />
              </div>
              {linkRequiresPrepayment && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wide text-slate-400">Modo</label>
                    <select
                      value={linkPrepaymentMode}
                      onChange={(e) => setLinkPrepaymentMode(e.target.value as "manual" | "stripe")}
                      className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                    >
                      <option value="manual">Manual (Pix/transferência)</option>
                      <option value="stripe">Stripe (cartão)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wide text-slate-400">Valor (centavos)</label>
                    <input
                      type="number"
                      min={0}
                      value={linkPrepaymentAmount}
                      onChange={(e) => setLinkPrepaymentAmount(e.target.value)}
                      className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wide text-slate-400">Moeda</label>
                    <input
                      value={linkPrepaymentCurrency}
                      onChange={(e) => setLinkPrepaymentCurrency(e.target.value.toLowerCase())}
                      className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                    />
                  </div>
                  {linkPrepaymentMode === "manual" && (
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-wide text-slate-400">Pix chave</label>
                      <input
                        value={linkManualPixKey}
                        onChange={(e) => setLinkManualPixKey(e.target.value)}
                        className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                      />
                    </div>
                  )}
                </div>
              )}
              {linkRequiresPrepayment && (
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-wide text-slate-400">Instruções para o cliente</label>
                  <textarea
                    value={linkManualInstructions}
                    onChange={(e) => setLinkManualInstructions(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                    placeholder="Ex.: Envie o comprovante no WhatsApp 5 minutos após o pagamento."
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={linkCalendar}
              disabled={
                busy ||
                !selectedCalendarId ||
                !description ||
                !whatsappNumber ||
                (linkRequiresPrepayment && Number(linkPrepaymentAmount || "0") <= 0) ||
                (isPro ? limitReached : (linkedCount >= 1 && !canSwapNow))
              }
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {isPro
                ? (limitReached ? "Limite alcançado" : "Vincular selecionada")
                : (linkedCount > 0
                    ? (canSwapNow ? "Trocar (1x/dia)" : `Disponível novamente em ${formatRemaining((lastSwapMs + CALENDAR_SWAP_INTERVAL_MS) - now)}`)
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
          {(account?.linkedCalendars || []).length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Nenhuma agenda vinculada.</p>
          ) : (
            <div className="mt-4 space-y-6">
              {account!.linkedCalendars.map((c) => {
                const draft = drafts[c.id] ?? {
                  description: c.description ?? "",
                  whatsappNumber: c.whatsappNumber ?? "",
                  services: JSON.stringify(c.services?.length ? c.services : DEFAULT_SERVICES, null, 2),
                  workHours: JSON.stringify(c.workHours && Object.keys(c.workHours).length ? c.workHours : DEFAULT_WORK_HOURS, null, 2),
                };
                const isActive = activeId === c.id;
                return (
                  <div key={c.id} className="rounded-2xl bg-white/5 p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-400">Calendário vinculado</div>
                        <div className="text-sm font-semibold text-slate-200">{c.summary}</div>
                        <div className="text-xs text-slate-500 break-all">{c.id}</div>
                        {c.slug && appBaseUrl && (
                          <a
                            href={`${appBaseUrl}/agenda/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center text-xs text-emerald-300 hover:text-emerald-200"
                          >
                            {appBaseUrl.replace(/\/$/, "")}/agenda/{c.slug}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs ${isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>
                          {isActive ? "Agenda ativa" : "Inativa"}
                        </span>
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => setActive(c.id)}
                            disabled={busy || !canSwapNow}
                            className="rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/15 disabled:opacity-60"
                          >
                            {canSwapNow ? "Tornar ativa" : `Aguarde ${formatRemaining((lastSwapMs + CALENDAR_SWAP_INTERVAL_MS) - now)}`}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Descrição pública</label>
                        <input
                          value={draft.description}
                          onChange={(e) => handleDraftChange(c.id, "description", e.target.value)}
                          className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                          placeholder="Ex.: Studio da Ana — Centro"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">WhatsApp para confirmações</label>
                        <input
                          value={draft.whatsappNumber}
                          onChange={(e) => handleDraftChange(c.id, "whatsappNumber", e.target.value)}
                          className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                          placeholder="+55DDDNUMERO"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Serviços (JSON)</label>
                      <textarea
                        value={draft.services}
                        onChange={(e) => handleDraftChange(c.id, "services", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl bg-white/10 px-3 py-2 text-xs font-mono ring-1 ring-white/15"
                        spellCheck={false}
                      />
                      <p className="mt-1 text-[10px] text-slate-500">Ex.: {SERVICES_EXAMPLE}</p>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Horários por dia (JSON)</label>
                      <textarea
                        value={draft.workHours}
                        onChange={(e) => handleDraftChange(c.id, "workHours", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl bg-white/10 px-3 py-2 text-xs font-mono ring-1 ring-white/15"
                        spellCheck={false}
                      />
                      <p className="mt-1 text-[10px] text-slate-500">Use horários no formato HH:MM. Ex.: {WORK_HOURS_EXAMPLE}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300">Exigir pagamento antecipado</label>
                        <input
                          type="checkbox"
                          checked={draft.requiresPrepayment}
                          onChange={(e) => handleDraftToggle(c.id, "requiresPrepayment", e.target.checked)}
                          className="h-4 w-4 rounded border border-white/20"
                        />
                      </div>

                      {draft.requiresPrepayment && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="block text-[11px] uppercase tracking-wide text-slate-400">Modo</label>
                            <select
                              value={draft.prepaymentMode}
                              onChange={(e) => handleDraftMode(c.id, e.target.value as "manual" | "stripe")}
                              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                            >
                              <option value="manual">Manual (Pix/transferência)</option>
                              <option value="stripe">Stripe (cartão)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[11px] uppercase tracking-wide text-slate-400">Valor (centavos)</label>
                            <input
                              type="number"
                              min={0}
                              value={draft.prepaymentAmountCents}
                              onChange={(e) => handleDraftChange(c.id, "prepaymentAmountCents", e.target.value)}
                              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[11px] uppercase tracking-wide text-slate-400">Moeda</label>
                            <input
                              value={draft.prepaymentCurrency}
                              onChange={(e) => handleDraftChange(c.id, "prepaymentCurrency", e.target.value.toLowerCase())}
                              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                            />
                          </div>
                          {draft.prepaymentMode === "manual" && (
                            <div className="space-y-2">
                              <label className="block text-[11px] uppercase tracking-wide text-slate-400">Pix chave</label>
                              <input
                                value={draft.manualPixKey}
                                onChange={(e) => handleDraftChange(c.id, "manualPixKey", e.target.value)}
                                className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {draft.requiresPrepayment && (
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-wide text-slate-400">Instruções para o cliente</label>
                          <textarea
                            value={draft.manualInstructions}
                            onChange={(e) => handleDraftChange(c.id, "manualInstructions", e.target.value)}
                            rows={3}
                            className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                            placeholder="Ex.: Envie o comprovante para confirmar o horário."
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => saveDraft(c.id)}
                        disabled={busy}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                      >
                        Salvar ajustes
                      </button>
                      {isPro ? (
                        <button
                          type="button"
                          onClick={() => unlink(c.id)}
                          disabled={busy}
                          className="rounded-xl bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30"
                        >
                          Remover agenda
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Remoção disponível no plano Pro.</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isPro && (
            <div className="mt-4 rounded-2xl bg-white/5 p-3 text-xs text-slate-300">
              <div>
                Agenda ativa: {account?.linkedCalendars?.[0]?.summary ?? "nenhuma"}{" "}
                {account?.linkedCalendars?.[0]?.id ? `(${account.linkedCalendars[0]!.id})` : ""}
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-slate-400">
            <p>Você pode trocar a agenda ativa 1 vez ao dia. Última troca: {formatWhen(lastSwap)}.</p>
            {!canSwapNow && nextSwapAt && (
              <p>Próxima troca disponível: {nextSwapAt.toLocaleString("pt-BR")}.</p>
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
                Remover todas
              </button>
            </div>
          )}
          {status && <p className="mt-2 text-sm text-slate-300">{status}</p>}
        </>
      )}
    </div>
  );
}
