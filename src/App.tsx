import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnnouncementBar } from './components/AnnouncementBar';
import { HeroSection } from './components/HeroSection';
import { LiveStats } from './components/LiveStats';
import { YourTier } from './components/YourTier';
import { TikTokOptimizer } from './components/TikTokOptimizer';
import { VideoComparison } from './components/VideoComparison';
import { HowToUseModal } from './components/HowToUseModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import {
  OptimizationSettings,
  ProcessingResult,
  VideoMetadata,
} from './types';
import { getCssFilterString } from './utils/videoProcessor';

export default function App() {
  // Navigation & Modals
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  // Stats refresh trigger
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

  // Active Tier preset
  const [activeTierPreset, setActiveTierPreset] = useState<'standard' | 'enhanced' | 'max'>('enhanced');

  // Optimization Settings
  const [settings, setSettings] = useState<OptimizationSettings>({
    resolution: '4k',
    fps: 60,
    optimizationMode: 'high_quality',
    encoding: 'quality',
    sharpen: 'medium',
    noiseReduction: 'low',
    colourCorrection: 'vibrant',
    bitrate: 'auto',
    aspectRatio: 'original',
    topazPreset: 'none',
    handbrakePreset: 'none',
  });

  // Video State
  const [originalMeta, setOriginalMeta] = useState<VideoMetadata | null>(null);
  const [currentResult, setCurrentResult] = useState<ProcessingResult | null>(null);

  // Scroll navigation helper
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Apply Tier Presets
  const handleApplyTierPreset = (tier: 'standard' | 'enhanced' | 'max') => {
    setActiveTierPreset(tier);
    if (tier === 'standard') {
      setSettings((prev) => ({
        ...prev,
        resolution: '1080p',
        fps: 60,
        optimizationMode: 'tiktok_standard',
        encoding: 'balanced',
        sharpen: 'low',
        noiseReduction: 'off',
        colourCorrection: 'natural',
        bitrate: '20mbps',
        topazPreset: 'none',
        handbrakePreset: 'rf18_balanced',
      }));
    } else if (tier === 'enhanced') {
      setSettings((prev) => ({
        ...prev,
        resolution: '4k',
        fps: 60,
        optimizationMode: 'high_quality',
        encoding: 'quality',
        sharpen: 'medium',
        noiseReduction: 'low',
        colourCorrection: 'vibrant',
        bitrate: 'auto',
        topazPreset: 'gaia',
        handbrakePreset: 'hq_tiktok60',
      }));
    } else if (tier === 'max') {
      setSettings((prev) => ({
        ...prev,
        resolution: '4k',
        fps: 120,
        optimizationMode: 'maximum_quality',
        encoding: 'maximum_quality',
        sharpen: 'high',
        noiseReduction: 'medium',
        colourCorrection: 'hdr',
        bitrate: '40mbps',
        topazPreset: 'proteus',
        handbrakePreset: 'hq_tiktok60',
      }));
    }

    // Scroll to optimizer
    const optEl = document.getElementById('optimizer');
    if (optEl) {
      optEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Callback when optimization finishes
  const handleOptimizationComplete = (result: ProcessingResult, meta: VideoMetadata) => {
    setCurrentResult(result);
    setOriginalMeta(meta);
    setStatsRefreshTrigger((prev) => prev + 1);
  };

  const activeFilterString = getCssFilterString(
    settings.colourCorrection,
    settings.sharpen,
    settings.topazPreset
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col relative selection:bg-[#8BD600] selection:text-black">
      {/* Subtle ambient cyber grid backdrop */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Sticky Header */}
        <Header
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenHowToUse={() => setIsHowToUseOpen(true)}
          onNavigate={handleNavigate}
          activeSection={activeSection}
        />

        {/* Yellow Announcement Pill */}
        <AnnouncementBar />

        {/* Hero Section */}
        <HeroSection
          onStartOptimizer={() => handleNavigate('optimizer')}
          onHowItWorks={() => setIsHowToUseOpen(true)}
        />

        {/* Live Session Stats */}
        <LiveStats refreshTrigger={statsRefreshTrigger} />

        {/* Your Tier */}
        <YourTier
          onApplyTierPreset={handleApplyTierPreset}
          activeTierPreset={activeTierPreset}
        />

        {/* Main TikTok Optimizer */}
        <TikTokOptimizer
          settings={settings}
          onUpdateSettings={setSettings}
          onOptimizationComplete={handleOptimizationComplete}
          currentResult={currentResult}
        />

        {/* Video Comparison Section */}
        <VideoComparison
          originalMeta={originalMeta}
          optimizedResult={currentResult}
          filterString={activeFilterString}
        />

        {/* Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenHowToUse={() => setIsHowToUseOpen(true)}
        />
      </div>

      {/* Modals */}
      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
        onStartNow={() => {
          setIsHowToUseOpen(false);
          handleNavigate('optimizer');
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
