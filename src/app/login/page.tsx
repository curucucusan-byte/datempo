import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Entrar — DaTempo",
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
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header limpo */}
      <header className="border-b border-[#EDE5D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-9 w-9">
                {/* Relógio Vintage */}
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="45" fill="#FDFBF7" stroke="#8B6F47" strokeWidth="3"/>
                  <circle cx="50" cy="15" r="2.5" fill="#8B6F47"/>
                  <circle cx="85" cy="50" r="2.5" fill="#8B6F47"/>
                  <circle cx="50" cy="85" r="2.5" fill="#8B6F47"/>
                  <circle cx="15" cy="50" r="2.5" fill="#8B6F47"/>
                  <line x1="50" y1="50" x2="50" y2="30" stroke="#6B5D52" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="50" y1="50" x2="65" y2="50" stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="50" cy="50" r="4" fill="#8B6F47"/>
                </svg>
              </div>
              <span className="font-serif text-xl font-semibold text-[#4A3F35]">DaTempo</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-[#6B5D52] hover:text-[#4A3F35]">
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <main className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-md">
          {/* Ilustração do relógio grande */}
          <div className="flex justify-center mb-8">
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-lg">
                {/* Sombra */}
                <circle cx="52" cy="52" r="45" fill="#EDE5D8" opacity="0.3"/>
                
                {/* Relógio principal */}
                <circle cx="50" cy="50" r="45" fill="#FDFBF7" stroke="#8B6F47" strokeWidth="4"/>
                
                {/* Marcações das horas - mais elaboradas */}
                <circle cx="50" cy="12" r="3" fill="#8B6F47"/>
                <circle cx="88" cy="50" r="3" fill="#8B6F47"/>
                <circle cx="50" cy="88" r="3" fill="#8B6F47"/>
                <circle cx="12" cy="50" r="3" fill="#8B6F47"/>
                
                {/* Marcações secundárias */}
                <circle cx="73" cy="27" r="2" fill="#B8956A"/>
                <circle cx="73" cy="73" r="2" fill="#B8956A"/>
                <circle cx="27" cy="73" r="2" fill="#B8956A"/>
                <circle cx="27" cy="27" r="2" fill="#B8956A"/>
                
                {/* Ponteiros */}
                <line x1="50" y1="50" x2="50" y2="25" stroke="#6B5D52" strokeWidth="4" strokeLinecap="round"/>
                <line x1="50" y1="50" x2="70" y2="50" stroke="#8B6F47" strokeWidth="3.5" strokeLinecap="round"/>
                
                {/* Centro decorativo */}
                <circle cx="50" cy="50" r="5" fill="#8B6F47"/>
                <circle cx="50" cy="50" r="2" fill="#FDFBF7"/>
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#4A3F35] mb-3 tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-lg text-[#6B5D52] leading-relaxed">
              Só um instantinho para conectar
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-xl border-2 border-[#B8956A] bg-[#F5EFE6] p-4 text-base text-[#6B5D52] shadow-sm">
              {message}
            </div>
          )}
          
          {/* Card de login */}
          <div className="rounded-2xl border-2 border-[#EDE5D8] bg-white p-8 shadow-lg">
            <LoginForm />
          </div>

          {/* Footer links */}
          <p className="mt-8 text-center text-sm text-[#9C8D7E] leading-relaxed">
            Ao entrar, você concorda com nossos{" "}
            <Link href="/termos" className="text-[#8B6F47] hover:text-[#6B5D52] font-medium underline decoration-[#B8956A]">
              Termos
            </Link>
            {" "}e{" "}
            <Link href="/privacidade" className="text-[#8B6F47] hover:text-[#6B5D52] font-medium underline decoration-[#B8956A]">
              Privacidade
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
