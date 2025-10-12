// Empty States - DaTempo Style
// Estados vazios com tom acolhedor e nostálgico

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Empty State - Componente base para estados vazios
 */
export function EmptyState({
  icon = "☕",
  title = "Nada por aqui ainda",
  description = "Tudo tranquilo. Quando quiser, é só começar.",
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-6xl mb-4 animate-bounce-slow">{icon}</div>
      <h3 className="font-serif text-2xl font-semibold text-[#8B6F47] mb-2">
        {title}
      </h3>
      <p className="text-[#9C8D7E] mb-6 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * No Appointments - Nenhum agendamento
 */
export function NoAppointments() {
  return (
    <EmptyState
      icon="📅"
      title="Nenhum agendamento ainda"
      description="Assim que alguém marcar horário com você, vai aparecer aqui. Por enquanto, tudo livre!"
      action={
        <Link 
          href="/dashboard/minha-agenda" 
          className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#B8956A] font-medium transition-colors"
        >
          Configurar minha agenda 
          <span>→</span>
        </Link>
      }
    />
  );
}

/**
 * No Calendars - Nenhum calendário conectado
 */
export function NoCalendars() {
  return (
    <EmptyState
      icon="🗓️"
      title="Nenhum calendário conectado"
      description="Conecte seu Google Calendar para começar a receber agendamentos. É rápido e seguro."
      action={
        <form action="/api/google/oauth/start" method="get">
          <button 
            type="submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-br from-[#8B6F47] to-[#B8956A] text-[#FDFBF7] font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Conectar Google Calendar
          </button>
        </form>
      }
    />
  );
}

/**
 * No Results - Nenhum resultado encontrado
 */
export function NoResults({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon="🔍"
      title="Nenhum resultado encontrado"
      description={
        searchTerm 
          ? `Não encontramos nada para "${searchTerm}". Que tal tentar outras palavras?`
          : "Não encontramos nada com esses filtros. Que tal ajustar sua busca?"
      }
    />
  );
}

/**
 * No Services - Nenhum serviço cadastrado
 */
export function NoServices() {
  return (
    <EmptyState
      icon="✂️"
      title="Nenhum serviço cadastrado"
      description="Cadastre seus serviços para que os clientes saibam o que você oferece e quanto tempo dura cada atendimento."
      action={
        <button className="px-6 py-3 rounded-lg bg-gradient-to-br from-[#8B6F47] to-[#B8956A] text-[#FDFBF7] font-medium hover:shadow-lg transition-all">
          Cadastrar primeiro serviço
        </button>
      }
    />
  );
}

/**
 * Error State - Estado de erro genérico
 */
export function ErrorState({ 
  message = "Ops, algo não saiu como esperado...",
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="🤔"
      title="Algo deu errado"
      description={message}
      action={
        onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-3 rounded-lg border-2 border-[#B8956A] text-[#8B6F47] font-medium hover:bg-[#B8956A]/10 transition-all"
          >
            Tentar novamente
          </button>
        )
      }
    />
  );
}

/**
 * Coming Soon - Em breve
 */
export function ComingSoon({ feature }: { feature?: string }) {
  return (
    <EmptyState
      icon="🚧"
      title="Em breve por aqui"
      description={
        feature 
          ? `Estamos preparando ${feature} com todo carinho. Em breve estará disponível!`
          : "Estamos trabalhando nesta funcionalidade. Em breve ela estará disponível!"
      }
    />
  );
}

/**
 * Maintenance - Em manutenção
 */
export function Maintenance() {
  return (
    <EmptyState
      icon="🔧"
      title="Fazendo alguns ajustes"
      description="Estamos fazendo uma manutenção rápida. Voltamos em instantes. Aproveite para tomar um café! ☕"
    />
  );
}

/**
 * Access Denied - Acesso negado
 */
export function AccessDenied() {
  return (
    <EmptyState
      icon="🔒"
      title="Esta área é reservada"
      description="Parece que você não tem permissão para acessar esta página. Se precisar de acesso, entre em contato."
      action={
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#B8956A] font-medium transition-colors"
        >
          Voltar para o início
          <span>→</span>
        </Link>
      }
    />
  );
}
