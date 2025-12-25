import React, { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionsProps {
  username: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username }) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        // Using GitHub's contribution API via a proxy
        const query = `
          query {
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `;

        // Note: In production, you'd need a GitHub token
        // For demo, we'll generate mock data
        const mockData = generateMockContributions();
        setContributions(mockData.days);
        setTotalContributions(mockData.total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contributions:', error);
        // Fallback to mock data
        const mockData = generateMockContributions();
        setContributions(mockData.days);
        setTotalContributions(mockData.total);
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  const generateMockContributions = () => {
    const days: ContributionDay[] = [];
    const today = new Date();
    let total = 0;

    // Generate 365 days of data
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random contribution count (weighted towards fewer contributions)
      const random = Math.random();
      const count = random > 0.7 ? Math.floor(Math.random() * 15) + 1 : 0;
      
      total += count;
      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count > 0 ? 1 : 0,
      });
    }

    return { days, total };
  };

  const getWeeksData = () => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    contributions.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === contributions.length - 1) {
        weeks.push(currentWeek);
      }
    });

    return weeks;
  };

  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: { month: string; offset: number }[] = [];
    
    contributions.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      
      if (dayOfMonth <= 7 && dayOfWeek === 0) {
        const weekIndex = Math.floor(index / 7);
        labels.push({
          month: months[date.getMonth()],
          offset: weekIndex,
        });
      }
    });

    return labels;
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Contributions
          </h3>
        </div>
        <div className="flex items-center justify-center h-48 rounded-xl bg-white/5">
          <div className="text-zinc-500">Loading contributions...</div>
        </div>
      </div>
    );
  }

  const weeks = getWeeksData();
  const monthLabels = getMonthLabels();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Contributions
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Last Year</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-zinc-100">{totalContributions}</div>
          <p className="text-xs text-zinc-500">Total Commits</p>
        </div>
      </div>

      <div className="rounded-xl bg-white/5 p-6 overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-2 ml-8">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-[10px] text-zinc-500"
                style={{ 
                  marginLeft: index === 0 ? 0 : `${(label.offset - (monthLabels[index - 1]?.offset || 0)) * 11}px`,
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] justify-around pr-2">
              <div className="text-[10px] text-zinc-500 h-[10px] leading-[10px]">Mon</div>
              <div className="text-[10px] text-zinc-500 h-[10px] leading-[10px]">Wed</div>
              <div className="text-[10px] text-zinc-500 h-[10px] leading-[10px]">Fri</div>
            </div>

            {/* Contribution grid */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                  const day = week.find(d => new Date(d.date).getDay() === dayIndex);
                  const hasContribution = day && day.count > 0;

                  return (
                    <div
                      key={dayIndex}
                      className={`w-[10px] h-[10px] rounded-sm transition-all duration-200 hover:ring-2 hover:ring-emerald-400 ${
                        hasContribution
                          ? 'bg-emerald-500'
                          : 'bg-zinc-800/50'
                      }`}
                      title={day ? `${day.date}: ${day.count} contributions` : 'No data'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <GitHubContributions username="ritik-2407" />
        </div>
      </div>
    </div>
  );
}