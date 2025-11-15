
import React, { useState, useCallback, useEffect } from 'react';
import type { BrandIdentity } from './types';
import { generateBrandBible } from './services/geminiService';
import Loader from './components/Loader';
import ColorPalette from './components/ColorPalette';
import FontPairing from './components/FontPairing';
import LogoDisplay from './components/LogoDisplay';

const App: React.FC = () => {
  const [mission, setMission] = useState<string>('');
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brandIdentity?.fontPairings) {
      const { header, body } = brandIdentity.fontPairings;
      const fontUrl = `https://fonts.googleapis.com/css2?family=${header.replace(/ /g, '+')}:wght@700&family=${body.replace(/ /g, '+')}:wght@400&display=swap`;
      
      const linkId = 'dynamic-google-fonts';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = fontUrl;
    }
  }, [brandIdentity]);


  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mission.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setBrandIdentity(null);

    try {
      const result = await generateBrandBible(mission);
      setBrandIdentity(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [mission, isLoading]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center my-8">
            <div className="inline-flex items-center space-x-3 bg-slate-800 py-2 px-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                <span className="font-semibold text-slate-200">Gemini Brand Architect</span>
            </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            Brand Identity Generator
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Describe your company's mission and let AI craft a complete brand bible, from logos and colors to typography.
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="e.g., 'An eco-friendly coffee subscription service that delivers ethically sourced beans to your door, promoting sustainability and global coffee culture.'"
                className="w-full h-32 p-4 pr-32 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none text-slate-200 placeholder-slate-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !mission.trim()}
                className="absolute top-1/2 right-4 -translate-y-1/2 px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>

          <div className="min-h-[400px] flex items-center justify-center">
            {isLoading && <Loader />}
            {error && <div className="text-center bg-red-900/50 border border-red-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-300">An Error Occurred</h3>
                <p className="text-red-400 mt-2">{error}</p>
            </div>}

            {brandIdentity && (
              <div className="w-full space-y-8 animate-fade-in">
                <LogoDisplay 
                  primaryLogoUrl={brandIdentity.primaryLogoUrl} 
                  secondaryMarksUrls={brandIdentity.secondaryMarksUrls} 
                />
                <ColorPalette colors={brandIdentity.colorPalette} />
                <FontPairing fonts={brandIdentity.fontPairings} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
