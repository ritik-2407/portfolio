"use client";

import { createContext, useContext, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type BlogThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const BlogThemeContext = createContext<BlogThemeContextType | undefined>(undefined);

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BlogThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`relative min-h-screen transition-colors duration-500 ease-in-out pb-20 ${
          theme === "light" ? "blog-light-theme bg-white text-black" : "blog-dark-theme bg-[#18181B] text-white"
        }`}
      >
        <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b transition-colors duration-500 ease-in-out" style={{
          backgroundColor: theme === "light" ? "rgba(255,255,255,0.7)" : "#18181B",
          borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
        }}>
          <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="font-bold text-lg hover:opacity-70 transition-opacity">
              &larr; Back to Portfolio
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/blogs" className="font-medium hover:opacity-70 transition-opacity">
                All Blogs
              </Link>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  theme === "light"
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 pt-12">
          {children}
        </main>
      </div>
    </BlogThemeContext.Provider>
  );
}

export function useBlogTheme() {
  const context = useContext(BlogThemeContext);
  if (context === undefined) {
    throw new Error("useBlogTheme must be used within a BlogThemeProvider");
  }
  return context;
}
