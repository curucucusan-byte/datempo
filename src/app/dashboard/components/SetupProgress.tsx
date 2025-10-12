// Dashboard Components - Setup Progress

"use client";

import { CheckCircle2, Circle } from "lucide-react";

export interface SetupStep {
  id: string;
  label: string;
  done: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface SetupProgressProps {
  steps: SetupStep[];
}

export function SetupProgress({ steps }: SetupProgressProps) {
  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const percentage = (completed / total) * 100;

  if (completed === total) {
    return null; // Não mostra quando tudo está completo
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-emerald-900">Configure sua conta</h3>
        <span className="text-sm font-medium text-emerald-700">
          {completed}/{total} completo
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-emerald-100 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            {step.done ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <Circle className="h-6 w-6 text-slate-300 flex-shrink-0" />
            )}
            <span
              className={
                step.done
                  ? "text-slate-600 line-through flex-1"
                  : "text-slate-900 font-medium flex-1"
              }
            >
              {step.label}
            </span>
            {!step.done && step.action && (
              <button
                onClick={step.action.onClick}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline transition-colors"
              >
                {step.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
