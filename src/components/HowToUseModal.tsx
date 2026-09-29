import React from 'react';
import { X, CheckCircle, ShieldAlert, Cpu, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNow: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  isOpen,
  onClose,
  onStartNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#101014] border border-[#8BD600]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(139,214,0,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#15151A] border border-[#27272D] text-[#8A8A93] hover:text-white hover:border-[#8BD600] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#8BD600]/10 border border-[#8BD600] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#8BD600]" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-[#8BD600] font-bold">
              GUIDE & MASTERCLASS
            </div>
            <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide">
              HOW THE RTX FURY METHOD WORKS
            </h3>
          </div>
        </div>

        {/* Body content */}
        <div className="space-y-6 text-sm text-[#8A8A93]">
          {/* Problem Statement */}
          <div className="p-4 rounded-xl bg-[#15151A] border border-[#27272D]">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>The TikTok Compression Trap</span>
            </div>
            <p className="text-xs leading-relaxed">
              When you upload a standard 1080p or raw 4K clip directly to TikTok via mobile, their automated transcoding pipeline crushes high frequencies, drops frames, and blurs fine motion details. This causes dark gaming clips and high-FPS video edits to look pixelated.
            </p>
          </div>

          {/* 3 Step Formula */}
          <div>
            <h4 className="text-xs font-mono uppercase text-white font-bold mb-3 tracking-wider">
              THE 3-STEP RTX PIPELINE:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#050505] border border-[#27272D]">
                <div className="text-xs font-mono text-[#8BD600] font-bold">STEP 01</div>
                <div className="text-white font-bold text-sm mt-1">Pre-Scale & Frame Rate</div>
                <p className="text-[11px] text-[#8A8A93] mt-1 leading-normal">
                  Upscale canvas to 4K / 1080p with 60 or 120 FPS target to force TikTok&apos;s server into high-bitrate AV1/VP9 distribution profile.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050505] border border-[#27272D]">
                <div className="text-xs font-mono text-[#8BD600] font-bold">STEP 02</div>
                <div className="text-white font-bold text-sm mt-1">Unsharp Convolution</div>
                <p className="text-[11px] text-[#8A8A93] mt-1 leading-normal">
                  Our Topaz-style filter injects high-pass edge contrast so when TikTok compresses the video, the edges remain razor-sharp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050505] border border-[#27272D]">
                <div className="text-xs font-mono text-[#8BD600] font-bold">STEP 03</div>
                <div className="text-white font-bold text-sm mt-1">Target CBR Muxing</div>
                <p className="text-[11px] text-[#8A8A93] mt-1 leading-normal">
                  Export at 20-40 Mbps bitrate threshold to eliminate macro-blocking and color banding in dark gradients.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Best Settings Checklist */}
          <div className="p-4 rounded-xl bg-[#15151A] border border-[#8BD600]/30">
            <h4 className="text-xs font-mono uppercase text-[#9DFF00] font-bold mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8BD600]" />
              <span>RECOMMENDED TIKTOK SETTINGS IN THIS APP:</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-white">
                <CheckCircle className="w-4 h-4 text-[#8BD600] shrink-0" />
                <span><strong>Resolution:</strong> 1080p (9:16) or 4K for maximum clarity</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <CheckCircle className="w-4 h-4 text-[#8BD600] shrink-0" />
                <span><strong>Framerate:</strong> 60 FPS (Ultra Smooth) or 120 FPS</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <CheckCircle className="w-4 h-4 text-[#8BD600] shrink-0" />
                <span><strong>Sharpen:</strong> Medium (Unsharp mask for edge preservation)</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <CheckCircle className="w-4 h-4 text-[#8BD600] shrink-0" />
                <span><strong>Colour Correction:</strong> Vibrant or HDR-style for punchy mobile screens</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-[#27272D] flex items-center justify-between">
          <span className="text-xs font-mono text-[#8BD600]">
            PERSONAL EDITION • 100% FREE
          </span>
          <button
            onClick={() => {
              onClose();
              onStartNow();
            }}
            className="px-6 py-2.5 rounded-lg bg-[#8BD600] hover:bg-[#9DFF00] text-black font-extrabold text-xs tracking-wider uppercase font-display flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,214,0,0.3)]"
          >
            <span>TRY IT NOW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
