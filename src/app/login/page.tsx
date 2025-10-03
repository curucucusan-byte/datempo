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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto max-w-3xl px-6 py-8 text-center">
        <h1 className="text-3xl font-semibold">Entrar no ZapAgenda</h1>
        <p className="text-slate-300 mt-2">Entre usando sua conta Google. Não pedimos e‑mail e senha.</p>
      </header>
      <main className="px-6 pb-16">
        {message && (
          <div className="mx-auto mb-4 max-w-md rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {message}
          </div>
        )}
        <LoginForm />
      </main>
    </div>
  );
}
