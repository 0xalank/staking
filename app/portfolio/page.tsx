'use client';
import React, { useContext, useRef, useEffect } from 'react';
import { StateContext, DispatchContext } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, ExternalLink, ArrowRight, Gift, Loader2, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStaking } from '@/lib/hooks/useStaking';
import { formatBalance } from '@/lib/utils/formatBalance';
import { requestAccounts } from '@/lib/wallet';
import { cn } from '@/lib/utils';
import { GridTraffic } from '../page'; // Assuming GridTraffic is exported from homepage

// Connect Wallet Button with particle effects
const ConnectWalletButton = () => {
  const dispatch = useContext(DispatchContext);

  return (
    <Link href="#" className="block group/btn">
        <Button
            onClick={() => requestAccounts(dispatch)}
            className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button"
            style={{
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
            Connect Wallet
        </Button>
    </Link>
  );
};

// Token Logo Component
const TokenLogo = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-red-9/20 rounded-full blur-md" />
      <Image
        src="/images/quai-logo.png"
        alt="QUAI"
        width={size}
        height={size}
        className="rounded-full relative z-10"
      />
    </div>
  );
};

export default function Portfolio() {
  const { account } = useContext(StateContext);
  const staking = useStaking();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  const formatTimeLeft = (seconds: number) => {
    if (!seconds || seconds <= 0) return 'Ready';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Get real staking data
  const realQuaiStaked = staking.userInfo ? Number(staking.userInfo.stakedAmountFormatted) : 0;
  const realQuaiClaimable = staking.userInfo ? Number(staking.userInfo.claimableRewardsFormatted) : 0;
  const realQuaiApr = staking.contractInfo ? staking.contractInfo.apy : 0;

  const hasPosition = realQuaiStaked > 0;

  if (!account?.addr) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="modern-card p-8">
            <CardContent className="text-center">
              <Coins className="h-16 w-16 text-red-9/50 mx-auto mb-4 animate-in zoom-in-50 duration-500" />
              <h1 className="text-3xl font-monorama font-bold text-white mb-2 animate-in fade-in-up duration-700 delay-100">Portfolio Access</h1>
              <p className="text-zinc-400 mb-6 animate-in fade-in-up duration-700 delay-200">
                Connect your wallet to view your staking positions and earnings.
              </p>
              <ConnectWalletButton />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Show loading state while staking data is loading
  if (staking.isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="modern-card p-8">
            <CardContent className="text-center">
              <Loader2 className="h-16 w-16 text-red-9 mx-auto mb-4 animate-spin" />
              <h2 className="text-3xl font-monorama font-bold text-white mb-2">Loading Portfolio</h2>
              <p className="text-zinc-400">
                Fetching your staking positions and rewards...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!hasPosition) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="modern-card p-8">
            <CardContent className="text-center">
              <TrendingUp className="h-16 w-16 text-red-9/50 mx-auto mb-4 animate-in zoom-in-50 duration-500" />
              <h2 className="text-3xl font-monorama font-bold text-white mb-2 animate-in fade-in-up duration-700 delay-100">No Active Positions</h2>
              <p className="text-zinc-400 mb-6 animate-in fade-in-up duration-700 delay-200">
                You don&apos;t have any active staking positions yet. Start staking to see your portfolio here.
              </p>
              <Link href="#" className="block group/btn">
                  <Button
                      className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button"
                      style={{
                          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                      }}
                  >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                      Start Staking
                  </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-32 pb-8 px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10 animate-in fade-in-up duration-700">
        <h1 className="text-4xl font-monorama font-bold text-white text-center md:text-left drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">Your Portfolio</h1>

        {/* Portfolio Overview */}
        <Card className="modern-card p-4 overflow-hidden border border-red-9/20">
          <CardContent className="p-0"> {/* Remove default padding */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-red-9/10">
              <div className="text-center px-2 py-3">
                <div className="text-xl sm:text-2xl font-monorama font-bold text-white truncate">{formatNumber(realQuaiStaked)} QUAI</div>
                <div className="text-xs text-zinc-500 truncate mt-1">Total Staked</div>
              </div>
              <div className="text-center px-2 py-3">
                <div className="text-xl sm:text-2xl font-monorama font-bold text-red-400 truncate">{formatNumber(Number(formatBalance(realQuaiClaimable)))} QUAI</div>
                <div className="text-xs text-zinc-500 truncate mt-1">Claimable</div>
              </div>
              <div className="text-center px-2 py-3">
                <div className="text-xl sm:text-2xl font-monorama font-bold text-green-400 truncate">+{realQuaiApr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>
                <div className="text-xs text-zinc-500 truncate mt-1">Current APR</div>
              </div>
              <div className="text-center px-2 py-3">
                <div className="text-xl sm:text-2xl font-monorama font-bold text-white truncate">1</div>
                <div className="text-xs text-zinc-500 truncate mt-1">Active Pool</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claimable Rewards */}
        {realQuaiClaimable > 0 && (
          <Card className="modern-card bg-gradient-to-r from-red-950/30 to-black/30 border border-red-9/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 group-hover:opacity-20 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-9/20 rounded-full">
                    <Gift className="h-6 w-6 text-red-9" />
                  </div>
                  <div>
                    <h3 className="text-lg font-monorama font-semibold text-white">Available Rewards</h3>
                    <p className="text-3xl font-monorama font-bold text-red-400">{formatBalance(realQuaiClaimable)} QUAI</p>
                    <p className="text-xs text-zinc-500">Claim your accumulated rewards below.</p>
                  </div>
                </div>
                <Button
                    className="bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button h-12 w-full sm:w-auto px-8"
                    style={{
                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                    }}
                    onClick={() => staking.claimRewards()}
                    disabled={staking.isTransacting}
                >
                    {staking.isTransacting ? 'Claiming...' : 'Claim Rewards'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Position */}
        <div className="space-y-4">
          <h2 className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Active Staking Position</h2>

          <Card className="modern-card">
            <CardContent className="p-6">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TokenLogo size={32} />
                  <div>
                    <h3 className="text-lg font-monorama font-semibold text-white">QUAI Staking Pool</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-monorama font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Withdrawal Actions */}
                  {staking.userInfo?.isInExitPeriod && (
                    staking.userInfo?.canExecuteWithdraw ? (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white font-monorama uppercase"
                        onClick={() => staking.executeWithdraw()}
                        disabled={staking.isTransacting}
                      >
                        {staking.isTransacting ? 'Processing...' : 'Complete Withdrawal'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-monorama uppercase"
                        onClick={() => staking.cancelWithdraw()}
                        disabled={staking.isTransacting}
                      >
                        Cancel Withdrawal
                      </Button>
                    )
                  )}

                  <Link href="/stake/native-quai?mode=manage">
                    <Button 
                      size="sm" 
                      className="bg-red-9/20 border border-red-9/50 text-red-9 hover:bg-red-9 hover:text-white font-monorama uppercase transition-all duration-300"
                    >
                      Manage Stake
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pt-4 border-t border-red-9/10">
                <div className="text-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="text-xl font-monorama font-bold text-white">{formatNumber(realQuaiStaked)} QUAI</div>
                  <div className="text-xs text-zinc-500 mt-1">Staked Amount</div>
                </div>

                <div className="text-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="text-xl font-monorama font-bold text-red-400">{formatBalance(realQuaiClaimable)} QUAI</div>
                  <div className="text-xs text-zinc-500 mt-1">Claimable Rewards</div>
                </div>

                <div className="text-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="text-xl font-monorama font-bold text-white">Instant</div>
                  <div className="text-xs text-zinc-500 mt-1">Reward Distribution</div>
                </div>

                <div className="text-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex flex-col justify-center">
                  {staking.userInfo?.isInExitPeriod ? (
                    <>
                      <div className="text-xl font-monorama font-bold text-white">{formatTimeLeft(staking.userInfo?.timeUntilWithdrawalAvailable || 0)}</div>
                      <div className="text-xs text-zinc-500 mt-1">Exit Window</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl font-monorama font-bold text-green-400">Active</div>
                      <div className="text-xs text-zinc-500 mt-1">Status</div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center uppercase tracking-wide font-mono mt-2">
                Withdrawal locked for 30 days after request.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="modern-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase">
                  Stake More
                </Button>
              </Link>
              <Link href="/calculator">
                <Button variant="outline" size="sm" className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase">
                  Calculator
                </Button>
              </Link>
              <a
                href={account?.addr ? `https://quaiscan.io/address/${account.addr}` : "https://quaiscan.io"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase">
                  Explorer
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}