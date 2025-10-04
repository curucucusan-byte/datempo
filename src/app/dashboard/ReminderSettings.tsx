"use client";

import { useState } from "react";

type ReminderSettingsProps = {
  initialEnabled: boolean;
  initialWindowMinutes: number;
  canEdit: boolean;
  planLabel: string;
  planId: string;
  requiredPlanLabel: string;
  maxAutoReminders: number;
};

export default function ReminderSettings({
  initialEnabled,
  initialWindowMinutes,
  canEdit,
  planLabel,
  planId,
  requiredPlanLabel,
  maxAutoReminders,
}: ReminderSettingsProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [windowMinutes, setWindowMinutes] = useState(String(initialWindowMinutes));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });

  const windowNumber = Number(windowMinutes);
  const windowInvalid = Number.isNaN(windowNumber) || windowNumber < 5;

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canEdit || windowInvalid) return;
    setLoading(true);
    setStatus({ type: "idle" });
    try {
      const resp = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminders: {
            enabled,
            windowMinutes: windowNumber,
          },
        }),
      });
      if (!resp.ok) {
        const body = (await resp.json().catch(() => ({ error: "Falha ao salvar" }))) as { error?: string };
        throw new Error(body.error || `Erro ${resp.status}`);
      }
      setStatus({ type: "success", message: "Preferências salvas." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Lembretes no WhatsApp</h2>
          <p className="text-sm text-slate-600">
            Ajuste quando os clientes recebem lembretes automáticos.
            {maxAutoReminders > 0 ? (
              <span> Seu plano atual permite até {maxAutoReminders} lembrete(s) automático(s) por agendamento.</span>
            ) : (
              <span> Recurso disponível a partir do plano {requiredPlanLabel}.</span>
            )}
          </p>
        </div>
        {!canEdit && (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Faça upgrade para habilitar {requiredPlanLabel}
          </span>
        )}
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            disabled={!canEdit}
            className="h-4 w-4 rounded border border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Ativar lembretes automáticos
        </label>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="reminder-window">
            Enviar com antecedência (minutos)
          </label>
          <input
            id="reminder-window"
            type="number"
            min={5}
            step={5}
            value={windowMinutes}
            onChange={(event) => setWindowMinutes(event.target.value)}
            disabled={!canEdit}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Recomendado: entre 30 e 180 minutos. O sistema usa horário local do cliente.
          </p>
          {windowInvalid && <p className="text-xs text-red-600 mt-1">Informe um valor válido (mínimo 5).</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={!canEdit || loading || windowInvalid}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60 transition-colors"
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
        {status.type !== "idle" && (
          <span className={`text-sm font-medium ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {status.message}
          </span>
        )}
      </div>

      <footer className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
        <p>
          Os lembretes são enviados somente quando houver resposta recente do cliente (22h) e dentro da franquia do plano.
        </p>
        <p className="mt-1 text-slate-500">
          Plano atual: {planLabel} ({planId}).
        </p>
      </footer>
    </form>
  );
}
