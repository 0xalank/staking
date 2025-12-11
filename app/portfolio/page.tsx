'use client';
import React, { useContext } from 'react';
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
import { GridTraffic } from '@/components/ui/grid-traffic';

// Connect Wallet Button
const ConnectWalletButton = () => {
  const dispatch = useContext(DispatchContext);

  return (
    <Button
      onClick={() => requestAccounts(dispatch)}
      className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button text-lg shadow-[0_0_20px_rgba(226,41,1,0.3)] hover:shadow-[0_0_30px_rgba(226,41,1,0.5)]"
      style={{
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
      Connect Wallet
    </Button>
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
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 md:pt-0 p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm p-8">
            <CardContent className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-9/10 rounded-full flex items-center justify-center mx-auto border border-red-9/20 animate-in zoom-in-50 duration-500">
                <Coins className="h-10 w-10 text-red-9" />
              </div>
              <div>
                <h1 className="text-3xl font-monorama font-bold text-white mb-2 animate-in fade-in-up duration-700 delay-100">Portfolio Access</h1>
                <p className="text-zinc-300 animate-in fade-in-up duration-700 delay-200">
                  Connect your wallet to view your staking positions and earnings.
                </p>
              </div>
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
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 md:pt-0 p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm p-8">
            <CardContent className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-9/10 rounded-full flex items-center justify-center mx-auto border border-red-9/20">
                <Loader2 className="h-10 w-10 text-red-9 animate-spin" />
              </div>
              <div>
                <h2 className="text-3xl font-monorama font-bold text-white mb-2">Loading Portfolio</h2>
                <p className="text-zinc-300">
                  Fetching your staking positions and rewards...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!hasPosition) {
    return (
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 md:pt-0 p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm p-8">
            <CardContent className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-9/10 rounded-full flex items-center justify-center mx-auto border border-red-9/20 animate-in zoom-in-50 duration-500">
                <TrendingUp className="h-10 w-10 text-red-9" />
              </div>
              <div>
                <h2 className="text-3xl font-monorama font-bold text-white mb-2 animate-in fade-in-up duration-700 delay-100">No Active Positions</h2>
                <p className="text-zinc-300 animate-in fade-in-up duration-700 delay-200">
                  You don&apos;t have any active staking positions yet. Start staking to see your portfolio here.
                </p>
              </div>
              <Link href="/stake/native-quai" className="block group/btn w-full">
                <Button
                  className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button text-lg shadow-[0_0_20px_rgba(226,41,1,0.3)] hover:shadow-[0_0_30px_rgba(226,41,1,0.5)]"
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
    <main className="relative min-h-[100dvh] flex flex-col items-center pt-24 sm:pt-32 pb-8 px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10 animate-in fade-in-up duration-700">
        <h1 className="text-4xl md:text-5xl font-monorama font-bold text-white text-center md:text-left drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">Your Portfolio</h1>

        {/* Claimable Rewards */}
        {realQuaiClaimable > 0 && (
          <Card className="modern-card bg-gradient-to-r from-red-950/40 to-zinc-900/80 border border-red-9/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-red-9/10 to-transparent pointer-events-none" />

            <CardContent className="p-6 md:p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-red-9/20 rounded-full border border-red-9/30 shadow-[0_0_15px_rgba(226,41,1,0.2)]">
                    <Gift className="h-8 w-8 text-red-9" />
                  </div>
                  <div>
                    <h3 className="text-xl font-monorama font-bold text-white mb-1">Available Rewards</h3>
                    <p className="text-4xl font-monorama font-bold text-red-400 drop-shadow-[0_0_10px_rgba(226,41,1,0.4)]">{formatBalance(realQuaiClaimable)} QUAI</p>
                    <p className="text-sm text-zinc-400 mt-1">Compound and increase your rewards over time.</p>
                  </div>
                </div>
                <Button
                  className="w-full md:w-auto h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button px-8 text-lg shadow-[0_0_20px_rgba(226,41,1,0.3)] hover:shadow-[0_0_30px_rgba(226,41,1,0.5)]"
                  style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}
                  onClick={() => staking.compound()}
                  disabled={staking.isTransacting || staking.userInfo?.isInExitPeriod}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
                  {staking.isTransacting ? 'Compounding...' : 'Compound Rewards'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Position */}
        <div className="space-y-4">
          <h2 className="text-2xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)] border-l-4 border-red-9 pl-4">Active Staking Position</h2>

          <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-9/30 rounded-full blur-md" />
                    <TokenLogo size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-monorama font-bold text-white">QUAI Staking Pool</h3>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  {/* Withdrawal Actions */}
                  {staking.userInfo?.isInExitPeriod && (
                    staking.userInfo?.canExecuteWithdraw ? (
                      <Button
                        size="lg"
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-monorama font-bold uppercase tracking-wide h-12"
                        onClick={() => staking.executeWithdraw()}
                        disabled={staking.isTransacting}
                      >
                        {staking.isTransacting ? 'Processing...' : 'Complete Withdrawal'}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="flex-1 md:flex-none bg-yellow-600 hover:bg-yellow-700 text-white font-monorama font-bold uppercase tracking-wide h-12"
                        onClick={() => staking.cancelWithdraw()}
                        disabled={staking.isTransacting}
                      >
                        Cancel Withdrawal
                      </Button>
                    )
                  )}

                  <Link href="/stake/native-quai?mode=manage" className="flex-1 md:flex-none">
                    <Button
                      size="lg"
                      className="w-full bg-zinc-800 border border-zinc-700 text-white hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama font-bold uppercase tracking-wide transition-all duration-300 h-12 group"
                    >
                      Manage Stake
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl hover:border-red-9/20 transition-colors group">
                  <div className="text-xs text-zinc-400 font-monorama uppercase tracking-wider mb-1">Staked Amount</div>
                  <div className="text-2xl font-monorama font-bold text-white group-hover:text-red-100 transition-colors">{realQuaiStaked.toLocaleString()} QUAI</div>
                </div>

                <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl hover:border-red-9/20 transition-colors group">
                  <div className="text-xs text-zinc-400 font-monorama uppercase tracking-wider mb-1">Claimable Rewards</div>
                  <div className="text-2xl font-monorama font-bold text-red-400 group-hover:text-red-300 transition-colors">{formatBalance(realQuaiClaimable)} QUAI</div>
                </div>

                <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl hover:border-red-9/20 transition-colors group">
                  <div className="text-xs text-zinc-400 font-monorama uppercase tracking-wider mb-1">Current APR</div>
                  <div className="text-2xl font-monorama font-bold text-green-400">+{realQuaiApr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>
                </div>

                <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl hover:border-red-9/20 transition-colors group">
                  <div className="text-xs text-zinc-400 font-monorama uppercase tracking-wider mb-1">Status</div>
                  {staking.userInfo?.isInExitPeriod ? (
                    <>
                      <div className="text-xl font-monorama font-bold text-white mb-1">{formatTimeLeft(staking.userInfo?.timeUntilWithdrawalAvailable || 0)}</div>
                      <div className="text-xs text-zinc-500">Exit Window</div>
                    </>
                  ) : (
                    <div className="text-2xl font-monorama font-bold text-green-400">Active</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 bg-zinc-900/30 py-2 rounded-lg border border-white/5">
                <Lock className="h-3 w-3" />
                <p className="text-xs uppercase tracking-wide font-mono">
                  Withdrawal locked for 30 days after request
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="modern-card border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-white/5 mb-2">
            <CardTitle className="text-xl font-monorama font-bold text-white drop-shadow-[0_0_5px_rgba(226,41,1,0.1)]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3">
              <Link href="/">
                <Button variant="outline" className="bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-red-9/20 hover:border-red-9/50 hover:text-white font-monorama uppercase tracking-wide transition-all h-10 px-6">
                  Stake More
                </Button>
              </Link>
              <Link href="/calculator">
                <Button variant="outline" className="bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-red-9/20 hover:border-red-9/50 hover:text-white font-monorama uppercase tracking-wide transition-all h-10 px-6">
                  Calculator
                </Button>
              </Link>
              <a
                href={account?.addr ? `https://quaiscan.io/address/${account.addr}` : "https://quaiscan.io"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-red-9/20 hover:border-red-9/50 hover:text-white font-monorama uppercase tracking-wide transition-all h-10 px-6 group">
                  Explorer
                  <ExternalLink className="h-3 w-3 ml-2 group-hover:text-red-9 transition-colors" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}