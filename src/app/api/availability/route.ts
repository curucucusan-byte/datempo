// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/availability/route.ts

import { NextResponse } from "next/server";

import { loadAppointments } from "@/lib/store";
import { freeBusyForDate, getLinkedCalendarBySlugWithToken } from "@/lib/google";

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type AvailabilityResult = {
  ok: true;
  date: string;
  slotMinutes: number;
  free: string[];
  taken: { start: string; end: string }[];
};

type ErrorResult = {
  ok: false;
  error: string;
};

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

function parseDateOnly(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;
  const utc = Date.UTC(year, month - 1, day);
  return { year, month, day, utcDate: new Date(utc) };
}

function toUtcIso(dateParts: { year: number; month: number; day: number }, time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  const { year, month, day } = dateParts;
  const ts = Date.UTC(year, month - 1, day, hour, minute);
  return new Date(ts);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const token = searchParams.get("h") || searchParams.get("token") || undefined;
  const date = searchParams.get("date");
  if (!slug) {
    return NextResponse.json<ErrorResult>(
      { ok: false, error: "Informe o slug da agenda (?slug=)." }, // Mensagem atualizada
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json<ErrorResult>(
      { ok: false, error: "Informe a data desejada (?date=YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  const parsedDate = parseDateOnly(date);
  if (!parsedDate) {
    return NextResponse.json<ErrorResult>(
      { ok: false, error: "Data inválida. Use o formato YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const linkedCalendar = await getLinkedCalendarBySlugWithToken(slug, token);
  if (!linkedCalendar) {
    return NextResponse.json<ErrorResult>({ ok: false, error: "Agenda não encontrada ou link inválido." }, { status: 404 });
  }

  const slotMinutes = Math.max(5, Math.min(8 * 60, linkedCalendar.slotDurationMinutes ?? 60));

  // Definição de slots base: preferimos Google Calendar.
  const ownerUid = linkedCalendar.ownerUid ?? null; // Usar ownerUid da agenda
  let googleBusy: { start: string; end: string }[] | null = null;
  let daySlots: string[] = [];
  if (ownerUid) {
    const calId = linkedCalendar.id; // Usar o ID da agenda vinculada
    if (calId) {
      googleBusy = await freeBusyForDate(ownerUid, calId, date);
    }
  }

  const workHours = linkedCalendar.workHours ?? null;
  if (workHours) {
    const dayIndex = parsedDate.utcDate.getUTCDay();
    const weekday = WEEKDAYS[dayIndex];
    const slotsForDay = workHours[weekday] ?? [];
    if (slotsForDay.length) {
      daySlots = slotsForDay.filter((time) => /^\d{2}:\d{2}$/.test(time));
    }
  }

  if (!daySlots.length) {
    if (googleBusy) {
      const startHour = 8;
      const endHour = 20;
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += slotMinutes) {
          const hh = String(h).padStart(2, "0");
          const mm = String(m).padStart(2, "0");
          daySlots.push(`${hh}:${mm}`);
        }
      }
    } else {
      for (let h = 9; h < 18; h++) {
        const hh = String(h).padStart(2, "0");
        daySlots.push(`${hh}:00`);
        if (slotMinutes <= 30) daySlots.push(`${hh}:30`);
      }
    }
  }

  const appointments = await loadAppointments();
  const dayAppointments = appointments.filter((appt) => {
    if (appt.slug !== slug) return false;
    return appt.startISO.slice(0, 10) === date;
  });

  const free: string[] = [];
  for (const time of daySlots) {
    const slotStart = toUtcIso(parsedDate, time);
    if (!slotStart) continue;
    const slotEnd = new Date(slotStart.getTime() + slotMinutes * 60_000);

    const hasLocalClash = dayAppointments.some((appt) =>
      overlaps(slotStart, slotEnd, new Date(appt.startISO), new Date(appt.endISO))
    );
    const hasGoogleClash = (googleBusy ?? []).some((b) =>
      overlaps(slotStart, slotEnd, new Date(b.start), new Date(b.end))
    );

    if (!hasLocalClash && !hasGoogleClash) {
      free.push(slotStart.toISOString());
    }
  }

  const taken = dayAppointments
    .map((appt) => ({ start: appt.startISO, end: appt.endISO }))
    .sort((a, b) => a.start.localeCompare(b.start));

  const result: AvailabilityResult = {
    ok: true,
    date,
    slotMinutes,
    free,
    taken,
  };

  return NextResponse.json(result);
}
