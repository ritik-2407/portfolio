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
  Star,
  Github,
  ArrowUpRight,
  ExternalLinkIcon,
  CpuIcon,
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

import GithubChart from "@/components/GitHubContributions";

// --- Types (Kept Exact) ---
type SectionId = "about" | "projects" | "skills" | "contact";

type Project = {
  name: string;
  description: string;
  tags: string[];
  status: "Completed" | "Building" | "Planning" | "v-01" | "v-02" | "v-03";
  link: string;
  post: string;
  live: string;
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
    tags: ["NEXT", "NextAuth", "Github API", "Groq LLM"],
    status: "v-03",
    link: "https://github.com/ritik-2407/DEV-DNA",
    highlight: "AI powered Github Analyzer",
    post: "https://x.com/ritik_247/status/2003502226493546667?s=20",
    live: "https://dev-dna-chi.vercel.app/",
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
    live: "",
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
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/ritik_247/",
    icon: LeetCodeIcon,
  },
  { name: "X", href: "https://x.com/ritik_247", icon: XIcon },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ritik-yadav-06a8aa361/",
    icon: LinkedInIcon,
  },
  // Added LeetCode here

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

              <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>
                 INDIA
              </span>
            </div>

            <h1 className="cursor-default text-5xl font-semibold tracking-tight sm:text-7xl">
              I&apos;m Ritik.
              <span className="block text-zinc-500">
                I Just Explore & Build.
              </span>
            </h1>

            <p className="cursor-default max-w-xl text-lg leading-relaxed text-zinc-400">
              Full-Stack developer with a focus on{" "}
              <span className="text-zinc-200">Product Design</span> and
              providing seamless <span className="text-zinc-200">UI/UX</span>. I
              build tools that serve a purpose in day to day life. <br></br>{" "}
              <br></br>Currently a third year CS grad stepping into
              tech and getting started with development.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                View Work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                Contact
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- PROJECTS --- */}
        <section id="projects" className="flex flex-col gap-12">
          <div>
            <h2 className="cursor-default text-3xl font-semibold tracking-tight">
              Best Works
            </h2>
            <p className="cursor-default mt-2 text-zinc-500">
              Applications that are actually useful.
            </p>
          </div>

          <div className="grid gap-6">
            {projects.map((project, i) => {
              const Icon =
                iconMap[project.name as keyof typeof iconMap] || DefaultIcon;

              return (
                <BentoCard key={project.name} className="group" delay={i * 0.1}>
                  <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                          <Icon className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-zinc-100" />
                        </div>
                        <div>
                          <h3 className="cursor-default text-xl font-semibold">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-500">
                            <span
                              className={`h-1.5 w-1.5 rounded-full  ${
                                project.status === "v-03" ||
                                project.status === "v-02"
                                  ? "bg-green-400 cursor-default"
                                  : "bg-amber-300 cursor-default"
                              }`}
                            />
                            {project.status}
                          </div>
                        </div>
                      </div>

                      <p className="cursor-default max-w-lg text-pretty text-zinc-400">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="cursor-default rounded-full border border-white/5 bg-white/2 px-3 py-1 text-xs font-medium text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* --- LINKS SECTION --- */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* 1. Github Link */}
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View Project"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-black transition-transform duration-300 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <GitHubIcon className="h-5 w-5" />
                      </a>

                      {/* 2. X (Twitter) Link */}
                      {project.post && (
                        <a
                          href={project.post}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View Post on X"
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white transition-transform duration-300 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                          <XIcon className="h-5 w-5 fill-current" />
                        </a>
                      )}

                      {/* 3. NEW: Live Visit Link */}
                      <a
                        href={project.live || undefined} // Removes href if empty, preventing navigation
                        target={project.live ? "_blank" : undefined}
                        rel={project.live ? "noopener noreferrer" : undefined}
                        aria-label="Visit Live App"
                        onClick={(e) => !project.live && e.preventDefault()} // Safety check
                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 transition-all duration-300 ${
                          project.live
                            ? "text-white hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                            : "text-zinc-600 cursor-not-allowed opacity-50" // Greyed out styles
                        }`}
                      >
                        <ExternalLinkIcon className="h-5 w-5" />
                      </a>
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
            <h2 className="cursor-default text-3xl font-semibold tracking-tight">Skills</h2>
            <p className="cursor-default mt-2 text-zinc-500">
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
                <h3 className="cursor-default mb-6 text-sm font-medium uppercase tracking-wider text-zinc-400">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2 ">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </BentoCard>
            ))}
          </div>

          {/* --- REPLACE THE PREVIOUS ACTIVITY STATS DIV WITH THIS --- */}
          {/* Grid Layout: 2 Columns on medium screens, 1 on mobile */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* 1. Github Chart (Full Width: sm:col-span-2) */}
            <BentoCard delay={0.3} className="sm:col-span-2">
              <div className="flex h-full flex-col gap-4">
                {/* Heading */}
                <h3 className="cursor-default flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-400">
                  <Github className="h-4 w-4 " />
                  Github Contributions
                </h3>

                {/* Chart */}
                <div className=" cursor-default mt-2  flex flex-1 items-center justify-center">
                  <GithubChart />
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.4}>
              <div className="flex h-full flex-col gap-4">
                {/* Heading */}
                <h3 className="cursor-default flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-400">
                  LeetCode Stats
                </h3>

                {/* Card */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl">
                  <img
                    src="https://leetcard.jacoblin.cool/ritik_247?theme=dark&font=Inter&hide=ranking,username&ext=theme"
                    alt="LeetCode Stats"
                    className="w-full border-2 border-white/20 rounded-2xl object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </BentoCard>

            {/* 3. Top Languages (Half Width) - Fills the empty spot */}
            <BentoCard delay={0.4}>
              <div className="flex h-full flex-col gap-4">
                <h3 className="cursor-default text-sm font-medium  tracking-wider text-zinc-400">
                  TOP GITHUB LANGUAGES
                </h3>
                <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-black/5 ">
                  {/* Try the official GitHub Stats API */}
                  <img
                    src="https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=ritik-2407&layout=compact&hide_border=true&hide_title=true&text_color=a1a1aa&bg_color=121212&langs_count=8"
                    alt="Top Languages"
                    className="w-full border-2 border-white/20 rounded-2xl max-w-md object-contain opacity-90 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Fallback to another instance with transparent background
                      e.currentTarget.src =
                        "https://github-readme-stats.vercel.app/api/top-langs/?username=ritik-2407&layout=compact&hide_border=true&hide_title=true&text_color=a1a1aa&bg_color=00000000";
                    }}
                  />
                </div>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* --- CONTACT --- */}
        <section id="contact" className="flex flex-col gap-12">
          <BentoCard className="flex flex-col items-center text-center">
            <div className="mb-8 rounded-full bg-white/5 p-4">
              <HandshakeIcon className="h-6 w-6 text-yellow-200" />
            </div>

            <h2 className="cursor-default mb-4 text-3xl font-semibold sm:text-4xl">
              Let&apos;s build something together.
            </h2>
            <p className="cursor-default mb-8 max-w-md text-zinc-400">
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
                className=" cursor-pointer transition-all duration-300 ease-in-out hover:scale-103 group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-semibold text-black active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send Message{" "}
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0" />
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
                    className="cursor-pointer group flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-all hover:scale-110 hover:bg-white hover:text-black"
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

function LeetCodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-1.803-1.458-4.965-1.258-6.52.405l-1.636 1.751 4.706-5.04c.534-.572.534-1.498 0-2.07A1.374 1.374 0 0 0 13.483 0m-2.296 4.673a1.376 1.376 0 0 0-.401.993c.003.771.642 1.4 1.408 1.405h7.456c.77-.003 1.396-.636 1.393-1.405a1.376 1.376 0 0 0-1.393-1.396h-7.456a1.376 1.376 0 0 0-1.007.403m-7.229 6.845a1.375 1.375 0 0 0-.964.441 1.376 1.376 0 0 0 0 1.936l1.379 1.353a1.374 1.374 0 0 0 1.948 0 1.376 1.376 0 0 0 0-1.936L4.942 11.96a1.374 1.374 0 0 0-.986-.442" />
    </svg>
  );
}
