'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GridTraffic } from '@/components/ui/grid-traffic';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link as LinkIcon, Check, Wallet, Coins, ArrowRightLeft, Lock, RotateCcw, Lightbulb, Zap, BarChart, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function HowToStake() {
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#faq`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const faqItems = [
    {
      question: "Do I keep custody of my QUAI while staking?",
      answer: "Yes. Your QUAI remains owned by your wallet, but it becomes time-locked by the staking contract until successfully withdrawn."
    },
    {
      question: "Can I withdraw part of my stake before the lock ends?",
      answer: "Yes. Staked tokens can be partially or fully withdrawn when the user chooses. Upon withdrawal, users are subject to a 30 day Exit Period and capital is fully available at the end of the Exit Period."
    },
    {
      question: "Is staking inflationary?",
      answer: "No. Staking rewards come from SOAP protocol subsidies, not from minting new QUAI."
    },
    {
      question: "Is my reward rate fixed when I stake?",
      answer: "No. Reward rates are dynamic and depend on network-wide conditions such as total staked QUAI and available SOAP subsidies. Estimates shown in the app are projections, not guarantees."
    },
    {
      question: "What determines the size of my rewards?",
      answer: "Rewards are influenced by several factors: Total SOAP subsidy flow, Amount of QUAI burned versus distributed to stakers, Total QUAI staked across the network, and Your stake amount."
    },
    {
      question: "What happens if I don’t claim my rewards?",
      answer: "Unclaimed rewards remain associated with your position and can be claimed at any time once available."
    },
    {
      question: "Will I continue earning rewards if I choose to withdraw?",
      answer: "No. Rewards stop accruing once you trigger a withdrawal."
    },
    {
      question: "Can I increase the amount in an existing stake?",
      answer: "Yes. You can add to your stake at any time."
    },
    {
      question: "What happens if I lose access to Pelagus?",
      answer: "If you lose your seed phrase, you permanently lose access to your wallet, including your staked QUAI and rewards. Store your seed phrase securely offline."
    }
  ];

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center pt-24 sm:pt-32 pb-8 px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10 animate-in fade-in-up duration-700">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-monorama font-bold text-white drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">How to Stake $QUAI</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Follow this guide to start earning real yield from the SOAP protocol.
          </p>
        </div>

        {/* Prerequisites */}
        <section className="space-y-6">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">Prerequisites</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-9/10 flex items-center justify-center mb-4 border border-red-9/20">
                  <Wallet className="w-6 h-6 text-red-9" />
                </div>
                <CardTitle className="text-xl font-monorama font-bold text-white">1. Pelagus Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300">
                  You need to have Pelagus wallet installed in your browser to interact with the Quai Network.
                </p>
                <a
                  href="https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    variant="outline" 
                    className="w-full bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-red-9/20 hover:border-red-9/50 hover:text-white font-monorama uppercase transition-all"
                  >
                    Install Pelagus Wallet
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-9/10 flex items-center justify-center mb-4 border border-red-9/20">
                  <Coins className="w-6 h-6 text-red-9" />
                </div>
                <CardTitle className="text-xl font-monorama font-bold text-white">2. $QUAI Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300">
                  Ensure you have enough $QUAI for staking plus a small amount for gas fees.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'MEXC', url: 'https://www.mexc.com/exchange/QUAI_USDT' },
                    { name: 'Gate.io', url: 'https://www.gate.io/trade/QUAI_USDT' },
                    { name: 'LBank', url: 'https://www.lbank.com/trade/quai_usdt' },
                    { name: 'LetsExchange', url: 'https://letsexchange.io/' },
                  ].map((exchange) => (
                    <a
                      key={exchange.name}
                      href={exchange.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-red-9/20 hover:border-red-9/50 hover:text-white font-monorama uppercase text-xs"
                      >
                        {exchange.name}
                      </Button>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Staking Process Timeline */}
        <section className="space-y-8">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">Staking Process</h2>
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-red-9/50 via-red-9/20 to-transparent hidden md:block" />
            
            <div className="space-y-8">
              {[
                { title: "Connect Wallet", desc: "Click the 'Connect' button in the header to link your Pelagus wallet. Ensure you're on the Cyprus-1 network." },
                { title: "Enter Amount", desc: "Navigate to the Stake tab and input the amount of $QUAI you wish to stake. Review the APY and rewards." },
                { title: "Confirm Transaction", desc: "Click 'Deposit' and approve the transaction in your wallet. Your tokens will be staked upon confirmation." },
                { title: "Earn Rewards", desc: "Your staked $QUAI starts earning rewards immediately. Claim them anytime without unstaking." }
              ].map((step, index) => (
                <div key={index} className="relative flex gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-zinc-900 border border-red-9/30 flex items-center justify-center relative z-10 group-hover:border-red-9/80 transition-colors shadow-[0_0_15px_-5px_rgba(226,41,1,0.2)]">
                    <span className="font-monorama font-bold text-xl text-red-9 group-hover:text-white transition-colors">{index + 1}</span>
                  </div>
                  <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-xl p-6 hover:bg-zinc-900/50 hover:border-red-9/20 transition-all">
                    <h3 className="text-lg font-monorama font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-zinc-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Withdrawal Mechanism */}
        <section className="space-y-6">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">Withdrawal Mechanism</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-red-9/30 transition-all group">
              <Zap className="w-8 h-8 text-red-9 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-monorama font-bold text-white mb-2">Instant Staking</h3>
              <p className="text-zinc-400 text-sm">
                Tokens start earning immediately upon deposit. No initial lock-up period required.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-red-9/30 transition-all group">
              <Lock className="w-8 h-8 text-red-9 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-monorama font-bold text-white mb-2">30-Day Lock</h3>
              <p className="text-zinc-400 text-sm">
                Withdrawals trigger a 30-day exit period. Rewards cease during this time.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-red-9/30 transition-all group">
              <RotateCcw className="w-8 h-8 text-red-9 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-monorama font-bold text-white mb-2">Cancel Anytime</h3>
              <p className="text-zinc-400 text-sm">
                Cancel a pending withdrawal to instantly resume earning rewards on your stake.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="space-y-6">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">Pro Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Lightbulb className="w-5 h-5" />, title: "Maximize Rewards", desc: "Long-term staking maximizes yield capture from protocol subsidies." },
              { icon: <Zap className="w-5 h-5" />, title: "Gas Optimization", desc: "Batch your claim and compound transactions to save on network fees." },
              { icon: <BarChart className="w-5 h-5" />, title: "Monitor APY", desc: "APY is dynamic based on total network stake and buyback volume." },
              { icon: <RefreshCw className="w-5 h-5" />, title: "Auto-Compound", desc: "Re-stake rewards periodically to benefit from compound interest effects." }
            ].map((tip, i) => (
              <div key={i} className="flex gap-4 p-4 bg-zinc-900/30 border border-white/5 rounded-xl hover:bg-zinc-900/50 hover:border-red-9/20 transition-all items-start">
                <div className="p-2 bg-red-9/10 rounded-lg text-red-9 mt-1">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-monorama font-bold text-white mb-1">{tip.title}</h3>
                  <p className="text-zinc-400 text-sm">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="space-y-6 scroll-mt-32">
          <div className="flex items-center gap-3 border-l-4 border-red-9 pl-4">
            <h2 className="text-2xl font-monorama font-bold text-white">FAQ</h2>
            <button
              onClick={copyLink}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
              title="Copy link to FAQ"
            >
              {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <LinkIcon className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/5 last:border-0 px-2">
                  <AccordionTrigger className="text-zinc-200 hover:text-red-9 hover:no-underline font-satoshi text-left px-4 py-5 text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-4 pb-6 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <div className="flex justify-center pt-8 pb-12">
          <Link href="/" className="block group/btn w-full max-w-sm">
            <Button
              className="w-full h-16 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button text-lg shadow-[0_0_20px_rgba(226,41,1,0.3)] hover:shadow-[0_0_30px_rgba(226,41,1,0.5)]"
              style={{
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
              Start Staking
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}