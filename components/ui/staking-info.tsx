import React, { useState, useEffect } from 'react';
import { UserStakingInfo, ContractInfo } from '@/lib/hooks/useStaking';
import { Progress } from '@/components/ui/progress';
import { formatUnits } from 'quais';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ExternalLink, Lock, Clock, Timer, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatQuai } from '@/lib/hooks/useStaking';
import { SECONDS_PER_BLOCK } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface StakingInfoProps {
  userInfo: UserStakingInfo | null;
  contractInfo: ContractInfo | null;
  isLoading: boolean;
  isTransacting: boolean;
  transactionStage?: 'idle' | 'approving' | 'staking';
  error: string | null;
  transactionHash: string | null;
  onDeposit: (amount: string, durationSeconds: number) => Promise<void>;
  onRequestWithdraw: (amount: string) => Promise<void>;
  onExecuteWithdraw: () => Promise<void>;
  onCancelWithdraw: () => Promise<void>;
  onClaimRewards: () => Promise<void>;
  onCompound?: () => Promise<void>;
  onRefresh: () => void;
  stakedSymbol?: string;
  rewardSymbol?: string;
  availableBalanceFormatted?: string;
  availableBalanceLabel?: string;
}

export function StakingInfo({
  userInfo,
  contractInfo,
  isLoading,
  isTransacting,
  transactionStage,
  error,
  transactionHash,
  onDeposit,
  onRequestWithdraw,
  onExecuteWithdraw,
  onCancelWithdraw,
  onClaimRewards,
  onCompound,
  onRefresh,
  stakedSymbol = '$QUAI',
  rewardSymbol = '$QUAI',
  availableBalanceFormatted,
  availableBalanceLabel
}: StakingInfoProps) {
  const withCommas = (v: string | number) => {
    const n = typeof v === 'string' ? Number(v) : v;
    if (isNaN(n as number)) return String(v);
    return (n as number).toLocaleString('en-US', { maximumFractionDigits: 6 });
  };
  const formatClaimableSmart = (v: bigint) => {
    if (!v || v === BigInt(0)) return '0';
    const asNum = parseFloat(formatUnits(v, 18));
    if (asNum === 0) return '0';
    if (asNum < 0.001) return asNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 6 });
    return asNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 });
  };
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'rewards'>('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeAction, setActiveAction] = useState<'deposit' | 'withdraw' | 'execute' | 'cancel' | 'claim' | 'compound' | null>(null);
  const { toast } = useToast();

  // Reset activeAction when transaction completes
  useEffect(() => {
    if (!isTransacting) {
      setActiveAction(null);
    }
  }, [isTransacting]);

  // Show toast notification when error changes
  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Transaction Error',
        description: error,
        duration: 3000,
      });
    }
  }, [error, toast]);

  // Show toast notification when transaction is submitted
  useEffect(() => {
    if (transactionHash) {
      toast({
        title: 'Transaction Submitted',
        description: (
          <a
            href={`https://quaiscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-red-400 flex items-center gap-1"
          >
            View on Explorer →
          </a>
        ),
        duration: 5000,
      });
    }
  }, [transactionHash, toast]);


  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    setActiveAction('deposit');
    const raw = depositAmount.replace(/,/g, '');
    await onDeposit(raw, 0); // No duration needed for simple staking
    setDepositAmount('');
  };

  const handleRequestWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    setActiveAction('withdraw');
    const raw = withdrawAmount.replace(/,/g, '');
    await onRequestWithdraw(raw);
    setWithdrawAmount('');
  };

  const handleExecuteWithdraw = async () => {
    setActiveAction('execute');
    await onExecuteWithdraw();
  };

  const handleCancelWithdraw = async () => {
    setActiveAction('cancel');
    await onCancelWithdraw();
  };

  const handleClaimRewards = async () => {
    setActiveAction('claim');
    await onClaimRewards();
  };

  const handleCompound = async () => {
    setActiveAction('compound');
    if (onCompound) {
      await onCompound();
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ready';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Input formatting with commas (keeps decimals)
  const formatInputWithCommas = (value: string) => {
    // remove invalid chars, keep digits and dots
    let v = (value || '').replace(/[^0-9.]/g, '');
    if (!v) return '';
    // keep only first dot
    const parts = v.split('.');
    const int = parts[0].replace(/^0+(\d)/, '$1');
    const dec = parts.length > 1 ? parts.slice(1).join('') : undefined;
    const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dec !== undefined && dec.length > 0 ? `${intFmt}.${dec}` : intFmt;
  };

  if (isLoading) {
    return (
      <Card className="modern-card overflow-hidden border border-red-9/20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-monorama text-white">Loading Staking Information</CardTitle>
          <CardDescription className="text-zinc-400">
            Please wait while we fetch your staking details...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-red-9" />
        </CardContent>
      </Card>
    );
  }

  // Component for displaying rewards (instant rewards - no vesting)
  const RewardsDisplay = () => {
    const hasClaimableRewards = userInfo && userInfo.claimableRewards > BigInt(0);
    const hasDelayedRewards = (userInfo?.delayedRewards?.length ?? 0) > 0;

    return (
      <div className="space-y-3">
        {/* Show claimable rewards and claim button */}
        {hasClaimableRewards ? (
          <>
            <div className="p-4 bg-gradient-to-r from-red-950/20 to-orange-950/20 border border-red-500/30 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
              <div className="flex justify-between items-center relative z-10">
                <span className="text-zinc-300 font-monorama uppercase tracking-wider text-sm">Claimable Rewards</span>
                <span className="font-monorama font-bold text-xl bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {withCommas(userInfo.claimableRewardsFormatted)} {rewardSymbol}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleClaimRewards}
                disabled={isTransacting}
                className="flex-1 h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-colors clip-button group"
                style={{
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
                {activeAction === 'claim' && isTransacting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Claim'
                )}
              </Button>
              {onCompound && (
                <Button
                  onClick={handleCompound}
                  disabled={isTransacting || userInfo?.isInExitPeriod}
                  className="flex-1 h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-colors clip-button group"
                  style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
                  {activeAction === 'compound' && isTransacting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Compound'
                  )}
                </Button>
              )}
            </div>
            {userInfo?.isInExitPeriod && onCompound && (
              <p className="text-xs text-zinc-500 text-center mt-2">
                Compound unavailable during exit period
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-zinc-400">No rewards available to claim yet.</p>
            <p className="text-zinc-500 text-xs mt-1">Rewards accrue in real-time as you stake.</p>
          </div>
        )}

        {/* Show delayed/vesting rewards if any exist (legacy support) */}
        {hasDelayedRewards && userInfo?.delayedRewards && (
          <div className="mt-4 pt-4 border-t border-red-9/10">
            <h4 className="font-monorama font-medium text-white mb-3">Vesting Rewards</h4>
            {userInfo.delayedRewards.map((reward, index) => (
              <div key={index} className="p-3 bg-zinc-900 border border-red-9/20 rounded-lg mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">
                    {withCommas(reward.amountFormatted)} {stakedSymbol}
                  </span>
                  <span className={cn(
                    "text-sm font-monorama",
                    reward.timeUntilUnlock <= 0 ? "text-red-400" : "text-orange-400"
                  )}>
                    {reward.timeUntilUnlock <= 0 ? 'Ready!' : formatTimeRemaining(reward.timeUntilUnlock)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Component for displaying withdrawal status and actions
  const WithdrawalStatusDisplay = () => {
    if (!userInfo?.isInExitPeriod) {
      return null;
    }

    return (
      <div className="space-y-3">
        <div className={cn(
          "p-3 rounded-lg text-center border",
          userInfo.canExecuteWithdraw
            ? "bg-green-500/10 text-green-400 border-green-9/20"
            : "bg-red-9/10 text-red-400 border-red-9/20"
        )}>
          <div className="flex items-center justify-center gap-2 mb-2 font-monorama">
            {userInfo.canExecuteWithdraw ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Timer className="h-5 w-5" />
            )}
            <span className="font-medium">
              {userInfo.canExecuteWithdraw ? 'Withdrawal Ready' : 'In Exit Period'}
            </span>
          </div>
          <p className="text-sm">
            {userInfo.canExecuteWithdraw
              ? 'You can now complete your withdrawal'
              : `Time remaining: ${formatTimeRemaining(userInfo.timeUntilWithdrawalAvailable)}`
            }
          </p>
        </div>

        <div className="flex gap-2">
          {userInfo.canExecuteWithdraw ? (
            <Button
              onClick={handleExecuteWithdraw}
              disabled={isTransacting}
              className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-colors clip-button group"
              style={{
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
              {activeAction === 'execute' && isTransacting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Withdrawal'
              )}
            </Button>
          ) : null}

          <Button
            onClick={handleCancelWithdraw}
            disabled={isTransacting}
            variant="outline"
            className={cn(
              userInfo.canExecuteWithdraw ? "flex-1" : "w-full",
              "h-14 bg-transparent border-red-400 text-red-400 hover:bg-red-400/10 hover:text-red-300 font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button group"
            )}
            style={{
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
            {activeAction === 'cancel' && isTransacting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Cancel Request'
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="modern-card overflow-hidden border border-red-9/20 bg-zinc-900/50 backdrop-blur-sm">
        <CardContent className="space-y-4">
          {/* User Staking Info */}
          {userInfo && userInfo.stakedAmount > BigInt(0) && (
            <div className="space-y-2 font-monorama p-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Your Stake</span>
                <span className="font-medium text-white">
                  {withCommas(userInfo.stakedAmountFormatted)} {stakedSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Claimable Rewards</span>
                <span className="font-medium bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {withCommas(userInfo.claimableRewardsFormatted)} {rewardSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className="font-medium text-sm text-white">
                  {userInfo.userStatus}
                </span>
              </div>
              {userInfo.isInExitPeriod && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Pending Withdrawal</span>
                    <span className="font-medium text-orange-400">
                      {withCommas(userInfo.withdrawalAmountFormatted)} {stakedSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Withdrawal Available</span>
                    <span className="font-medium text-red-400">
                      {userInfo.canExecuteWithdraw ? 'Ready!' : formatTimeRemaining(userInfo.timeUntilWithdrawalAvailable)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Action Tabs */}
          <div className="pt-4">
            <div className="flex gap-2 mb-4 p-1 bg-zinc-900 border border-red-9/20 rounded-lg">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('deposit')}
                className={cn(
                  'flex-1 font-monorama uppercase text-sm',
                  activeTab === 'deposit'
                    ? 'bg-red-9 text-white shadow-md shadow-red-9/30'
                    : 'text-zinc-400 hover:bg-zinc-800'
                )}
              >
                Deposit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('rewards')}
                className={cn(
                  'flex-1 font-monorama uppercase text-sm',
                  activeTab === 'rewards'
                    ? 'bg-red-9 text-white shadow-md shadow-red-9/30'
                    : 'text-zinc-400 hover:bg-zinc-800'
                )}
              >
                Rewards
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('withdraw')}
                className={cn(
                  'flex-1 font-monorama uppercase text-sm',
                  activeTab === 'withdraw'
                    ? 'bg-red-9 text-white shadow-md shadow-red-9/30'
                    : 'text-zinc-400 hover:bg-zinc-800'
                )}
              >
                Withdraw
              </Button>
            </div>

            {activeTab === 'deposit' && (
              <div className="space-y-3">
                {availableBalanceFormatted && (
                  <div className="flex items-center justify-between text-sm text-zinc-400 font-monorama">
                    <span>{availableBalanceLabel === "$QUAI Balance" ? "Your Balance" : availableBalanceLabel || 'Available Balance'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg font-bold">{withCommas(availableBalanceFormatted || '0')} {stakedSymbol}</span>
                      <button
                        type="button"
                        className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-monorama text-sm uppercase"
                        onClick={() => {
                          // Remove commas and parse balance, leave 0.1 QUAI for gas
                          const rawBalance = parseFloat((availableBalanceFormatted || '0').replace(/,/g, ''));
                          const gasReserve = 0.1;
                          const maxDeposit = Math.max(0, rawBalance - gasReserve);
                          // Format with up to 6 decimals, remove trailing zeros
                          const formatted = maxDeposit > 0 ? parseFloat(maxDeposit.toFixed(6)).toString() : '0';
                          setDepositAmount(formatInputWithCommas(formatted));
                        }}
                        disabled={isTransacting}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                )}

                <Input
                  type="text"
                  placeholder={`Amount to deposit (${stakedSymbol})`}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(formatInputWithCommas(e.target.value))}
                  className="bg-zinc-900 border-red-9/30 text-white font-monorama text-lg h-12"
                  disabled={isTransacting || userInfo?.isInExitPeriod}
                />

                {/* Deposit Information */}
                {depositAmount && parseFloat(depositAmount) > 0 && contractInfo && (
                  <div className="bg-zinc-900 border border-red-9/20 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex justify-between font-monorama">
                      <span className="text-zinc-400">Estimated APR:</span>
                      <span className="text-red-400">
                        {(() => {
                          const currentTotalStaked = parseFloat((contractInfo.activeStakedFormatted ?? contractInfo.totalStakedFormatted) || '0');
                          const newDeposit = parseFloat(depositAmount);
                          const projectedTotalStaked = currentTotalStaked + newDeposit;

                          const rewardPerBlock = parseFloat(contractInfo.rewardPerBlockFormatted || '0');
                          const blocksPerYear = Math.floor((365 * 24 * 60 * 60) / (SECONDS_PER_BLOCK || 5));
                          const annualRewardsFromBlocks = rewardPerBlock * blocksPerYear;

                          let projectedApr: number;
                          if (projectedTotalStaked > 0 && annualRewardsFromBlocks > 0) {
                            projectedApr = (annualRewardsFromBlocks / projectedTotalStaked) * 100;
                          } else {
                            projectedApr = contractInfo.apy ?? 0;
                          }

                          return `${projectedApr.toLocaleString('en-US', { maximumFractionDigits: 1 })}%`;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between font-monorama">
                      <span className="text-zinc-400">Withdrawal Lock:</span>
                      <span className="text-red-400">30 days after request</span>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleDeposit}
                  disabled={
                    isTransacting ||
                    !depositAmount ||
                    parseFloat(depositAmount) <= 0 ||
                    userInfo?.isInExitPeriod
                  }
                  className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button group"
                  style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
                  {activeAction === 'deposit' && isTransacting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Deposit'
                  )}
                </Button>
                {userInfo?.isInExitPeriod && (
                  <p className="text-xs text-red-400 text-center font-monorama">
                    Cannot deposit during exit period
                  </p>
                )}
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-4">
                <div className="p-3 bg-red-9/10 text-red-400 rounded-lg text-xs border border-red-9/20 font-monorama">
                  <p className="font-medium mb-1">Withdrawal Lock Period:</p>
                  <p>Withdrawals require a 30-day lock period. During this period, rewards DO NOT accrue on the withdrawal amount. Rewards continue to accrue on your remaining staked amount.</p>
                </div>
                <WithdrawalStatusDisplay />

                {!userInfo?.isInExitPeriod && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={`Amount to withdraw (${stakedSymbol})`}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(formatInputWithCommas(e.target.value))}
                        className="bg-zinc-900 border-red-9/30 text-white font-monorama flex-1"
                        disabled={isTransacting || !userInfo?.canRequestWithdraw}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-auto bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 font-monorama uppercase"
                        onClick={() => setWithdrawAmount(userInfo?.stakedAmountFormatted || '0')}
                        disabled={isTransacting || !userInfo?.canRequestWithdraw}
                      >
                        Max
                      </Button>
                    </div>
                    <Button
                      onClick={handleRequestWithdraw}
                      disabled={
                        isTransacting ||
                        !withdrawAmount ||
                        parseFloat(withdrawAmount) <= 0 ||
                        !userInfo?.canRequestWithdraw
                      }
                      className={cn(
                        'w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase relative overflow-hidden transition-all clip-button group',
                        !userInfo?.canRequestWithdraw
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      )}
                      style={{
                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                      }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover:animate-[shine_1s_infinite]" />
                      {activeAction === 'withdraw' && isTransacting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : !userInfo?.canRequestWithdraw ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          {userInfo?.isLocked ? 'Locked' : 'Cannot Request Withdrawal'}
                        </>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </Button>
                    {userInfo?.isInExitPeriod && !userInfo?.canExecuteWithdraw && (
                      <div className="text-xs text-center space-y-1 font-monorama">
                        <p className="text-orange-400">
                          Withdrawal available in {formatTimeRemaining(userInfo.timeUntilWithdrawalAvailable)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <RewardsDisplay />
              </div>
            )}
          </div>



          {/* Pool Limit Per User */}
          {contractInfo?.hasUserLimit && (
            <div className="pt-4 border-t border-red-9/10">
              <div className="p-3 bg-zinc-900 border border-red-9/20 rounded-md">
                <p className="text-zinc-400 text-sm font-monorama">
                  Pool Limit Per User: {withCommas(contractInfo.poolLimitPerUserFormatted || '0')} {stakedSymbol}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}