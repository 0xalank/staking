'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GridTraffic } from '@/components/ui/grid-traffic';
import { cn } from '@/lib/utils';
import { Pickaxe, RefreshCcw, Flame, ShieldCheck, Layers, TrendingUp, Lock, Unlock } from 'lucide-react';

export default function WhatIsSOAP() {
  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center pt-24 sm:pt-32 pb-8 px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10 animate-in fade-in-up duration-700">

        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-monorama font-bold text-white drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">What is SOAP?</h1>
          <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Understanding the <span className="text-white font-semibold">Subsidized Open-market Acquisition Protocol</span> — How Quai turns merge-mining into sustainable token buybacks.
          </p>
        </div>

        {/* SOAP Overview Card */}
        <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-9 via-red-600 to-red-9" />
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-monorama font-bold text-white mb-2">The SOAP Mechanism</h2>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  SOAP transforms traditional merge-mining into a protocol subsidy mechanism. Instead of miners receiving rewards directly (creating selling pressure), SOAP routes parent chain rewards to protocol-controlled addresses.
                </p>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  These rewards automatically buy $QUAI tokens, which are then either <span className="text-red-400 font-bold">burned</span> to reduce supply or <span className="text-green-400 font-bold">distributed</span> to stakers, creating continuous buy pressure.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
                <div className="w-32 h-32 rounded-full bg-red-9/10 border border-red-9/20 flex items-center justify-center shadow-[0_0_30px_rgba(226,41,1,0.15)] animate-pulse-slow">
                  <RefreshCcw className="w-16 h-16 text-red-9" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Problem & Solution */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-8 hover:border-red-9/20 transition-all group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-9/10 transition-colors">
              <Layers className="w-6 h-6 text-zinc-400 group-hover:text-red-9 transition-colors" />
            </div>
            <h3 className="text-xl font-monorama font-bold text-white mb-3">The Problem</h3>
            <p className="text-zinc-400 leading-relaxed">
              Traditional merge-mining allows miners to secure multiple chains. However, miners often immediately sell the child chain&apos;s tokens to cover costs, creating persistent selling pressure on the asset.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-8 hover:border-red-9/20 transition-all group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-900/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-zinc-400 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="text-xl font-monorama font-bold text-white mb-3">SOAP&apos;s Solution</h3>
            <p className="text-zinc-400 leading-relaxed">
              Channel that flow into permanent protocol support. By converting external mining rewards into $QUAI buybacks instead of direct miner payouts, SOAP turns merge-mining into a net-positive force.
            </p>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="space-y-8">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                icon: <Pickaxe className="w-6 h-6" />,
                title: "Multi-Chain Mining",
                desc: "Miners secure QUAI while mining parent chains (BCH, LTC, DOGE)."
              },
              {
                icon: <RefreshCcw className="w-6 h-6" />,
                title: "Auto-Buybacks",
                desc: "Parent chain rewards are converted to $QUAI at market rates."
              },
              {
                icon: <Flame className="w-6 h-6" />,
                title: "Burn & Distribute",
                desc: "Purchased $QUAI is burned or sent to stakers as sustainable yield."
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Enhanced Security",
                desc: "Diverse algorithms increase block weight and economic finality."
              }
            ].map((step, i) => (
              <div key={i} className="bg-zinc-900/30 border border-white/5 p-6 rounded-xl relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-4 right-4 text-6xl font-monorama font-bold text-white/5 select-none">{i + 1}</div>
                <div className="w-12 h-12 bg-red-9/10 rounded-full flex items-center justify-center mb-4 text-red-9 group-hover:bg-red-9 group-hover:text-white transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-lg font-monorama font-bold text-white mb-2 relative z-10">{step.title}</h3>
                <p className="text-sm text-zinc-400 relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="space-y-6">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">Technical Innovation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-xl">
              <h3 className="text-lg font-monorama font-bold text-blue-400 mb-2">📋 Workshares</h3>
              <p className="text-zinc-400 text-sm">
                $QUAI blocks are produced by KAWPOW miners, but other algorithms (SHA256d, Scrypt) submit &quot;workshares&quot;. Each workshare proves computational work on parent chains and earns proportional rewards.
              </p>
            </div>
            <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-xl">
              <h3 className="text-lg font-monorama font-bold text-purple-400 mb-2">🔗 AuxPoW Proofs</h3>
              <p className="text-zinc-400 text-sm">
                Auxiliary Proof-of-Work structures verify that parent chain blocks actually paid the protocol address. This ensures trustless verification without changes to existing mining pools.
              </p>
            </div>
          </div>
        </section>

        {/* SOAP Staking Pools */}
        <section className="space-y-6">
          <h2 className="text-2xl font-monorama font-bold text-white border-l-4 border-red-9 pl-4">Staking Pools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-900/20 to-zinc-900 border border-red-9/30 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-red-9 text-white text-xs font-bold px-2 py-1 rounded font-monorama uppercase">Highest APR</span>
              </div>
              <Lock className="w-8 h-8 text-red-9 mb-4" />
              <h3 className="text-xl font-monorama font-bold text-white mb-2">Locked $QUAI Pool</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Time-locked staking for maximum rewards. Best for long-term holders committed to the protocol.
              </p>
              <ul className="text-xs text-zinc-500 space-y-1 font-mono">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 30-day lock period</li>
              </ul>
            </div>


          </div>
        </section>

        {/* CTA */}
        <div className="bg-zinc-900/80 border border-red-9/20 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 pointer-events-none" />
          <h3 className="text-2xl font-monorama font-bold text-white mb-3 relative z-10">Ready to Join SOAP?</h3>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto relative z-10">
            Start earning sustainable rewards through the first Proof-of-Work powered yield protocol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/" className="group/btn w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button px-8 text-lg"
                style={{
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
                Start Staking
              </Button>
            </Link>
            <Link href="/calculator" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-white/5 hover:text-white font-monorama font-bold uppercase tracking-widest px-8 text-lg"
              >
                Calculator
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}