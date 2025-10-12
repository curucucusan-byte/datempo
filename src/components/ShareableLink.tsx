"use client";

import { useState } from "react";
import { Copy, Check, QrCode, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareableLinkProps {
  shortcode: string;
  token?: string | null;
  calendarName?: string;
}

export function ShareableLink({ shortcode, token, calendarName }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Funções auxiliares (inline para evitar dependência externa por enquanto)
  const formatShortcode = (code: string): string => {
    const half = Math.floor(code.length / 2);
    return `${code.slice(0, half)}-${code.slice(half)}`;
  };

  const getShareableLink = (code: string, tkn?: string | null): string => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://zap-agenda.onrender.com";
    return tkn ? `${baseUrl}/agenda/${code}/${tkn}` : `${baseUrl}/agenda/${code}`;
  };

  const getQRCodeUrl = (code: string, tkn?: string | null): string => {
    const link = getShareableLink(code, tkn);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
  };

  const link = getShareableLink(shortcode, token);
  const formattedCode = formatShortcode(shortcode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: calendarName ? `Agende com ${calendarName}` : "Minha Agenda",
          text: "Clique aqui para agendar um horário:",
          url: link,
        });
        toast.success("Link compartilhado!");
      } catch (error) {
        // Usuário cancelou o compartilhamento
      }
    } else {
      // Fallback: copiar para clipboard
      handleCopy();
    }
  };

  const handleOpenPreview = () => {
    window.open(link, "_blank");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Link de Compartilhamento</h3>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          {showQR ? "Esconder" : "QR Code"}
        </button>
      </div>

      {/* Link Completo com Ações */}
      <div className="space-y-3">
        {/* Input + Botões */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={link}
            readOnly
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            {copied ? (
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

        {/* Botões Secundários */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenPreview}
            className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Visualizar
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          )}
        </div>

        {/* Código Curto */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Código curto:{" "}
            <span className="font-mono font-semibold text-gray-900">{formattedCode}</span>
          </div>
          {token && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              🔒 Protegido por senha
            </div>
          )}
        </div>
      </div>

      {/* QR Code (Toggle) */}
      {showQR && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <img
              src={getQRCodeUrl(shortcode, token)}
              alt="QR Code para agenda"
              className="mx-auto w-56 h-56 rounded-lg shadow-md"
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-900">Escaneie para acessar</p>
              <p className="text-xs text-gray-500">
                {calendarName ? `Agenda de ${calendarName}` : "Sua agenda de agendamentos"}
              </p>
            </div>

            {/* Botão de Download QR */}
            <a
              href={getQRCodeUrl(shortcode, token)}
              download={`qrcode-${shortcode}.png`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Baixar QR Code
            </a>
          </div>
        </div>
      )}

      {/* Dicas de Uso */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
            💡 Como compartilhar este link
          </summary>
          <ul className="mt-3 space-y-2 text-gray-600 pl-5 list-disc">
            <li>Copie e cole no WhatsApp, Instagram, email ou SMS</li>
            <li>Adicione em sua bio do Instagram ou outras redes sociais</li>
            <li>Imprima o QR Code em cartões de visita ou panfletos</li>
            <li>Compartilhe diretamente usando o botão "Compartilhar" (mobile)</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
