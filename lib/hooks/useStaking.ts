import { Contract, JsonRpcProvider, Shard, formatQuai, parseQuai } from 'quais';
import { useContext, useState, useEffect, useCallback } from 'react';
import { StateContext } from '@/store';
// Use the up-to-date ABI from Hardhat artifacts to match the latest contract
import SmartChefNativeArtifact from '@/lib/SmartChefNative.json';
const SmartChefNativeABI = (SmartChefNativeArtifact as any).abi;
import { RPC_URL, STAKING_CONTRACT_ADDRESS, SECONDS_PER_BLOCK, WITHDRAWAL_LOCK_PERIOD } from '@/lib/config';

// Re-export formatQuai for use in other components
export { formatQuai, parseQuai };

// Helper function to format numbers with up to 3 decimals but remove trailing zeros
export function formatBalance(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return parseFloat(num.toFixed(3)).toString();
}


export interface DelayedReward {
  amount: bigint;
  unlockTime: number;
  amountFormatted: string;
  timeUntilUnlock: number;
}

export interface UserStakingInfo {
  stakedAmount: bigint;
  stakedAmountFormatted: string;
  lockDurationSeconds?: number;
  pendingRewards: bigint;
  pendingRewardsFormatted: string;
  claimableRewards: bigint;
  claimableRewardsFormatted: string;
  totalDelayedRewards: bigint;
  totalDelayedRewardsFormatted: string;
  delayedRewards: DelayedReward[];
  lockStartTime: number;
  lockEndTime: number;
  isLocked: boolean;
  isInExitPeriod: boolean;
  canRequestWithdraw: boolean;
  canExecuteWithdraw: boolean;
  withdrawRequestTime: number;
  withdrawalAmount: bigint;
  withdrawalAmountFormatted: string;
  withdrawalAvailableTime: number;
  timeUntilUnlock: number; // in seconds
  timeUntilWithdrawalAvailable: number; // in seconds
  userStatus: string;
}

export interface ContractInfo {
  totalStaked: bigint;
  totalStakedFormatted: string;
  totalInExitPeriod?: bigint;
  totalInExitPeriodFormatted?: string;
  activeStaked?: bigint;
  activeStakedFormatted?: string;
  rewardPerBlock: bigint;
  rewardPerBlockFormatted: string;
  poolLimitPerUser: bigint;
  poolLimitPerUserFormatted: string;
  hasUserLimit: boolean;
  contractBalance: bigint;
  contractBalanceFormatted: string;
  rewardBalance: bigint;
  rewardBalanceFormatted: string;
  apy: number; // default APY (30D)
  apy30?: number;
  apy90?: number;
  currentBlock: number;
  userQuaiBalance: bigint;
  userQuaiBalanceFormatted: string;
}

