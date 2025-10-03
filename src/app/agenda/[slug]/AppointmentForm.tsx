// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/agenda/[slug]/AppointmentForm.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { maskBR } from "@/lib/phone";

type AvailabilityResponse = {
  ok: boolean;
  date: string;
  slotMinutes: number;
  free: string[];
  taken: { start: string; end: string }[];
  error?: string;
};

type AppointmentResponse = {
  ok: boolean;
  id?: string;
  when?: string;
  minutes?: number;
  ics?: string;
  error?: string;
  timeZone?: string;
  payment?:
    | { status: "not_required" }
    | {
        status: "pending";
        mode?: "manual" | "stripe";
        amountCents?: number;
        currency?: string;
        pixKey?: string;
        instructions?: string | null;
      };
};

export default function AppointmentForm({ slug, h }: { slug: string; h?: string }) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("+55");
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AppointmentResponse | null>(null);
  const [slotMinutes, setSlotMinutes] = useState<number | null>(null);

  // data mínima (hoje) no input date
  const minDate = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  // Preseleciona hoje ao abrir
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(minDate);
    }
  }, [minDate, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      setLoadingSlots(true);
      setError(null);
      setAvailableSlots([]);
      setSelectedSlot("");
      try {
        const res = await fetch(`/api/availability?slug=${encodeURIComponent(slug)}&date=${selectedDate}${h ? `&h=${encodeURIComponent(h)}` : ""}`);
        const data: AvailabilityResponse = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Erro ao carregar horários.");
        }
        setAvailableSlots(data.free);
        setSlotMinutes(data.slotMinutes ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar disponibilidade.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    if (!selectedDate || !selectedSlot || !customerName || !customerPhone) {
      setError("Por favor, preencha todos os campos.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          h,
          customerName,
          customerPhone,
          datetime: selectedSlot, // O slot já é um ISO string
          durationMinutes: slotMinutes ?? undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const data: AppointmentResponse = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erro ao agendar.");
      }
      setResult(data);
      // Limpar formulário
      setSelectedDate("");
      setSelectedSlot("");
      setCustomerName("");
      setCustomerPhone("");
      setAvailableSlots([]);
      setSlotMinutes(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao agendar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      {/* DATA */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-300">Data</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          min={minDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full rounded-xl border-white/10 bg-slate-800/80 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      {/* HORÁRIOS */}
      {selectedDate && (
        <div>
          <div className="mb-1 text-sm font-medium text-slate-300">Horário</div>
          {loadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-800/60 p-3 text-sm text-slate-300">
              Nenhum horário disponível para esta data.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => {
                const d = new Date(slot);
                const label = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                const past = d.getTime() < Date.now();
                const selected = selectedSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={past || submitting}
                    className={`h-10 rounded-xl px-3 text-sm font-medium ring-1 transition ${
                      selected
                        ? "bg-emerald-500 text-slate-950 ring-emerald-400"
                        : "bg-slate-800/80 text-slate-200 hover:bg-slate-700 ring-white/10"
                    } ${past ? "opacity-40 pointer-events-none" : ""}`}
                    aria-pressed={selected}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NOME */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Seu nome</label>
        <input
          type="text"
          id="name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1 block w-full rounded-xl border-white/10 bg-slate-800/80 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ex.: Ana Silva"
          required
        />
      </div>

      {/* WHATSAPP */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Seu WhatsApp</label>
        <input
          type="tel"
          id="phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(maskBR(e.target.value))}
          className="mt-1 block w-full rounded-xl border-white/10 bg-slate-800/80 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="+55 (11) 99999-0000"
          required
        />
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={submitting || !selectedSlot || !customerName || !customerPhone}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-900 border-r-transparent" />
            Agendando...
          </>
        ) : (
          "Agendar horário"
        )}
      </button>

      {/* MENSAGENS */}
      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-red-300">
          {error}
        </p>
      )}
      {result?.ok && (
        <div className="space-y-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <div className="font-semibold text-emerald-200">Agendamento registrado! Você receberá confirmação no WhatsApp.</div>
          {result.when && (
            <p>
              Horário: {new Date(result.when).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: result.timeZone,
              })}
            </p>
          )}
          {result.payment?.status === "pending" && (
            <div className="space-y-1">
              <p>
                Pagamento pendente: {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: result.payment.currency?.toUpperCase?.() ?? "BRL",
                }).format((result.payment.amountCents ?? 0) / 100)}
              </p>
              {result.payment.pixKey && <p>Chave Pix: {result.payment.pixKey}</p>}
              {result.payment.instructions && <p>{result.payment.instructions}</p>}
            </div>
          )}
          {result.ics && (
            <a
              href={result.ics}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
            >
              Adicionar ao calendário
            </a>
          )}
        </div>
      )}
    </form>
  );
}
