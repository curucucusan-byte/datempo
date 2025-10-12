import { NextResponse } from "next/server";

import { loadAppointments } from "@/lib/store";

function icsEscape(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toICSDate(dt: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    dt.getUTCFullYear() +
    pad(dt.getUTCMonth() + 1) +
    pad(dt.getUTCDate()) +
    "T" +
    pad(dt.getUTCHours()) +
    pad(dt.getUTCMinutes()) +
    pad(dt.getUTCSeconds()) +
    "Z"
  );
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const list = await loadAppointments();
  const appt = list.find((a) => a.id === id);
  if (!appt) return new NextResponse("Not found", { status: 404 });

  const dtStart = new Date(appt.startISO);
  const dtEnd = new Date(appt.endISO);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DaTempo//pt-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsEscape(appt.id)}@datempo`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(dtStart)}`,
    `DTEND:${toICSDate(dtEnd)}`,
    `SUMMARY:${icsEscape(`${appt.service} — ${appt.customerName}`)}`,
    `DESCRIPTION:${icsEscape(`Cliente: ${appt.customerName}\\nServiço: ${appt.service}`)}`,
    `LOCATION:${icsEscape(appt.slug)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];

  const body = lines.join("\r\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=datempo-${appt.id}.ics`,
    },
  });
}

