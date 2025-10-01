"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";

import { getClientAuth } from "@/lib/firebaseClient";

const auth = getClientAuth();

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/session", { method: "DELETE" });
      await signOut(auth);
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-60"
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
