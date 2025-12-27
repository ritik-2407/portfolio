"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"      // Look for the class="dark" on the <html> tag
      defaultTheme="dark"    // Start as dark
      forcedTheme="dark"     // STAY as dark (the kill switch)
      enableSystem={false}   // Completely ignore Windows/Mac light mode settings
    >
      {children}
    </NextThemesProvider>
  );
}