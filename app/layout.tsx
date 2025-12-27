import type { Metadata } from "next";
import { Lexend, Outfit, Ubuntu } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

import { Header } from "@/components/header";
import { Starfield } from "@/components/starfield";
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-ubuntu",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lexend",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Ritik - portfolio",
  description: "The place to know me better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // FIX APPLIED HERE:
        // 1. bg-[#050505]: Forces the page background to be black (fixes the "weird" transparency issue).
        // 2. text-zinc-100: Sets the default text color to light grey/white.
        // 3. selection:bg-purple-500/30: Adds that nice purple highlight effect you had.
        className={`${ubuntu.variable} ${lexend.variable} ${outfit.variable} font-body antialiased bg-[#050505] text-zinc-100 selection:bg-purple-500/30`}
      >
        <Analytics />
        
        {/* Note: If your icons/text still flip color in Light Mode, 
           add the prop forcedTheme="dark" to this ThemeProvider tag.
        */}
        <ThemeProvider>
          <Starfield />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <div className="relative z-10 flex-1">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}