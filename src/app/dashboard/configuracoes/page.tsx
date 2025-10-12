import { redirect } from "next/navigation";
import {
  User,
  Calendar,
  Bell,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Trash2,
  Save,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import QuickLinks from "../minha-agenda/QuickLinks";

interface SettingsSection {
  title: string;
  description: string;
  icon: any;
  fields: Field[];
}

interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea" | "toggle";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
  required?: boolean;
  description?: string;
}

async function getUserProfile(userId: string) {
  const { getDb } = await import("@/lib/firebaseAdmin");
  const db = getDb();

  const userDoc = await db.collection("users").doc(userId).get();
  const profile = userDoc.exists ? userDoc.data() : {};

  // Buscar configurações de lembretes
  const remindersDoc = await db.collection("reminderSettings").doc(userId).get();
  const reminderSettings = remindersDoc.exists ? remindersDoc.data() : {};

  // Buscar calendários vinculados
  const calendarsSnapshot = await db.collection("linkedCalendars").where("ownerUid", "==", userId).get();
  const linkedCalendars = calendarsSnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    profile: profile || {},
    reminderSettings: reminderSettings || {},
    linkedCalendars,
  };
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsSectionComponent({ section }: { section: SettingsSection }) {
  const Icon = section.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.description}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {section.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "toggle" ? (
              <div className="flex items-center justify-between">
                {field.description && <p className="text-sm text-gray-600">{field.description}</p>}
                <ToggleSwitch enabled={!!field.defaultValue} onChange={(value) => console.log(value)} />
              </div>
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                defaultValue={field.defaultValue as string}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string | number}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {field.description && field.type !== "toggle" && (
              <p className="mt-1 text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
        <button
          type="reset"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default async function ConfiguracoesPage() {
  const { getAuthenticatedUser } = await import("@/lib/session");
  const user = await getAuthenticatedUser();

  if (!user?.uid) {
    redirect("/login");
  }

  const { profile, reminderSettings, linkedCalendars } = await getUserProfile(user.uid);

  const sections: SettingsSection[] = [
    // Perfil Profissional
    {
      title: "Perfil Profissional",
      description: "Informações que seus clientes verão",
      icon: User,
      fields: [
        {
          name: "name",
          label: "Nome Completo",
          type: "text",
          placeholder: "Seu nome profissional",
          defaultValue: profile.name || "",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "seu@email.com",
          defaultValue: user.email || "",
          required: true,
        },
        {
          name: "phone",
          label: "Telefone/WhatsApp",
          type: "tel",
          placeholder: "(00) 00000-0000",
          defaultValue: profile.phone || "",
          description: "Será usado para enviar notificações via WhatsApp",
        },
        {
          name: "profession",
          label: "Profissão",
          type: "text",
          placeholder: "Ex: Psicólogo, Dentista, Personal Trainer...",
          defaultValue: profile.profession || "",
        },
        {
          name: "bio",
          label: "Sobre Você",
          type: "textarea",
          placeholder: "Conte um pouco sobre sua experiência e especialidades...",
          defaultValue: profile.bio || "",
          description: "Máximo 500 caracteres",
        },
      ],
    },

    // Agenda e Disponibilidade
    {
      title: "Agenda e Disponibilidade",
      description: "Configure sua agenda de atendimento",
      icon: Calendar,
      fields: [
        {
          name: "defaultDuration",
          label: "Duração Padrão de Consulta",
          type: "select",
          defaultValue: profile.defaultDuration || "60",
          options: [
            { value: "30", label: "30 minutos" },
            { value: "45", label: "45 minutos" },
            { value: "60", label: "1 hora" },
            { value: "90", label: "1 hora e 30 minutos" },
            { value: "120", label: "2 horas" },
          ],
        },
        {
          name: "intervalBetween",
          label: "Intervalo Entre Consultas",
          type: "select",
          defaultValue: profile.intervalBetween || "0",
          options: [
            { value: "0", label: "Sem intervalo" },
            { value: "15", label: "15 minutos" },
            { value: "30", label: "30 minutos" },
          ],
          description: "Tempo de descanso entre atendimentos",
        },
        {
          name: "advanceBooking",
          label: "Antecedência Mínima para Agendar",
          type: "select",
          defaultValue: profile.advanceBooking || "24",
          options: [
            { value: "1", label: "1 hora" },
            { value: "6", label: "6 horas" },
            { value: "24", label: "1 dia" },
            { value: "48", label: "2 dias" },
            { value: "168", label: "1 semana" },
          ],
        },
        {
          name: "maxAdvance",
          label: "Antecedência Máxima para Agendar",
          type: "select",
          defaultValue: profile.maxAdvance || "30",
          options: [
            { value: "7", label: "1 semana" },
            { value: "15", label: "15 dias" },
            { value: "30", label: "1 mês" },
            { value: "60", label: "2 meses" },
            { value: "90", label: "3 meses" },
          ],
        },
      ],
    },

    // Lembretes
    {
      title: "Lembretes Automáticos",
      description: "Configurar notificações para você e seus clientes",
      icon: Bell,
      fields: [
        {
          name: "enableReminders",
          label: "Ativar Lembretes",
          type: "toggle",
          defaultValue: reminderSettings.enabled !== false,
          description: "Enviar lembretes automáticos por WhatsApp",
        },
        {
          name: "reminderTime",
          label: "Quando Enviar Lembrete",
          type: "select",
          defaultValue: reminderSettings.hoursBefore || "24",
          options: [
            { value: "1", label: "1 hora antes" },
            { value: "2", label: "2 horas antes" },
            { value: "6", label: "6 horas antes" },
            { value: "12", label: "12 horas antes" },
            { value: "24", label: "1 dia antes" },
            { value: "48", label: "2 dias antes" },
          ],
        },
        {
          name: "reminderMessage",
          label: "Mensagem do Lembrete",
          type: "textarea",
          placeholder:
            "Olá! Lembre-se que você tem uma consulta amanhã às {hora}. Confirme sua presença respondendo esta mensagem.",
          defaultValue: reminderSettings.customMessage || "",
          description: "Use {hora}, {data}, {nome} para personalizar. Deixe em branco para usar a mensagem padrão.",
        },
      ],
    },

    // Local de Atendimento
    {
      title: "Local de Atendimento",
      description: "Endereço e informações de localização",
      icon: MapPin,
      fields: [
        {
          name: "location",
          label: "Endereço Completo",
          type: "text",
          placeholder: "Rua, número, bairro, cidade - estado",
          defaultValue: profile.location || "",
        },
        {
          name: "locationDetails",
          label: "Complemento/Detalhes",
          type: "text",
          placeholder: "Sala, andar, ponto de referência...",
          defaultValue: profile.locationDetails || "",
        },
        {
          name: "onlineAvailable",
          label: "Atendimento Online",
          type: "toggle",
          defaultValue: profile.onlineAvailable || false,
          description: "Oferecer opção de consulta por videochamada",
        },
        {
          name: "meetingLink",
          label: "Link para Reunião Online",
          type: "text",
          placeholder: "https://meet.google.com/seu-link",
          defaultValue: profile.meetingLink || "",
          description: "Google Meet, Zoom ou outra plataforma",
        },
      ],
    },

    // Integrações
    {
      title: "Integrações",
      description: "Google Calendar e outras ferramentas",
      icon: Globe,
      fields: [
        {
          name: "googleCalendarStatus",
          label: "Google Calendar",
          type: "text",
          defaultValue: linkedCalendars.length > 0 ? "Conectado" : "Não conectado",
          description:
            linkedCalendars.length > 0
              ? `${linkedCalendars.length} calendário(s) vinculado(s)`
              : "Clique no botão abaixo para conectar",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e informações do perfil</p>
      </div>

      {/* Sections */}
      <form className="space-y-8">
        {sections.map((section) => (
          <SettingsSectionComponent key={section.title} section={section} />
        ))}

        {/* Quick Links - Novos Links Rápidos */}
        {linkedCalendars.length > 0 && (
          <div className="space-y-4">
            {linkedCalendars.map((calendar: any) => (
              <QuickLinks 
                key={calendar.id}
                slug={calendar.slug} 
                calendarName={calendar.summary || calendar.slug}
              />
            ))}
          </div>
        )}

        {/* Zona de Perigo */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Zona de Perigo</h2>
          </div>
          <p className="text-sm text-red-700 mb-4">
            Ações irreversíveis. Use com cuidado!
          </p>
          <div className="space-y-3">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Excluir Todos os Agendamentos
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium ml-0 sm:ml-3"
            >
              Excluir Conta Permanentemente
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="flex justify-center pt-4">
          <Link
            href="/api/session/logout"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </Link>
        </div>
      </form>
    </div>
  );
}
