'use client';
import { FaDiscord, FaXTwitter, FaTelegram, FaYoutube } from 'react-icons/fa6';
import { PiGlobe } from 'react-icons/pi';
import Link from 'next/link';

export const FooterSocials = () => {
  return (
    <div className="fixed bottom-6 left-6 z-40 hidden xl:flex items-center gap-2 p-2 bg-zinc-900/80 rounded-full border border-white/5 backdrop-blur-md shadow-lg animate-in slide-in-from-left-10 duration-700 delay-500">
      {[
        { icon: <FaXTwitter />, href: 'https://x.com/QuaiNetwork' },
        { icon: <FaDiscord />, href: 'https://discord.gg/quai' },
        { icon: <FaYoutube />, href: 'https://www.youtube.com/@QuaiNetwork' },
        { icon: <FaTelegram />, href: 'https://t.me/QuaiNetwork' },
        { icon: <PiGlobe />, href: 'https://qu.ai' },
      ].map((social, i) => (
        <Link key={i} target="_blank" href={social.href} className="group">
          <div className="p-2 text-zinc-400 hover:text-red-9 hover:bg-red-9/10 rounded-full transition-all duration-300 border border-transparent hover:border-red-9/20 text-lg hover:scale-110 hover:-translate-y-1">
            {social.icon}
          </div>
        </Link>
      ))}
    </div>
  );
};
