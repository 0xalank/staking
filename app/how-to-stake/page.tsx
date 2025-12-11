'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GridTraffic } from '@/components/ui/grid-traffic';
import { cn } from '@/lib/utils';

export default function HowToStake() {
  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center pt-20 sm:pt-32 pb-8 px-2 sm:px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto space-y-6 relative z-10 animate-in fade-in-up duration-700">
        <Card className="modern-card border border-red-9/20">
          <CardHeader>
            <CardTitle className="text-3xl font-monorama font-bold text-white drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">How to Stake $QUAI</CardTitle>
            <CardDescription className="text-zinc-400">
              Learn how to stake your $QUAI tokens and earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Prerequisites */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Prerequisites</h2>
              <div className="space-y-3">
                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-red-9 mb-2">1. Pelagus Wallet</h3>
                  <p className="text-zinc-400 mb-2">
                    You need to have Pelagus wallet installed in your browser to interact with the Quai Network.
                  </p>
                  <a
                    href="https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase"
                    >
                      Install Pelagus Wallet →
                    </Button>
                  </a>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-red-9 mb-2">2. $QUAI Tokens</h3>
                  <p className="text-zinc-400 mb-3">
                    You need $QUAI tokens in your wallet to stake. Make sure you have enough $QUAI for staking plus a small amount for gas fees.
                  </p>
                  <p className="text-zinc-400 mb-3">
                    Get QUAI from these exchanges:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://www.mexc.com/exchange/QUAI_USDT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase"
                      >
                        MEXC →
                      </Button>
                    </a>
                    <a
                      href="https://www.gate.io/trade/QUAI_USDT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase"
                      >
                        Gate.io →
                      </Button>
                    </a>
                    <a
                      href="https://letsexchange.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase"
                      >
                        LetsExchange →
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="bg-zinc-900/50 border border-zinc-700 text-zinc-500 font-monorama uppercase cursor-not-allowed"
                    >
                      Kraken (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Staking Steps */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Staking Process</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Connect Your Wallet</h3>
                    <p className="text-zinc-400">
                      Click the &ldquo;Connect&rdquo; button in the header to connect your Pelagus wallet. Make sure you&apos;re on the Cyprus-1 network.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Enter Staking Amount</h3>
                    <p className="text-zinc-400">
                      Navigate to the Stake tab and enter the amount of $QUAI you want to stake. The interface will show you the current APY and your expected rewards.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Confirm Transaction</h3>
                    <p className="text-zinc-400">
                      Click &ldquo;Deposit&rdquo; and confirm the transaction in your Pelagus wallet. Your tokens will be staked after the transaction is confirmed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    4
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Earn Rewards</h3>
                    <p className="text-zinc-400">
                      Your staked $QUAI will start earning rewards immediately. You can claim your rewards at any time without unstaking your principal.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Withdrawal Mechanism */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Understanding the Withdrawal Process</h2>
              <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-monorama font-bold text-white flex items-center gap-2">
                    <span className="text-red-9 mr-2">✅</span> Instant Staking
                  </h3>
                  <p className="text-zinc-400">
                    When you stake $QUAI, your tokens immediately start earning rewards. There is no initial lock period - you can request a withdrawal at any time.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-monorama font-bold text-white flex items-center gap-2">
                    <span className="text-red-9 mr-2">🔒</span> 30-Day Withdrawal Lock
                  </h3>
                  <p className="text-zinc-400">
                    When you request a withdrawal, your tokens enter a 30-day lock period. During this time, the withdrawn amount stops earning rewards. After 30 days, you can complete the withdrawal and receive your tokens.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-monorama font-bold text-white flex items-center gap-2">
                    <span className="text-red-9 mr-2">↩️</span> Cancel Withdrawal
                  </h3>
                  <p className="text-zinc-400">
                    Changed your mind? You can cancel a pending withdrawal at any time during the 30-day lock period. Your tokens will return to active staking and resume earning rewards immediately.
                  </p>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Tips for Stakers</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-red-400 mb-2 flex items-center gap-2">
                    💡 Maximize Rewards
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Stake for longer periods to maximize your rewards. The lock mechanism ensures committed stakers earn the best returns.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-orange-400 mb-2 flex items-center gap-2">
                    ⚡ Gas Optimization
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Batch your transactions when possible. Claiming rewards and re-staking in one session saves on gas fees.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    📊 Monitor APY
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Keep an eye on the APY as it can change based on the total staked amount and reward distribution.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-green-400 mb-2 flex items-center gap-2">
                    🔄 Auto-Compound
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Consider claiming and re-staking your rewards periodically to benefit from compound interest.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <Link href="/" className="block group/btn">
                  <Button
                      className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button"
                      style={{
                          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                      }}
                  >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                      Start Staking Now →
                  </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}