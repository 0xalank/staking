'use client';
import React, { useContext, useState } from 'react';
import { StateContext } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStaking } from '@/lib/hooks/useStaking';
import { StakingInfo } from '@/components/ui/staking-info';
import { GridTraffic } from '@/components/ui/grid-traffic';
import { cn } from '@/lib/utils';

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

// Pool data - only native QUAI
const poolData = {
  id: 'native-quai',
  name: '$QUAI',
  description: 'Stake $QUAI tokens and earn instant rewards',
};

export default function StakePage() {
  const params = useParams();
  const { account } = useContext(StateContext);
  const [showDetails, setShowDetails] = useState(false);

  // Use real staking hook for native QUAI
  const staking = useStaking();

  const poolId = params.id as string;

  // Only support native-quai pool
  if (poolId !== 'native-quai') {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-red-9/30">
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        <GridTraffic />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="text-center relative z-10">
          <h1 className="text-3xl font-monorama font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(226,41,1,0.2)]">Pool Not Found</h1>
          <Link href="/" className="block group/btn">
            <Button 
                className="h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button px-8"
                style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                Back to Pools
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-20 sm:pt-32 pb-8 px-2 sm:px-4 overflow-hidden selection:bg-red-9/30">
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto relative z-10 animate-in fade-in-up duration-700">

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-red-9 transition-colors font-monorama uppercase text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to All Pools
          </Link>
        </div>

        {/* Pool Header */}
        <Card className="modern-card border border-red-9/20 mb-6">
          <CardHeader>
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <TokenLogo size={48} />
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl font-monorama font-bold text-white">{poolData.name} Pool</CardTitle>
                <p className="text-zinc-400 text-sm sm:text-base">{poolData.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 border-t border-red-9/10 pt-4">
              <div className="text-center">
                <div className="text-base sm:text-lg font-monorama font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin rounded-full h-4 w-4 text-red-9" />
                      <span className="text-xs text-zinc-500">Loading...</span>
                    </div>
                  ) : staking.contractInfo ? (
                    <span>
                      {(staking.contractInfo.apy ?? 0) >= 0 ? '+' : ''}{(staking.contractInfo.apy ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%
                    </span>
                  ) : (
                    '—'
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-1">APR</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-monorama font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin rounded-full h-4 w-4 text-red-9" />
                      <span className="text-xs text-zinc-500">Loading...</span>
                    </div>
                  ) : staking.contractInfo ? (
                    (() => {
                      const v = staking.contractInfo.activeStakedFormatted ?? staking.contractInfo.totalStakedFormatted;
                      const n = Number(v || '0');
                      return n.toLocaleString('en-US', { maximumFractionDigits: 3 });
                    })()
                  ) : (
                    '—'
                  )} QUAI
                </div>
                <div className="text-xs text-zinc-500 mt-1">Active Staked</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-monorama font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin rounded-full h-4 w-4 text-red-9" />
                      <span className="text-xs text-zinc-500">Loading...</span>
                    </div>
                  ) : (
                    'Instant'
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-monorama font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin rounded-full h-4 w-4 text-red-9" />
                      <span className="text-xs text-zinc-500">Loading...</span>
                    </div>
                  ) : (
                    '30 Days'
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Withdrawal Lock</div>
              </div>
            </div>

            {/* Show Details Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:bg-red-9/20 hover:border-red-9/50 hover:text-red-9 font-monorama uppercase flex items-center"
              >
                {showDetails ? (
                  <span className="inline-flex items-center">
                    Hide Details
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    Show Details
                  </span>
                )}
              </Button>
            </div>
          </CardContent>

          {/* Detailed Information */}
          {showDetails && staking.contractInfo && (
            <CardContent className="pt-0 border-t border-red-9/10">
              <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-zinc-400">Current Block</p>
                    <p className="font-monorama font-medium text-white">
                      <a
                        href={`https://quaiscan.io/block/${staking.contractInfo.currentBlock}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-red-9"
                      >
                        <span>{Number(staking.contractInfo.currentBlock).toLocaleString('en-US')}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-400">Reward Per Block</p>
                    <p className="font-monorama font-medium text-white">
                      {Number(staking.contractInfo.rewardPerBlockFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} $QUAI
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-zinc-400">Contract Balance</p>
                    <p className="font-monorama font-medium text-white">
                      {Number(staking.contractInfo.contractBalanceFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} $QUAI
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-400">Reward Balance</p>
                    <p className="font-monorama font-medium text-white">
                      {Number(staking.contractInfo.rewardBalanceFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} $QUAI
                    </p>
                  </div>
                </div>

                {staking.contractInfo.hasUserLimit && (
                  <div className="p-3 bg-zinc-900 border border-red-9/20 rounded-md">
                    <p className="text-zinc-400 text-sm">
                      Pool Limit Per User: {Number(staking.contractInfo.poolLimitPerUserFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} $QUAI
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Real Staking Interface for Native QUAI */}
        <StakingInfo
          userInfo={staking.userInfo}
          contractInfo={staking.contractInfo}
          isLoading={staking.isLoading}
          isTransacting={staking.isTransacting}
          error={staking.error}
          transactionHash={staking.transactionHash}
          onDeposit={(amount: string, durationSeconds: number) => staking.deposit(amount, durationSeconds)}
          onRequestWithdraw={staking.requestWithdraw}
          onExecuteWithdraw={staking.executeWithdraw}
          onCancelWithdraw={staking.cancelWithdraw}
          onClaimRewards={staking.claimRewards}
          onRefresh={staking.refreshData}
          stakedSymbol="$QUAI"
          rewardSymbol="$QUAI"
          availableBalanceFormatted={staking.contractInfo?.userQuaiBalanceFormatted}
          availableBalanceLabel="$QUAI Balance"
        />
      </div>
    </main>
  );
}