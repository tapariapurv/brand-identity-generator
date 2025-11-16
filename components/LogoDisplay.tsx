import React from 'react';

interface LogoDisplayProps {
  primaryLogoUrl: string;
  secondaryMarksUrls: string[];
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ primaryLogoUrl, secondaryMarksUrls }) => {
  const allLogos = [primaryLogoUrl, ...secondaryMarksUrls];

  return (
    <div className="mt-8 flex flex-col gap-6 rounded-xl p-6 sm:p-8 bg-white/60 dark:bg-[#1b2727] backdrop-blur-xl border border-white/20 dark:border-[#3b5454]">
      <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Logos & Marks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div className="flex flex-col items-center gap-2 col-span-2 sm:col-span-1">
           <p className="text-sm text-slate-500 dark:text-[#9cbaba]">Primary Logo</p>
           <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-[#111818]/50 p-4 ring-1 ring-black/10 dark:ring-white/10">
              <img src={primaryLogoUrl} alt="Primary Logo" className="w-full h-full object-contain" />
           </div>
        </div>
        {secondaryMarksUrls.map((url, index) => (
           <div key={index} className="flex flex-col items-center gap-2">
              <p className="text-sm text-slate-500 dark:text-[#9cbaba]">Secondary Mark</p>
              <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-[#111818]/50 p-4 ring-1 ring-black/10 dark:ring-white/10">
                <img src={url} alt={`Secondary Mark ${index + 1}`} className="w-full h-full object-contain" />
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default LogoDisplay;