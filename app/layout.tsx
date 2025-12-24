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
        className={`${ubuntu.variable} ${lexend.variable} ${outfit.variable} font-body antialiased`}
      >
        <Analytics />
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
