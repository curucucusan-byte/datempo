import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9">
              {/* Relógio Vintage com cores híbridas */}
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* Fundo do relógio - gradiente verde/madeira */}
                <defs>
                  <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#8B6F47" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="white" stroke="url(#clockGradient)" strokeWidth="3"/>
                
                {/* Marcações das horas */}
                <circle cx="50" cy="15" r="2.5" fill="#10b981"/>
                <circle cx="85" cy="50" r="2.5" fill="#8B6F47"/>
                <circle cx="50" cy="85" r="2.5" fill="#10b981"/>
                <circle cx="15" cy="50" r="2.5" fill="#8B6F47"/>
                
                {/* Ponteiros */}
                <line x1="50" y1="50" x2="50" y2="30" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
                <line x1="50" y1="50" x2="65" y2="50" stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round"/>
                
                {/* Centro */}
                <circle cx="50" cy="50" r="4" fill="#059669"/>
              </svg>
            </div>
            <span className="font-serif text-xl font-semibold bg-gradient-to-r from-emerald-600 to-[#8B6F47] bg-clip-text text-transparent tracking-tight">
              DaTempo
            </span>
          </Link>

          {/* Nav direita - botão híbrido */}
          <Link
            href="/login"
            className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:scale-105"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
