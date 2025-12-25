/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Database,
  DnaIcon,
  GlobeIcon,
  HandshakeIcon,
  Layers,
  LayoutGrid,
  Loader2,
  Mail,
  Send,
  Sparkles,
  Terminal,
  TrendingUpIcon,
  TwitterIcon,
  User,
  Wrench,
  WrenchIcon,
} from "lucide-react";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";

// --- Types (Kept Exact) ---
type SectionId = "about" | "projects" | "skills" | "contact";

type Project = {
  name: string;
  description: string;
  tags: string[];
  status: "Completed" | "Building" | "Planning" | "v-01" | "v-02";
  link: string;
  post: string;
  highlight?: string;
};

type SkillCategory = {
  title: string;
  icon: ReactNode;
  skills: string[];
};

type SocialLink = {
  name: string;
  href: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
};

// --- Data (Kept Exact) ---
const skills: SkillCategory[] = [
  {
    title: "Languages & Runtime",
    icon: <Code2 className="h-5 w-5" />,
    skills: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "SQL",
      "C/C++",
      "Java (OOPS)",
      "Python (Basic)",
    ],
  },
  {
    title: "TechStacks",
    icon: <Layers className="h-5 w-5" />,
    skills: [
      "NEXT.js",
      "React.js",
      "Express.js",
      "Postgres SQL",
      "MongoDB",
      "Tailwind CSS",
      "Git & Github",
    ],
  },
  {
    title: "TOOLS & Libraries",
    icon: <WrenchIcon className="h-5 w-5" />,
    skills: [
      "Recoil & Redux",
      "Prisma ORM",
      "Drizzle",
      "Axios",
      "Zod",
      "NextAuth",
      "Lucide React",
      "Framer Motion",
      "BASH",
    ],
  },
];

const projects: Project[] = [
  {
    name: "DEV DNA",
    description:
      "It is an AI powered analysis engine which scrapes your Github profile to give genuine outputs like suggestions, analysis, roast etc. without sounding too generic and robotic.",
    tags: ["Next", "NextAuth", "Github API", "GROQ LLM"],
    status: "v-01",
    link: "https://github.com/ritik-2407/DEV-DNA",
    highlight: "AI powered Github Analyzer",
    post: "https://x.com/ritik_247/status/2003502226493546667?s=20",
  },
  {
    name: "MOMENTUM",
    description:
      "Momentum knows the functioning of your monkey brain and gamifies the experience to keep users hooked into doing productive things and daily tasks like a game.",
    tags: ["NEXT", "MONGO DB", "Lucide React", "Basic Auth"],
    status: "v-01",
    link: "https://github.com/ritik-2407/MOMENTUM",
    highlight: "Not your typical productivity partner",
    post: "https://x.com/ritik_247/status/1995159815526756555?s=20",
  },
];

const iconMap = {
  "DEV DNA": DnaIcon, // If project name is 'Dev DNA', use Dna icon
  MOMENTUM: TrendingUpIcon, // If project name is 'Momentum', use TrendingUp icon
  // Example
} as const;

const DefaultIcon = Code2;

const socialLinks: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/ritik-2407", icon: GitHubIcon },
  { name: "X", href: "https://x.com/ritik_247", icon: XIcon },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ritik-yadav-06a8aa361/",
    icon: LinkedInIcon,
  },
  { name: "Email", href: "ritikyadav2426@gmail.com", icon: MailIcon },
];

