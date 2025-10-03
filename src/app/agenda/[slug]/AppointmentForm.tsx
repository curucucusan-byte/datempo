// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/agenda/[slug]/AppointmentForm.tsx

"use client";

import { useState, useEffect } from "react";

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
};

export default function AppointmentForm({ slug }: { slug: string }) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AppointmentResponse | null>(null);
  const [slotMinutes, setSlotMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      setAvailableSlots([]);
      setSelectedSlot("");
      try {
        const res = await fetch(`/api/availability?slug=${slug}&date=${selectedDate}`);
        const data: AvailabilityResponse = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Erro ao carregar horários.");
        }
        setAvailableSlots(data.free);
        setSlotMinutes(data.slotMinutes ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar disponibilidade.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!selectedDate || !selectedSlot || !customerName || !customerPhone) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-300">Data:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          required
        />
      </div>

      {selectedDate && (
        <div>
          <label htmlFor="slot" className="block text-sm font-medium text-slate-300">Horário:</label>
          <select
            id="slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            required
            disabled={loading || availableSlots.length === 0}
          >
            <option value="">Selecione um horário</option>
            {loading ? (
              <option value="" disabled>Carregando horários...</option>
            ) : availableSlots.length === 0 ? (
              <option value="" disabled>Nenhum horário disponível para esta data.</option>
            ) : (
              availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {new Date(slot).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Seu Nome:</label>
        <input
          type="text"
          id="name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Seu WhatsApp (com DDD, ex: +5511987654321):</label>
        <input
          type="tel"
          id="phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !selectedSlot || !customerName || !customerPhone}
        className="w-full rounded-md bg-emerald-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Agendando..." : "Agendar Horário"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {result?.ok && (
        <div className="space-y-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-xs text-emerald-100">
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
          {result.payment?.status === "pending" ? (
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
          ) : null}
        </div>
      )}
    </form>
  );
}
