import { notFound } from "next/navigation";
import { getLinkedCalendarBySlugWithToken } from "@/lib/google";
import AppointmentForm from "../AppointmentForm";

export async function generateMetadata({ params }: { params: { slug: string; h: string } }) {
  const linkedCalendar = await getLinkedCalendarBySlugWithToken(params.slug, params.h);
  if (!linkedCalendar) {
    return { title: "Agenda não encontrada" };
  }
  return {
    title: `Agende com ${linkedCalendar.summary} — ZapAgenda`,
    description: linkedCalendar.description,
  };
}

export default async function AgendaPage({ params }: { params: { slug: string; h: string } }) {
  const linkedCalendar = await getLinkedCalendarBySlugWithToken(params.slug, params.h);
  if (!linkedCalendar) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto max-w-xl px-6 py-8 text-center">
        <h1 className="text-3xl font-semibold">Agende com {linkedCalendar.summary}</h1>
        {linkedCalendar.description && (
          <p className="mt-2 text-slate-300">{linkedCalendar.description}</p>
        )}
      </header>

      <main className="mx-auto max-w-xl px-6 pb-16">
        <AppointmentForm slug={params.slug} h={params.h} />
      </main>
    </div>
  );
}

