// Dashboard Components - Metric Cards

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: "emerald" | "blue" | "amber" | "purple";
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs. mês passado",
  color = "emerald",
}: MetricCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-sm font-medium mt-2 ${
                trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-600" : "text-slate-600"
              }`}
            >
              {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}% {trendLabel}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
