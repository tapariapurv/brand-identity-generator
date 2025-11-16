import React, { useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSubmit(message);
    setMessage('');
  };

  return (
    <div className="mt-8 flex flex-col gap-6 rounded-xl p-6 sm:p-8 bg-white/60 dark:bg-[#1b2727] backdrop-blur-xl border border-white/20 dark:border-[#3b5454]">
      <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Refine Your Brand</h2>
      <p className="text-sm text-slate-500 dark:text-[#9cbaba] -mt-4">
        Not quite right? Tell the AI what you'd like to change.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Change the primary color to a deep blue..."
            className="form-input w-full resize-none rounded-xl border border-slate-300 dark:border-[#3b5454] bg-slate-100/50 dark:bg-[#101919] p-4 text-base font-normal leading-normal text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9cbaba] transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-24"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        <div className="flex w-full justify-end pt-3 mt-4">
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-[#111818] text-base font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(13,242,242,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(13,242,242,0.6)] disabled:bg-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
          >
            <span className="truncate">{isLoading ? 'Refining...' : 'Refine'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;