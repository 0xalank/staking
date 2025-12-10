'use client';
import React, { useContext, useState } from 'react';
import { StateContext } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStaking } from '@/lib/hooks/useStaking';
import { StakingInfo } from '@/components/ui/staking-info';

// Token Logo Component
const TokenLogo = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center">
      <Image
        src="/images/quai-logo.png"
        alt="QUAI"
        width={size}
        height={size}
        className="rounded-full"
      />
    </div>
  );
};

// Pool data - only native QUAI
const poolData = {
  id: 'native-quai',
  name: 'QUAI',
  description: 'Stake QUAI tokens and earn instant rewards',
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
      <main className="flex min-h-screen flex-col items-center pt-32 pb-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Pool Not Found</h1>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Back to Pools
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 md:pt-32 pb-8 px-3 sm:px-4">
      <div className="w-full max-w-2xl mx-auto">

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link href="/" className="flex items-center gap-2 text-[#999999] hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Link>
        </div>

        {/* Pool Header */}
        <Card className="bg-[#1a1a1a] border border-[#333333] mb-6">
          <CardHeader>
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <TokenLogo size={48} />
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl text-white">{poolData.name}</CardTitle>
                <p className="text-[#999999] text-sm sm:text-base">{poolData.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      <span className="text-xs text-[#666666]">Loading...</span>
                    </div>
                  ) : staking.contractInfo ? (
                    <span>
                      {staking.contractInfo.apy.toLocaleString('en-US', { maximumFractionDigits: 1 })}%
                    </span>
                  ) : (
                    '—'
                  )}
                </div>
                <div className="text-xs text-[#666666]">APR</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      <span className="text-xs text-[#666666]">Loading...</span>
                    </div>
                  ) : staking.contractInfo ? (
                    (() => {
                      const v = staking.contractInfo.activeStakedFormatted ?? staking.contractInfo.totalStakedFormatted;
                      const n = Number(v || '0');
                      return n.toLocaleString('en-US', { maximumFractionDigits: 3 });
                    })()
                  ) : (
                    '—'
                  )}
                </div>
                <div className="text-xs text-[#666666]">Active Staked</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      <span className="text-xs text-[#666666]">Loading...</span>
                    </div>
                  ) : (
                    'Instant'
                  )}
                </div>
                <div className="text-xs text-[#666666]">Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {staking.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      <span className="text-xs text-[#666666]">Loading...</span>
                    </div>
                  ) : (
                    '30 days'
                  )}
                </div>
                <div className="text-xs text-[#666666]">Withdrawal Lock</div>
              </div>
            </div>

            {/* Show Details Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="border-[#333333] text-[#999999] hover:bg-[#222222] flex items-center"
              >
                {showDetails ? (
                  <span className="inline-flex items-center">
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Details
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show Details
                  </span>
                )}
              </Button>
            </div>
          </CardContent>

          {/* Detailed Information */}
          {showDetails && staking.contractInfo && (
            <CardContent className="pt-0 border-t border-[#333333]">
              <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-[#999999]">Current Block</p>
                    <p className="font-medium text-white">
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
                    <p className="text-[#999999]">Reward Per Block</p>
                    <p className="font-medium text-white">
                      {Number(staking.contractInfo.rewardPerBlockFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} QUAI
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-[#999999]">Contract Balance</p>
                    <p className="font-medium text-white">
                      {Number(staking.contractInfo.contractBalanceFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} QUAI
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#999999]">Reward Balance</p>
                    <p className="font-medium text-white">
                      {Number(staking.contractInfo.rewardBalanceFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} QUAI
                    </p>
                  </div>
                </div>

                {staking.contractInfo.hasUserLimit && (
                  <div className="p-3 bg-[#222222] rounded-md">
                    <p className="text-[#999999] text-sm">
                      Pool Limit Per User: {Number(staking.contractInfo.poolLimitPerUserFormatted || '0').toLocaleString('en-US', { maximumFractionDigits: 6 })} QUAI
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
          stakedSymbol="QUAI"
          rewardSymbol="QUAI"
          availableBalanceFormatted={staking.contractInfo?.userQuaiBalanceFormatted}
          availableBalanceLabel="QUAI Balance"
        />
      </div>
    </main>
  );
}
