"use client";

import { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: string;
  slug: string;
  customerName: string;
  customerPhone: string;
  service: string;
  startISO: string;
  endISO: string;
  ownerUid?: string | null;
  createdAt: string;
  reminderSentAt?: string | null;
};

type ApiResponse = {
  ok: boolean;
  count?: number;
  appointments?: Appointment[];
  error?: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugFilter, setSlugFilter] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (slugFilter) params.set("slug", slugFilter);
        if (since) params.set("since", since);
        if (until) params.set("until", until);
        const url = params.toString() ? `/api/appointments?${params.toString()}` : "/api/appointments";
        const resp = await fetch(url, { cache: "no-store" });
        const data = (await resp.json()) as ApiResponse;
        if (!resp.ok || !data.ok || !data.appointments) {
          throw new Error(data.error || `Erro ${resp.status}`);
        }
        setAppointments(data.appointments);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Falha ao carregar agendamentos.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
  }, [slugFilter, since, until]);

  useEffect(() => {
    void load();
  }, [load]);

  const slugOptions = useMemo(() => {
    const set = new Set(appointments.map((apt) => apt.slug));
    return Array.from(set.values()).sort();
  }, [appointments]);

  const serviceOptions = useMemo(() => {
    const set = new Set(appointments.map((apt) => apt.service));
    return Array.from(set.values()).sort();
  }, [appointments]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return appointments.filter((apt) => {
      if (serviceFilter && apt.service !== serviceFilter) return false;
      if (term) {
        const haystack = `${apt.customerName} ${apt.customerPhone}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [appointments, serviceFilter, searchTerm]);

  const resetFilters = () => {
    setSlugFilter("");
    setSince("");
    setUntil("");
    setServiceFilter("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1" htmlFor="slug-filter">
            Profissional
          </label>
          <select
            id="slug-filter"
            value={slugFilter}
            onChange={(e) => setSlugFilter(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10"
          >
            <option value="">Todos</option>
            {slugOptions.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1" htmlFor="service-filter">
            Serviço
          </label>
          <select
            id="service-filter"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10"
          >
            <option value="">Todos</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1" htmlFor="since-filter">
            Desde
          </label>
          <input
            id="since-filter"
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1" htmlFor="until-filter">
            Até
          </label>
          <input
            id="until-filter"
            type="date"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-slate-300 mb-1" htmlFor="search-filter">
            Buscar cliente / telefone
          </label>
          <input
            id="search-filter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ex.: Maria"
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Carregando..." : "Atualizar"}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15"
          >
            Limpar
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
            <tr>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Profissional</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Serviço</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3">Lembrete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((apt) => (
                <tr key={apt.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-slate-200">{formatDate(apt.startISO)}</td>
                  <td className="px-4 py-3 text-slate-300">{apt.slug}</td>
                  <td className="px-4 py-3 text-slate-200">{apt.customerName}</td>
                  <td className="px-4 py-3 text-slate-300">{apt.service}</td>
                  <td className="px-4 py-3 text-slate-300">{apt.customerPhone}</td>
                  <td className="px-4 py-3 text-slate-300">{formatDate(apt.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {apt.reminderSentAt ? `Enviado ${formatDate(apt.reminderSentAt)}` : "Pendente"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
