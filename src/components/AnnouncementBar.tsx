import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center py-3 px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15] text-black text-xs sm:text-sm font-bold shadow-[0_0_22px_rgba(250,204,21,0.4)] hover:shadow-[0_0_28px_rgba(250,204,21,0.6)] transition-shadow cursor-default select-none border border-yellow-300">
        <span className="text-base leading-none">🎁</span>
        <span>Personal Edition — All features are FREE</span>
      </div>
    </div>
  );
};
