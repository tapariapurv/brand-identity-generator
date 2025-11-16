import React from 'react';
import type { FontPairing as FontPairingType } from '../types';

interface FontPairingProps {
  fonts: FontPairingType;
}

const FontPairing: React.FC<FontPairingProps> = ({ fonts }) => {
  const headerStyle = { fontFamily: `'${fonts.header}', sans-serif` };
  const bodyStyle = { fontFamily: `'${fonts.body}', sans-serif` };

  return (
    <div className="mt-8 flex flex-col gap-6 rounded-xl p-6 sm:p-8 bg-white/60 dark:bg-[#1b2727] backdrop-blur-xl border border-white/20 dark:border-[#3b5454]">
      <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Typography</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Header Font */}
        <div>
          <p className="text-sm text-slate-500 dark:text-[#9cbaba]">Header Font: {fonts.header}</p>
          <p className="text-6xl font-bold truncate" style={headerStyle}>Aa</p>
          <div className="mt-4 space-y-2">
             <p className="text-3xl font-bold tracking-tight" style={headerStyle}>Heading 1</p>
             <p className="text-2xl font-bold tracking-tight" style={headerStyle}>Heading 2</p>
             <p className="text-xl font-bold" style={headerStyle}>Heading 3</p>
          </div>
        </div>
        {/* Body Font */}
        <div>
          <p className="text-sm text-slate-500 dark:text-[#9cbaba]">Body Font: {fonts.body}</p>
          <p className="text-6xl" style={bodyStyle}>Aa</p>
          <div className="mt-4 space-y-2">
             <p className="text-base font-normal leading-relaxed" style={bodyStyle}>
               Body text for paragraphs. The quick brown fox jumps over the lazy dog. A showcase of the typeface for longer-form content.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontPairing;