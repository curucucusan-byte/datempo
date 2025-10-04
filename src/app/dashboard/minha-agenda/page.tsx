// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/dashboard/minha-agenda/page.tsx
import { redirect } from "next/navigation";

export const metadata = {
  title: "Minha Agenda — Agende Mais",
};

export default async function MinhaAgendaPage() {
  // Mantemos a rota por compatibilidade, mas redirecionamos para o novo dashboard unificado
  return redirect("/dashboard?tab=agenda");
}
