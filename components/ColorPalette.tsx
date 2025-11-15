
import React from 'react';
import type { Color } from '../types';

interface ColorPaletteProps {
  colors: Color[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const isDark = (hex: string) => {
    const color = (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 120;
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-white mb-4">Color Palette</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col">
            <div className="w-full h-24 rounded-lg shadow-md" style={{ backgroundColor: color.hex }}></div>
            <div className="mt-2 text-center">
              <p className="font-semibold text-slate-200">{color.name}</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">{color.hex}</p>
              <p className="text-xs text-cyan-400 mt-1">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
