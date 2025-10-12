// Dashboard Components - Quick Actions

import { Calendar, Link2, Settings, Zap } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  icon: "calendar" | "link" | "settings" | "zap";
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

const iconMap = {
  calendar: Calendar,
  link: Link2,
  settings: Settings,
  zap: Zap,
};

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action, index) => {
        const Icon = iconMap[action.icon];
        const content = (
          <>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-100 p-3">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
              <svg
                className="h-5 w-5 text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </>
        );

        if (action.href) {
          return (
            <Link
              key={index}
              href={action.href}
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={index}
            onClick={action.onClick}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group text-left w-full"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
