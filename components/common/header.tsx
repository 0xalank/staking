'use client';
import Logo from '@/components/ui/logo';
import { requestAccounts, useGetAccounts, disconnectWallet } from '@/lib/wallet';
import { cn } from '@/lib/utils';
import IconContainer from '@/components/ui/iconContainer';
import { FaDiscord, FaXTwitter, FaTelegram, FaYoutube } from 'react-icons/fa6';
import { PiGlobe } from 'react-icons/pi';
import Link from 'next/link';
import { useContext, useState, useEffect, useRef } from 'react';
import { DispatchContext, StateContext } from '@/store';
import { Button } from '@/components/ui/button';
import { shortenAddress } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, ChevronDown, LogOut, ExternalLink, Copy, Check } from 'lucide-react';

const isTestnet = process.env.NEXT_PUBLIC_TESTNET === 'true';

export default function Header() {
  const { account, web3Provider } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const walletDropdownRef = useRef<HTMLDivElement>(null);

  useGetAccounts();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const connectHandler = () => {
    requestAccounts(dispatch);
  };

  const disconnectHandler = async () => {
    setIsWalletDropdownOpen(false);
    await disconnectWallet(dispatch);
  };

  const copyAddress = () => {
    if (account?.addr) {
      navigator.clipboard.writeText(account.addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close wallet dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setIsWalletDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Stake', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'SOAP Calculator', href: '/calculator' },
    { label: 'How to Stake', href: '/how-to-stake' },
    { label: 'What is SOAP?', href: '/what-is-soap' },
    { label: 'Subsidy Tracker', href: 'https://soap.qu.ai/', external: true },
  ];

  return (
    <>
      <div className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b',
        scrolled 
          ? 'bg-black/90 backdrop-blur-md border-red-9/20 py-2' 
          : 'bg-transparent border-transparent py-3 md:py-4'
      )}>
        {/* Top decorative line for techno feel */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-9/50 to-transparent opacity-50" />

        <div className="container mx-auto px-2 md:px-4 max-w-[1400px]">
          <div className="flex items-center justify-between gap-2 md:gap-6">

            {/* Logo Section - pushed to far left */}
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-2 bg-red-9/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Logo />
              </div>
            </div>

            {/* Desktop Navigation - centered, takes available space */}
            <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/50 rounded-full px-2 py-1 border border-white/5 backdrop-blur-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    className={cn(
                      'relative px-3 py-1.5 text-sm font-monorama tracking-wide uppercase transition-all duration-300 rounded-full whitespace-nowrap flex items-center gap-1',
                      isActive
                        ? 'text-white bg-red-9 shadow-[0_0_15px_rgba(226,41,1,0.4)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                    {item.external && <ExternalLink className="h-3 w-3 opacity-70" />}
                  </Link>
                );
              })}
            </nav>

            {/* Right Section: Socials & Wallet & Hamburger - pushed to far right */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              
              {/* Wallet Button */}
              {isTestnet ? (
                <Button
                  disabled
                  className="bg-zinc-800 text-zinc-500 border border-zinc-700 font-monorama uppercase tracking-wider cursor-not-allowed px-3 md:px-4 text-xs md:text-sm"
                >
                  Coming Soon
                </Button>
              ) : web3Provider === undefined ? (
                <a href="https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop" target="_blank">
                  <Button
                    className="bg-pelagusBlue/10 text-pelagusBlue border border-pelagusBlue/50 hover:bg-pelagusBlue hover:text-white font-monorama uppercase tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(23,117,228,0.1)] hover:shadow-[0_0_20px_rgba(23,117,228,0.4)] px-3 md:px-4 text-xs md:text-sm"
                  >
                    Install Pelagus
                  </Button>
                </a>
              ) : account ? (
                <div className="relative" ref={walletDropdownRef}>
                  <Button
                    onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                    className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-green-500/50 hover:bg-zinc-800 font-monorama uppercase tracking-wider border transition-all duration-300 px-3 md:px-4 text-xs md:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-mono text-sm">{shortenAddress(account.addr)}</span>
                      <ChevronDown className={cn("h-3 w-3 transition-transform", isWalletDropdownOpen && "rotate-180")} />
                    </div>
                  </Button>

                  {/* Dropdown Menu */}
                  {isWalletDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Address Display */}
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <p className="text-xs text-zinc-500 mb-1">Connected Wallet</p>
                        <p className="text-sm font-mono text-white truncate">{account.addr}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={copyAddress}
                          className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'Copied!' : 'Copy Address'}
                        </button>
                        <a
                          href={`https://quaiscan.io/address/${account.addr}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on Explorer
                        </a>
                        <button
                          onClick={disconnectHandler}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={connectHandler}
                  className="bg-pelagusBlue text-white border-pelagusBlue hover:bg-pelagusBlue/80 hover:shadow-[0_0_15px_rgba(23,117,228,0.4)] font-monorama uppercase tracking-wider border transition-all duration-300 px-3 md:px-4 text-xs md:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/pelagus-logo.png"
                      alt="Pelagus"
                      width={16}
                      height={16}
                      className="rounded-sm opacity-90 object-contain"
                    />
                    <span>Connect</span>
                  </div>
                </Button>
              )}

              {/* Hamburger Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-zinc-400 hover:text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Drawer */}
          <div className="absolute right-0 top-0 h-full w-[280px] bg-[#050505] border-l border-red-9/30 shadow-[-10px_0_30px_rgba(226,41,1,0.1)] p-6 animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <span className="text-lg font-monorama font-bold text-white tracking-widest">MENU</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-red-9 hover:bg-red-9/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    className={cn(
                      'px-4 py-3 text-sm font-monorama tracking-wide uppercase rounded-lg transition-all duration-200 border border-transparent flex items-center justify-between',
                      isActive 
                        ? 'bg-red-9/10 text-red-9 border-red-9/30' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                    {item.external && <ExternalLink className="h-3 w-3 opacity-70" />}
                  </Link>
                );
              })}
            </nav>

            {/* Socials in Menu */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex justify-center gap-4">
                {[
                  { icon: <FaXTwitter />, href: 'https://x.com/QuaiNetwork' },
                  { icon: <FaDiscord />, href: 'https://discord.gg/quai' },
                  { icon: <FaYoutube />, href: 'https://www.youtube.com/@QuaiNetwork' },
                  { icon: <FaTelegram />, href: 'https://t.me/QuaiNetwork' },
                  { icon: <PiGlobe />, href: 'https://qu.ai' },
                ].map((social, i) => (
                  <Link key={i} target="_blank" href={social.href} className="text-zinc-500 hover:text-red-9 transition-colors p-2">
                    <span className="text-xl">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}