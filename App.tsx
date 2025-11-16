import React, { useState, useCallback, useEffect } from 'react';
import type { BrandIdentity } from './types';
import type { Chat } from '@google/genai';
import { startBrandGeneration, refineBrandGeneration } from './services/geminiService';
import Loader from './components/Loader';
import ColorPalette from './components/ColorPalette';
import FontPairing from './components/FontPairing';
import LogoDisplay from './components/LogoDisplay';
import ChatInput from './components/ChatInput';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [mission, setMission] = useState<string>('');
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(storedTheme || preferredTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (brandIdentity?.fontPairings) {
      const { header, body } = brandIdentity.fontPairings;
      const headerFont = header.replace(/ /g, '+');
      const bodyFont = body.replace(/ /g, '+');
      const fontUrl = `https://fonts.googleapis.com/css2?family=${headerFont}:wght@700&family=${bodyFont}:wght@400;700&display=swap`;
      
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
    setChat(null);

    try {
      const { brandIdentity: result, chat: chatSession } = await startBrandGeneration(mission);
      setBrandIdentity(result);
      setChat(chatSession);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [mission, isLoading]);
  
  const handleChatSubmit = useCallback(async (refinement: string) => {
    if (!refinement.trim() || !chat || isRefining || !brandIdentity) return;

    setIsRefining(true);
    setError(null);
    
    try {
      const result = await refineBrandGeneration(chat, brandIdentity, refinement);
      setBrandIdentity(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during refinement.');
    } finally {
      setIsRefining(false);
    }
  }, [chat, isRefining, brandIdentity]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden p-4 sm:p-6 md:p-8">
      <header className="flex w-full max-w-5xl items-center justify-between whitespace-nowrap px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-5 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w_org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Brand Bible</h2>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={toggleTheme} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50">
             <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
           </button>
        </div>
      </header>

      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-start py-10 sm:py-20">
        <div className="flex w-full flex-col items-center gap-3 p-4 text-center">
          <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-[#61EFFF] dark:to-primary bg-clip-text text-transparent dark:text-glow">
            Brand Bible
          </h1>
          <p className="text-slate-500 dark:text-[#9cbaba] text-base font-normal leading-normal max-w-md">
            Define your mission. We'll build your brand's universe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-8">
            <div className="w-full">
                <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Enter your company's mission statement, values, and vision..."
                    className="form-input w-full resize-none rounded-xl border border-slate-300 dark:border-[#3b5454] bg-slate-100/50 dark:bg-[#1b2727] p-5 text-base font-normal leading-normal text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9cbaba] transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isLoading}
                />
            </div>
            <div className="flex w-full justify-center py-3 mt-6">
                <button
                    type="submit"
                    disabled={isLoading || !mission.trim()}
                    className="flex min-w-[84px] w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-[#111818] text-base font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(13,242,242,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(13,242,242,0.6)] disabled:bg-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                >
                    <span className="truncate">{isLoading ? 'Generating...' : 'Generate'}</span>
                </button>
            </div>
        </form>

        <div className="w-full mt-12">
            {isLoading && <Loader />}
            {error && <div className="text-center p-6 rounded-lg bg-red-100/50 dark:bg-red-900/20 backdrop-blur-md border border-red-200/80 dark:border-red-700/50">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300">An Error Occurred</h3>
                <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
            </div>}

            {brandIdentity && (
              <div className="w-full space-y-8 animate-fade-in">
                <div className="flex flex-col">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-[#3b5454] to-transparent"></div>
                  <LogoDisplay 
                    primaryLogoUrl={brandIdentity.primaryLogoUrl} 
                    secondaryMarksUrls={brandIdentity.secondaryMarksUrls} 
                  />
                </div>
                <div className="flex flex-col">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-[#3b5454] to-transparent"></div>
                  <ColorPalette colors={brandIdentity.colorPalette} />
                </div>
                <div className="flex flex-col">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-[#3b5454] to-transparent"></div>
                  <FontPairing fonts={brandIdentity.fontPairings} />
                </div>
                
                <div className="flex flex-col pt-8">
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-[#3b5454] to-transparent"></div>
                   <ChatInput onSubmit={handleChatSubmit} isLoading={isRefining} />
                </div>

              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;