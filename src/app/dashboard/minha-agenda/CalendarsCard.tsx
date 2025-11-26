// Caminho do arquivo: /home/ubuntu/datempo/datempo/src/app/dashboard/minha-agenda/CalendarsCard.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ACTIVE_PLANS, CALENDAR_SWAP_INTERVAL_MS, isActivePlan, type ActivePlanId, type PlanId } from "@/lib/plans";
import { LinkedCalendar } from "@/lib/google"; // Importar o tipo LinkedCalendar
import { WorkHoursSelector } from "../components/WorkHoursSelector";

const DEFAULT_SLOT_DURATION = 60;
const DEFAULT_WORK_HOURS: Record<string, string[]> = {
  monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
  saturday: [],
  sunday: [],
};
const WORK_HOURS_EXAMPLE = '{"monday":["09:00","10:00"],"tuesday":[]}';

type Calendar = { id: string; summary: string };
type AccountResp = {
  ok?: boolean;
  account?: {
    plan: PlanId;
    linkedCalendars: LinkedCalendar[]; // Usar LinkedCalendar
    activeCalendarId?: string | null;
    lastCalendarSwapAt?: string | null;
  };
  error?: string;
};

type CalendarDraft = {
  description: string;
  whatsappNumber: string;
  slotDurationMinutes: string;
  workHours: string;
  requiresPrepayment: boolean;
  prepaymentMode: "manual" | "stripe";
  prepaymentAmountCents: string;
  prepaymentCurrency: string;
  manualPixKey: string;
  manualInstructions: string;
  logoPath: string;
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
  const [linkSlotDuration, setLinkSlotDuration] = useState<string>(String(DEFAULT_SLOT_DURATION));
  const [linkRequiresPrepayment, setLinkRequiresPrepayment] = useState(false);
  const [linkPrepaymentMode, setLinkPrepaymentMode] = useState<"manual" | "stripe">("manual");
  const [linkPrepaymentAmount, setLinkPrepaymentAmount] = useState("0");
  const [linkPrepaymentCurrency, setLinkPrepaymentCurrency] = useState("brl");
  const [linkManualPixKey, setLinkManualPixKey] = useState("");
  const [linkManualInstructions, setLinkManualInstructions] = useState("");
  const [linkLogoPath, setLinkLogoPath] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, CalendarDraft>>({});
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const configuredBaseUrl = (process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || "").replace(/\/$/, "");
  const [publicBaseUrl, setPublicBaseUrl] = useState<string>(configuredBaseUrl);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const effectivePlanId: ActivePlanId =
    account?.plan && isActivePlan(account.plan) ? account.plan : "free";
  const planDetails = ACTIVE_PLANS[effectivePlanId];
  const planLimit = planDetails.limits.maxConnectedCalendars;
  const paymentFeatureEnabled = planDetails.features.paymentAtBooking;
  const isPro = effectivePlanId === "pro";

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/account/google", { cache: "no-store" });
      const j = (await r.json()) as AccountResp;
      if (!r.ok || !j.ok || !j.account) throw new Error(j.error || `Erro ${r.status}`);
      setAccount(j.account);
      const remotePlanId: ActivePlanId =
        j.account.plan && isActivePlan(j.account.plan) ? j.account.plan : "free";
      const remotePlanDetails = ACTIVE_PLANS[remotePlanId];
      const remotePaymentEnabled = remotePlanDetails.features.paymentAtBooking;
      const draftMap: Record<string, CalendarDraft> = {};
      for (const calendar of j.account.linkedCalendars ?? []) {
        draftMap[calendar.id] = {
          description: calendar.description ?? "",
          whatsappNumber: calendar.whatsappNumber ?? "",
          slotDurationMinutes: String(calendar.slotDurationMinutes ?? DEFAULT_SLOT_DURATION),
          workHours: JSON.stringify(calendar.workHours && Object.keys(calendar.workHours).length ? calendar.workHours : DEFAULT_WORK_HOURS, null, 2),
          requiresPrepayment: remotePaymentEnabled ? Boolean(calendar.requiresPrepayment) : false,
          prepaymentMode: remotePaymentEnabled && calendar.prepaymentMode === "stripe" ? "stripe" : "manual",
          prepaymentAmountCents: String(remotePaymentEnabled ? calendar.prepaymentAmountCents ?? 0 : 0),
          prepaymentCurrency: calendar.prepaymentCurrency ?? "brl",
          manualPixKey: remotePaymentEnabled ? calendar.manualPixKey ?? "" : "",
          manualInstructions: remotePaymentEnabled ? calendar.manualInstructions ?? "" : "",
          logoPath: (calendar as any).logoPath ?? "",
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

  useEffect(() => {
    if (!paymentFeatureEnabled) {
      setLinkRequiresPrepayment(false);
    }
  }, [paymentFeatureEnabled]);

  useEffect(() => {
    if (!configuredBaseUrl && typeof window !== "undefined") {
      setPublicBaseUrl(window.location.origin);
    }
  }, [configuredBaseUrl]);

  const handleCopyLink = async (slug: string, token?: string | null) => {
    const link = computePublicLink(slug, token || undefined);
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("clipboard_unavailable");
      }
      await navigator.clipboard.writeText(link);
      setCopyFeedback("Link copiado!");
    } catch {
      setCopyFeedback("Copie manualmente: " + link);
    }
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const computePublicLink = (slug: string, token?: string) => {
    const base = publicBaseUrl || (typeof window !== "undefined" ? window.location.origin : "");
    return token
      ? `${base.replace(/\/$/, "")}/agenda/${slug}/${token}`
      : `${base.replace(/\/$/, "")}/agenda/${slug}`;
  };

  async function linkCalendar() {
    const id = selectedCalendarId;
    if (!id || !description || !whatsappNumber) return; // Validar novos campos
    const summary = available.find((c) => c.id === id)?.summary || id;
    const allowsPrepayment = paymentFeatureEnabled;
    const requiresPrepayment = allowsPrepayment && linkRequiresPrepayment;
    const amountCents = requiresPrepayment ? Math.max(0, Math.round(Number(linkPrepaymentAmount || "0"))) : 0;
    const slotDurationValue = Math.max(5, Math.min(8 * 60, Math.round(Number(linkSlotDuration || DEFAULT_SLOT_DURATION)) || DEFAULT_SLOT_DURATION));
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
            slotDurationMinutes: slotDurationValue,
            workHours: undefined,
            requiresPrepayment,
            prepaymentMode: requiresPrepayment ? linkPrepaymentMode : "manual",
            prepaymentAmountCents: amountCents,
            prepaymentCurrency: linkPrepaymentCurrency,
            manualPixKey: requiresPrepayment ? linkManualPixKey : "",
            manualInstructions: requiresPrepayment ? linkManualInstructions : "",
            logoPath: linkLogoPath || undefined,
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
      setLinkSlotDuration(String(DEFAULT_SLOT_DURATION));
      setLinkLogoPath("");
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
      slotDurationMinutes: String(DEFAULT_SLOT_DURATION),
      workHours: JSON.stringify(DEFAULT_WORK_HOURS, null, 2),
      requiresPrepayment: false,
      prepaymentMode: "manual",
      prepaymentAmountCents: "0",
      prepaymentCurrency: "brl",
      manualPixKey: "",
      manualInstructions: "",
      logoPath: "",
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
    if (field === "requiresPrepayment" && !paymentFeatureEnabled) {
      updateDraft(id, { [field]: false } as Partial<CalendarDraft>);
      return;
    }
    updateDraft(id, { [field]: checked } as Partial<CalendarDraft>);
  }

  function handleDraftMode(id: string, mode: "manual" | "stripe") {
    if (!paymentFeatureEnabled) {
      return;
    }
    updateDraft(id, { prepaymentMode: mode });
  }

  async function saveDraft(id: string) {
    const draft = drafts[id];
    if (!draft) return;

    const amountValue = Math.max(0, Math.round(Number(draft.prepaymentAmountCents || "0")));
    if (draft.requiresPrepayment && amountValue <= 0) {
      setStatus("Informe um valor em centavos maior que zero para o pré-pagamento.");
      return;
    }

    const durationValue = Math.round(Number(draft.slotDurationMinutes || DEFAULT_SLOT_DURATION));
    if (!Number.isFinite(durationValue) || durationValue <= 0) {
      setStatus("Informe uma duração válida (minutos).");
      return;
    }
    const sanitizedDuration = Math.max(5, Math.min(8 * 60, durationValue));

    let workHoursPayload: unknown;
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
          slotDurationMinutes: sanitizedDuration,
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

  async function uploadLogo(slug: string | undefined, calendarId: string) {
    const input = uploadRefs.current[calendarId] || null;
    if (!slug) {
      setStatus("Gere o link público da agenda antes de enviar o logo.");
      return;
    }
    if (!input || !input.files || input.files.length === 0) {
      setStatus("Selecione um arquivo de imagem antes de enviar.");
      return;
    }

    const file = input.files[0];
    setBusy(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("slug", slug);
      form.append("file", file);

      const res = await fetch("/api/logo/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; path?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Erro ${res.status}`);
      }
      const nextPath = data.path && typeof data.path === "string" ? data.path : `/agenda-logos/${slug}/logo.webp`;
      handleDraftChange(calendarId, "logoPath", nextPath);
      setStatus("Logotipo atualizado.");
      void refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erro ao enviar logotipo");
    } finally {
      setBusy(false);
      if (input) {
        input.value = "";
      }
    }
  }

  const activeId = account?.activeCalendarId ?? null;
  const lastSwap = account?.lastCalendarSwapAt ?? null;
  const linkedCount = account?.linkedCalendars?.length ?? 0;
  const limitReached = linkedCount >= planLimit;
  const requiresSwapCooldown = effectivePlanId === "free";
  const now = Date.now();
  const lastSwapMs = lastSwap ? Date.parse(lastSwap) : 0;
  const canSwapNow = !lastSwapMs || now - lastSwapMs >= CALENDAR_SWAP_INTERVAL_MS;
  const nextSwapAt = lastSwapMs ? new Date(lastSwapMs + CALENDAR_SWAP_INTERVAL_MS) : null;
  const swapBlocked = requiresSwapCooldown && linkedCount >= 1 && !canSwapNow;
  const requiresPrepaymentSelection = paymentFeatureEnabled && linkRequiresPrepayment;

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
            Vincule sua agenda do Google e selecione qual usar no DaTempo. {linkedCount}/{planLimit} vinculadas.
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
            <input
              type="number"
              min={5}
              placeholder="Duração padrão (minutos)"
              value={linkSlotDuration}
              onChange={(e) => setLinkSlotDuration(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <input
              type="text"
              placeholder="Caminho do logo (em public), ex.: /agenda-logos/slug/logo.webp"
              value={linkLogoPath}
              onChange={(e) => setLinkLogoPath(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <div className="rounded-xl bg-white/5 p-3 text-xs text-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">Exigir pagamento antecipado?</label>
                <input
                  type="checkbox"
                  checked={linkRequiresPrepayment}
                  onChange={(e) => setLinkRequiresPrepayment(paymentFeatureEnabled && e.target.checked)}
                  disabled={!paymentFeatureEnabled}
                  className="h-4 w-4 rounded border border-white/20"
                />
              </div>
              {!paymentFeatureEnabled && (
                <p className="rounded-lg bg-white/10 px-3 py-2 text-[11px] text-slate-400">
                  Disponível a partir do plano {ACTIVE_PLANS.starter.label}.
                </p>
              )}
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
                (requiresPrepaymentSelection && Number(linkPrepaymentAmount || "0") <= 0) ||
                Number(linkSlotDuration || "0") <= 0 ||
                limitReached ||
                swapBlocked
              }
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {limitReached
                ? "Limite alcançado"
                : requiresSwapCooldown && linkedCount > 0 && !canSwapNow
                  ? `Disponível novamente em ${formatRemaining((lastSwapMs + CALENDAR_SWAP_INTERVAL_MS) - now)}`
                  : requiresSwapCooldown && linkedCount > 0
                    ? "Trocar (1x/dia)"
                    : "Vincular selecionada"}
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
                  slotDurationMinutes: String(c.slotDurationMinutes ?? DEFAULT_SLOT_DURATION),
                  workHours: JSON.stringify(c.workHours && Object.keys(c.workHours).length ? c.workHours : DEFAULT_WORK_HOURS, null, 2),
                  requiresPrepayment: Boolean(c.requiresPrepayment && paymentFeatureEnabled),
                  prepaymentMode: c.prepaymentMode === "stripe" ? "stripe" : "manual",
                  prepaymentAmountCents: String(c.prepaymentAmountCents ?? 0),
                  prepaymentCurrency: c.prepaymentCurrency ?? "brl",
                  manualPixKey: c.manualPixKey ?? "",
                  manualInstructions: c.manualInstructions ?? "",
                  logoPath: (c as any).logoPath ?? "",
                };
                const isActive = activeId === c.id;
                return (
                  <div key={c.id} className="rounded-2xl bg-white/5 p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-400">Calendário vinculado</div>
                        <div className="text-sm font-semibold text-slate-200">{c.summary}</div>
                        <div className="text-xs text-slate-500 break-all">{c.id}</div>
                        {c.slug && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-300">
                            <span className="truncate">{computePublicLink(c.slug, (c as any).publicToken)}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(c.slug, (c as any).publicToken)}
                              className="rounded-lg bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-500/30"
                            >
                              Copiar link
                            </button>
                          </div>
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
                        <button
                          type="button"
                          onClick={async () => {
                            setBusy(true);
                            setStatus(null);
                            try {
                              const r = await fetch("/api/account/google", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ action: "regenPublicToken", id: c.id }),
                              });
                              const j = await r.json();
                              if (!r.ok || !j.ok) throw new Error(j?.error || `Erro ${r.status}`);
                              setStatus("Link público regenerado.");
                              void refresh();
                            } catch (err) {
                              setStatus(err instanceof Error ? err.message : "Erro ao regenerar link");
                            } finally {
                              setBusy(false);
                            }
                          }}
                          className="rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/15 disabled:opacity-60"
                        >
                          Regenerar link
                        </button>
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

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Caminho do logo (em public)</label>
                        <input
                          value={draft.logoPath}
                          onChange={(e) => handleDraftChange(c.id, "logoPath", e.target.value)}
                          className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                          placeholder="/agenda-logos/seu-slug/logo.webp"
                        />
                        <p className="mt-1 text-[10px] text-slate-500">Arquivos em public/. Ex.: public/agenda-logos/seu-slug/logo.webp</p>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            ref={(el) => { uploadRefs.current[c.id] = el; }}
                            type="file"
                            accept="image/*"
                            className="text-xs"
                            aria-label="Selecionar arquivo de logotipo"
                          />
                          <button
                            type="button"
                            onClick={() => uploadLogo(c.slug, c.id)}
                            disabled={busy}
                            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/15 disabled:opacity-60"
                          >
                            Enviar para public
                          </button>
                        </div>
                        {draft.logoPath && (
                          <div className="mt-2 flex items-center gap-3">
                            <img src={draft.logoPath} alt="Logo" className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10" />
                            <span className="text-xs text-slate-400">Pré-visualização</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Duração padrão (minutos)</label>
                        <input
                          type="number"
                          min={5}
                          value={draft.slotDurationMinutes}
                          onChange={(e) => handleDraftChange(c.id, "slotDurationMinutes", e.target.value)}
                          className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="60"
                        />
                        <p className="mt-1 text-[10px] text-slate-500">Usado para gerar os horários disponíveis.</p>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-2">Horários de Trabalho</label>
                        <WorkHoursSelector
                          value={(() => {
                            try {
                              return JSON.parse(draft.workHours);
                            } catch {
                              return DEFAULT_WORK_HOURS;
                            }
                          })()}
                          onChange={(newHours) => {
                            handleDraftChange(c.id, "workHours", JSON.stringify(newHours, null, 2));
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300">Exigir pagamento antecipado</label>
                        <input
                          type="checkbox"
                          checked={draft.requiresPrepayment}
                          onChange={(e) => handleDraftToggle(c.id, "requiresPrepayment", e.target.checked)}
                          disabled={!paymentFeatureEnabled}
                          className="h-4 w-4 rounded border border-white/20"
                        />
                      </div>
                      {!paymentFeatureEnabled && (
                        <p className="text-[11px] text-slate-400">
                          Disponível a partir do plano {ACTIVE_PLANS.starter.label}.
                        </p>
                      )}

                      {draft.requiresPrepayment && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="block text-[11px] uppercase tracking-wide text-slate-400">Modo</label>
                            <select
                              value={draft.prepaymentMode}
                              onChange={(e) => handleDraftMode(c.id, e.target.value as "manual" | "stripe")}
                              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                              disabled={!paymentFeatureEnabled}
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
                              disabled={!paymentFeatureEnabled}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[11px] uppercase tracking-wide text-slate-400">Moeda</label>
                            <input
                              value={draft.prepaymentCurrency}
                              onChange={(e) => handleDraftChange(c.id, "prepaymentCurrency", e.target.value.toLowerCase())}
                              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                              disabled={!paymentFeatureEnabled}
                            />
                          </div>
                          {draft.prepaymentMode === "manual" && (
                            <div className="space-y-2">
                              <label className="block text-[11px] uppercase tracking-wide text-slate-400">Pix chave</label>
                              <input
                                value={draft.manualPixKey}
                                onChange={(e) => handleDraftChange(c.id, "manualPixKey", e.target.value)}
                                className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-xs ring-1 ring-white/10"
                                disabled={!paymentFeatureEnabled}
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
                            disabled={!paymentFeatureEnabled}
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
          {copyFeedback && <p className="mt-2 text-xs text-emerald-300">{copyFeedback}</p>}
          {status && <p className="mt-2 text-sm text-slate-300">{status}</p>}
        </>
      )}
    </div>
  );
}
