import React, { useRef, useState, useEffect } from 'react';
import {
  Columns2,
  Split,
  Play,
  Pause,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { ProcessingResult, VideoMetadata } from '../types';

interface VideoComparisonProps {
  originalMeta: VideoMetadata | null;
  optimizedResult: ProcessingResult | null;
  filterString: string;
}

export const VideoComparison: React.FC<VideoComparisonProps> = ({
  originalMeta,
  optimizedResult,
  filterString,
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'sideBySide'>('split');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const origVideoRef = useRef<HTMLVideoElement>(null);
  const optVideoRef = useRef<HTMLVideoElement>(null);

  // Synchronize playback between original and optimized
  const togglePlay = () => {
    const orig = origVideoRef.current;
    const opt = optVideoRef.current;
    if (!orig) return;

    if (orig.paused) {
      orig.play().catch(() => {});
      if (opt) opt.play().catch(() => {});
      setIsPlaying(true);
    } else {
      orig.pause();
      if (opt) opt.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (origVideoRef.current) {
      setCurrentTime(origVideoRef.current.currentTime);
      if (optVideoRef.current && Math.abs(optVideoRef.current.currentTime - origVideoRef.current.currentTime) > 0.15) {
        optVideoRef.current.currentTime = origVideoRef.current.currentTime;
      }
    }
  };

  // Slider drag events
  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  const activeVideoSrc = optimizedResult?.blobUrl || originalMeta?.url;
  const originalSrc = originalMeta?.url;

  return (
    <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#27272D]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#8BD600] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VISUAL ENHANCEMENT ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display mt-0.5">
            SEE THE DIFFERENCE
          </h2>
          <p className="text-sm text-[#8A8A93] mt-1">
            Compare your original and optimized video.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              viewMode === 'split'
                ? 'bg-[#8BD600] text-black border-[#8BD600] shadow-[0_0_12px_rgba(139,214,0,0.3)]'
                : 'bg-[#101014] text-[#8A8A93] border-[#27272D] hover:text-white'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>SPLIT SLIDER</span>
          </button>

          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-[#8BD600] text-black border-[#8BD600] shadow-[0_0_12px_rgba(139,214,0,0.3)]'
                : 'bg-[#101014] text-[#8A8A93] border-[#27272D] hover:text-white'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>SIDE BY SIDE</span>
          </button>
        </div>
      </div>

      {/* Main Comparison Area */}
      {!originalSrc ? (
        <div className="rounded-2xl bg-[#101014] border border-[#27272D] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#15151A] border border-[#27272D] flex items-center justify-center text-[#8BD600] mb-4">
            <Sliders className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-display">
            Awaiting Video Input
          </h3>
          <p className="text-xs text-[#8A8A93] max-w-md mt-1">
            Upload a video in the TikTok Optimizer above or click &quot;Load Demo Clip&quot; to inspect the real-time split difference slider.
          </p>
          <a
            href="#optimizer"
            className="mt-5 px-5 py-2 rounded-lg bg-[#15151A] hover:bg-[#8BD600] text-[#9DFF00] hover:text-black border border-[#8BD600]/40 text-xs font-mono font-bold transition-all"
          >
            GO TO OPTIMIZER
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'split' ? (
            /* Split Interactive Slider */
            <div
              ref={containerRef}
              className="relative w-full max-w-4xl mx-auto aspect-[9/16] sm:aspect-[16/9] max-h-[620px] bg-black rounded-2xl overflow-hidden border-2 border-[#27272D] shadow-[0_0_35px_rgba(0,0,0,0.8)] select-none cursor-ew-resize group"
            >
              {/* Underlying Optimized Video (Right Side) */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                <video
                  ref={optVideoRef}
                  src={activeVideoSrc}
                  playsInline
                  muted
                  loop
                  style={{
                    filter: optimizedResult ? 'none' : filterString,
                  }}
                  className="w-full h-full object-contain"
                />
                {/* Optimized Label on right */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-black/80 border border-[#8BD600] text-xs font-mono font-bold text-[#9DFF00] shadow-[0_0_10px_rgba(139,214,0,0.3)] backdrop-blur-md">
                  OPTIMIZED (RTX V2)
                </div>
              </div>

              {/* Clipped Original Video (Left Side) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden z-10"
                style={{ width: `${sliderPos}%` }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
                  }}
                >
                  <video
                    ref={origVideoRef}
                    src={originalSrc}
                    playsInline
                    muted
                    loop
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-contain"
                  />
                  {/* Original Label on left */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-black/80 border border-[#27272D] text-xs font-mono font-bold text-white backdrop-blur-md">
                    ORIGINAL
                  </div>
                </div>
              </div>

              {/* Draggable Vertical Divider Handle */}
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="absolute inset-y-0 z-20 w-1 bg-[#8BD600] shadow-[0_0_15px_#8BD600] cursor-ew-resize flex items-center justify-center"
                style={{ left: `calc(${sliderPos}% - 2px)` }}
              >
                <div className="w-8 h-8 rounded-full bg-black border-2 border-[#8BD600] flex items-center justify-center text-[#9DFF00] shadow-[0_0_15px_rgba(139,214,0,0.8)] -ml-[1px]">
                  <Split className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Floating Play/Pause Controls */}
              <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-black/80 border border-[#8BD600]/60 hover:border-[#9DFF00] text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#8BD600]" /> : <Play className="w-3.5 h-3.5 text-[#8BD600]" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY COMPARISON'}</span>
                </button>
              </div>

              {/* Drag instructions hint */}
              <div className="absolute bottom-4 right-4 z-30 hidden sm:block text-[11px] font-mono text-white/70 bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm pointer-events-none">
                DRAG SLIDER TO REVEAL DIFFERENCE
              </div>
            </div>
          ) : (
            /* Side By Side View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Card */}
              <div className="rounded-2xl bg-[#101014] border border-[#27272D] overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 bg-[#15151A] border-b border-[#27272D] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">ORIGINAL VIDEO</span>
                  <span className="text-[10px] font-mono text-[#8A8A93]">UNMODIFIED</span>
                </div>
                <div className="aspect-[9/16] sm:aspect-[16/9] bg-black flex items-center justify-center">
                  <video
                    src={originalSrc}
                    playsInline
                    muted
                    loop
                    controls
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4 bg-[#101014] border-t border-[#27272D] text-xs font-mono text-[#8A8A93] flex justify-between">
                  <span>{originalMeta?.width} × {originalMeta?.height}</span>
                  <span>Baseline Quality</span>
                </div>
              </div>

              {/* Optimized Card */}
              <div className="rounded-2xl bg-[#101014] border-2 border-[#8BD600]/70 shadow-[0_0_20px_rgba(139,214,0,0.15)] overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 bg-[#15151A] border-b border-[#27272D] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#9DFF00] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8BD600]" />
                    OPTIMIZED (RTX V2)
                  </span>
                  <span className="text-[10px] font-mono text-black font-bold bg-[#8BD600] px-1.5 py-0.5 rounded">
                    ENHANCED
                  </span>
                </div>
                <div className="aspect-[9/16] sm:aspect-[16/9] bg-black flex items-center justify-center">
                  <video
                    src={activeVideoSrc}
                    playsInline
                    muted
                    loop
                    controls
                    style={{
                      filter: optimizedResult ? 'none' : filterString,
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4 bg-[#101014] border-t border-[#27272D] text-xs font-mono text-[#8BD600] flex justify-between">
                  <span>
                    {optimizedResult?.outputWidth || originalMeta?.width} × {optimizedResult?.outputHeight || originalMeta?.height}
                  </span>
                  <span>{optimizedResult?.outputFps || 60} FPS Target</span>
                </div>
              </div>
            </div>
          )}

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="bg-[#101014] border border-[#27272D] rounded-xl p-4">
              <div className="text-[10px] font-mono text-[#8A8A93]">RESOLUTION MATRIX</div>
              <div className="text-sm font-mono-tech text-white font-bold mt-1">
                {originalMeta?.width}p → <span className="text-[#8BD600]">{optimizedResult?.outputWidth || '4K (2160p)'}</span>
              </div>
              <div className="text-[10px] text-[#8BD600] mt-0.5">+400% Pixel Density</div>
            </div>

            <div className="bg-[#101014] border border-[#27272D] rounded-xl p-4">
              <div className="text-[10px] font-mono text-[#8A8A93]">FRAMERATE TARGET</div>
              <div className="text-sm font-mono-tech text-white font-bold mt-1">
                {originalMeta?.fps || 30} FPS → <span className="text-[#8BD600]">{optimizedResult?.outputFps || 60} FPS</span>
              </div>
              <div className="text-[10px] text-[#8BD600] mt-0.5">Ultra-Smooth Motion</div>
            </div>

            <div className="bg-[#101014] border border-[#27272D] rounded-xl p-4">
              <div className="text-[10px] font-mono text-[#8A8A93]">TIKTOK RECOMPRESSION</div>
              <div className="text-sm font-mono-tech text-white font-bold mt-1">
                AVOID ARTIFACTS
              </div>
              <div className="text-[10px] text-[#8BD600] mt-0.5">Bitrate Pre-Tuned</div>
            </div>

            <div className="bg-[#101014] border border-[#27272D] rounded-xl p-4">
              <div className="text-[10px] font-mono text-[#8A8A93]">TOPAZ CLARITY</div>
              <div className="text-sm font-mono-tech text-white font-bold mt-1">
                UNSHARP FILTER
              </div>
              <div className="text-[10px] text-[#8BD600] mt-0.5">Active Edge Convolution</div>
            </div>
          </div>

          {/* Download button if optimization completed */}
          {optimizedResult && (
            <div className="flex justify-center pt-2">
              <a
                href={optimizedResult.blobUrl}
                download={optimizedResult.filename}
                className="px-8 py-3.5 rounded-xl bg-[#8BD600] hover:bg-[#9DFF00] text-black font-extrabold text-sm uppercase tracking-wider font-display flex items-center gap-2 shadow-[0_0_25px_rgba(139,214,0,0.4)] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>DOWNLOAD OPTIMIZED FILE</span>
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
