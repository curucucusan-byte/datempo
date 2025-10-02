"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Image from "next/image";

import { getClientAuth } from "@/lib/firebaseClient";

export default function LoginForm() {
  const router = useRouter();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setAuth(getClientAuth());
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Firebase não está configurado no cliente. Configure variáveis NEXT_PUBLIC_*.";
      setInitError(message);
    }
  }, []);

  async function createSession(idToken: string) {
    const resp = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!resp.ok) {
      const body = (await resp.json().catch(() => ({ error: "Falha ao criar sessão." }))) as {
        error?: string;
      };
      throw new Error(body.error || `Erro ${resp.status}`);
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("Firebase Auth não inicializado. Verifique as variáveis de ambiente.");
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await createSession(idToken);
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/popup-closed-by-user") {
        setError(null);
        return;
      }
      const message = err instanceof Error ? err.message : "Falha ao autenticar com Google";
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  if (initError) {
    console.error("Auth init error:", initError);
    return (
      <div className="mx-auto max-w-md space-y-2 rounded-2xl border border-red-400/40 bg-red-950/40 p-6 text-sm text-red-200">
        <p>Login temporariamente indisponível.</p>
        <p>Tente novamente em instantes ou contate o suporte.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading || googleLoading}
        className="w-full rounded-xl bg-white/90 py-3 text-sm font-semibold text-slate-900 hover:bg-white disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        <Image
          src="/logos/google.webp"
          alt="Google"
          width={18}
          height={18}
          className="h-[18px] w-[18px]"
        />
        {googleLoading ? "Conectando..." : "Entrar com Google"}
      </button>
      <p className="text-xs text-slate-400">
        Apenas login com Google está disponível. Seu Google Agenda será conectado em seguida.
      </p>
    </div>
  );
}
