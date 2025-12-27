'use client';

import { GitHubCalendar } from 'react-github-calendar';

const GithubChart = () => {
  return (
    <div className="flex w-full justify-center">
      <GitHubCalendar
        username="ritik-2407"
        blockSize={10}
        blockMargin={4}
        fontSize={12}
        transformData={(data) => data.slice(-364)}
        theme={{
          light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          dark: ['#333', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
        }}
      />
    </div>
  );
};

export default GithubChart;
