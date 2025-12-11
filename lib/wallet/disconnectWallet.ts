// Disconnect wallet from dApp
// Uses wallet_revokePermissions to properly disconnect from Pelagus

const disconnectWallet = async (dispatch: any) => {
  try {
    if (window.pelagus) {
      // Try to revoke permissions (supported by most wallets including Pelagus)
      try {
        await window.pelagus.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }]
        });
      } catch (revokeError) {
        // Some wallets may not support wallet_revokePermissions
        console.log('wallet_revokePermissions not supported, clearing local state only');
      }
    }
  } catch (err) {
    console.log('Error disconnecting wallet:', err);
  } finally {
    // Always clear local state
    dispatch({ type: 'SET_ACCOUNT', payload: undefined });
    dispatch({ type: 'SET_WEB3_PROVIDER', payload: undefined });
  }
};

export default disconnectWallet;
