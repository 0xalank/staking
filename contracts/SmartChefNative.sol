// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract SmartChefNative is Ownable, ReentrancyGuard {
  // Info of each user
  struct UserInfo {
    uint256 amount; // Active staked native tokens (accruing rewards)
    uint256 rewardDebt; // Reward debt for active stakes
    uint256 pendingWithdrawal; // Principal locked for withdrawal (not accruing rewards)
    uint256 withdrawalRequestTime; // When withdrawal was requested (0 if none pending)
  }

  // Withdrawal lock period (default 30 days after requesting withdrawal)
  uint256 public withdrawalLockPeriod = 30 days;

  // Accrued token per share
  uint256 public accTokenPerShare;
  // The block number when mining starts
  uint256 public startBlock;
  // The block number of the last pool update
  uint256 public lastRewardBlock;
  // Tokens created per block
  uint256 public rewardPerBlock;
  // Precision factor for reward calculations
  uint256 public PRECISION_FACTOR;
  // Total amount actively staked (accruing rewards)
  uint256 public totalStaked;
  // Total amount pending withdrawal (not accruing rewards)
  uint256 public totalPendingWithdrawals;
  // Block time in seconds (configurable)
  uint256 public blockTime = 5;
  // Info of each user that stakes tokens
  mapping(address => UserInfo) public userInfo;

  event Deposit(address indexed user, uint256 amount);
  event WithdrawalRequested(address indexed user, uint256 amount);
  event WithdrawalCompleted(address indexed user, uint256 amount);
  event WithdrawalCancelled(address indexed user, uint256 amount);
  event RewardClaimed(address indexed user, uint256 amount);
  event NewRewardPerBlock(uint256 rewardPerBlock);
  event AdminTokenRecovery(address tokenRecovered, uint256 amount);
  event RewardsFunded(uint256 amount);
  event BlockTimeUpdated(uint256 oldBlockTime, uint256 newBlockTime);
  event WithdrawalLockPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
  event PoolUpdated(
    uint256 lastRewardBlock,
    uint256 accTokenPerShare,
    uint256 totalStaked,
    uint256 totalPendingWithdrawals,
    uint256 rewardBalance
  );

  constructor(uint256 _rewardPerBlock, uint256 _startBlock) Ownable(msg.sender) {
    rewardPerBlock = _rewardPerBlock;
    startBlock = _startBlock > block.number ? _startBlock : block.number;
    lastRewardBlock = startBlock;
    // Native token has 18 decimals
    PRECISION_FACTOR = 10 ** (30 - 18);
  }

  // Deposit native tokens and collect pending rewards
  // User can deposit at any time, even if they have a pending withdrawal
  function deposit() external payable nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    uint256 _amount = msg.value;
    require(_amount > 0, 'Deposit amount must be greater than 0');

    _updatePool();

    // Auto-claim any pending rewards
    if (user.amount > 0) {
      uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
      if (pending > 0) {
        uint256 balanceBeforeDeposit = address(this).balance - msg.value;
        uint256 rewardBalance = balanceBeforeDeposit - totalStaked - totalPendingWithdrawals;
        require(pending <= rewardBalance, 'Insufficient reward balance');
        _safeTransferNative(msg.sender, pending);
        emit RewardClaimed(msg.sender, pending);
      }
    }

    user.amount = user.amount + _amount;
    totalStaked = totalStaked + _amount;

    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;
    emit Deposit(msg.sender, _amount);
  }

  // Request withdrawal of staked tokens
  // This moves principal from active staking to pending withdrawal
  // Principal stops accruing rewards and starts a 30-day lock period
  // Auto-claims pending rewards - use emergencyRequestWithdrawal if rewards are insolvent
  function requestWithdrawal(uint256 _amount) external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    require(_amount > 0, 'Amount must be greater than 0');
    require(user.amount >= _amount, 'Amount to withdraw too high');
    require(user.pendingWithdrawal == 0, 'Already have pending withdrawal');

    _updatePool();

    // Auto-claim any pending rewards before moving principal
    uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    if (pending > 0) {
      uint256 rewardBalance = address(this).balance - totalStaked - totalPendingWithdrawals;
      require(pending <= rewardBalance, 'Insufficient reward balance');
      _safeTransferNative(msg.sender, pending);
      emit RewardClaimed(msg.sender, pending);
    }

    // Move principal from active staking to pending withdrawal
    user.amount = user.amount - _amount;
    totalStaked = totalStaked - _amount;

    user.pendingWithdrawal = _amount;
    totalPendingWithdrawals = totalPendingWithdrawals + _amount;
    user.withdrawalRequestTime = block.timestamp;

    // Update reward debt for remaining active stake
    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit WithdrawalRequested(msg.sender, _amount);
  }

  // Emergency request withdrawal - forfeits pending rewards but guarantees exit
  // Use this if requestWithdrawal fails due to insufficient reward balance
  function emergencyRequestWithdrawal(uint256 _amount) external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    require(_amount > 0, 'Amount must be greater than 0');
    require(user.amount >= _amount, 'Amount to withdraw too high');
    require(user.pendingWithdrawal == 0, 'Already have pending withdrawal');

    _updatePool();

    // Move principal from active staking to pending withdrawal (no reward claim)
    user.amount = user.amount - _amount;
    totalStaked = totalStaked - _amount;

    user.pendingWithdrawal = _amount;
    totalPendingWithdrawals = totalPendingWithdrawals + _amount;
    user.withdrawalRequestTime = block.timestamp;

    // Reset reward debt - user forfeits pending rewards
    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit WithdrawalRequested(msg.sender, _amount);
  }

  // Complete withdrawal after the 30-day lock period
  function completeWithdrawal() external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    require(user.pendingWithdrawal > 0, 'No pending withdrawal');
    require(block.timestamp >= user.withdrawalRequestTime + withdrawalLockPeriod, 'Withdrawal still locked');

    uint256 amountToWithdraw = user.pendingWithdrawal;

    // Reset pending withdrawal state
    user.pendingWithdrawal = 0;
    user.withdrawalRequestTime = 0;
    totalPendingWithdrawals = totalPendingWithdrawals - amountToWithdraw;

    // Transfer the principal
    _safeTransferNative(msg.sender, amountToWithdraw);

    emit WithdrawalCompleted(msg.sender, amountToWithdraw);
  }

  // Cancel a pending withdrawal and return funds to active staking
  // Auto-claims pending rewards on remaining active stake
  function cancelWithdrawal() external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    require(user.pendingWithdrawal > 0, 'No pending withdrawal');

    uint256 amountToCancel = user.pendingWithdrawal;

    _updatePool();

    // Auto-claim any pending rewards on current active stake
    if (user.amount > 0) {
      uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
      if (pending > 0) {
        uint256 rewardBalance = address(this).balance - totalStaked - totalPendingWithdrawals;
        require(pending <= rewardBalance, 'Insufficient reward balance');
        _safeTransferNative(msg.sender, pending);
        emit RewardClaimed(msg.sender, pending);
      }
    }

    // Move funds back from pending withdrawal to active staking
    user.pendingWithdrawal = 0;
    user.withdrawalRequestTime = 0;
    totalPendingWithdrawals = totalPendingWithdrawals - amountToCancel;

    user.amount = user.amount + amountToCancel;
    totalStaked = totalStaked + amountToCancel;

    // Update reward debt for the new active stake amount
    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit WithdrawalCancelled(msg.sender, amountToCancel);
  }

  // Claim rewards without withdrawing stake
  function claimRewards() external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    _updatePool();
    uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    if (pending > 0) {
      // Check solvency: ensure we don't dip into staked or pending withdrawal funds
      uint256 rewardBalance = address(this).balance - totalStaked - totalPendingWithdrawals;
      require(pending <= rewardBalance, 'Insufficient reward balance');
      _safeTransferNative(msg.sender, pending);
      emit RewardClaimed(msg.sender, pending);
    }
    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;
  }

  // Compound rewards - claim and restake in one transaction
  function compound() external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];
    require(user.pendingWithdrawal == 0, 'Cannot compound during exit period');

    _updatePool();

    uint256 pending = (user.amount * accTokenPerShare) / PRECISION_FACTOR - user.rewardDebt;
    require(pending > 0, 'No rewards to compound');

    // Check solvency
    uint256 rewardBalance = address(this).balance - totalStaked - totalPendingWithdrawals;
    require(pending <= rewardBalance, 'Insufficient reward balance');

    // Add rewards to staked amount (no transfer needed - rewards stay in contract)
    user.amount = user.amount + pending;
    totalStaked = totalStaked + pending;

    // Update reward debt
    user.rewardDebt = (user.amount * accTokenPerShare) / PRECISION_FACTOR;

    emit RewardClaimed(msg.sender, pending);
    emit Deposit(msg.sender, pending);
  }

  // Recover wrong tokens sent to the contract (not native tokens)
  function recoverWrongTokens(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
    require(_tokenAddress != address(0), 'Cannot recover native tokens');
    (bool success, ) = _tokenAddress.call(
      abi.encodeWithSignature('transfer(address,uint256)', msg.sender, _tokenAmount)
    );
    require(success, 'Token transfer failed');
    emit AdminTokenRecovery(_tokenAddress, _tokenAmount);
  }

  // Update reward per block (APY is in basis points, e.g., 1000 = 10%)
  function updateRewardPerBlock(uint256 _newAPYBasisPoints) external onlyOwner {
    require(_newAPYBasisPoints <= 1000000, 'APY too high'); // Max 10,000%
    _updatePool(); // Lock in past rewards before changing rate

    // Calculate reward per block based on APY
    // APY in basis points (1000 = 10%)
    // Calculate blocks per year based on current block time
    uint256 blocksPerYear = (365 * 24 * 3600) / blockTime;

    uint256 newRewardPerBlock;
    if (totalStaked > 0) {
      // rewardPerBlock = (totalStaked * APY) / (blocksPerYear * 10000)
      newRewardPerBlock = (totalStaked * _newAPYBasisPoints) / (blocksPerYear * 10000);
    } else {
      // If no tokens staked, set a default based on expected stake
      // This will auto-adjust when tokens are staked
      newRewardPerBlock = (_newAPYBasisPoints * 1e18) / (blocksPerYear * 10000);
    }

    // Cap at 500 QUAI per block to prevent abuse
    require(newRewardPerBlock <= 500 ether, 'Calculated reward per block exceeds 500 QUAI');
    rewardPerBlock = newRewardPerBlock;

    emit NewRewardPerBlock(rewardPerBlock);
  }

  // Alternative: Set reward per block directly (for precise control)
  // Max 500 QUAI per block to prevent abuse if admin key is compromised
  function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
    require(_rewardPerBlock <= 500 ether, 'Reward per block cannot exceed 500 QUAI');
    _updatePool(); // Lock in past rewards before changing rate
    rewardPerBlock = _rewardPerBlock;
    emit NewRewardPerBlock(rewardPerBlock);
  }

  // Update block time (in seconds)
  function updateBlockTime(uint256 _newBlockTime) external onlyOwner {
    require(_newBlockTime > 0, 'Block time must be positive');
    require(_newBlockTime <= 3600, 'Block time too large'); // Max 1 hour for sanity
    uint256 oldBlockTime = blockTime;
    blockTime = _newBlockTime;
    emit BlockTimeUpdated(oldBlockTime, _newBlockTime);
  }

  // Update withdrawal lock period (max 60 days to protect users)
  function updateWithdrawalLockPeriod(uint256 _newPeriod) external onlyOwner {
    require(_newPeriod <= 60 days, 'Lock period cannot exceed 60 days');
    uint256 oldPeriod = withdrawalLockPeriod;
    withdrawalLockPeriod = _newPeriod;
    emit WithdrawalLockPeriodUpdated(oldPeriod, _newPeriod);
  }

  // Fund rewards pool with native tokens
  function fundRewards() external payable onlyOwner {
    require(msg.value > 0, 'Must send tokens');
    emit RewardsFunded(msg.value);
  }

  // Withdraw excess rewards (emergency)
  function emergencyRewardWithdraw(uint256 _amount) external onlyOwner {
    // Ensure we don't withdraw user stakes or pending withdrawals
    uint256 rewardBalance = address(this).balance - totalStaked - totalPendingWithdrawals;
    require(_amount <= rewardBalance, 'Cannot withdraw user funds');
    _safeTransferNative(msg.sender, _amount);
  }

  // View pending rewards
  function pendingReward(address _user) external view returns (uint256) {
    UserInfo storage user = userInfo[_user];
    uint256 adjustedTokenPerShare = accTokenPerShare;
    if (block.number > lastRewardBlock && totalStaked != 0) {
      uint256 multiplier = _getMultiplier(lastRewardBlock, block.number);
      uint256 reward = multiplier * rewardPerBlock;
      adjustedTokenPerShare = accTokenPerShare + ((reward * PRECISION_FACTOR) / totalStaked);
    }
    return ((user.amount * adjustedTokenPerShare) / PRECISION_FACTOR) - user.rewardDebt;
  }

  // Update pool variables
  function _updatePool() internal {
    if (block.number <= lastRewardBlock) {
      return;
    }
    if (totalStaked == 0) {
      lastRewardBlock = block.number;
      emit PoolUpdated(
        lastRewardBlock,
        accTokenPerShare,
        totalStaked,
        totalPendingWithdrawals,
        _getRewardBalance()
      );
      return;
    }
    uint256 multiplier = _getMultiplier(lastRewardBlock, block.number);
    uint256 reward = multiplier * rewardPerBlock;
    accTokenPerShare = accTokenPerShare + ((reward * PRECISION_FACTOR) / totalStaked);
    lastRewardBlock = block.number;
    emit PoolUpdated(
      lastRewardBlock,
      accTokenPerShare,
      totalStaked,
      totalPendingWithdrawals,
      _getRewardBalance()
    );
  }

  // Internal function to get reward balance
  function _getRewardBalance() internal view returns (uint256) {
    uint256 userFunds = totalStaked + totalPendingWithdrawals;
    if (address(this).balance > userFunds) {
      return address(this).balance - userFunds;
    }
    return 0;
  }

  // Return reward multiplier
  function _getMultiplier(uint256 _from, uint256 _to) internal pure returns (uint256) {
    return _to - _from;
  }

  // Safe transfer native tokens
  function _safeTransferNative(address _to, uint256 _amount) internal {
    (bool success, ) = _to.call{ value: _amount }('');
    require(success, 'Native token transfer failed');
  }

  // View function to check if user has a pending withdrawal
  function hasPendingWithdrawal(address _user) external view returns (bool) {
    return userInfo[_user].pendingWithdrawal > 0;
  }

  // View function to check if user can complete their withdrawal
  function canCompleteWithdrawal(address _user) external view returns (bool) {
    UserInfo storage user = userInfo[_user];
    if (user.pendingWithdrawal == 0) return false;
    return block.timestamp >= user.withdrawalRequestTime + withdrawalLockPeriod;
  }

  // View function to get time until withdrawal can be completed
  function timeUntilWithdrawal(address _user) external view returns (uint256) {
    UserInfo storage user = userInfo[_user];
    if (user.pendingWithdrawal == 0) return 0;

    uint256 unlockTime = user.withdrawalRequestTime + withdrawalLockPeriod;
    if (block.timestamp >= unlockTime) return 0;

    return unlockTime - block.timestamp;
  }

  // View function to get withdrawal details for a user
  function getWithdrawalInfo(
    address _user
  )
    external
    view
    returns (
      uint256 activeStake,
      uint256 pendingWithdrawalAmount,
      uint256 withdrawalRequestTime,
      uint256 withdrawalUnlockTime,
      bool canComplete
    )
  {
    UserInfo storage user = userInfo[_user];
    activeStake = user.amount;
    pendingWithdrawalAmount = user.pendingWithdrawal;
    withdrawalRequestTime = user.withdrawalRequestTime;

    if (user.pendingWithdrawal > 0) {
      withdrawalUnlockTime = user.withdrawalRequestTime + withdrawalLockPeriod;
      canComplete = block.timestamp >= withdrawalUnlockTime;
    } else {
      withdrawalUnlockTime = 0;
      canComplete = false;
    }
  }

  // View function to get contract balance (excluding user stakes and pending withdrawals)
  function getRewardBalance() external view returns (uint256) {
    return _getRewardBalance();
  }

  // Receive function to accept native token transfers
  receive() external payable {
    // Accept native tokens for rewards funding
  }

  // Fallback function
  fallback() external payable {
    // Accept native tokens for rewards funding
  }
}