// --- Unique Components ---

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-[2.5rem] border border-white/8 bg-[#0F0F11]/80 backdrop-blur-sm p-8 ${className}`}
    >
      {/* Reduced internal opacity to let Starfield shine through slightly */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-indigo-500/10 via-[#0F0F11]/50 to-[#0F0F11]/50" />
      {children}
    </motion.div>
  );
}

function MagneticButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function FloatingDock({ activeSection }: { activeSection: SectionId }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#161616]/80 px-2 py-2 shadow-2xl backdrop-blur-xl">
        {[
          { id: "about", icon: User },
          { id: "projects", icon: LayoutGrid },
          { id: "skills", icon: Terminal },
          { id: "contact", icon: Mail },
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white mix-blend-difference"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showEmailToast, setShowEmailToast] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const ACCESS_KEY = "1dfdacfa-5d1d-42bd-a831-b7d43243dac2";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll("section")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setResult(null);
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await response.json();
      if (data.success) {
        setResult("Sent!");
        form.reset();
      } else {
        setResult("Error.");
      }
    } catch (error) {
      setResult("Error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = useCallback((email: string) => {
    navigator.clipboard.writeText(email);
    setShowEmailToast(true);
    setTimeout(() => setShowEmailToast(false), 3000);
  }, []);

  return (
    // REMOVED: min-h-screen and bg-[#050505].
    // The Layout handles the height and the Starfield handles the base color.
    <div className="relative text-zinc-100 selection:bg-purple-500/30">
      {/* Background Ambience (kept for color, but transparent base) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      {/* CHANGED: <main> to <div> since layout.tsx already has a <main> */}
      <div className="mx-auto flex max-w-4xl flex-col gap-32 px-6 pb-40 pt-24">
        {/* --- HERO --- */}
        <section
          id="about"
          className="flex min-h-[60vh] flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 bg-zinc-900 shadow-2xl">
                <img
                  src="/ritik-icon.jpg"
                  alt="Ritik"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-md">
                Open for Work
              </span>
            </div>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
              I&apos;m Ritik.
              <span className="block text-zinc-500">
                I Just Explore & Build.
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
              Full-Stack developer with a focus on{" "}
              <span className="text-zinc-200">Product Design</span> and
              providing seamless <span className="text-zinc-200">UI/UX</span>. I
              build tools that serve a purpose in day to day life. I am currently a third year CS grad based in INDIA
            </p>

            <div className="mt-8 flex gap-4">
              <MagneticButton className=" hover:cursor-pointer group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black transition-transform active:scale-95">
                <span
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Work
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </MagneticButton>
              <MagneticButton className="hover:cursor-pointer rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10 active:scale-95">
                <span
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Contact
                </span>
              </MagneticButton>
            </div>
          </motion.div>
        </section>

        {/* --- PROJECTS --- */}
        <section id="projects" className="flex flex-col gap-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Best Works
            </h2>
            <p className="mt-2 text-zinc-500">
              Applications that are actually useful.
            </p>
          </div>

          <div className="grid gap-6">
            {projects.map((project, i) => {
              // 2. RETRIEVE THE SPECIFIC ICON
              // We look up the icon based on the project name.
              const Icon =
                iconMap[project.name as keyof typeof iconMap] || DefaultIcon;

              return (
                <BentoCard key={project.name} className="group" delay={i * 0.1}>
                  <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                          {/* 3. RENDER THE ICON */}
                          <Icon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-zinc-100" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-500">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                project.status === "Completed"
                                  ? "bg-green-400"
                                  : "bg-amber-300"
                              }`}
                            />
                            {project.status}
                          </div>
                        </div>
                      </div>

                      <p className="max-w-lg text-pretty text-zinc-400">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/5 bg-white/2 px-3 py-1 text-xs font-medium text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Project/Github Link */}
                      <a
                        href={project.link}
                        target="_blank"
                        aria-label="View Project"
                        className="flex h-12 w-12 items-center justify-center rounded-full  bg-zinc-800 text-black transition-transform duration-300 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <GitHubIcon className="h-5 w-5" />
                      </a>

                      {/* X (Twitter) Post Link */}
                      {project.post && (
                        <a
                          href={project.post}
                          target="_blank"
                          aria-label="View Post on X"
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white transition-transform duration-300 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                          <XIcon className="h-5 w-5 fill-current" />
                        </a>
                      )}
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </div>
        </section>

        {/* --- SKILLS --- */}
        <section id="skills" className="flex flex-col gap-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Skills</h2>
            <p className="mt-2 text-zinc-500">
              The technologies I use to build useful apps.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((category, index) => (
              <BentoCard
                key={category.title}
                delay={index * 0.1}
                className="p-6"
              >
                <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  {category.icon}
                </div>
                <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-zinc-400">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2 ">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </BentoCard>
            ))}
          </div>
        </section>

        {/* --- CONTACT --- */}
        <section id="contact" className="flex flex-col gap-12">
          <BentoCard className="flex flex-col items-center text-center">
            <div className="mb-8 rounded-full bg-white/5 p-4">
              <HandshakeIcon className="h-6 w-6 text-yellow-200" />
            </div>

            <h2 className="mb-4 text-3xl font-semibold sm:text-4xl">
              Let&apos;s build something together.
            </h2>
            <p className="mb-8 max-w-md text-zinc-400">
              I&apos;m currently open to new projects and opportunities. Drop me
              a line and let's build something cool.
            </p>

            <form
              onSubmit={handleContactSubmit}
              className="flex w-full max-w-md flex-col gap-3"
            >
              <input type="hidden" name="access_key" value={ACCESS_KEY} />
              <div className="flex gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="w-full rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-purple-500/5"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-purple-500/5"
                />
              </div>
              <textarea
                name="message"
                placeholder="How can I help?"
                rows={4}
                required
                className="w-full resize-none rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-purple-500/5"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-semibold text-black transition-transform active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send Message{" "}
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              {result && (
                <p
                  className={`text-sm ${
                    result === "Sent!" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {result}
                </p>
              )}
            </form>

            <div className="mt-12 flex gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => {
                const handleClick = () => {
                  if (name === "Email") {
                    // Remove mailto: prefix if present
                    const email =
                      href.replace(/^mailto:/, "") ||
                      "ritikyadav2426@gmail.com";
                    handleCopyEmail(email);
                  } else {
                    window.open(href, "_blank");
                  }
                };

                return (
                  <button
                    key={name}
                    onClick={handleClick}
                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-all hover:scale-110 hover:bg-white hover:text-black"
                    aria-label={name}
                    type="button"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </BentoCard>
        </section>
      </div>

      {/* Floating Navigation */}

      <AnimatePresence>
        {showEmailToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-50 rounded-full border border-white/10 bg-[#161616] px-6 py-2 text-sm text-white shadow-2xl backdrop-blur-md"
          >
            Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Icons (Kept Exact) ---
function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48 0-.24-.01-.86-.01-1.68-2.48.54-3-1.19-3-1.19-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.53 1.05 1.53 1.05.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-1.98-.23-4.07-.99-4.07-4.39 0-.97.35-1.77.93-2.39-.09-.23-.4-1.15.09-2.39 0 0 .75-.24 2.45.92a8.53 8.53 0 0 1 4.46 0c1.7-1.16 2.45-.92 2.45-.92.49 1.24.18 2.16.09 2.39.58.62.93 1.42.93 2.39 0 3.41-2.1 4.15-4.1 4.37.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 12 2" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M13.45 10.86 19.56 4h-1.45l-5.3 5.94L8 4H3l6.39 9.23L3 20h1.45l5.69-6.37L16 20h5z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-9.65 15H6.69V9.75h2.66zM8 8.54a1.54 1.54 0 1 1 0-3.08 1.54 1.54 0 0 1 0 3.08m10 9.46h-2.65v-3.76c0-.9-.02-2.05-1.25-2.05-1.25 0-1.44.97-1.44 1.98v3.83H9.99V9.75h2.54v1.1h.04a2.79 2.79 0 0 1 2.51-1.38c2.69 0 3.19 1.77 3.19 4.07z" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 2v.51l-8 5-8-5V6zm0 12H4V8.32l8 5 8-5z" />
    </svg>
  );
}
