import React, { useEffect, useState } from 'react';
import { getLocalStats } from '../utils/storage';
import { Activity, Cpu, HardDrive, Users } from 'lucide-react';

interface LiveStatsProps {
  refreshTrigger?: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ refreshTrigger = 0 }) => {
  const [stats, setStats] = useState(() => getLocalStats());

  useEffect(() => {
    setStats(getLocalStats());
  }, [refreshTrigger]);

  const statCards = [
    {
      label: 'TOTAL OPTIMIZATIONS',
      value: stats.displayTotal.toLocaleString(),
      subtext: stats.localCount > 0 ? `+${stats.localCount} by this device` : 'All sessions combined',
      icon: Activity,
      accent: '#8BD600',
    },
    {
      label: 'USERS',
      value: stats.displayUsers.toLocaleString(),
      subtext: 'Global creator network',
      icon: Users,
      accent: '#9DFF00',
    },
    {
      label: 'OPTIMIZATIONS TODAY',
      value: stats.displayToday.toLocaleString(),
      subtext: 'Local session tracking',
      icon: HardDrive,
      accent: '#8BD600',
    },
    {
      label: 'ENGINE STATUS',
      value: 'ONLINE',
      isStatus: true,
      subtext: 'Browser WebGL & MediaEngine',
      icon: Cpu,
      accent: '#9DFF00',
    },
  ];

  return (
    <section id="analytics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-[#27272D]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#8BD600] font-bold">
            PLATFORM
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display mt-0.5">
            LIVE STATS
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <span className="text-xs font-mono text-[#8A8A93]">LOCAL SESSION STATS</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8BD600]"></span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#101014] hover:bg-[#15151A] border border-[#27272D] hover:border-[#8BD600]/40 rounded-xl p-5 transition-all duration-200 group relative overflow-hidden"
            >
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8BD600]/30 to-transparent group-hover:via-[#9DFF00] transition-all" />

              <div className="flex items-center justify-between text-[#8A8A93] mb-3">
                <span className="text-[11px] font-mono font-semibold tracking-wider">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-[#8BD600] opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-baseline gap-2">
                {card.isStatus ? (
                  <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black font-mono-tech text-white">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8BD600] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8BD600]"></span>
                    </span>
                    <span className="text-[#8BD600]">{card.value}</span>
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl font-black font-mono-tech text-white tracking-tight">
                    {card.value}
                  </div>
                )}
              </div>

              <div className="mt-2 text-xs font-mono text-[#8A8A93] flex items-center justify-between">
                <span>{card.subtext}</span>
                {card.isStatus && (
                  <span className="text-[10px] text-[#8BD600] bg-[#8BD600]/10 px-1.5 py-0.5 rounded border border-[#8BD600]/20">
                    LOW LATENCY
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
