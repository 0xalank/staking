// Network and Provider Constants
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.quai.network';

// Staking Contract Constants
export const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || '0x006Ac8e729d91CC84De81Df5BdB9660Fc5150309';

// Staking Parameters
export const WITHDRAWAL_LOCK_PERIOD = 30 * 24 * 60 * 60; // 30 days in seconds
export const BLOCKS_PER_SECOND = 0.2; // 5 second block time = 0.2 blocks per second
export const SECONDS_PER_BLOCK = 5; // 5 seconds per block on Quai

// Contract Parameters
export const REWARD_PER_BLOCK = '0.001'; // 0.001 QUAI per block
export const POOL_LIMIT_PER_USER = '1000.0'; // 1000 QUAI max per user

// UI Constants
export const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || 'QUAI Staking';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Stake QUAI tokens and earn rewards';

// Formatting Constants
export const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'QUAI';
export const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS) || 18;
