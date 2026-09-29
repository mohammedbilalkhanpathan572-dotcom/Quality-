import React from 'react';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { OptimizationSettings } from '../types';

interface YourTierProps {
  onApplyTierPreset: (preset: 'standard' | 'enhanced' | 'max') => void;
  activeTierPreset: 'standard' | 'enhanced' | 'max';
}

export const YourTier: React.FC<YourTierProps> = ({
  onApplyTierPreset,
  activeTierPreset,
}) => {
  const tiers = [
    {
      id: 'standard' as const,
      name: 'STANDARD',
      badge: 'FREE',
      description: 'Ideal for standard high-framerate clips with fast turnaround.',
      resolution: '1080p (1080x1920)',
      fps: '60 FPS',
      features: [
        '1080p output',
        '60 FPS motion smoothness',
        'Basic optimization filter',
        'Balanced encoding preset',
        'Original audio passthrough',
        'Instant web download',
      ],
      buttonLabel: 'USE STANDARD',
      isPopular: false,
    },
    {
      id: 'enhanced' as const,
      name: 'ENHANCED',
      badge: 'FREE',
      description: 'High-clarity 4K rendering with vibrant dynamic range.',
      resolution: '4K (2160x3840)',
      fps: '60 FPS',
      features: [
        '4K Ultra HD output option',
        '60 FPS high-motion target',
        'Advanced Topaz-style enhancement',
        'Vibrant & HDR colour grading',
        'Edge sharpening convolution',
        'TikTok bitrate pre-tuning',
      ],
      buttonLabel: 'USE ENHANCED',
      isPopular: true,
    },
    {
      id: 'max' as const,
      name: 'MAX',
      badge: 'FREE',
      description: 'Maximum available browser processing with cinema-grade curves.',
      resolution: '4K (2160x3840)',
      fps: '120 FPS',
      features: [
        '4K Ultra HD output',
        '120 FPS high-refresh rate mode',
        'Maximum available browser processing',
        'Topaz Proteus & Handbrake RF18 presets',
        'High dynamic range (HDR) expander',
        'Unlimited queue & local sessions',
      ],
      buttonLabel: 'USE MAX',
      isPopular: false,
    },
  ];

  return (
    <section id="tiers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-[#27272D]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#8BD600] font-bold">
            CONFIGURATION TIERS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display mt-0.5">
            YOUR TIER
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-2 text-xs font-mono text-[#8BD600]">
          <ShieldCheck className="w-4 h-4 text-[#8BD600]" />
          <span>ALL TIERS 100% UNLOCKED & FREE</span>
        </div>
      </div>

      {/* Green outlined current-tier bar */}
      <div className="mb-8 rounded-xl bg-[#101014] border-2 border-[#8BD600] p-4 sm:p-5 shadow-[0_0_25px_rgba(139,214,0,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8BD600]/10 border border-[#8BD600] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#8BD600]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white font-display tracking-wide">
                PERSONAL EDITION
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8BD600] text-black">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#8A8A93] mt-0.5">
              Zero subscriptions • No accounts • Unlimited local browser video processing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span className="px-3 py-1.5 rounded-lg bg-[#15151A] border border-[#8BD600]/50 text-xs font-mono font-bold text-[#9DFF00] flex items-center gap-1.5 shadow-[0_0_12px_rgba(139,214,0,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8BD600]" />
            UNLIMITED • LOCAL USE
          </span>
        </div>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isActive = activeTierPreset === tier.id;
          return (
            <div
              key={tier.id}
              className={`rounded-xl bg-[#101014] border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isActive
                  ? 'border-[#9DFF00] shadow-[0_0_30px_rgba(139,214,0,0.25)] ring-1 ring-[#9DFF00]'
                  : 'border-[#27272D] hover:border-[#8BD600]/50'
              }`}
            >
              {/* Highlight badge for popular */}
              {tier.isPopular && (
                <div className="bg-[#8BD600] text-black text-[10px] font-mono font-black uppercase text-center py-1 tracking-wider">
                  RECOMMENDED FOR TIKTOK
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-white font-display tracking-wide">
                    {tier.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#8BD600]/15 text-[#9DFF00] border border-[#8BD600]/30">
                    {tier.badge}
                  </span>
                </div>

                <p className="text-xs text-[#8A8A93] min-h-[32px] mb-4">
                  {tier.description}
                </p>

                {/* Specs pill row */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#27272D]">
                  <div className="px-2.5 py-1 rounded bg-[#15151A] border border-[#27272D] text-[11px] font-mono text-white font-semibold">
                    {tier.resolution}
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[#15151A] border border-[#27272D] text-[11px] font-mono text-[#8BD600] font-semibold">
                    {tier.fps}
                  </div>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2.5 text-xs text-[#8A8A93]">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8BD600] shrink-0 mt-0.5" />
                      <span className="text-[#F5F5F5]/90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 mt-4">
                <button
                  onClick={() => onApplyTierPreset(tier.id)}
                  className={`w-full py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer font-display flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-[#9DFF00] text-black shadow-[0_0_20px_rgba(157,255,0,0.4)]'
                      : 'bg-[#15151A] hover:bg-[#8BD600] text-white hover:text-black border border-[#27272D] hover:border-[#8BD600]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isActive ? `ACTIVE (${tier.buttonLabel})` : tier.buttonLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
