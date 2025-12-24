"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { label: "About", href: "#about", external: false },
  { label: "Projects", href: "#projects", external: false },
  {
    label: "Blogs",
    href: "https://medium.com/@ritik_247",
    external: true,
  },
  { label: "Contact", href: "#contact", external: false },
] as const;

export function Header() {
  const [activeTab, setActiveTab] = useState<string>("");
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const hydrateSections = () => {
      const nextMap: Record<string, HTMLElement | null> = {};
      NAV_ITEMS.forEach(({ href, external }) => {
        if (external || !href.startsWith("#")) return;
        const id = href.slice(1);
        nextMap[id] = document.getElementById(id);
      });
      sectionsRef.current = nextMap;
    };

    hydrateSections();
    window.addEventListener("resize", hydrateSections);
    window.addEventListener("hashchange", hydrateSections);
    
    // Optional: Add scroll listener to update active tab
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const item of NAV_ITEMS) {
        if (item.external) continue;
        const id = item.href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(item.label);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", hydrateSections);
      window.removeEventListener("hashchange", hydrateSections);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string, external: boolean, label: string) => {
      if (external || !href.startsWith("#")) return;

      event.preventDefault();
      setActiveTab(label);

      const id = href.slice(1);
      const section = sectionsRef.current[id] ?? document.getElementById(id);

      if (section) {
        sectionsRef.current[id] = section;
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
      }
    },
    [],
  );

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="relative flex items-center gap-2 rounded-full border border-white/10 bg-[#0F0F11]/80 p-2 shadow-2xl backdrop-blur-xl transition-all hover:bg-[#0F0F11]/90">
        
        

        {/* --- Desktop Nav --- */}
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map(({ label, href, external }) => {
            const isActive = activeTab === label;
            return (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                onClick={(event) => handleNavClick(event, href, external, label)}
                onMouseEnter={() => setActiveTab(label)}
                className="relative px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {/* Magnetic Hover/Active Pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* --- Mobile Nav (Simplified) --- */}
        <nav className="flex items-center gap-1 sm:hidden">
            {/* On mobile, usually show less or use a dropdown. 
                For this aesthetic, we keep it clean and maybe just show 'Contact' or 'Projects' 
                if space is tight, but here we'll just render them compactly */}
             {NAV_ITEMS.slice(0, 2).map(({ label, href, external }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={(event) => handleNavClick(event, href, external, label)}
                  className="rounded-full px-3 py-2 text-xs font-medium text-zinc-400 active:bg-white/10 active:text-white"
                >
                  {label}
                </Link>
             ))}
        </nav>

        

      </div>
    </motion.header>
  );
}