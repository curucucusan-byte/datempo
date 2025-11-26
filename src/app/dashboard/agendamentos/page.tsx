import { redirect } from "next/navigation";
import { Calendar, Clock, User, Phone, Mail, MapPin, Search, Filter, Download, Plus } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "../components/EmptyState";
import { AppointmentListSkeleton } from "../components/LoadingSkeleton";
import { Suspense } from "react";

interface Appointment {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  service?: string;
  date: Date;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
  location?: string;
}

async function getAppointments(
  userId: string,
  filters: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
): Promise<Appointment[]> {
  const { getDb } = await import("@/lib/firebaseAdmin");
  const { Timestamp } = await import("firebase-admin/firestore");
  const db = getDb();

  let query = db.collection("appointments").where("professionalId", "==", userId);

  // Filtro de status
  if (filters.status && filters.status !== "all") {
    query = query.where("status", "==", filters.status);
  }

  // Filtro de data (padrão: últimos 30 dias se não especificado)
  const dateFrom = filters.dateFrom
    ? new Date(filters.dateFrom)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  query = query
    .where("date", ">=", Timestamp.fromDate(dateFrom))
    .where("date", "<=", Timestamp.fromDate(dateTo))
    .orderBy("date", "desc");

  const snapshot = await query.get();

  const appointments = snapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      clientName: data.clientName || "Cliente sem nome",
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      service: data.service,
      date: data.date?.toDate() || new Date(),
      duration: data.duration || 60,
      status: data.status || "pending",
      notes: data.notes,
      location: data.location,
    };
  });

  // Filtro de busca por texto (client-side já que Firestore não tem full-text search)
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    return appointments.filter(
      (apt) =>
        apt.clientName.toLowerCase().includes(searchTerm) ||
        apt.clientEmail?.toLowerCase().includes(searchTerm) ||
        apt.clientPhone?.includes(searchTerm) ||
        apt.service?.toLowerCase().includes(searchTerm)
    );
  }

  return appointments;
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const statusColors = {
    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  const statusLabels = {
    confirmed: "Confirmado",
    pending: "Pendente",
    cancelled: "Cancelado",
    completed: "Concluído",
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isPast = appointment.date < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{appointment.clientName}</h3>
            {appointment.service && <p className="text-sm text-gray-600">{appointment.service}</p>}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appointment.status]}`}>
          {statusLabels[appointment.status]}
        </span>
      </div>

      {/* Data e Hora */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {formatTime(appointment.date)} ({appointment.duration} min)
          </span>
        </div>
      </div>

      {/* Informações de Contato */}
      <div className="space-y-2 mb-4">
        {appointment.clientPhone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{appointment.clientPhone}</span>
          </div>
        )}
        {appointment.clientEmail && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{appointment.clientEmail}</span>
          </div>
        )}
        {appointment.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{appointment.location}</span>
          </div>
        )}
      </div>

      {/* Notas */}
      {appointment.notes && (
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-700">{appointment.notes}</p>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
          Ver Detalhes
        </button>
        {!isPast && appointment.status !== "cancelled" && (
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

interface AppointmentListProps {
  searchParams: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
}

async function AppointmentList({ searchParams }: AppointmentListProps) {
  const { getAuthenticatedUser } = await import("@/lib/session");
  const user = await getAuthenticatedUser();

  if (!user?.uid) {
    redirect("/login");
  }

  const appointments = await getAppointments(user.uid, searchParams);

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="Nenhum agendamento encontrado"
        description="Não há agendamentos que correspondam aos filtros selecionados."
        action={{
          label: "Limpar filtros",
          href: "/dashboard/agendamentos"
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Exibindo <span className="font-semibold">{appointments.length}</span> agendamento
          {appointments.length !== 1 && "s"}
        </p>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}

export default async function AgendamentosPage({
  searchParams,
}: {
  searchParams: { status?: string; dateFrom?: string; dateTo?: string; search?: string };
}) {
  const { getAuthenticatedUser } = await import("@/lib/session");
  const user = await getAuthenticatedUser();

  if (!user?.uid) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendamentos</h1>
        <p className="text-gray-600">Gerencie todos os seus agendamentos em um só lugar</p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar
            </label>
            <input
              type="text"
              name="search"
              placeholder="Nome, email ou telefone do cliente..."
              defaultValue={searchParams.search || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Status
            </label>
            <select
              name="status"
              defaultValue={searchParams.status || "all"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Período
            </label>
            <select
              name="period"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="30">Últimos 30 dias</option>
              <option value="7">Últimos 7 dias</option>
              <option value="today">Hoje</option>
              <option value="future">Próximos</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
            Aplicar Filtros
          </button>
          <Link
            href="/dashboard/agendamentos"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Limpar
          </Link>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <Suspense fallback={<AppointmentListSkeleton />}>
        <AppointmentList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
