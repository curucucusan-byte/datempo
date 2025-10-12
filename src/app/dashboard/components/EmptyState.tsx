// Dashboard Components - Empty States

import { Calendar, CheckCircle, Settings } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "calendar" | "check" | "settings";
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ title, description, icon = "calendar", action }: EmptyStateProps) {
  const icons = {
    calendar: Calendar,
    check: CheckCircle,
    settings: Settings,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-slate-100 p-4 mb-4">
        <Icon className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 max-w-md mb-6">{description}</p>
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
