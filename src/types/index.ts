export type ResolutionOption = 'auto' | '1080p' | '1440p' | '4k';
export type FpsOption = 30 | 60 | 120;
export type OptimizationMode = 'tiktok_standard' | 'high_quality' | 'maximum_quality' | 'smooth_motion';
export type EncodingMode = 'balanced' | 'quality' | 'maximum_quality';
export type FilterLevel = 'off' | 'low' | 'medium' | 'high';
export type ColourCorrection = 'off' | 'natural' | 'vibrant' | 'hdr';
export type BitrateOption = 'auto' | '10mbps' | '20mbps' | '40mbps' | '60mbps';
export type AspectRatioOption = 'original' | '9:16' | '16:9' | '1:1';

export type TopazPreset = 'none' | 'proteus' | 'gaia' | 'artemis' | 'chronos';
export type HandbrakePreset = 'none' | 'rf18_balanced' | 'hq_tiktok60' | 'production_4k';

export interface OptimizationSettings {
  resolution: ResolutionOption;
  fps: FpsOption;
  optimizationMode: OptimizationMode;
  encoding: EncodingMode;
  sharpen: FilterLevel;
  noiseReduction: FilterLevel;
  colourCorrection: ColourCorrection;
  bitrate: BitrateOption;
  aspectRatio: AspectRatioOption;
  topazPreset: TopazPreset;
  handbrakePreset: HandbrakePreset;
}

export interface VideoMetadata {
  name: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  url: string;
  file?: File;
}

export type ProcessingStage =
  | 'idle'
  | 'analyzing'
  | 'preparing'
  | 'applying_filters'
  | 'encoding'
  | 'finalizing'
  | 'complete'
  | 'error';

export interface ProcessingState {
  isProcessing: boolean;
  stage: ProcessingStage;
  progress: number;
  stageDescription: string;
  startTime?: number;
  estimatedRemainingSec?: number;
  error?: string;
}

export interface ProcessingResult {
  blobUrl: string;
  blobSize: number;
  originalSize: number;
  duration: number;
  outputWidth: number;
  outputHeight: number;
  outputFps: number;
  processingTimeMs: number;
  filtersApplied: string[];
  filename: string;
  timestamp: number;
}

export interface LocalSessionStats {
  totalOptimizations: number;
  filesOptimized: number;
  bytesProcessed: number;
  lastOptimizedAt?: string;
}
