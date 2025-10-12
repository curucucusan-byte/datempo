"use client";

import { useState } from "react";
import { Copy, Check, Link as LinkIcon } from "lucide-react";

interface QuickLinksProps {
  slug: string;
  calendarName: string;
}

export default function QuickLinks({ slug, calendarName }: QuickLinksProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  // Usar URL do ambiente ou fallback
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://datempo.com";
  const baseLink = `${baseUrl}/agenda/${slug}`;
  
  const quickLinks = [
    { 
      label: "Esta Semana", 
      icon: "📅", 
      url: `${baseLink}?view=week`,
      description: "Próximos 7 dias"
    },
    { 
      label: "Este Mês", 
      icon: "📅", 
      url: `${baseLink}?view=month`,
      description: "Próximos 30 dias"
    },
    { 
      label: "Hoje", 
      icon: "📍", 
      url: `${baseLink}?view=today`,
      description: "Apenas hoje"
    },
    { 
      label: "Amanhã", 
      icon: "📍", 
      url: `${baseLink}?view=tomorrow`,
      description: "Apenas amanhã"
    },
    { 
      label: "Manhãs (semana)", 
      icon: "🌅", 
      url: `${baseLink}?view=week&shift=morning`,
      description: "08:00-12:00"
    },
    { 
      label: "Tardes (semana)", 
      icon: "🌆", 
      url: `${baseLink}?view=week&shift=afternoon`,
      description: "12:00-18:00"
    },
    { 
      label: "Noites (semana)", 
      icon: "🌙", 
      url: `${baseLink}?view=week&shift=evening`,
      description: "18:00-21:00"
    },
  ];
  
  const copyToClipboard = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
      // Fallback: criar textarea temporário
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };
  
  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <LinkIcon className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">
          Links Rápidos — {calendarName}
        </h3>
      </div>
      
      {/* Link Principal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          📋 Link Principal
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={baseLink}
            readOnly
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
          />
          <button
            onClick={() => copyToClipboard(baseLink, "principal")}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:shadow-md transition-all"
          >
            {copied === "principal" ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Links Pré-Configurados */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          ⚡ Links Personalizados
        </label>
        <div className="grid gap-2">
          {quickLinks.map((link) => (
            <div 
              key={link.label} 
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-white hover:border-emerald-300 transition-all group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {link.label}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {link.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(link.url, link.label)}
                className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 transition-all ml-2"
              >
                {copied === link.label ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="hidden sm:inline">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="hidden sm:inline">Copiar</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dica de Uso */}
      <div className="mt-6 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-200 p-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          💡 <strong className="text-emerald-800">Dica:</strong> Copie o link e envie direto no WhatsApp para facilitar o agendamento! Os links personalizados já filtram os horários automaticamente.
        </p>
      </div>
    </div>
  );
}
