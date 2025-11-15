
import React from 'react';
import type { FontPairing as FontPairingType } from '../types';

interface FontPairingProps {
  fonts: FontPairingType;
}

const FontPairing: React.FC<FontPairingProps> = ({ fonts }) => {
  const headerStyle = { fontFamily: `'${fonts.header}', sans-serif` };
  const bodyStyle = { fontFamily: `'${fonts.body}', sans-serif` };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-white mb-4">Typography</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-cyan-400 uppercase tracking-wider mb-1">Header</p>
          <p className="text-2xl lg:text-3xl text-slate-100 font-bold" style={headerStyle}>{fonts.header}</p>
          <p className="text-4xl lg:text-5xl text-slate-200 mt-2 truncate" style={headerStyle}>The quick brown fox</p>
        </div>
        <div>
          <p className="text-sm text-cyan-400 uppercase tracking-wider mb-1">Body</p>
          <p className="text-2xl lg:text-3xl text-slate-100 font-bold" style={bodyStyle}>{fonts.body}</p>
          <p className="text-slate-300 mt-2" style={bodyStyle}>
            The quick brown fox jumps over the lazy dog. It's a classic phrase used for typography samples.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontPairing;
