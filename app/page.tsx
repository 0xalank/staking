'use client';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { StateContext } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Activity, Lock, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStaking } from '@/lib/hooks/useStaking';
import { cn } from '@/lib/utils';
import { GridTraffic } from '@/components/ui/grid-traffic';

// --- Components ---

const TokenLogo = ({ token, size = 24 }: { token: string, size?: number }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-red-9/20 rounded-full blur-md" />
      <Image
        src="/images/quai-logo.png"
        alt={token}
        width={size}
        height={size}
        className="rounded-full relative z-10"
      />
    </div>
  );
};

const quaiStakingPool = {
  id: 'native-quai',
  name: 'QUAI',
  token: 'QUAI',
};

const isTestnet = process.env.NEXT_PUBLIC_TESTNET === 'true';

const PoolCard = ({ stakingData, isLoading }: {
  stakingData?: any,
  isLoading?: boolean
}) => {
  const { account } = useContext(StateContext);

  // Format helpers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const userStake = stakingData?.userInfo ? {
    staked: Number(stakingData.userInfo.stakedAmountFormatted || 0),
    earned: Number(stakingData.userInfo.claimableRewardsFormatted || 0),
  } : { staked: 0, earned: 0 };

  const hasStake = userStake.staked > 0;

  return (
    <Card className="relative overflow-hidden bg-black/80 border-red-9/30 backdrop-blur-sm group transition-all duration-300 hover:border-red-9/60 hover:shadow-[0_0_30px_-5px_rgba(226,41,1,0.3)]">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-red-9" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-red-9" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-red-9" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-red-9" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TokenLogo token="QUAI" size={42} />
            <div>
              <CardTitle className="text-2xl font-monorama tracking-wider text-white">
                {quaiStakingPool.name}
              </CardTitle>

            </div>
          </div>
          <div className="text-right">
             <div className="text-xs text-red-9/80 font-mono uppercase mb-1">APY Rate</div>
             {isTestnet ? (
               <div className="text-xl font-bold font-monorama bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                 TBD
               </div>
             ) : isLoading ? (
               <div className="h-6 w-16 bg-red-9/10 animate-pulse rounded" />
             ) : (
               <div className="text-xl font-bold font-monorama bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                 {stakingData?.contractInfo?.apy?.toLocaleString('en-US', { maximumFractionDigits: 1 })}%
               </div>
             )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded hover:border-red-9/30 transition-colors">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 font-mono uppercase">
                    <Activity className="w-3 h-3" /> Total Staked
                </div>
                <div className="text-lg font-semibold text-white">
                     {isTestnet ? "TBD" : stakingData?.contractInfo ? (
                        Number(stakingData.contractInfo.activeStakedFormatted || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }) + " QUAI"
                     ) : "- QUAI"}
                </div>
            </div>
             <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded hover:border-red-9/30 transition-colors">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 font-mono uppercase">
                    <Zap className="w-3 h-3" /> Rewards
                </div>
                <div className="text-lg font-semibold text-white">
                     Instant
                </div>
            </div>
        </div>

        <p className="text-xs text-zinc-500 text-center uppercase tracking-wide font-mono mt-2">
            Withdrawal locked for 30 days after request.
        </p>

        {/* User Position */}
        {hasStake && account?.addr && (
          <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-9/20 rounded p-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Coins className="h-4 w-4 text-red-9" />
              <span className="text-sm text-red-9 font-bold font-mono uppercase tracking-wider">My Position</span>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Staked Amount</span>
                <div className="text-white font-mono text-lg">{formatNumber(userStake.staked)} QUAI</div>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Claimable</span>
                <div className="text-red-400 font-mono text-lg">{Number(userStake.earned).toFixed(3)} QUAI</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
           {hasStake ? (
             <Link href={`/stake/${quaiStakingPool.id}?mode=manage`} className="block group/btn">
                <Button
                  className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button"
                  style={{
                      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                  Manage Stake
                </Button>
              </Link>
           ) : isTestnet ? (
              <Button
                className="w-full h-14 bg-zinc-800 text-zinc-400 font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button cursor-not-allowed"
                style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
                disabled
              >
                Coming Soon
              </Button>
           ) : (
             <Link href={`/stake/${quaiStakingPool.id}`} className="block group/btn">
                <Button
                  className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button"
                  style={{
                      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                  Initialize Stake
                </Button>
              </Link>
           )}
        </div>



      </CardContent>
    </Card>
  );
};

export default function Home() {
  const staking = useStaking();

  // When testnet, don't show live data
  const stakingData = isTestnet ? null : staking;
  const stakingLoading = isTestnet ? false : staking.isLoading;

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center pt-24 md:pt-28 p-4 overflow-hidden selection:bg-red-9/30">

      {/* Background Systems */}
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />

      {/* Glow Center */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col items-center gap-8">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md mb-2 animate-fade-in-down",
            isTestnet ? "border border-zinc-600 bg-zinc-800/50" : "border border-red-9/50 bg-red-9/20"
          )}>
            <span className="relative flex h-3 w-3">
              <span className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isTestnet ? "bg-zinc-500" : "bg-red-9"
              )}></span>
              <span className={cn(
                "relative inline-flex rounded-full h-3 w-3",
                isTestnet ? "bg-zinc-500" : "bg-red-9"
              )}></span>
            </span>
            <span className={cn(
              "text-sm font-monorama font-bold tracking-widest uppercase",
              isTestnet ? "text-zinc-400" : "text-red-9"
            )}>{isTestnet ? 'Coming Soon' : 'Now Live'}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-monorama font-bold text-white tracking-tight uppercase leading-none animate-in fade-in-up duration-700 delay-100">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Proof-of-Work Powered</span><br />
            <span className="text-red-9 drop-shadow-[0_0_15px_rgba(226,41,1,0.5)]">Yield</span>
          </h1>

          <p className="text-zinc-400 max-w-lg mx-auto text-base md:text-lg font-light animate-in fade-in-up duration-700 delay-200">
            Real, sustainable yield distributed from $QUAI buybacks as part of the Subsidized Open-market Acquisition Protocol (SOAP). Learn more at <Link href="/what-is-soap" className="text-red-9 hover:text-red-7 underline">&ldquo;What is SOAP?&rdquo;</Link>
          </p>
        </div>

        {/* Interactive Staking Module */}
        <div className="w-full max-w-md">
          <div className="transform transition-transform duration-500 hover:-translate-y-2">
             <PoolCard
              stakingData={stakingData}
              isLoading={stakingLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
