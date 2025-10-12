// Caminho do arquivo: /home/ubuntu/datempo/datempo/src/app/agenda/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { getLinkedCalendarBySlugWithToken } from "@/lib/google";
import AppointmentForm from "./AppointmentForm";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const linkedCalendar = await getLinkedCalendarBySlugWithToken(params.slug, undefined);
  if (!linkedCalendar) {
    return { title: "Agenda não encontrada" };
  }
  return {
    title: `Agende com ${linkedCalendar.summary} — DaTempo`,
    description: linkedCalendar.description,
  };
}

export default async function AgendaPage({ params }: { params: { slug: string } }) {
  const linkedCalendar = await getLinkedCalendarBySlugWithToken(params.slug, undefined);

  if (!linkedCalendar) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Modern Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-sm">
            <Image
              src={(linkedCalendar.logoPath || "/logos/calendar.png") as string}
              alt={linkedCalendar.summary}
              width={80}
              height={80}
              className="h-20 w-20 object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            Agende com {linkedCalendar.summary}
          </h1>
          {linkedCalendar.description && (
            <p className="mt-4 text-lg text-slate-600">{linkedCalendar.description}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <AppointmentForm slug={params.slug} />
      </main>
    </div>
  );
}
