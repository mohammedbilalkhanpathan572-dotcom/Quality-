import React from 'react';
import { ArrowDownCircle, BookOpen, Flame, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartOptimizer: () => void;
  onHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOptimizer,
  onHowItWorks,
}) => {
  return (
    <section className="relative pt-8 pb-14 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto flex flex-col items-center">
      {/* Background ambient neon radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8BD600]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Small green badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101014] border border-[#8BD600]/40 text-[#9DFF00] text-xs font-mono font-semibold tracking-wider mb-6 shadow-[0_0_15px_rgba(139,214,0,0.15)]">
        <Sparkles className="w-3.5 h-3.5 text-[#8BD600]" />
        <span>+ RTX FURY METHOD • ENGINE V2</span>
      </div>

      {/* Large Hero Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-display leading-[1.08] max-w-4xl text-balance">
        UPLOAD UP TO <span className="text-[#8BD600] inline-block drop-shadow-[0_0_20px_rgba(139,214,0,0.35)]">4K 120 FPS</span> ON TIKTOK
      </h1>

      {/* Hero Subtitle */}
      <p className="mt-5 text-base sm:text-lg md:text-xl text-[#8A8A93] max-w-2xl text-balance font-normal leading-relaxed">
        Optimize your videos for TikTok while maintaining high quality and smooth motion.
      </p>

      {/* Status & Date Pill */}
      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#101014] border border-[#27272D] text-[11px] font-mono text-[#8A8A93]">
        <span className="w-2 h-2 rounded-full bg-[#8BD600] animate-pulse"></span>
        <span className="text-white font-medium">ENGINE V2 ONLINE</span>
        <span className="text-[#27272D]">|</span>
        <span className="text-[#9DFF00]">CLIENT ACCELERATED</span>
        <span className="text-[#27272D]">|</span>
        <span>NO RECOMPRESSION LOSS</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <button
          onClick={onStartOptimizer}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#8BD600] hover:bg-[#9DFF00] text-black font-extrabold text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(139,214,0,0.4)] hover:shadow-[0_0_35px_rgba(157,255,0,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
        >
          <Flame className="w-4 h-4 text-black fill-black" />
          <span>START OPTIMIZER</span>
        </button>

        <button
          onClick={onHowItWorks}
          className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#101014] hover:bg-[#15151A] text-white hover:text-[#9DFF00] border border-[#27272D] hover:border-[#8BD600]/60 font-semibold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#8A8A93] group-hover:text-[#9DFF00]" />
          <span>HOW IT WORKS</span>
        </button>
      </div>

      {/* Scroll indicator hint */}
      <div className="mt-10 flex items-center gap-1.5 text-xs text-[#8A8A93] font-mono opacity-80 hover:opacity-100 transition-opacity">
        <ArrowDownCircle className="w-4 h-4 text-[#8BD600] animate-bounce" />
        <span>SCROLL DOWN TO OPTIMIZE</span>
      </div>
    </section>
  );
};
