'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GridTraffic } from '@/components/ui/grid-traffic';
import { cn } from '@/lib/utils';

export default function WhatIsSOAP() {
  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center pt-20 sm:pt-32 pb-8 px-2 sm:px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto space-y-6 relative z-10 animate-in fade-in-up duration-700">
        <Card className="modern-card border border-red-9/20">
          <CardHeader>
            <CardTitle className="text-3xl font-monorama font-bold text-white drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">What is SOAP?</CardTitle>
            <CardDescription className="text-zinc-400">
              Understanding the Subsidized Open-market Acquisition Protocol - How Quai turns merge-mining into token buybacks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Introduction */}
            <section className="space-y-4">
              <div className="bg-red-9/5 border border-red-9/20 rounded-lg p-6">
                <h2 className="text-xl font-monorama font-bold text-white mb-4">SOAP Overview</h2>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  SOAP (Subsidized Open-market Acquisition Protocol) transforms traditional merge-mining into a protocol subsidy mechanism.
                  Instead of miners receiving rewards from multiple chains directly (creating selling pressure), SOAP routes
                  parent chain rewards to protocol-controlled addresses that automatically buy $QUAI tokens.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  The purchased $QUAI is then either burned to reduce supply or distributed to time-locked stakers,
                  creating continuous buy pressure while rewarding long-term network participants.
                </p>
              </div>
            </section>

            {/* The Problem with Traditional Merge Mining */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">The Merge-Mining Innovation</h2>
              <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-6">
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Traditional merge-mining allows miners to work on multiple blockchains simultaneously without splitting
                  their computational power. Famous examples include Namecoin with Bitcoin, and Dogecoin with Litecoin.
                </p>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  <strong className="text-white">The Problem:</strong> In traditional setups, miners receive rewards from both chains directly,
                  often immediately selling the child chain&apos;s tokens, creating ongoing selling pressure.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  <strong className="text-white">SOAP&apos;s Solution:</strong> Channel that flow into permanent protocol support by converting
                  external mining rewards into $QUAI buybacks instead of direct miner payouts.
                </p>
              </div>
            </section>

            {/* How SOAP Works */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">How SOAP Works</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Multi-Chain Mining</h3>
                    <p className="text-zinc-400">
                      Miners with SHA256d (BCH), Scrypt (LTC/DOGE), or KAWPOW hardware can mine $QUAI while
                      their parent chain rewards are automatically routed to protocol-controlled addresses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Automatic $QUAI Buybacks</h3>
                    <p className="text-zinc-400">
                      Parent chain rewards (BCH, LTC, DOGE) are automatically converted to $QUAI at market rates,
                      creating continuous buy pressure instead of selling pressure.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Burn & Reward Distribution</h3>
                    <p className="text-zinc-400">
                      Purchased $QUAI is either burned to reduce supply or distributed to time-locked stakers,
                      creating sustainable yield without token inflation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-9 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-red-9/30">
                    4
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-monorama font-bold text-white">Enhanced Security</h3>
                    <p className="text-zinc-400">
                      Workshares from different algorithms contribute to block weight and economic finality,
                      making reorg attacks more expensive while diversifying the security model.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Innovation */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Technical Innovation: Workshares & AuxPoW</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-blue-400 mb-2 flex items-center gap-2">📋 Workshares</h3>
                  <p className="text-zinc-400 text-sm mb-2">
                    $QUAI blocks are produced exclusively by KAWPOW miners, but other algorithms
                    (SHA256d, Scrypt) can submit &ldquo;workshares&rdquo; that get included in blocks.
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Each workshare proves computational work on parent chains and earns proportional $QUAI rewards.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-purple-400 mb-2 flex items-center gap-2">🔗 AuxPoW Proofs</h3>
                  <p className="text-zinc-400 text-sm mb-2">
                    Auxiliary Proof-of-Work structures verify that parent chain blocks actually
                    paid the protocol address and included required SOAP commitments.
                  </p>
                  <p className="text-zinc-400 text-sm">
                    This ensures trustless verification without requiring changes to existing mining infrastructure.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-green-400 mb-2 flex items-center gap-2">⚖️ Multi-Algorithm Security</h3>
                  <p className="text-zinc-400 text-sm mb-2">
                    Hardware diversity across SHA256d, Scrypt, and KAWPOW ASICs makes it harder
                    for any single manufacturer or hardware class to dominate.
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Each algorithm contributes to block weight, making reorgs proportionally more expensive.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-orange-400 mb-2 flex items-center gap-2">🎛️ Graceful Degradation</h3>
                  <p className="text-zinc-400 text-sm mb-2">
                    SOAP is designed to fail gracefully. If parent chain participation drops to zero,
                    $QUAI continues producing KAWPOW blocks normally.
                  </p>
                  <p className="text-zinc-400 text-sm">
                    There&apos;s no liveness coupling - workshares are purely additive benefits.
                  </p>
                </div>
              </div>
            </section>

            {/* Economic Model */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Economic Model & Incentives</h2>
              <div className="bg-red-9/5 border border-red-9/20 rounded-lg p-6">
                <h3 className="text-lg font-monorama font-bold text-white mb-4">Why Miners Participate</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-md font-monorama font-bold text-green-400 mb-2">Parent Chain Miners (BCH/LTC/DOGE)</h4>
                    <ul className="text-zinc-400 text-sm space-y-1">
                      <li>• Receive $QUAI rewards for workshare submissions</li>
                      <li>• Diversify earnings across multiple tokens</li>
                      <li>• Contribute to Quai security while mining parent chains</li>
                      <li>• Profitability depends on $QUAI price vs parent chain tokens</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-monorama font-bold text-blue-400 mb-2">KAWPOW Miners</h4>
                    <ul className="text-zinc-400 text-sm space-y-1">
                      <li>• Receive standard $QUAI block rewards</li>
                      <li>• Benefit from SOAP buyback pressure on $QUAI price</li>
                      <li>• Secure Quai directly using KAWPOW algorithm</li>
                      <li>• Block production unchanged from standard mining</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-6">
                <h3 className="text-lg font-monorama font-bold text-white mb-3">Market Dynamics</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  <strong className="text-white">$Best Case:</strong> Non-mercenary miners hold their $QUAI rewards while parent chain
                  subsidies create continuous buy pressure, leading to net positive price action.
                </p>
                <p className="text-zinc-400 text-sm mb-3">
                  <strong className="text-white">$Worst Case:</strong> Miners immediately sell $QUAI while protocol buys with subsidies,
                  creating net-zero flow but maintaining price stability.
                </p>
                <p className="text-zinc-400 text-sm">
                  <strong className="text-white">Feedback Loop:</strong> Higher $QUAI prices → More hashrate → Stronger security →
                  More attractive to parent chains → More subsidy flows → More buybacks.
                </p>
              </div>
            </section>

            {/* Key Benefits */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Key Benefits</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-red-400 mb-2 flex items-center gap-2">
                    🔥 Deflationary Mechanism
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Parent chain subsidies fund $QUAI burns, reducing total supply while external miners provide security
                    without requiring $QUAI emission increases.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-green-400 mb-2 flex items-center gap-2">
                    💰 Sustainable Rewards
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Staking rewards come from external protocol subsidies rather than inflation,
                    creating sustainable yield backed by real economic activity.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-blue-400 mb-2 flex items-center gap-2">
                    🛡️ Enhanced Security
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Multi-algorithm workshares increase block weight and reorg costs while diversifying
                    security across different hardware supply chains.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <h3 className="text-lg font-monorama font-bold text-purple-400 mb-2 flex items-center gap-2">
                    📊 Inverted Economics
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Unlike traditional merge-mining that creates selling pressure, SOAP converts
                    external mining into permanent buy pressure and protocol support.
                  </p>
                </div>
              </div>
            </section>

            {/* SOAP Staking Pools */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">SOAP Staking Pools</h2>
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-monorama font-bold text-red-400">Locked $QUAI Pool</h3>
                    <span className="text-sm text-red-300 bg-red-9/30 px-2 py-1 rounded font-monorama uppercase">Highest APR</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-2">
                    Time-locked $QUAI staking with commitment periods. Offers the highest rewards for long-term participants.
                  </p>
                  <div className="text-xs text-zinc-500">
                    • Lock period: 30 days
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits */}
            <section className="space-y-4">
              <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Overall Benefits of SOAP</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2 text-blue-400">📈</div>
                  <h3 className="text-lg font-monorama font-bold text-blue-400 mb-2">Sustainable Yield</h3>
                  <p className="text-zinc-400 text-sm">
                    Protocol-backed rewards create sustainable yield without relying on token inflation.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2 text-red-400">🔥</div>
                  <h3 className="text-lg font-monorama font-bold text-red-400 mb-2">Deflationary Pressure</h3>
                  <p className="text-zinc-400 text-sm">
                    Regular token burns reduce supply over time.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2 text-green-400">🎯</div>
                  <h3 className="text-lg font-monorama font-bold text-green-400 mb-2">Aligned Incentives</h3>
                  <p className="text-zinc-400 text-sm">
                    Rewards long-term holders and active participants in the ecosystem.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-red-9/5 border border-red-9/20 rounded-lg p-6 text-center">
              <h3 className="text-xl font-monorama font-bold text-white mb-2">Ready to Join SOAP?</h3>
              <p className="text-zinc-400 mb-4">
                Start earning sustainable rewards through the SOAP protocol today.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/" className="block group/btn">
                  <Button
                      className="h-12 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button px-8"
                      style={{
                          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                      }}
                  >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                      Start Staking
                  </Button>
                </Link>
                <Link href="/calculator" className="block group/btn">
                  <Button 
                    variant="outline" 
                    className="h-12 bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase px-8"
                  >
                    Use Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
