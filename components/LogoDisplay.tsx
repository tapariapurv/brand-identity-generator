
import React from 'react';

interface LogoDisplayProps {
  primaryLogoUrl: string;
  secondaryMarksUrls: string[];
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ primaryLogoUrl, secondaryMarksUrls }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-white mb-4">Logos & Marks</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center">
          <p className="text-sm text-cyan-400 uppercase tracking-wider mb-2">Primary Logo</p>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <img src={primaryLogoUrl} alt="Primary Logo" className="w-48 h-48 object-contain" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-cyan-400 uppercase tracking-wider mb-2">Secondary Marks</p>
          <div className="flex space-x-4">
            {secondaryMarksUrls.map((url, index) => (
              <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
                <img src={url} alt={`Secondary Mark ${index + 1}`} className="w-20 h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDisplay;
