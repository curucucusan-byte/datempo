import LoginForm from "./LoginForm";

export const metadata = {
  title: "Entrar — ZapAgenda",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto max-w-3xl px-6 py-8 text-center">
        <h1 className="text-3xl font-semibold">Entrar no ZapAgenda</h1>
        <p className="text-slate-300 mt-2">Entre usando sua conta Google. Não pedimos e‑mail e senha.</p>
      </header>
      <main className="px-6 pb-16">
        <LoginForm />
      </main>
    </div>
  );
}
