// Loading Components - DaTempo Style
// Componentes de carregamento com identidade visual nostálgica e acolhedora

import React from 'react';

/**
 * Page Loader - Loading de página inteira
 * Relógio vintage animado com mensagens acolhedoras
 */
export function PageLoader({ 
  message = "Só um instantinho, dá tempo! ☕" 
}: { 
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Relógio vintage animado */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Círculo externo do relógio */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#D4C4A8" 
              strokeWidth="2"
            />
            
            {/* Marcadores das horas (12, 3, 6, 9) */}
            <circle cx="50" cy="10" r="2" fill="#9C8D7E" />
            <circle cx="90" cy="50" r="2" fill="#9C8D7E" />
            <circle cx="50" cy="90" r="2" fill="#9C8D7E" />
            <circle cx="10" cy="50" r="2" fill="#9C8D7E" />
            
            {/* Ponteiro das horas (fixo) */}
            <line 
              x1="50" 
              y1="50" 
              x2="50" 
              y2="30" 
              stroke="#8B6F47" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            
            {/* Ponteiro dos minutos (rotação lenta) */}
            <line 
              x1="50" 
              y1="50" 
              x2="50" 
              y2="18" 
              stroke="#B8956A" 
              strokeWidth="2" 
              strokeLinecap="round"
              className="origin-center animate-spin"
              style={{ 
                transformOrigin: '50px 50px',
                animationDuration: '3s',
                animationTimingFunction: 'linear'
              }}
            />
            
            {/* Centro do relógio */}
            <circle cx="50" cy="50" r="4" fill="#8B6F47"/>
          </svg>
        </div>
        
        {/* Mensagem acolhedora */}
        <div>
          <p className="font-serif text-xl font-semibold text-[#8B6F47]">
            {message}
          </p>
        </div>
        
        {/* Pontinhos animados (estilo retrô) */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#B8956A]"
              style={{
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton - Componente base para loading states
 * Textura de papel com pulsação suave
 */
export function Skeleton({ 
  className = "", 
  variant = "default" 
}: { 
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
}) {
  const baseClasses = "animate-pulse-slow bg-[#EDE5D8] rounded";
  
  const variantClasses = {
    default: "h-4 w-full",
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

/**
 * Card Skeleton - Loading de cards
 */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/**
 * List Skeleton - Loading de listas
 */
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="flex items-start gap-4 p-4 rounded-lg border border-[#EDE5D8] bg-[#FDFBF7]"
        >
          <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Button Spinner - Spinner para botões
 */
export function ButtonSpinner({ size = "sm" }: { size?: "xs" | "sm" | "md" }) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };
  
  return (
    <svg 
      className={`${sizeClasses[size]} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="3"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Table Skeleton - Loading de tabelas
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-[#EDE5D8]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-5 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Metric Card Skeleton - Loading de cards de métricas
 */
export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton variant="circular" className="w-12 h-12" />
      </div>
    </div>
  );
}

/**
 * Appointment List Skeleton - Loading de lista de agendamentos
 */
export function AppointmentListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
