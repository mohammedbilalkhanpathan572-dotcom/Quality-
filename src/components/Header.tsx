import React, { useState } from 'react';
import { Zap, User, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenHowToUse: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenHowToUse,
  onNavigate,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'how-to-use', label: 'How to Use', action: onOpenHowToUse },
    { id: 'optimizer', label: 'TikTok Optimizer' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'tiers', label: 'Tiers' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#27272D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: RTX Logo & Brand */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#101014] border border-[#8BD600]/40 flex items-center justify-center relative group-hover:border-[#9DFF00] transition-colors shadow-[0_0_15px_rgba(139,214,0,0.2)]">
            <Zap className="w-5 h-5 text-[#8BD600] group-hover:text-[#9DFF00] transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8BD600] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8BD600]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wider text-white group-hover:text-[#9DFF00] transition-colors font-display">
              RTX FURY METHOD
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8BD600] font-semibold -mt-0.5">
              Personal Edition
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-[#9DFF00] bg-[#101014] border border-[#8BD600]/30 shadow-[0_0_10px_rgba(139,214,0,0.15)]'
                    : 'text-[#8A8A93] hover:text-white hover:bg-[#15151A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Version badge */}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#101014] text-[#8A8A93] border border-[#27272D]">
            v2.0
          </span>

          {/* Personal Unlimited Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#15151A] text-[#9DFF00] border border-[#8BD600]/30">
            <Sparkles className="w-3 h-3 text-[#8BD600]" />
            UNLIMITED
          </span>

          {/* Free Badge */}
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-black bg-[#8BD600] font-bold">
            <ShieldCheck className="w-3 h-3 text-black" />
            FREE
          </span>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            title="Local User Profile & Engine Settings"
            className="w-9 h-9 rounded-lg bg-[#101014] border border-[#27272D] hover:border-[#8BD600] flex items-center justify-center text-[#8A8A93] hover:text-white transition-all shadow-sm group"
          >
            <User className="w-4 h-4 group-hover:text-[#8BD600] transition-colors" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-[#101014] border border-[#27272D] flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#27272D] bg-[#101014] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                if (item.action) {
                  item.action();
                } else {
                  onNavigate(item.id);
                }
              }}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium text-white hover:bg-[#15151A] hover:text-[#9DFF00] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#27272D] flex items-center justify-between text-xs text-[#8A8A93] font-mono">
            <span>VERSION 2.0 • FREE</span>
            <span className="text-[#8BD600]">UNLIMITED LOCAL USE</span>
          </div>
        </div>
      )}
    </header>
  );
};
