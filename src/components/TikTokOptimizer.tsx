import React, { useRef, useState, useEffect } from 'react';
import {
  UploadCloud,
  FileVideo,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Download,
  AlertCircle,
  Eye,
  Zap,
  Layers,
  Wand2,
  X,
  Maximize2
} from 'lucide-react';
import {
  OptimizationSettings,
  ProcessingResult,
  ProcessingState,
  VideoMetadata,
} from '../types';
import {
  generateSampleVideo,
  getCssFilterString,
  optimizeVideo,
} from '../utils/videoProcessor';
import { recordOptimization } from '../utils/storage';

interface TikTokOptimizerProps {
  settings: OptimizationSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<OptimizationSettings>>;
  onOptimizationComplete: (result: ProcessingResult, originalMeta: VideoMetadata) => void;
  currentResult: ProcessingResult | null;
}

export const TikTokOptimizer: React.FC<TikTokOptimizerProps> = ({
  settings,
  onUpdateSettings,
  onOptimizationComplete,
  currentResult,
}) => {
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLiveFilterPreview, setShowLiveFilterPreview] = useState(true);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  // Processing state
  const [procState, setProcState] = useState<ProcessingState>({
    isProcessing: false,
    stage: 'idle',
    progress: 0,
    stageDescription: '',
  });

  const shouldCancelRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const livePreviewFilter = getCssFilterString(settings.colourCorrection, settings.sharpen, settings.topazPreset);

  // Format helpers
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle uploaded video file
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|mkv)$/i)) {
      alert('Please upload a valid MP4, MOV, or WebM video file.');
      return;
    }

    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = url;

    tempVideo.onloadedmetadata = () => {
      const detectedCodec = file.type.includes('mp4')
        ? 'AVC1 / H.264'
        : file.type.includes('webm')
        ? 'VP9 / WebM'
        : 'MPEG-4 Container';

      const metadata: VideoMetadata = {
        name: file.name,
        size: file.size,
        duration: tempVideo.duration || 5,
        width: tempVideo.videoWidth || 1080,
        height: tempVideo.videoHeight || 1920,
        fps: 60, // standard baseline
        codec: detectedCodec,
        url,
        file,
      };

      setVideoMeta(metadata);
      setDuration(tempVideo.duration || 0);
      setIsPlaying(false);
      setCurrentTime(0);
    };
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Instant demo clip generator
  const handleLoadDemo = async () => {
    try {
      setIsGeneratingDemo(true);
      const demo = await generateSampleVideo();
      const metadata: VideoMetadata = {
        name: 'rtx_fury_demo_4k60.webm',
        size: demo.blob.size,
        duration: 4,
        width: 1080,
        height: 1920,
        fps: 60,
        codec: 'VP9 High Framerate',
        url: demo.url,
        file: demo.file,
      };
      setVideoMeta(metadata);
      setDuration(4);
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (err) {
      console.error('Failed to create sample video', err);
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  // Toggle playback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Run Optimization Process
  const handleStartOptimization = async () => {
    if (!videoRef.current || !videoMeta) return;

    shouldCancelRef.current = false;
    setProcState({
      isProcessing: true,
      stage: 'analyzing',
      progress: 5,
      stageDescription: 'Analyzing video streams...',
      startTime: Date.now(),
    });

    try {
      const result = await optimizeVideo(
        videoRef.current,
        videoMeta,
        settings,
        (progress, stage, stageDesc) => {
          setProcState((prev) => ({
            ...prev,
            progress,
            stage: stage as any,
            stageDescription: stageDesc,
          }));
        },
        () => shouldCancelRef.current
      );

      // Record to local storage
      recordOptimization(result);

      setProcState({
        isProcessing: false,
        stage: 'complete',
        progress: 100,
        stageDescription: 'Optimization complete!',
      });

      onOptimizationComplete(result, videoMeta);

      // Scroll to comparison smoothly
      setTimeout(() => {
        const compEl = document.getElementById('comparison');
        if (compEl) {
          compEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 350);
    } catch (err: any) {
      if (shouldCancelRef.current) {
        setProcState({
          isProcessing: false,
          stage: 'idle',
          progress: 0,
          stageDescription: 'Optimization cancelled.',
        });
      } else {
        setProcState({
          isProcessing: false,
          stage: 'error',
          progress: 0,
          stageDescription: err?.message || 'Processing failed.',
          error: err?.message || 'Unknown processing error',
        });
      }
    }
  };

  const handleCancel = () => {
    shouldCancelRef.current = true;
    setProcState({
      isProcessing: false,
      stage: 'idle',
      progress: 0,
      stageDescription: 'Process halted.',
    });
  };

  return (
    <section id="optimizer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#27272D]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#8BD600] font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>ENGINE WORKSPACE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display mt-0.5">
            TIKTOK OPTIMIZER
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-3">
          <span className="text-xs font-mono text-[#8A8A93]">PERSONAL EDITION • FREE</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8BD600] text-black">
            CLIENT V2
          </span>
        </div>
      </div>

      {/* Main Grid: Upload & Preview on Left (or top), Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload / Preview */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Upload Dropzone if no video loaded */}
          {!videoMeta ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden group ${
                isDragging
                  ? 'border-[#9DFF00] bg-[#8BD600]/10 shadow-[0_0_30px_rgba(139,214,0,0.3)]'
                  : 'border-[#27272D] hover:border-[#8BD600]/60 bg-[#101014] hover:bg-[#15151A]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelected(e.target.files[0]);
                  }
                }}
              />

              {/* Pulsing upload icon */}
              <div className="w-20 h-20 rounded-2xl bg-[#15151A] border border-[#27272D] group-hover:border-[#8BD600] flex items-center justify-center mb-5 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-105">
                <UploadCloud className="w-10 h-10 text-[#8BD600] group-hover:text-[#9DFF00] transition-colors" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
                DROP YOUR VIDEO HERE
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8A93] mt-2">
                or <span className="text-[#8BD600] underline font-semibold">CLICK TO UPLOAD</span>
              </p>

              {/* Supported formats */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {['MP4', 'MOV', 'WEBM'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded bg-[#15151A] border border-[#27272D] text-[11px] font-mono font-bold text-white"
                  >
                    {fmt}
                  </span>
                ))}
                <span className="text-[11px] font-mono text-[#8A8A93] ml-1">
                  Max file size: 500 MB (Client memory safe)
                </span>
              </div>

              {/* Instant Load Demo Clip Button */}
              <div className="mt-8 pt-6 border-t border-[#27272D]/60 w-full flex flex-col items-center">
                <p className="text-xs text-[#8A8A93] mb-3">No video file on hand?</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadDemo();
                  }}
                  disabled={isGeneratingDemo}
                  className="px-5 py-2.5 rounded-lg bg-[#15151A] hover:bg-[#8BD600] text-[#9DFF00] hover:text-black border border-[#8BD600]/40 text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingDemo ? 'GENERATING 60FPS DEMO CLIP...' : 'LOAD HIGH-MOTION DEMO CLIP'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Video Loaded Preview Card */
            <div className="rounded-2xl bg-[#101014] border border-[#27272D] overflow-hidden flex flex-col">
              {/* Card top toolbar */}
              <div className="px-5 py-3 border-b border-[#27272D] flex items-center justify-between bg-[#15151A]/60">
                <div className="flex items-center gap-2 min-w-0">
                  <FileVideo className="w-4 h-4 text-[#8BD600] shrink-0" />
                  <span className="text-xs font-mono text-white truncate max-w-[200px] sm:max-w-xs font-semibold">
                    {videoMeta.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLiveFilterPreview(!showLiveFilterPreview)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition-colors flex items-center gap-1.5 ${
                      showLiveFilterPreview
                        ? 'bg-[#8BD600]/20 text-[#9DFF00] border-[#8BD600]/50'
                        : 'bg-[#101014] text-[#8A8A93] border-[#27272D]'
                    }`}
                    title="Live preview active color and sharpen filters"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{showLiveFilterPreview ? 'FILTERS ON' : 'FILTERS OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setVideoMeta(null);
                      setIsPlaying(false);
                    }}
                    className="p-1 rounded hover:bg-[#27272D] text-[#8A8A93] hover:text-white transition-colors"
                    title="Upload another video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-[9/16] max-h-[500px] bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoMeta.url}
                  playsInline
                  muted={isMuted}
                  loop
                  onTimeUpdate={() => {
                    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                  }}
                  onEnded={() => setIsPlaying(false)}
                  style={{
                    filter: showLiveFilterPreview ? livePreviewFilter : 'none',
                    transition: 'filter 0.2s ease',
                  }}
                  className="max-h-full max-w-full object-contain cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Big Center Play Overlay Button */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 border border-[#8BD600] flex items-center justify-center text-[#8BD600] hover:scale-110 transition-transform shadow-[0_0_20px_rgba(139,214,0,0.4)] backdrop-blur-sm cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-[#8BD600] ml-1" />
                  </button>
                )}

                {/* Filter preview badge */}
                {showLiveFilterPreview && livePreviewFilter !== 'none' && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 border border-[#8BD600]/40 text-[10px] font-mono text-[#9DFF00] backdrop-blur-sm">
                    LIVE SHARPEN & COLOR PREVIEW
                  </div>
                )}
              </div>

              {/* Video Controls Bar */}
              <div className="p-4 bg-[#15151A] border-t border-[#27272D] space-y-3">
                {/* Scrubber slider */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#8A8A93] w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 1}
                    step="0.05"
                    value={currentTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCurrentTime(val);
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="flex-1 accent-[#8BD600] cursor-pointer h-1.5 bg-[#27272D] rounded-lg"
                  />
                  <span className="text-[11px] font-mono text-[#8A8A93] w-10">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="px-3 py-1.5 rounded bg-[#101014] border border-[#27272D] hover:border-[#8BD600] text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime = 0;
                      }}
                      className="p-1.5 rounded bg-[#101014] border border-[#27272D] hover:text-[#8BD600] text-[#8A8A93] transition-colors"
                      title="Reset playback"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-[#8BD600] font-semibold">
                    {videoMeta.width} x {videoMeta.height} @ {settings.fps} FPS Target
                  </span>
                </div>
              </div>

              {/* Video Technical Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#101014] border-t border-[#27272D] text-xs font-mono">
                <div>
                  <div className="text-[10px] text-[#8A8A93]">RESOLUTION</div>
                  <div className="text-white font-bold">{videoMeta.width} × {videoMeta.height}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8A8A93]">FILE SIZE</div>
                  <div className="text-white font-bold">{formatBytes(videoMeta.size)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8A8A93]">DURATION</div>
                  <div className="text-white font-bold">{formatTime(videoMeta.duration)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8A8A93]">CONTAINER</div>
                  <div className="text-[#8BD600] font-bold truncate">{videoMeta.codec}</div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time processing progress modal/card if running */}
          {procState.isProcessing && (
            <div className="rounded-xl bg-[#101014] border-2 border-[#8BD600] p-6 shadow-[0_0_30px_rgba(139,214,0,0.3)] animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8BD600] animate-ping" />
                  <span className="text-sm font-black text-white font-display uppercase tracking-wide">
                    {procState.stage.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#9DFF00]">
                  {procState.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-[#15151A] rounded-full overflow-hidden border border-[#27272D]">
                <div
                  className="h-full bg-gradient-to-r from-[#8BD600] to-[#9DFF00] transition-all duration-300 shadow-[0_0_10px_#8BD600]"
                  style={{ width: `${procState.progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#8A8A93]">
                <span className="truncate max-w-[280px]">{procState.stageDescription}</span>
                <button
                  onClick={handleCancel}
                  className="text-red-400 hover:text-red-300 underline font-semibold ml-2"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[#27272D] text-[11px] font-mono text-[#8BD600]">
                Browser processing mode: RTX Engine V2 (Client-Side Acceleration via Canvas 2D & MediaStream Encoder)
              </div>
            </div>
          )}

          {/* Quick results callout if ready */}
          {currentResult && !procState.isProcessing && (
            <div className="rounded-xl bg-[#101014] border border-[#8BD600] p-5 shadow-[0_0_20px_rgba(139,214,0,0.2)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#9DFF00]">
                  <CheckCircle2 className="w-5 h-5 text-[#8BD600]" />
                  <span className="font-extrabold text-sm font-display tracking-wide uppercase">
                    OPTIMIZATION READY
                  </span>
                </div>
                <span className="text-xs font-mono text-[#8A8A93]">
                  {Math.round(currentResult.processingTimeMs / 1000)}s encode time
                </span>
              </div>

              <p className="text-xs text-[#8A8A93] mb-4">
                Encoded to {currentResult.outputWidth}x{currentResult.outputHeight} at {currentResult.outputFps} FPS. Enhanced for TikTok upload!
              </p>

              <div className="flex items-center gap-3">
                <a
                  href={currentResult.blobUrl}
                  download={currentResult.filename}
                  className="flex-1 py-3 rounded-lg bg-[#8BD600] hover:bg-[#9DFF00] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,214,0,0.3)] transition-all font-display"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>DOWNLOAD VIDEO ({formatBytes(currentResult.blobSize)})</span>
                </a>

                <a
                  href="#comparison"
                  className="px-4 py-3 rounded-lg bg-[#15151A] hover:bg-[#27272D] text-white border border-[#27272D] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8BD600]" />
                  <span>COMPARE</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Full Control Panel */}
        <div className="lg:col-span-6 bg-[#101014] border border-[#27272D] rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272D]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8BD600]" />
              <h3 className="text-base font-black text-white uppercase font-display tracking-wide">
                OPTIMIZATION CONTROLS
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8BD600]">
              UNLIMITED • FREE
            </span>
          </div>

          {/* 1. Output Resolution */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                OUTPUT RESOLUTION
              </label>
              <span className="text-[11px] font-mono text-[#8BD600]">
                {settings.resolution.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['auto', '1080p', '1440p', '4k'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, resolution: res }))}
                  className={`py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                    settings.resolution === res
                      ? 'bg-[#8BD600] text-black border-[#8BD600] shadow-[0_0_12px_rgba(139,214,0,0.35)]'
                      : 'bg-[#15151A] text-[#8A8A93] hover:text-white border-[#27272D] hover:border-[#8BD600]/40'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Output FPS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                OUTPUT FPS
              </label>
              <span className="text-[11px] font-mono text-[#8BD600]">
                {settings.fps} FPS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([30, 60, 120] as const).map((fps) => (
                <button
                  key={fps}
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, fps }))}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                    settings.fps === fps
                      ? 'bg-[#8BD600] text-black border-[#8BD600] shadow-[0_0_12px_rgba(139,214,0,0.35)]'
                      : 'bg-[#15151A] text-[#8A8A93] hover:text-white border-[#27272D] hover:border-[#8BD600]/40'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          </div>

          {/* 3. Optimization Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                OPTIMIZATION MODE
              </label>
              <span className="text-[11px] font-mono text-[#8A8A93]">
                TikTok Engine Algorithm
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'tiktok_standard', label: 'TikTok Std' },
                { id: 'high_quality', label: 'High Quality' },
                { id: 'maximum_quality', label: 'Max Quality' },
                { id: 'smooth_motion', label: 'Smooth Motion' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      optimizationMode: opt.id as any,
                    }))
                  }
                  className={`py-2 px-1 text-center rounded-lg text-[11px] font-mono font-bold uppercase transition-all border ${
                    settings.optimizationMode === opt.id
                      ? 'bg-[#8BD600] text-black border-[#8BD600] shadow-[0_0_12px_rgba(139,214,0,0.35)]'
                      : 'bg-[#15151A] text-[#8A8A93] hover:text-white border-[#27272D] hover:border-[#8BD600]/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Two-column grid for Sharpen & Noise Reduction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sharpen */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  SHARPEN
                </label>
                <span className="text-[11px] font-mono text-[#8BD600]">
                  {settings.sharpen.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['off', 'low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onUpdateSettings((prev) => ({ ...prev, sharpen: lvl }))}
                    className={`py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-all border ${
                      settings.sharpen === lvl
                        ? 'bg-[#8BD600] text-black border-[#8BD600]'
                        : 'bg-[#15151A] text-[#8A8A93] border-[#27272D] hover:border-[#8BD600]/40'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Noise Reduction */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  NOISE REDUCTION
                </label>
                <span className="text-[11px] font-mono text-[#8BD600]">
                  {settings.noiseReduction.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['off', 'low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, noiseReduction: lvl }))
                    }
                    className={`py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-all border ${
                      settings.noiseReduction === lvl
                        ? 'bg-[#8BD600] text-black border-[#8BD600]'
                        : 'bg-[#15151A] text-[#8A8A93] border-[#27272D] hover:border-[#8BD600]/40'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Colour Correction */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                COLOUR CORRECTION
              </label>
              <span className="text-[11px] font-mono text-[#8BD600]">
                {settings.colourCorrection.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'off', label: 'OFF' },
                { id: 'natural', label: 'Natural' },
                { id: 'vibrant', label: 'Vibrant' },
                { id: 'hdr', label: 'HDR-style' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      colourCorrection: c.id as any,
                    }))
                  }
                  className={`py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                    settings.colourCorrection === c.id
                      ? 'bg-[#8BD600] text-black border-[#8BD600] shadow-[0_0_12px_rgba(139,214,0,0.35)]'
                      : 'bg-[#15151A] text-[#8A8A93] hover:text-white border-[#27272D] hover:border-[#8BD600]/40'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Bitrate & Aspect Ratio Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bitrate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  BITRATE
                </label>
                <span className="text-[11px] font-mono text-[#8BD600]">
                  {settings.bitrate.toUpperCase()}
                </span>
              </div>
              <select
                value={settings.bitrate}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    bitrate: e.target.value as any,
                  }))
                }
                className="w-full py-2 px-3 rounded-lg bg-[#15151A] border border-[#27272D] text-xs font-mono text-white focus:outline-none focus:border-[#8BD600]"
              >
                <option value="auto">Auto (Adaptive 25 Mbps)</option>
                <option value="10mbps">10 Mbps</option>
                <option value="20mbps">20 Mbps</option>
                <option value="40mbps">40 Mbps</option>
                <option value="60mbps">60 Mbps</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  ASPECT RATIO
                </label>
                <span className="text-[11px] font-mono text-[#8BD600]">
                  {settings.aspectRatio}
                </span>
              </div>
              <select
                value={settings.aspectRatio}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    aspectRatio: e.target.value as any,
                  }))
                }
                className="w-full py-2 px-3 rounded-lg bg-[#15151A] border border-[#27272D] text-xs font-mono text-white focus:outline-none focus:border-[#8BD600]"
              >
                <option value="original">Original Aspect</option>
                <option value="9:16">9:16 (TikTok Vertical)</option>
                <option value="16:9">16:9 (Horizontal)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
          </div>

          {/* 7. Topaz-Style Enhancement Preset UI */}
          <div className="p-3.5 rounded-xl bg-[#15151A] border border-[#27272D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#9DFF00]">
                <Wand2 className="w-3.5 h-3.5 text-[#8BD600]" />
                <span>TOPAZ-STYLE ENHANCEMENT PRESETS</span>
              </div>
              <span className="text-[10px] font-mono text-[#8BD600] bg-[#8BD600]/15 px-1.5 py-0.5 rounded">
                FREE PRESET UI
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
              {[
                { id: 'none', label: 'Custom' },
                { id: 'proteus', label: 'Proteus HQ' },
                { id: 'gaia', label: 'Gaia Upscale' },
                { id: 'chronos', label: 'Chronos 120' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      topazPreset: p.id as any,
                      ...(p.id === 'proteus'
                        ? { sharpen: 'medium', colourCorrection: 'natural' }
                        : p.id === 'gaia'
                        ? { sharpen: 'high', colourCorrection: 'vibrant' }
                        : p.id === 'chronos'
                        ? { fps: 120, optimizationMode: 'smooth_motion' }
                        : {}),
                    }))
                  }
                  className={`py-1.5 px-2 rounded text-[11px] font-mono font-semibold transition-all border ${
                    settings.topazPreset === p.id
                      ? 'bg-[#8BD600] text-black border-[#8BD600]'
                      : 'bg-[#101014] text-[#8A8A93] border-[#27272D] hover:border-[#8BD600]/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Handbrake-Style Encoding Preset UI */}
          <div className="p-3.5 rounded-xl bg-[#15151A] border border-[#27272D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#9DFF00]">
                <Layers className="w-3.5 h-3.5 text-[#8BD600]" />
                <span>HANDBRAKE-STYLE ENCODING PRESETS</span>
              </div>
              <span className="text-[10px] font-mono text-[#8BD600] bg-[#8BD600]/15 px-1.5 py-0.5 rounded">
                FREE PRESET UI
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              {[
                { id: 'none', label: 'Default' },
                { id: 'rf18_balanced', label: 'RF 18 Balanced' },
                { id: 'hq_tiktok60', label: 'Production 60' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      handbrakePreset: p.id as any,
                      ...(p.id === 'rf18_balanced'
                        ? { encoding: 'quality', bitrate: '20mbps' }
                        : p.id === 'hq_tiktok60'
                        ? { encoding: 'maximum_quality', bitrate: '40mbps', fps: 60 }
                        : {}),
                    }))
                  }
                  className={`py-1.5 px-2 rounded text-[11px] font-mono font-semibold transition-all border ${
                    settings.handbrakePreset === p.id
                      ? 'bg-[#8BD600] text-black border-[#8BD600]'
                      : 'bg-[#101014] text-[#8A8A93] border-[#27272D] hover:border-[#8BD600]/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button: OPTIMIZE VIDEO */}
          <div className="pt-2">
            <button
              onClick={handleStartOptimization}
              disabled={!videoMeta || procState.isProcessing}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !videoMeta || procState.isProcessing
                  ? 'bg-[#15151A] text-[#8A8A93] border border-[#27272D] cursor-not-allowed opacity-60'
                  : 'bg-[#8BD600] hover:bg-[#9DFF00] text-black shadow-[0_0_30px_rgba(139,214,0,0.45)] hover:shadow-[0_0_40px_rgba(157,255,0,0.6)] hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>
                {procState.isProcessing
                  ? 'PROCESSING IN ENGINE...'
                  : videoMeta
                  ? 'OPTIMIZE VIDEO'
                  : 'UPLOAD A VIDEO TO BEGIN'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
