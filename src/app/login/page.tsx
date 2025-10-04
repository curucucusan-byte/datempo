import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Entrar — ZapAgenda",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const message = (() => {
    const m = Array.isArray(searchParams?.m) ? searchParams?.m[0] : searchParams?.m;
    switch (m) {
      case "login_required":
        return "Faça login para continuar.";
      case "upgrade_required":
        return "Entre para escolher um plano.";
      default:
        return null;
    }
  })();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header simples */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">ZapAgenda</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Voltar para home
            </Link>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <main className="px-4 sm:px-6 py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Entrar</h1>
            <p className="text-lg text-slate-600">Entre usando sua conta Google. Não pedimos e‑mail e senha.</p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-base text-emerald-800">
              {message}
            </div>
          )}
          
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ao entrar, você concorda com nossos{" "}
            <Link href="/termos" className="text-emerald-600 hover:text-emerald-500 font-medium">
              Termos de Serviço
            </Link>
            {" "}e{" "}
            <Link href="/privacidade" className="text-emerald-600 hover:text-emerald-500 font-medium">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
