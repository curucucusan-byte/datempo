// Caminho do arquivo: /home/ubuntu/datempo/datempo/src/app/dashboard/minha-agenda/page.tsx
import { redirect } from "next/navigation";

export const metadata = {
  title: "Minha Agenda — DaTempo",
};

export default async function MinhaAgendaPage() {
  // Mantemos a rota por compatibilidade, mas redirecionamos para o novo dashboard unificado
  return redirect("/dashboard?tab=agenda");
}
