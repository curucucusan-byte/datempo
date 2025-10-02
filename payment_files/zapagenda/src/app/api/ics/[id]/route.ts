// src/app/api/ics/[id]/route.ts
import { NextResponse } from "next/server";
import { loadAppointments } from "@/lib/store";

function icsEscape(s: string) {
  return s.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const appts = await loadAppointments();
  const a = appts.find(x => x.id === id);
  if (!a) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Usa timezone local do Brasil para nome, mas ICS precisa UTC no DTSTART/DTEND (ou TZID, mantendo simples: UTC)
  const dtStart = new Date(a.startISO).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const dtEnd   = new Date(a.endISO).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const summary = `Atendimento: ${a.service} (${a.slug})`;
  const desc = [
    `Cliente: ${a.customerName}`,
    `Contato (WhatsApp): ${a.customerPhone}`,
  ].filter(Boolean).join("\\n");

  const uid = `zapagenda-${a.id}@${process.env.APP_BASE_URL?.replace(/^https?:\/\//, "") || "local"}`;
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ZapAgenda//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsEscape(uid)}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${icsEscape(summary)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${a.id}.ics"`,
    },
  });
}
