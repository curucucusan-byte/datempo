import Link from "next/link";

export const metadata = {
  title: "Termos de Serviço — DaTempo",
  description: "Condições de uso da plataforma DaTempo.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <header className="border-b border-[#EDE5D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-xl font-semibold text-[#4A3F35]">DaTempo</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-[#6B5D52] hover:text-[#4A3F35]">
              Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-16 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-[#4A3F35] mb-8">Termos de Serviço</h1>

        <div className="prose prose-slate max-w-none space-y-6 text-[#6B5D52]">
          <p className="text-lg">
            Ao utilizar o DaTempo, você concorda com estes termos.
          </p>
          
          <p className="text-sm mt-8">
            Para dúvidas: <a href="mailto:legal@datempo.com" className="text-[#8B6F47] underline">legal@datempo.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}
