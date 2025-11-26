"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

type WorkHoursData = Record<DayOfWeek, string[]>;

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "monday", label: "Segunda-feira", short: "Seg" },
  { key: "tuesday", label: "Terça-feira", short: "Ter" },
  { key: "wednesday", label: "Quarta-feira", short: "Qua" },
  { key: "thursday", label: "Quinta-feira", short: "Qui" },
  { key: "friday", label: "Sexta-feira", short: "Sex" },
  { key: "saturday", label: "Sábado", short: "Sáb" },
  { key: "sunday", label: "Domingo", short: "Dom" },
];

const TEMPLATES: { name: string; data: WorkHoursData }[] = [
  {
    name: "Comercial (Seg-Sex 9-18h)",
    data: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      friday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      saturday: [],
      sunday: [],
    },
  },
  {
    name: "Flexível (Seg-Sáb 8-20h)",
    data: {
      monday: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
      tuesday: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
      wednesday: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
      thursday: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
      friday: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
      saturday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      sunday: [],
    },
  },
  {
    name: "Tarde/Noite (Ter-Sáb 14-21h)",
    data: {
      monday: [],
      tuesday: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
      wednesday: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
      thursday: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
      friday: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
      saturday: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
      sunday: [],
    },
  },
];

interface WorkHoursSelectorProps {
  value: WorkHoursData;
  onChange: (value: WorkHoursData) => void;
  className?: string;
}

export function WorkHoursSelector({ value, onChange, className = "" }: WorkHoursSelectorProps) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [simpleStart, setSimpleStart] = useState("09:00");
  const [simpleEnd, setSimpleEnd] = useState("18:00");
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(
    new Set<DayOfWeek>(["monday", "tuesday", "wednesday", "thursday", "friday"])
  );

  const applyTemplate = (template: WorkHoursData) => {
    onChange(template);
  };

  const applySimple = () => {
    const hours: string[] = [];
    const [startHour] = simpleStart.split(":").map(Number);
    const [endHour] = simpleEnd.split(":").map(Number);

    for (let h = startHour; h < endHour; h++) {
      hours.push(`${String(h).padStart(2, "0")}:00`);
    }

    const newData: WorkHoursData = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    selectedDays.forEach((day) => {
      newData[day] = hours;
    });

    onChange(newData);
  };

  const toggleDay = (day: DayOfWeek) => {
    const newSet = new Set(selectedDays);
    if (newSet.has(day)) {
      newSet.delete(day);
    } else {
      newSet.add(day);
    }
    setSelectedDays(newSet);
  };

  const getDaySummary = (day: DayOfWeek) => {
    const hours = value[day] || [];
    if (hours.length === 0) return "Fechado";
    const first = hours[0];
    const last = hours[hours.length - 1];
    return `${first} - ${last}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("simple")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "simple"
              ? "bg-emerald-600 text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          Modo Simples
        </button>
        <button
          type="button"
          onClick={() => setMode("advanced")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "advanced"
              ? "bg-emerald-600 text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          Modo Avançado (JSON)
        </button>
      </div>

      {mode === "simple" ? (
        <div className="space-y-4">
          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Templates Rápidos
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => applyTemplate(template.data)}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dias de Trabalho
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleDay(day.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedDays.has(day.key)
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Horário Início
              </label>
              <input
                type="time"
                value={simpleStart}
                onChange={(e) => setSimpleStart(e.target.value)}
                className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Horário Fim
              </label>
              <input
                type="time"
                value={simpleEnd}
                onChange={(e) => setSimpleEnd(e.target.value)}
                className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={applySimple}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            Aplicar Horários
          </button>

          {/* Current Schedule Preview */}
          <div className="rounded-lg bg-white/5 p-4 space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
              Horários Atuais
            </p>
            {DAYS.map((day) => (
              <div key={day.key} className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">{day.label}</span>
                <span className="text-slate-400">{getDaySummary(day.key)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            JSON Completo (Avançado)
          </label>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(parsed);
              } catch {
                // Ignore invalid JSON during typing
              }
            }}
            rows={12}
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs font-mono ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            spellCheck={false}
          />
          <p className="mt-2 text-xs text-slate-400">
            Formato: {`{"monday": ["09:00", "10:00"], "tuesday": []}`}
          </p>
        </div>
      )}
    </div>
  );
}
