// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/api/session/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getFirebaseAuth } from "@/lib/firebaseAdmin";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { idToken?: string } | null;
    const idToken = body?.idToken;
    if (!idToken) {
      return NextResponse.json({ error: "Token ausente." }, { status: 400 });
    }

    const auth = getFirebaseAuth();
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao criar sessão.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

