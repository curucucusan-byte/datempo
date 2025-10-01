"use client";

import { useState } from "react";

type ReminderSettingsProps = {
  initialEnabled: boolean;
  initialWindowMinutes: number;
  canEdit: boolean;
  planLabel: string;
  planId: string;
  availablePlanLabel: string;
};

export default function ReminderSettings({
  initialEnabled,
  initialWindowMinutes,
  canEdit,
  planLabel,
  planId,
  availablePlanLabel,
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
      className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Lembretes no WhatsApp</h2>
          <p className="text-sm text-slate-300">
            Ajuste quando os clientes recebem lembretes automáticos. Recurso disponível no plano {availablePlanLabel}.
          </p>
        </div>
        {!canEdit && (
          <span className="text-xs text-amber-300">
            Faça upgrade para habilitar.
          </span>
        )}
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="flex items-center gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            disabled={!canEdit}
            className="h-4 w-4 rounded border border-slate-400"
          />
          Ativar lembretes automáticos
        </label>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-300" htmlFor="reminder-window">
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
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10"
          />
          <p className="mt-1 text-xs text-slate-400">
            Recomendado: entre 30 e 180 minutos. O sistema usa horário local do cliente.
          </p>
          {windowInvalid && <p className="text-xs text-red-300 mt-1">Informe um valor válido (mínimo 5).</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={!canEdit || loading || windowInvalid}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
        {status.type !== "idle" && (
          <span className={`text-sm ${status.type === "success" ? "text-emerald-300" : "text-red-300"}`}>
            {status.message}
          </span>
        )}
      </div>

      <footer className="mt-4 rounded-2xl bg-white/5 p-3 text-xs text-slate-300">
        <p>
          O lembrete confirma que o agendamento continua válido. O profissional pode receber uma cópia adicional quando
          houver um WhatsApp cadastrado e a equipe habilitar essa opção no ambiente.
        </p>
        <p className="mt-1 text-slate-400">
          Plano atual: {planLabel} ({planId}).
        </p>
      </footer>
    </form>
  );
}
