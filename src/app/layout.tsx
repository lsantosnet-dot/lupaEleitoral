import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lupa Eleitoral 2026",
  description: "Fiscalize seus representantes nas eleições de 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lupa Eleitoral",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 pb-[env(safe-area-inset-bottom)]`}
        >
          <div className="max-w-lg mx-auto md:max-w-5xl min-h-screen pb-16 md:pb-0 font-sans flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <BottomNav />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
