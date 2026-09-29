import React from 'react';
import { Zap, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenHowToUse: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenHowToUse }) => {
  return (
    <footer className="w-full bg-[#050505] border-t border-[#27272D] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101014] border border-[#8BD600]/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#8BD600]" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wider text-white font-display">
                RTX FURY METHOD
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#8BD600]">
                PERSONAL EDITION • FREE
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#8A8A93]">
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-[#9DFF00] transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={onOpenHowToUse}
              className="hover:text-[#9DFF00] transition-colors"
            >
              How to Use
            </button>
            <button
              onClick={() => onNavigate('optimizer')}
              className="hover:text-[#9DFF00] transition-colors"
            >
              TikTok Optimizer
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="hover:text-[#9DFF00] transition-colors"
            >
              Analytics
            </button>
            <button
              onClick={() => onNavigate('tiers')}
              className="hover:text-[#9DFF00] transition-colors"
            >
              Tiers
            </button>
          </div>

          {/* Guarantee pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A93]">
            <ShieldCheck className="w-4 h-4 text-[#8BD600]" />
            <span>Zero Subscription • Client-Side Only</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#27272D]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8A8A93]/80 gap-3 text-center sm:text-left">
          <div>
            RTX FURY METHOD — Personal Edition v2.0. Built for high-fidelity TikTok uploads.
          </div>
          <div className="text-[#8BD600]">
            100% Client Accelerated
          </div>
        </div>
      </div>
    </footer>
  );
};
