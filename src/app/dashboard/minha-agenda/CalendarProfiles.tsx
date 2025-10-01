"use client";

import { useEffect, useMemo, useState } from "react";

type Calendar = { id: string; summary: string };

type Professional = {
  slug: string;
  name: string;
  description?: string;
  phone?: string;
  calendarId?: string;
  services?: { name: string; minutes: number }[];
};

type Props = {
  calendars: Calendar[];
  profiles: Professional[];
  readOnly?: boolean;
};

type Form = {
  slug?: string; // gerado automaticamente no create
  name: string;
  description: string;
  phone: string;
  existing: boolean; // já existe perfil salvo
  services: { id: string; name: string; minutes: number | "" }[];
};

function createId() {
  if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function servicesFromProfessional(prof?: { services?: { name: string; minutes: number }[] }) {
  const list = prof?.services ?? [];
  if (!list.length) {
    return [{ id: createId(), name: "Consulta", minutes: 60 }];
  }
  return list.map((s) => ({ id: createId(), name: s.name, minutes: s.minutes }));
}

export default function CalendarProfiles({ calendars, profiles, readOnly }: Props) {
  const initial = useMemo(() => {
    const map: Record<string, Form> = {};
    for (const cal of calendars) {
      const prof = profiles.find((p) => p.calendarId === cal.id);
      if (prof) {
        map[cal.id] = {
          slug: prof.slug,
          name: prof.name,
          description: prof.description ?? "",
          phone: prof.phone ?? "",
          existing: true,
          services: servicesFromProfessional(prof),
        };
      } else {
        map[cal.id] = {
          name: cal.summary,
          description: "",
          phone: "",
          existing: false,
          services: servicesFromProfessional(undefined),
        };
      }
    }
    return map;
  }, [calendars, profiles]);

  const [forms, setForms] = useState<Record<string, Form>>(initial);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setForms(initial);
  }, [initial]);

  function toServicePayload(list: { name: string; minutes: number | "" }[]) {
    return list
      .map((s) => ({ name: s.name.trim(), minutes: typeof s.minutes === "number" ? s.minutes : Number(s.minutes) }))
      .filter((s) => s.name && Number.isFinite(s.minutes) && s.minutes > 0)
      .map((s) => ({ name: s.name, minutes: Math.round(s.minutes) }));
  }

  async function save(calId: string) {
    if (readOnly) return;
    const f = forms[calId];
    if (!f) return;
    setSavingId(calId);
    setStatus(null);
    try {
      const services = toServicePayload(f.services);
      if (services.length === 0) {
        throw new Error("Informe ao menos 1 serviço com duração.");
      }
      if (f.existing && f.slug) {
        const r = await fetch(`/api/professional?slug=${encodeURIComponent(f.slug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: f.name, description: f.description, phone: f.phone, calendarId: calId, services }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j?.error || `Erro ${r.status}`);
      } else {
        const r = await fetch(`/api/professionals/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: f.name, description: f.description, phone: f.phone, calendarId: calId, services }),
        });
        const j = (await r.json().catch(() => ({}))) as { professional?: { slug?: string } };
        if (!r.ok) throw new Error(j?.error || `Erro ${r.status}`);
        // Marca como existente
        setForms((prev) => ({ ...prev, [calId]: { ...prev[calId], existing: true, slug: j?.professional?.slug } }));
      }
      setStatus("Perfil salvo.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSavingId(null);
    }
  }

  function updateService(calId: string, sid: string, field: "name" | "minutes", value: string) {
    setForms((prev) => {
      const f = prev[calId];
      if (!f) return prev;
      const next = f.services.map((s) => {
        if (s.id !== sid) return s;
        if (field === "minutes") {
          const numeric = value === "" ? "" : Number(value);
          return { ...s, minutes: Number.isFinite(numeric) ? numeric : "" };
        }
        return { ...s, name: value };
      });
      return { ...prev, [calId]: { ...f, services: next } };
    });
  }

  function addService(calId: string) {
    setForms((prev) => {
      const f = prev[calId];
      if (!f) return prev;
      const next = [...f.services, { id: createId(), name: "", minutes: 60 }];
      return { ...prev, [calId]: { ...f, services: next } };
    });
  }

  function removeService(calId: string, sid: string) {
    setForms((prev) => {
      const f = prev[calId];
      if (!f) return prev;
      const next = f.services.filter((s) => s.id !== sid);
      return { ...prev, [calId]: { ...f, services: next.length ? next : [{ id: createId(), name: "", minutes: 60 }] } };
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Perfis públicos por calendário</h2>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        Para cada calendário vinculado, defina um perfil público com nome, descrição e WhatsApp. O link público usa o slug.
      </p>

      {calendars.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Nenhum calendário Google vinculado ainda.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {calendars.map((cal) => {
            const f = forms[cal.id];
            return (
              <div key={cal.id} className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-400">Calendário</div>
                    <div className="text-slate-200 font-medium">{cal.summary}</div>
                    <div className="text-xs text-slate-400">{cal.id}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => save(cal.id)}
                    disabled={readOnly || savingId === cal.id}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {savingId === cal.id ? "Salvando..." : "Salvar"}
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-slate-300 mb-1">Nome para exibir</label>
                  <input
                    value={f?.name ?? ""}
                    onChange={(e) => setForms((prev) => ({ ...prev, [cal.id]: { ...prev[cal.id], name: e.target.value } }))}
                    className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                    disabled={readOnly}
                  />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">WhatsApp</label>
                    <input
                      value={f?.phone ?? ""}
                      onChange={(e) => setForms((prev) => ({ ...prev, [cal.id]: { ...prev[cal.id], phone: e.target.value } }))}
                      placeholder="+55DDDNUMERO"
                      className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                      disabled={readOnly}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Descrição</label>
                    <input
                      value={f?.description ?? ""}
                      onChange={(e) => setForms((prev) => ({ ...prev, [cal.id]: { ...prev[cal.id], description: e.target.value } }))}
                      className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                      disabled={readOnly}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300">Serviços oferecidos</label>
                    <button
                      type="button"
                      onClick={() => addService(cal.id)}
                      className="text-xs text-emerald-300 hover:text-emerald-200"
                      disabled={readOnly}
                    >
                      + adicionar serviço
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {f.services.map((s) => (
                      <div key={s.id} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                        <input
                          value={s.name}
                          onChange={(e) => updateService(cal.id, s.id, "name", e.target.value)}
                          placeholder="Nome do serviço"
                          className="rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                          disabled={readOnly}
                        />
                        <input
                          value={s.minutes}
                          onChange={(e) => updateService(cal.id, s.id, "minutes", e.target.value)}
                          placeholder="Minutos"
                          inputMode="numeric"
                          className="rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15"
                          disabled={readOnly}
                        />
                        <button
                          type="button"
                          onClick={() => removeService(cal.id, s.id)}
                          className="rounded-xl bg-red-500/20 px-3 py-2 text-xs text-red-200 hover:bg-red-500/30"
                          disabled={readOnly}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {f?.existing && f.slug && (
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                    <span>Link público:</span>
                    <code className="rounded bg-white/10 px-2 py-1">/{f.slug}</code>
                    <button
                      type="button"
                      className="rounded bg-white/10 px-2 py-1 hover:bg-white/15"
                      onClick={() => {
                        try {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const url = origin ? `${origin}/${f.slug}` : `/${f.slug}`;
                          navigator.clipboard?.writeText(url);
                        } catch {}
                      }}
                    >
                      Copiar
                    </button>
                    <a
                      href={`/${f.slug}`}
                      target="_blank"
                      className="rounded bg-white/10 px-2 py-1 hover:bg-white/15"
                    >
                      Abrir
                    </a>
                    <button
                      type="button"
                      className="rounded bg-white/10 px-2 py-1 hover:bg-white/15"
                      onClick={() => {
                        try {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const url = origin ? `${origin}/${f.slug}` : `/${f.slug}`;
                          if (typeof navigator !== 'undefined' && (navigator as any).share) {
                            (navigator as any).share({ title: f.name || 'ZapAgenda', url });
                          } else {
                            navigator.clipboard?.writeText(url);
                          }
                        } catch {}
                      }}
                    >
                      Compartilhar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {status && <p className="mt-3 text-sm text-slate-300">{status}</p>}
    </div>
  );
}
