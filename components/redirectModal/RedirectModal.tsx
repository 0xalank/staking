'use client';
import { useState, useEffect } from 'react';
import { X, Pickaxe, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const RedirectModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500 max-w-[320px] sm:max-w-[380px] hidden md:block">
      <div className="bg-zinc-900/95 backdrop-blur-md border border-red-9/30 rounded-2xl shadow-2xl p-4 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="h-10 w-10 bg-red-9/20 rounded-full flex items-center justify-center border border-red-9/30">
              <Pickaxe className="h-5 w-5 text-red-9" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-monorama mb-1">Where does the yield come from?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              The yield comes from protocol revenue. Track subsidy rewards from merge-mining on the SOAP dashboard.
            </p>
            <Link href="https://soap-dashboard-eight.vercel.app/" target="_blank">
              <Button
                size="sm"
                className="h-8 bg-red-9 hover:bg-red-8 text-white text-xs font-bold uppercase tracking-wide w-full flex items-center gap-2"
              >
                Open Dashboard <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};