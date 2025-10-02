// Caminho do arquivo: /home/ubuntu/zapagenda/zapagenda/src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/react"; // Removido

const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl),
  title: "ZapAgenda — Agendamentos via WhatsApp",
  description: "Cliente escolhe horário, você recebe no WhatsApp.",
  openGraph: {
    title: "ZapAgenda",
    description: "Agendamentos via WhatsApp",
    url: "https://seu-dominio.vercel.app",
    siteName: "ZapAgenda",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "pt_BR", type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@seuuser" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
