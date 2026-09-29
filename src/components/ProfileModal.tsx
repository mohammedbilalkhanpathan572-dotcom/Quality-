import React, { useState, useEffect } from 'react';
import { X, User, HardDrive, Cpu, ShieldCheck, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { getOptimizationHistory, getLocalStats } from '../utils/storage';
import { ProcessingResult } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<Partial<ProcessingResult>[]>([]);
  const [stats, setStats] = useState(() => getLocalStats());

  useEffect(() => {
    if (isOpen) {
      setHistory(getOptimizationHistory());
      setStats(getLocalStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearData = () => {
    if (confirm('Clear local optimization telemetry and session history?')) {
      localStorage.removeItem('rtx_fury_personal_stats');
      localStorage.removeItem('rtx_fury_personal_history');
      setHistory([]);
      setStats(getLocalStats());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#101014] border border-[#27272D] rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#15151A] border border-[#27272D] text-[#8A8A93] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#27272D]">
          <div className="w-14 h-14 rounded-2xl bg-[#15151A] border-2 border-[#8BD600] flex items-center justify-center text-[#8BD600] shadow-[0_0_20px_rgba(139,214,0,0.25)]">
            <User className="w-7 h-7 text-[#9DFF00]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-display">
                LOCAL CREATOR
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8BD600] text-black">
                FREE
              </span>
            </div>
            <p className="text-xs text-[#8A8A93] font-mono mt-0.5">
              Personal Edition • No Login Required
            </p>
          </div>
        </div>

        {/* Tier Status Box */}
        <div className="mb-6 p-4 rounded-xl bg-[#15151A] border border-[#8BD600]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#8BD600]" />
            <div>
              <div className="text-xs font-mono font-bold text-white">ACTIVE LICENSE</div>
              <div className="text-[11px] text-[#8BD600] font-mono font-semibold">
                PERSONAL UNLIMITED • ALL TIERS UNLOCKED
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#8BD600]/15 text-[#9DFF00] border border-[#8BD600]/30 font-bold">
            NO SUBSCRIPTION
          </span>
        </div>

        {/* Engine Hardware Capabilities */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-mono uppercase text-[#8A8A93] font-bold">
            CLIENT HARDWARE ENGINE
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#050505] border border-[#27272D]">
              <div className="text-[10px] text-[#8A8A93]">2D CANVAS</div>
              <div className="text-[#8BD600] font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACCELERATED</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#050505] border border-[#27272D]">
              <div className="text-[10px] text-[#8A8A93]">MEDIA RECORDER</div>
              <div className="text-[#8BD600] font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SUPPORTED</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#050505] border border-[#27272D]">
              <div className="text-[10px] text-[#8A8A93]">MAX FPS TARGET</div>
              <div className="text-white font-bold mt-0.5">120 FPS</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#050505] border border-[#27272D]">
              <div className="text-[10px] text-[#8A8A93]">MAX RESOLUTION</div>
              <div className="text-white font-bold mt-0.5">4K (2160p)</div>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-mono uppercase text-[#8A8A93] font-bold">
            LOCAL USAGE TELEMETRY
          </div>
          <div className="p-3.5 rounded-lg bg-[#050505] border border-[#27272D] flex items-center justify-between text-xs font-mono">
            <div>
              <div className="text-[#8A8A93]">Videos Optimized This Device:</div>
              <div className="text-xl font-bold text-white font-mono-tech mt-0.5">
                {stats.localCount}
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="px-3 py-1.5 rounded bg-[#15151A] hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Close action */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-[#15151A] hover:bg-[#8BD600] text-white hover:text-black border border-[#27272D] hover:border-[#8BD600] text-xs font-bold font-mono uppercase tracking-wider transition-all"
        >
          CLOSE PROFILE
        </button>
      </div>
    </div>
  );
};