export function useStaking() {
  const { account, web3Provider } = useContext(StateContext);
  const [userInfo, setUserInfo] = useState<UserStakingInfo | null>(null);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Calculate APY from rewardPerBlock and totalStaked
  const calculateAPY = (rewardPerBlock: bigint, totalStaked: bigint): number => {
    if (totalStaked === BigInt(0)) return 0;
    const blocksPerYear = BigInt(Math.floor((365 * 24 * 60 * 60) / SECONDS_PER_BLOCK));
    const annualRewards = rewardPerBlock * blocksPerYear;
    // APY = (annualRewards / totalStaked) * 100
    const apy = (Number(annualRewards) / Number(totalStaked)) * 100;
    return apy;
  };

  // Load contract information (available without wallet connection)
  const loadContractInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const provider = new JsonRpcProvider(RPC_URL);
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, provider);

      // Get current block
      const currentBlock = await provider.getBlockNumber(Shard.Cyprus1);

      // Get contract info with error handling
      let totalStaked = BigInt(0);
      let rewardPerBlock = BigInt(0);
      let totalInExitPeriod = BigInt(0);
      let poolLimitPerUser = BigInt(0);
      let hasUserLimit = false;
      let contractBalance = BigInt(0);
      let rewardBalance = BigInt(0);

      try {
        totalStaked = await stakingContract.totalStaked();
      } catch (e) {
        console.warn('Failed to get total staked:', e);
      }

      // Read rewardPerBlock directly from contract
      try {
        rewardPerBlock = await stakingContract.rewardPerBlock();
      } catch (e) {
        console.warn('Failed to get rewardPerBlock:', e);
      }

      try {
        poolLimitPerUser = await stakingContract.poolLimitPerUser();
        hasUserLimit = await stakingContract.hasUserLimit();
      } catch (e) {
        console.warn('Failed to get pool limits:', e);
      }

      try {
        contractBalance = await provider.getBalance(STAKING_CONTRACT_ADDRESS);
      } catch (e) {
        console.warn('Failed to get contract balance:', e);
      }

      try {
        rewardBalance = await stakingContract.getRewardBalance();
      } catch (e) {
        console.warn('Failed to get reward balance:', e);
      }

      // Get pending withdrawals (separate from totalStaked in this contract)
      try {
        totalInExitPeriod = await stakingContract.totalPendingWithdrawals();
      } catch (e) {
        console.warn('Failed to get totalPendingWithdrawals:', e);
      }

      // In this contract, totalStaked already excludes pending withdrawals
      // totalPendingWithdrawals is a separate pool
      const activeStaked = totalStaked;

      // Debug: Check actual withdrawal lock period
      try {
        const lockPeriod = await stakingContract.withdrawalLockPeriod();
        console.log('Contract withdrawalLockPeriod:', Number(lockPeriod), 'seconds (', Math.floor(Number(lockPeriod) / 86400), 'days)');
      } catch (e) {
        console.warn('Failed to get withdrawal lock period:', e);
      }

      // Calculate APY from rewardPerBlock and totalStaked
      const apy = calculateAPY(rewardPerBlock, activeStaked > BigInt(0) ? activeStaked : totalStaked);

      // Set contract info
      setContractInfo({
        totalStaked,
        totalStakedFormatted: formatBalance(formatQuai(totalStaked)),
        totalInExitPeriod,
        totalInExitPeriodFormatted: formatBalance(formatQuai(totalInExitPeriod)),
        activeStaked,
        activeStakedFormatted: formatBalance(formatQuai(activeStaked)),
        rewardPerBlock,
        rewardPerBlockFormatted: formatBalance(formatQuai(rewardPerBlock)),
        poolLimitPerUser,
        poolLimitPerUserFormatted: formatBalance(formatQuai(poolLimitPerUser)),
        hasUserLimit,
        contractBalance,
        contractBalanceFormatted: formatBalance(formatQuai(contractBalance)),
        rewardBalance,
        rewardBalanceFormatted: formatBalance(formatQuai(rewardBalance)),
        apy,
        currentBlock,
        userQuaiBalance: BigInt(0), // Will be set when user info is loaded
        userQuaiBalanceFormatted: '0',
      });
    } catch (error: any) {
      console.error('Failed to load contract info:', error);
      setError('Failed to load staking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user-specific staking information (requires wallet connection)
  const loadStakingInfo = useCallback(async () => {
    if (!account?.addr) {
      // If no account, just load contract info
      loadContractInfo();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new JsonRpcProvider(RPC_URL);
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, provider);

      // Get current block
      const currentBlock = await provider.getBlockNumber(Shard.Cyprus1);

      // Get user's QUAI balance
      const userQuaiBalance = await provider.getBalance(account.addr);

      // Initialize default values for user who hasn't staked
      let stakedAmount = BigInt(0);
      let lockStartTime = 0;
      let pendingRewards = BigInt(0);
      let isLocked = false;
      let timeUntilUnlock = 0;

      // Initialize extended user info with defaults
      let extendedInfo = {
        lockEndTime: 0,
        lockDurationSeconds: 0,
        isInExitPeriod: false,
        canRequestWithdraw: false,
        canExecuteWithdraw: false,
        withdrawRequestTime: 0,
        withdrawalAmount: BigInt(0),
        withdrawalAvailableTime: 0,
        timeUntilWithdrawalAvailable: 0,
        userStatus: 'No stake',
        claimableRewards: BigInt(0),
        totalDelayedRewards: BigInt(0),
        delayedRewards: [] as DelayedReward[]
      };

      try {
        // Get user info from new simplified contract
        const userInfoResult = await stakingContract.userInfo(account.addr);

        if (userInfoResult) {
          stakedAmount = userInfoResult.amount || BigInt(0);
          extendedInfo.withdrawalAmount = userInfoResult.pendingWithdrawal || BigInt(0);
          extendedInfo.withdrawRequestTime = userInfoResult.withdrawalRequestTime ? Number(userInfoResult.withdrawalRequestTime) : 0;
          extendedInfo.isInExitPeriod = extendedInfo.withdrawalAmount > BigInt(0);

          // Get withdrawal info
          if (stakedAmount > BigInt(0) || extendedInfo.withdrawalAmount > BigInt(0)) {
            try {
              const withdrawalInfo = await stakingContract.getWithdrawalInfo(account.addr);
              extendedInfo.canExecuteWithdraw = withdrawalInfo.canComplete || false;
              extendedInfo.withdrawalAvailableTime = withdrawalInfo.withdrawalUnlockTime ? Number(withdrawalInfo.withdrawalUnlockTime) : 0;

              // Calculate time until withdrawal available
              if (extendedInfo.isInExitPeriod && !extendedInfo.canExecuteWithdraw) {
                const now = Math.floor(Date.now() / 1000);
                extendedInfo.timeUntilWithdrawalAvailable = Math.max(0, extendedInfo.withdrawalAvailableTime - now);
              }
            } catch (e) {
              console.warn('Failed to get withdrawal info:', e);
            }

            // Can request withdraw if has staked amount and no pending withdrawal
            extendedInfo.canRequestWithdraw = stakedAmount > BigInt(0) && !extendedInfo.isInExitPeriod;

            // Get pending rewards
            try {
              pendingRewards = await stakingContract.pendingReward(account.addr);
              // In this simple contract, rewards are immediately claimable (no vesting)
              extendedInfo.claimableRewards = pendingRewards;
            } catch (e) {
              console.warn('Failed to get pending rewards:', e);
            }

            // Set user status
            if (extendedInfo.isInExitPeriod) {
              extendedInfo.userStatus = extendedInfo.canExecuteWithdraw ? 'Withdrawal Ready' : 'In Exit Period';
            } else if (stakedAmount > BigInt(0)) {
              extendedInfo.userStatus = 'Staking';
            } else {
              extendedInfo.userStatus = 'No stake';
            }
          }
        }
      } catch (error) {
        // User might not have interacted with the contract yet
        console.log('User has not staked yet or contract call failed:', error);
      }

      // Extended info is already populated above

      // Get contract info with error handling
      let totalStaked = BigInt(0);
      let rewardPerBlock = BigInt(0);
      let poolLimitPerUser = BigInt(0);
      let hasUserLimit = false;
      let contractBalance = BigInt(0);
      let rewardBalance = BigInt(0);

      try { totalStaked = await stakingContract.totalStaked(); } catch (e) { console.warn('Failed to get total staked:', e); }
      let totalInExitPeriod = BigInt(0);
      try { totalInExitPeriod = await stakingContract.totalPendingWithdrawals(); } catch (e) { console.warn('Failed to get totalPendingWithdrawals:', e); }
      // In this contract, totalStaked already excludes pending withdrawals
      const activeStaked = totalStaked;

      // Read rewardPerBlock directly from contract
      try {
        rewardPerBlock = await stakingContract.rewardPerBlock();
      } catch (e) {
        console.warn('Failed to get rewardPerBlock:', e);
      }

      try {
        poolLimitPerUser = await stakingContract.poolLimitPerUser();
        hasUserLimit = await stakingContract.hasUserLimit();
      } catch (e) {
        console.warn('Failed to get pool limits:', e);
      }

      try {
        contractBalance = await provider.getBalance(STAKING_CONTRACT_ADDRESS);
      } catch (e) {
        console.warn('Failed to get contract balance:', e);
      }

      try {
        rewardBalance = await stakingContract.getRewardBalance();
      } catch (e) {
        console.warn('Failed to get reward balance:', e);
      }

      // Debug: Check withdrawal lock period
      try {
        const lockPeriod = await stakingContract.withdrawalLockPeriod();
        console.log('Contract withdrawalLockPeriod:', Number(lockPeriod), 'seconds (', Math.floor(Number(lockPeriod) / 86400), 'days)');
      } catch (e) {
        console.warn('Failed to get withdrawal lock period:', e);
      }

      // Calculate APY from rewardPerBlock and totalStaked
      const apy = calculateAPY(rewardPerBlock, activeStaked > BigInt(0) ? activeStaked : totalStaked);

      // Set user info
      setUserInfo({
        stakedAmount,
        stakedAmountFormatted: formatBalance(formatQuai(stakedAmount)),
        lockDurationSeconds: extendedInfo.lockDurationSeconds,
        pendingRewards,
        pendingRewardsFormatted: formatBalance(formatQuai(pendingRewards)),
        claimableRewards: extendedInfo.claimableRewards,
        claimableRewardsFormatted: formatBalance(formatQuai(extendedInfo.claimableRewards)),
        totalDelayedRewards: extendedInfo.totalDelayedRewards,
        totalDelayedRewardsFormatted: formatBalance(formatQuai(extendedInfo.totalDelayedRewards)),
        delayedRewards: extendedInfo.delayedRewards,
        lockStartTime,
        lockEndTime: extendedInfo.lockEndTime,
        isLocked,
        isInExitPeriod: extendedInfo.isInExitPeriod,
        canRequestWithdraw: extendedInfo.canRequestWithdraw,
        canExecuteWithdraw: extendedInfo.canExecuteWithdraw,
        withdrawRequestTime: extendedInfo.withdrawRequestTime,
        withdrawalAmount: extendedInfo.withdrawalAmount,
        withdrawalAmountFormatted: formatBalance(formatQuai(extendedInfo.withdrawalAmount)),
        withdrawalAvailableTime: extendedInfo.withdrawalAvailableTime,
        timeUntilUnlock,
        timeUntilWithdrawalAvailable: extendedInfo.timeUntilWithdrawalAvailable,
        userStatus: extendedInfo.userStatus,
      });

      // Set contract info
      setContractInfo({
        totalStaked,
        totalStakedFormatted: formatBalance(formatQuai(totalStaked)),
        totalInExitPeriod,
        totalInExitPeriodFormatted: formatBalance(formatQuai(totalInExitPeriod)),
        activeStaked,
        activeStakedFormatted: formatBalance(formatQuai(activeStaked)),
        rewardPerBlock,
        rewardPerBlockFormatted: formatBalance(formatQuai(rewardPerBlock)),
        poolLimitPerUser,
        poolLimitPerUserFormatted: formatBalance(formatQuai(poolLimitPerUser)),
        hasUserLimit,
        contractBalance,
        contractBalanceFormatted: formatBalance(formatQuai(contractBalance)),
        rewardBalance,
        rewardBalanceFormatted: formatBalance(formatQuai(rewardBalance)),
        apy,
        currentBlock,
        userQuaiBalance,
        userQuaiBalanceFormatted: formatBalance(formatQuai(userQuaiBalance)),
      });
    } catch (error: any) {
      console.error('Failed to load staking info:', error);
      setError('Failed to load staking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [account, loadContractInfo]);

  // Deposit tokens (no duration parameter - simple staking)
  const deposit = useCallback(async (amount: string, _durationSeconds?: number) => {
    if (!account?.addr || !web3Provider) {
      setError('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsTransacting(true);
    setError(null);
    setTransactionHash(null);

    try {
      const signer = await web3Provider.getSigner();
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, signer);

      const depositAmount = parseQuai(amount);

      // Check user balance
      if (contractInfo && depositAmount > contractInfo.userQuaiBalance) {
        throw new Error('Insufficient balance');
      }

      // Check pool limit if applicable
      if (contractInfo?.hasUserLimit && userInfo) {
        const newTotal = userInfo.stakedAmount + depositAmount;
        if (newTotal > contractInfo.poolLimitPerUser) {
          throw new Error(`Deposit would exceed pool limit of ${contractInfo.poolLimitPerUserFormatted} QUAI`);
        }
      }

      // Send deposit transaction with value only (no duration in new contract)
      const tx = await stakingContract.deposit({
        value: depositAmount,
        gasLimit: 500000
      });
      setTransactionHash(tx.hash);

      // Wait for confirmation
      await tx.wait();

      // Reload staking info
      await loadStakingInfo();
    } catch (error: any) {
      console.error('Deposit failed:', error);
      setError(error.message || 'Deposit failed. Please try again.');
    } finally {
      setIsTransacting(false);
    }
  }, [account, web3Provider, contractInfo, userInfo, loadStakingInfo]);

  // Request withdrawal (starts 30-day lock period)
  const requestWithdraw = useCallback(async (amount: string) => {
    if (!account?.addr || !web3Provider) {
      setError('Please connect your wallet');
      return;
    }

    if (!userInfo) {
      setError('No staking information available');
      return;
    }

    if (!userInfo.canRequestWithdraw) {
      setError('Cannot request withdrawal at this time.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsTransacting(true);
    setError(null);
    setTransactionHash(null);

    try {
      const signer = await web3Provider.getSigner();
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, signer);

      const withdrawAmount = parseQuai(amount);

      // Check staked amount
      if (withdrawAmount > userInfo.stakedAmount) {
        throw new Error('Insufficient staked amount');
      }

      // Send request withdrawal transaction (note: function name is requestWithdrawal)
      const tx = await stakingContract.requestWithdrawal(withdrawAmount, { gasLimit: 500000 });
      setTransactionHash(tx.hash);

      // Wait for confirmation
      await tx.wait();

      // Reload staking info
      await loadStakingInfo();
    } catch (error: any) {
      console.error('Request withdraw failed:', error);
      setError(error.message || 'Request withdraw failed. Please try again.');
    } finally {
      setIsTransacting(false);
    }
  }, [account, web3Provider, userInfo, loadStakingInfo]);

  // Execute withdrawal (after 30-day lock period)
  const executeWithdraw = useCallback(async () => {
    if (!account?.addr || !web3Provider) {
      setError('Please connect your wallet');
      return;
    }

    if (!userInfo) {
      setError('No staking information available');
      return;
    }

    if (!userInfo.canExecuteWithdraw) {
      setError('Withdrawal lock period not finished yet.');
      return;
    }

    setIsTransacting(true);
    setError(null);
    setTransactionHash(null);

    try {
      const signer = await web3Provider.getSigner();
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, signer);

      // Send complete withdrawal transaction (note: function name is completeWithdrawal)
      const tx = await stakingContract.completeWithdrawal({ gasLimit: 500000 });
      setTransactionHash(tx.hash);

      // Wait for confirmation
      await tx.wait();

      // Reload staking info
      await loadStakingInfo();
    } catch (error: any) {
      console.error('Complete withdraw failed:', error);
      setError(error.message || 'Complete withdraw failed. Please try again.');
    } finally {
      setIsTransacting(false);
    }
  }, [account, web3Provider, userInfo, loadStakingInfo]);

  // Cancel withdrawal request (not available in this contract version)
  const cancelWithdraw = useCallback(async () => {
    setError('Cancel withdrawal is not available. Once requested, withdrawals cannot be cancelled.');
  }, []);

  // Claim rewards (now claims claimable delayed rewards)
  const claimRewards = useCallback(async () => {
    if (!account?.addr || !web3Provider) {
      setError('Please connect your wallet');
      return;
    }

    if (!userInfo || (userInfo.claimableRewards === BigInt(0) && userInfo.pendingRewards === BigInt(0))) {
      setError('No rewards to claim');
      return;
    }

    setIsTransacting(true);
    setError(null);
    setTransactionHash(null);

    try {
      const signer = await web3Provider.getSigner();
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, signer);

      // Get balance before claim
      const balanceBefore = await web3Provider.getBalance(account.addr);
      const claimableBeforeClaim = userInfo.claimableRewards;

      // Check contract reward balance
      const contractRewardBalance = await stakingContract.getRewardBalance();

      console.log('Claim transaction debug:', {
        userAddress: account.addr,
        balanceBefore: formatQuai(balanceBefore),
        claimableAmount: formatQuai(claimableBeforeClaim),
        contractRewardBalance: formatQuai(contractRewardBalance),
        contractAddress: STAKING_CONTRACT_ADDRESS
      });

      // Send claim transaction (this will add pending rewards to delayed and claim claimable)
      const tx = await stakingContract.claimRewards({ gasLimit: 500000 });
      setTransactionHash(tx.hash);

      console.log('Claim transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      console.log('Claim transaction confirmed:', {
        txHash: tx.hash,
        status: receipt.status,
        gasUsed: receipt.gasUsed?.toString(),
        blockNumber: receipt.blockNumber
      });

      // Parse events to see if RewardClaimed was emitted
      // Optional: parse logs if available (best-effort)
      try {
        const found = receipt.logs?.some((log: any) => {
          try {
            const parsed = stakingContract.interface.parseLog(log);
            if (parsed && parsed.name === 'RewardClaimed') {
              console.log('RewardClaimed event found:', {
                user: parsed.args?.user,
                amount: formatQuai(parsed.args?.amount || 0)
              });
              return true;
            }
            return false;
          } catch {
            return false;
          }
        });
        if (!found) console.warn('No RewardClaimed event found in transaction receipt');
      } catch (e) {
        console.warn('Log parsing skipped:', e);
      }

      // Check balance after claim
      const balanceAfter = await web3Provider.getBalance(account.addr);
      const balanceChange = balanceAfter - balanceBefore;

      console.log('Balance change after claim:', {
        balanceBefore: formatQuai(balanceBefore),
        balanceAfter: formatQuai(balanceAfter),
        balanceChange: formatQuai(balanceChange),
        expectedClaimAmount: formatQuai(claimableBeforeClaim)
      });

      // Reload staking info
      await loadStakingInfo();
    } catch (error: any) {
      console.error('Claim failed:', error);
      setError(error.message || 'Claim failed. Please try again.');
    } finally {
      setIsTransacting(false);
    }
  }, [account, web3Provider, userInfo, loadStakingInfo]);

  // Note: Emergency withdraw has been removed from the new contract

  // Refresh rewards periodically: update pending rewards (simple - no vesting)
  const refreshRewards = useCallback(async () => {
    if (!account?.addr || !userInfo || userInfo.stakedAmount === BigInt(0)) return;

    try {
      const provider = new JsonRpcProvider(RPC_URL);
      const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, SmartChefNativeABI, provider);

      const pendingRewards = await stakingContract.pendingReward(account.addr).catch(() => BigInt(0));

      setUserInfo(prev => prev ? {
        ...prev,
        pendingRewards,
        pendingRewardsFormatted: formatBalance(formatQuai(pendingRewards)),
        claimableRewards: pendingRewards, // In simple contract, all pending is claimable
        claimableRewardsFormatted: formatBalance(formatQuai(pendingRewards)),
      } : null);
    } catch (error) {
      console.warn('Failed to refresh rewards:', error);
    }
  }, [account, userInfo?.stakedAmount]);

  // Refresh all data
  const refreshData = useCallback(() => {
    loadStakingInfo();
  }, [loadStakingInfo]);

  // Load staking info on mount and when wallet connection changes
  useEffect(() => {
    // Always load staking info (will load contract info if no wallet, or full info if wallet connected)
    loadStakingInfo();
    // No polling - only refresh after transactions

    // Clear user info if no account connected
    if (!account?.addr) {
      setUserInfo(null);
    }
  }, [account, loadStakingInfo]);

  // Optionally update pending rewards periodically (lightweight)
  useEffect(() => {
    if (!userInfo || userInfo.stakedAmount === BigInt(0)) return;

    // Update rewards every 30 seconds if user has stake
    const rewardsInterval = setInterval(refreshRewards, 30000);
    return () => clearInterval(rewardsInterval);
  }, [userInfo?.stakedAmount, refreshRewards]);

  return {
    userInfo,
    contractInfo,
    isLoading,
    isTransacting,
    error,
    transactionHash,
    deposit,
    requestWithdraw,
    executeWithdraw,
    cancelWithdraw,
    claimRewards,
    refreshData,
    refreshRewards,
  };
}
