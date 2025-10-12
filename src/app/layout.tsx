// Caminho do arquivo: /home/ubuntu/datempo/datempo/src/app/layout.tsx

import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// import { Analytics } from "@vercel/analytics/react"; // Removido

const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl),
  title: "DaTempo — Agendamentos sem Pressa",
  description: "Onde tudo dá tempo. Sistema de agendamento online com WhatsApp e Google Calendar.",
  openGraph: {
    title: "DaTempo",
    description: "Onde tudo dá tempo. Agendamentos automáticos com WhatsApp.",
    url: "https://zap-agenda.onrender.com",
    siteName: "DaTempo",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "pt_BR", type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@datempo" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${crimsonPro.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FDFBF7] text-[#4A3F35]">
        <Toaster position="top-right" richColors closeButton />
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
