import React from 'react';
import type { Color } from '../types';

interface ColorPaletteProps {
  colors: Color[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const isLight = (hex: string) => {
    if (!hex) return false;
    const color = (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
    if (color.length < 6) return false;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
  }

  return (
    <div className="mt-8 flex flex-col gap-6 rounded-xl p-6 sm:p-8 bg-white/60 dark:bg-[#1b2727] backdrop-blur-xl border border-white/20 dark:border-[#3b5454]">
      <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Color Palette</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="size-20 rounded-lg ring-1 ring-black/10 dark:ring-white/10" style={{ backgroundColor: color.hex }}></div>
            <div className="mt-2 text-center">
               <p className="text-sm font-medium text-slate-800 dark:text-[#E2E8F0]">{color.name}</p>
               <p className={`text-xs ${isLight(color.hex) ? 'text-slate-600' : 'text-slate-500 dark:text-[#9cbaba]'}`}>{color.hex.toUpperCase()}</p>
               <p className="text-xs text-primary mt-1">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;