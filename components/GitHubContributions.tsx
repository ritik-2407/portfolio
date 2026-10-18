"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const USERNAME = "ritik-2407";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

type Profile = { public_repos: number; followers: number };

const LEVEL_CLASSES: Record<Day["level"], string> = {
  0: "bg-white/[0.06]",
  1: "bg-emerald-900",
  2: "bg-emerald-700",
  3: "bg-emerald-500",
  4: "bg-emerald-300",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function computeStats(days: Day[]) {
  const total = days.reduce((sum, d) => sum + d.count, 0);

  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  // Today may not have contributions yet; don't break the streak for that.
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }

  return { total, longest, current };
}

/** Group days into week columns (Sun-Sat), padding the first week. */
function toWeeks(days: Day[]): (Day | null)[][] {
  if (!days.length) return [];
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = Array(new Date(days[0].date).getUTCDay()).fill(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <div className="text-2xl font-semibold tabular-nums text-zinc-100">
        {value}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
    </div>
  );
}

export default function GitHubContributions() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(
      `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
      { signal }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { contributions: Day[] }) => setDays(data.contributions))
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });

    // Profile numbers are a nice-to-have; failure (e.g. rate limit) is silent.
    fetch(`https://api.github.com/users/${USERNAME}`, { signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setProfile(data))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const weeks = useMemo(() => (days ? toWeeks(days) : []), [days]);
  const stats = useMemo(() => (days ? computeStats(days) : null), [days]);

  // Show the most recent weeks first on narrow screens.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  const monthLabels = useMemo(() => {
    let last = -1;
    return weeks.map((w) => {
      const first = w.find(Boolean);
      if (!first) return "";
      const m = new Date(first.date).getUTCMonth();
      if (m === last) return "";
      last = m;
      return MONTHS[m];
    });
  }, [weeks]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="cursor-default text-sm font-medium uppercase tracking-wider text-zinc-400">
          GitHub Activity
        </h3>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 transition-colors hover:text-zinc-200"
        >
          @{USERNAME}
        </a>
      </div>

      {error ? (
        <p className="text-sm text-zinc-500">
          Couldn&apos;t load contribution data right now.{" "}
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300"
          >
            View on GitHub
          </a>
        </p>
      ) : !days || !stats ? (
        <div className="space-y-4" aria-busy="true">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
          <div className="h-[120px] animate-pulse rounded-2xl bg-white/5" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Contributions (1y)" value={stats.total.toLocaleString()} />
            <Stat label="Current streak" value={`${stats.current}d`} />
            <Stat label="Longest streak" value={`${stats.longest}d`} />
            <Stat
              label="Public repos"
              value={profile ? profile.public_repos : "—"}
            />
          </div>

          <div ref={scrollRef} className="overflow-x-auto pb-2">
            <div className="mx-auto w-max">
              <div className="mb-1 flex gap-[3px]">
                {monthLabels.map((label, i) => (
                  <div key={i} className="w-[11px] overflow-visible text-[10px] leading-none text-zinc-500">
                    <span className="whitespace-nowrap">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) =>
                      day ? (
                        <div
                          key={day.date}
                          title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                          className={`h-[11px] w-[11px] rounded-[3px] ${LEVEL_CLASSES[day.level]}`}
                        />
                      ) : (
                        <div key={`pad-${di}`} className="h-[11px] w-[11px]" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 text-[10px] text-zinc-500">
            Less
            {([0, 1, 2, 3, 4] as const).map((l) => (
              <span key={l} className={`h-[11px] w-[11px] rounded-[3px] ${LEVEL_CLASSES[l]}`} />
            ))}
            More
          </div>
        </>
      )}
    </div>
  );
}
