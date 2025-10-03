import { notFound } from "next/navigation";
import Image from "next/image";
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
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          <Image
            src={(linkedCalendar.logoPath || "/logos/calendar.png") as string}
            alt={linkedCalendar.summary}
            width={56}
            height={56}
            className="h-14 w-14 object-cover"
            priority
          />
        </div>
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
