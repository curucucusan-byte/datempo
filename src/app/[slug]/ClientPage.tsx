"use client";

import { useEffect, useMemo, useState } from "react";
import { maskBR, normalizeE164BR } from "@/lib/phone";

type Professional = {
  slug: string;
  name: string;
  phone: string;
  services: { name: string; minutes: number }[];
  workHours: Record<string, string[]>;
};

type CreateResp = {
  ok?: boolean;
  error?: string;
  id?: string;
  when?: string;
  minutes?: number;
  ics?: string; // link para baixar/abrir calendário
};

type AvResp = {
  ok?: boolean;
  error?: string;
  date?: string;
  slotMinutes?: number;
  free?: string[];
  taken?: { start: string; end: string }[];
};

type ClientPageProps = {
  slug: string;
};

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeForInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function combineLocalDateTime(date: string, time: string) {
  if (!date || !time) return null;
  return `${date}T${time}`;
}

export default function ClientPage({ slug }: ClientPageProps) {
  // dados do profissional
  const [prof, setProf] = useState<Professional | null>(null);

  // form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+55");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // estados auxiliares
  const [res, setRes] = useState<CreateResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // disponibilidade
  const [av, setAv] = useState<AvResp | null>(null);
  const [avLoading, setAvLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const minDate = useMemo(() => formatDateForInput(new Date()), []);

  // carrega profissional
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/professional?slug=${encodeURIComponent(slug)}`);
        const j = (await r.json()) as { ok?: boolean; professional?: Professional; error?: string };
        if (!cancelled && j.ok && j.professional) {
          setProf(j.professional);
          // define serviço padrão
          const first = j.professional.services?.[0]?.name ?? "";
          setService((s) => (s ? s : first));
          setDate((current) => (current ? current : formatDateForInput(new Date())));
        }
      } catch {
        // silencioso
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!prof?.services?.length) return;
    const currentExists = prof.services.some((s) => s.name === service);
    if (!currentExists) {
      setService(prof.services[0]!.name);
    }
  }, [prof, service]);

  // enviar agendamento
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const trimmedName = customerName.trim();
    if (trimmedName.length < 3) {
      errors.customerName = "Informe seu nome completo.";
    }

    const normalizedPhone = normalizeE164BR(customerPhone);
    if (!normalizedPhone) {
      errors.customerPhone = "WhatsApp inválido. Use +55DDDNÚMERO.";
    }

    if (!service) {
      errors.service = "Selecione um serviço.";
    }

    if (!date) {
      errors.date = "Escolha a data.";
    }

    if (!time) {
      errors.time = "Informe o horário.";
    }

    const localDateTime = combineLocalDateTime(date, time);
    if (localDateTime) {
      const selected = new Date(localDateTime);
      if (Number.isNaN(selected.getTime())) {
        errors.time = "Horário inválido.";
      } else if (selected.getTime() < Date.now()) {
        errors.time = "Escolha um horário no futuro.";
      }
    }

    if (Object.keys(errors).length > 0 || !localDateTime || !normalizedPhone) {
      setFieldErrors(errors);
      setRes({ error: "Corrija os campos destacados." });
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setRes(null);
    try {
      const r = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          customerName: trimmedName,
          customerPhone: normalizedPhone,
          service,
          datetime: localDateTime,
        }),
      });
      const j = (await r.json()) as CreateResp;
      if (!r.ok) throw new Error(j.error || "Falha no agendamento");
      setRes(j);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao agendar";
      setRes({ error: message });
    } finally {
      setLoading(false);
    }
  }

  // carrega disponibilidade do dia atual do input
  async function loadAvailability() {
    if (!date) {
      setAvailabilityError("Escolha a data para ver os horários.");
      return;
    }
    setAvLoading(true);
    setAvailabilityError(null);
    setAv(null);
    try {
      const qs = new URLSearchParams({ slug, date });
      if (service) qs.set("service", service);
      const r = await fetch(`/api/availability?${qs.toString()}`);
      const j = (await r.json()) as AvResp;
      if (!r.ok || !j.ok) {
        setAvailabilityError(j.error || "Não foi possível carregar a disponibilidade.");
        return;
      }
      setAv(j);
    } catch {
      setAvailabilityError("Não foi possível carregar a disponibilidade.");
    } finally {
      setAvLoading(false);
    }
  }

  // duração exibida do serviço selecionado
  const selMinutes =
    prof?.services?.find((s) => s.name === service)?.minutes ??
    (prof?.services?.[0]?.minutes ?? 30);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="mx-auto max-w-5xl px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {prof?.name ? `ZapAgenda — ${prof.name}` : "Carregando profissional..."}
        </h1>
        <p className="text-slate-300 mt-1">Agendamentos rápidos confirmados pelo WhatsApp em poucos cliques.</p>
        <div className="mt-2 text-xs text-emerald-300">
          Integrado ao Google Agenda — horários sempre atualizados e sem conflitos.
        </div>
        <ul className="mt-2 text-xs text-slate-400 list-disc pl-5 space-y-1">
          <li>Disponibilidade em tempo real direto do calendário do profissional.</li>
          <li>Evita overbooking: respeita compromissos já existentes no Google.</li>
          <li>Confirmações e lembretes por WhatsApp para reduzir faltas.</li>
        </ul>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 grid lg:grid-cols-2 gap-8">
        {/* FORMULÁRIO */}
        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Seu nome</label>
            <input
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setFieldErrors((prev) => {
                  if (!prev.customerName) return prev;
                  const next = { ...prev };
                  delete next.customerName;
                  return next;
                });
              }}
              required
              aria-invalid={Boolean(fieldErrors.customerName)}
              aria-describedby={fieldErrors.customerName ? "customer-name-error" : undefined}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-400"
            />
            {fieldErrors.customerName && (
              <p id="customer-name-error" className="text-xs text-red-300 mt-1">
                {fieldErrors.customerName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Seu WhatsApp (com +55)</label>
            <input
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                setFieldErrors((prev) => {
                  if (!prev.customerPhone) return prev;
                  const next = { ...prev };
                  delete next.customerPhone;
                  return next;
                });
              }}
              onBlur={(e) => {
                setCustomerPhone(maskBR(e.target.value));
                setFieldErrors((prev) => {
                  if (!prev.customerPhone) return prev;
                  const next = { ...prev };
                  delete next.customerPhone;
                  return next;
                });
              }}
              required
              inputMode="tel"
              aria-invalid={Boolean(fieldErrors.customerPhone)}
              aria-describedby={fieldErrors.customerPhone ? "customer-phone-error" : undefined}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-400 mt-1">Formato: +55DDDNÚMERO (ex.: +5553999999999)</p>
            {fieldErrors.customerPhone && (
              <p id="customer-phone-error" className="text-xs text-red-300 mt-1">
                {fieldErrors.customerPhone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Serviço</label>
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setAv(null);
                setAvailabilityError(null);
                setFieldErrors((prev) => {
                  if (!prev.service) return prev;
                  const next = { ...prev };
                  delete next.service;
                  return next;
                });
              }}
              required
              aria-invalid={Boolean(fieldErrors.service)}
              aria-describedby={fieldErrors.service ? "service-error" : undefined}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-white/10"
            >
              {prof?.services?.length ? (
                prof.services.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Serviços indisponíveis no momento
                </option>
              )}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Duração: {selMinutes} min
            </p>
            {fieldErrors.service && (
              <p id="service-error" className="text-xs text-red-300 mt-1">
                {fieldErrors.service}
              </p>
            )}
          </div>

          <div>
            <span className="block text-sm text-slate-300 mb-1">Data e hora</span>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1" htmlFor="date-input">
                  Data
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setAvailabilityError(null);
                    setFieldErrors((prev) => {
                      if (!prev.date) return prev;
                      const next = { ...prev };
                      delete next.date;
                      return next;
                    });
                  }}
                  min={minDate}
                  required
                  aria-invalid={Boolean(fieldErrors.date)}
                  aria-describedby={fieldErrors.date ? "date-error" : undefined}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-white/10"
                />
                {fieldErrors.date && (
                  <p id="date-error" className="text-xs text-red-300 mt-1">
                    {fieldErrors.date}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1" htmlFor="time-input">
                  Horário
                </label>
                <input
                  id="time-input"
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setAvailabilityError(null);
                    setFieldErrors((prev) => {
                      if (!prev.time) return prev;
                      const next = { ...prev };
                      delete next.time;
                      return next;
                    });
                  }}
                  step={300}
                  required
                  aria-invalid={Boolean(fieldErrors.time)}
                  aria-describedby={fieldErrors.time ? "time-error" : undefined}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-white/10"
                />
                {fieldErrors.time && (
                  <p id="time-error" className="text-xs text-red-300 mt-1">
                    {fieldErrors.time}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={loadAvailability}
                className="rounded-xl bg-white/10 px-3 py-2 text-xs font-medium ring-1 ring-white/15 hover:bg-white/15"
              >
                Ver ocupados / livres do dia
              </button>
              {avLoading && (
                <span className="text-xs text-slate-400 self-center">
                  Carregando…
                </span>
              )}
            </div>
            {availabilityError && (
              <p className="text-xs text-red-300 mt-1">{availabilityError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 text-slate-950 px-4 py-3 text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "Agendando..." : "Agendar e receber no WhatsApp"}
          </button>

          {res?.error && (
            <p className="text-sm text-red-300">{res.error}</p>
          )}
        </form>

        {/* PAINEL DE CONFIRMAÇÃO */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Confirmação</h2>

          {!res?.ok && (
            <>
              <p className="text-slate-300 mt-2">
                Os detalhes do agendamento aparecerão aqui quando você confirmar.
              </p>

              {av?.ok && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold">
                    Disponibilidade do dia {av.date}{" "}
                    {typeof av.slotMinutes === "number"
                      ? `(slots de ${av.slotMinutes} min)`
                      : ""}
                  </h3>
                  <div className="mt-3 grid sm:grid-cols-2 gap-2">
                    {(av.free || []).map((iso) => (
                      <button
                        key={iso}
                        onClick={() => {
                          const local = new Date(iso);
                          setDate(formatDateForInput(local));
                          setTime(formatTimeForInput(local));
                          setFieldErrors((prev) => {
                            if (!prev.date && !prev.time) return prev;
                            const next = { ...prev };
                            delete next.date;
                            delete next.time;
                            return next;
                          });
                          setAvailabilityError(null);
                        }}
                        className="rounded-lg bg-white/5 px-3 py-2 text-xs ring-1 ring-white/10 hover:bg-white/10"
                      >
                        {new Date(iso).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    ))}
                  </div>
                  {(av.taken?.length || 0) > 0 && (
                    <p className="text-xs text-slate-400 mt-3">
                      Ocupados:{" "}
                      {(av.taken || [])
                        .map((t) =>
                          new Date(t.start).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {res?.ok && (
            <div className="mt-4 space-y-3">
              {res.when && (
                <p className="text-slate-300">
                  Data/Hora confirmada:{" "}
                  <span className="font-medium">
                    {new Date(res.when).toLocaleString("pt-BR")}
                  </span>
                </p>
              )}

              {typeof res.minutes === "number" && (
                <p className="text-slate-300">
                  Duração prevista: <span className="font-medium">{res.minutes} min</span>
                </p>
              )}

              {res.ics && (
                <a
                  href={res.ics}
                  className="inline-block mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
                >
                  Adicionar ao calendário (.ics)
                </a>
              )}

              <p className="text-xs text-slate-400">
                Você também recebeu os dados no WhatsApp. Lembretes automáticos chegam antes do compromisso se o
                profissional habilitou o recurso.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
