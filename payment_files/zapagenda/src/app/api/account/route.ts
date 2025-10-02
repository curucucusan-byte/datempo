import { NextResponse } from "next/server";

import { authenticateRequest, getAuthenticatedUser } from "@/lib/session";
import { ensureAccount, getAccount, updateAccount } from "@/lib/account";
import type { PlanId } from "@/lib/plans";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await ensureAccount(auth.uid, auth.email ?? (await getAuthenticatedUser())?.email ?? undefined);
  return NextResponse.json({ ok: true, account });
}

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await getAccount(auth.uid);
  if (!account) {
    await ensureAccount(auth.uid, auth.email);
  }

  const body = (await req.json().catch(() => null)) as
    | {
        plan?: PlanId;
        status?: "active" | "trial" | "past_due" | "canceled";
        trialEndsAt?: string | null;
        reminders?: { enabled?: boolean; windowMinutes?: number };
      }
    | null;

  if (!body) {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  if (
    typeof body.plan === "string" &&
    body.plan !== "essencial" &&
    body.plan !== "pro" &&
    body.plan !== "inactive"
  ) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  if (
    typeof body.status === "string" &&
    !["active", "trial", "past_due", "canceled"].includes(body.status)
  ) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  if (
    typeof body.reminders !== "undefined" &&
    typeof body.reminders !== "object"
  ) {
    return NextResponse.json({ error: "Reminders inválido" }, { status: 400 });
  }

  if (
    typeof body.reminders?.windowMinutes !== "undefined" &&
    !Number.isFinite(body.reminders.windowMinutes)
  ) {
    return NextResponse.json({ error: "Window inválido" }, { status: 400 });
  }

  if (
    typeof body.plan === "undefined" &&
    typeof body.status === "undefined" &&
    typeof body.trialEndsAt === "undefined" &&
    typeof body.reminders === "undefined"
  ) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const updated = await updateAccount(auth.uid, body);
  return NextResponse.json({ ok: true, account: updated });
}
