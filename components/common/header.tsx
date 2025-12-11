'use client';
import Logo from '@/components/ui/logo';
import { requestAccounts, useGetAccounts } from '@/lib/wallet';
import { cn } from '@/lib/utils';
import IconContainer from '@/components/ui/iconContainer';
import { FaDiscord, FaXTwitter, FaTelegram } from 'react-icons/fa6';
import { PiGlobe } from 'react-icons/pi';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { DispatchContext, StateContext } from '@/store';
import { Button } from '@/components/ui/button';
import { shortenAddress } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const { account, web3Provider } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  useGetAccounts();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const connectHandler = () => {
    requestAccounts(dispatch);
  };

  const navItems = [
    { label: 'Stake', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'SOAP Calculator', href: '/calculator' },
    { label: 'How to Stake', href: '/how-to-stake' },
    { label: 'What is SOAP?', href: '/what-is-soap' },
  ];

  return (
    <div className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b',
      scrolled 
        ? 'bg-black/90 backdrop-blur-md border-red-9/20 py-2' 
        : 'bg-transparent border-transparent py-4'
    )}>
      {/* Top decorative line for techno feel */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-9/50 to-transparent opacity-50" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute -inset-2 bg-red-9/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Logo />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-4 bg-zinc-900/50 rounded-full px-2 py-1 border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-1.5 text-sm font-monorama tracking-wide uppercase transition-all duration-300 rounded-full',
                    isActive 
                      ? 'text-white bg-red-9 shadow-[0_0_15px_rgba(226,41,1,0.4)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Socials & Wallet */}
          <div className="flex items-center gap-3">
            
            {/* Social Icons - Hidden on very small screens */}
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-white/10">
              {[
                { icon: <FaXTwitter />, href: 'https://x.com/QuaiNetwork' },
                { icon: <FaDiscord />, href: 'https://discord.gg/quai' },
                { icon: <FaTelegram />, href: 'https://t.me/QuaiNetwork' },
                { icon: <PiGlobe />, href: 'https://qu.ai' },
              ].map((social, i) => (
                <Link key={i} target="_blank" href={social.href} className="group">
                  <div className="p-2 text-zinc-400 hover:text-red-9 hover:bg-red-9/10 rounded-md transition-all duration-300 border border-transparent hover:border-red-9/20">
                    {social.icon}
                  </div>
                </Link>
              ))}
            </div>

            {/* Wallet Button */}
            {web3Provider === undefined ? (
              <a href="https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop" target="_blank">
                <Button 
                  onClick={connectHandler} 
                  disabled={!!account}
                  className="bg-red-9/10 text-red-9 border border-red-9/50 hover:bg-red-9 hover:text-white font-monorama uppercase tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(226,41,1,0.1)] hover:shadow-[0_0_20px_rgba(226,41,1,0.4)]"
                >
                  Install Pelagus
                </Button>
              </a>
            ) : (
              <Button 
                onClick={connectHandler} 
                disabled={!!account}
                className={cn(
                  "font-monorama uppercase tracking-wider border transition-all duration-300",
                  account 
                    ? "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-red-9 hover:text-white"
                    : "bg-red-9 text-white border-red-9 hover:bg-red-8 hover:shadow-[0_0_15px_rgba(226,41,1,0.4)]"
                )}
              >
                {account ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="hidden sm:inline text-xs opacity-70">Cyprus-1</span>
                    <span className="font-mono text-sm">{shortenAddress(account.addr)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/pelagus-logo.png"
                      alt="Pelagus"
                      width={16}
                      height={16}
                      className="rounded-sm opacity-90"
                    />
                    <span>Connect</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation (Scrollable) */}
        <div className="md:hidden overflow-x-auto pb-2 mt-2 -mx-4 px-4 scrollbar-none">
          <div className="flex gap-3 min-w-max">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 text-xs font-monorama tracking-wide uppercase rounded-full border transition-colors',
                  pathname === item.href
                    ? 'bg-red-9/20 border-red-9 text-red-9'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}