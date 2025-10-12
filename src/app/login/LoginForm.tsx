"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getClientAuth } from "@/lib/firebaseClient";

export default function LoginForm() {
  const router = useRouter();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);
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
    setAuthenticating(true);
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
        setAuthenticating(false);
        return;
      }
      const message = err instanceof Error ? err.message : "Falha ao autenticar com Google";
      setError(message);
      setAuthenticating(false);
    }
  }

  if (initError) {
    console.error("Auth init error:", initError);
    return (
      <div className="space-y-3 rounded-xl border-2 border-[#D4A574]/40 bg-[#F5EFE6] p-6 text-sm text-[#6B5D52]">
        <p className="font-medium">Login temporariamente indisponível.</p>
        <p>Tente novamente em instantes ou contate o suporte.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading overlay com relógio */}
      {authenticating && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#FDFBF7]/95 backdrop-blur-sm"
        >
          {/* Relógio animado */}
          <div className="relative h-20 w-20">
            <svg viewBox="0 0 100 100" className="h-full w-full animate-pulse-slow">
              <circle cx="50" cy="50" r="45" fill="#FDFBF7" stroke="#8B6F47" strokeWidth="4"/>
              <circle cx="50" cy="12" r="3" fill="#8B6F47"/>
              <circle cx="88" cy="50" r="3" fill="#8B6F47"/>
              <circle cx="50" cy="88" r="3" fill="#8B6F47"/>
              <circle cx="12" cy="50" r="3" fill="#8B6F47"/>
              
              {/* Ponteiro rotativo */}
              <line 
                x1="50" y1="50" x2="50" y2="25" 
                stroke="#6B5D52" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="origin-center animate-spin"
                style={{ transformOrigin: '50% 50%' }}
              />
              
              <circle cx="50" cy="50" r="5" fill="#8B6F47"/>
            </svg>
          </div>
          
          <div className="text-center space-y-2">
            <p className="font-serif text-lg font-semibold text-[#4A3F35]">
              Conectando ao Google...
            </p>
            <p className="text-sm text-[#6B5D52]">
              Só um instantinho, dá tempo ☕
            </p>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="rounded-lg border-2 border-[#D4A574] bg-[#F5EFE6] p-4 text-sm text-[#6B5D52]">
          {error}
        </div>
      )}

      {/* Botão Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={authenticating}
        aria-label="Continuar com Google"
        className="group relative w-full overflow-hidden rounded-xl bg-white py-4 text-base font-medium text-[#4A3F35] transition-all hover:shadow-lg disabled:opacity-60 border-2 border-[#EDE5D8] hover:border-[#B8956A]"
      >
        <div className="flex items-center justify-center gap-3">
          {/* Google G logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.826 31.676 29.317 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c4.02 0 7.66 1.52 10.44 4.01l5.66-5.66C35.9 3.59 30.27 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22c12.15 0 22-9.85 22-22 0-1.47-.15-2.9-.389-4.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.814C14.757 16.064 19.04 13 24 13c4.02 0 7.66 1.52 10.44 4.01l5.66-5.66C35.9 3.59 30.27 1 24 1 15.317 1 7.91 5.69 4.053 12.69z"/>
            <path fill="#4CAF50" d="M24 45c5.232 0 10.02-2.003 13.627-5.273l-6.287-5.316C29.193 35.46 26.725 36 24 36c-5.29 0-9.787-3.37-11.396-8.065l-6.54 5.04C9.862 40.566 16.39 45 24 45z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.627 4.676-6.136 8-11.303 8-5.29 0-9.787-3.37-11.396-8.065l-6.54 5.04C9.862 40.566 16.39 45 24 45c12.15 0 22-9.85 22-22 0-1.47-.15-2.9-.389-4.917z"/>
          </svg>
          
          <span>{authenticating ? "Conectando..." : "Continuar com Google"}</span>
        </div>
      </button>

      {/* Info adicional */}
      <p className="text-center text-xs text-[#9C8D7E] leading-relaxed">
        Usamos apenas login do Google. Seu calendário será conectado em seguida.
      </p>
    </div>
  );
}
