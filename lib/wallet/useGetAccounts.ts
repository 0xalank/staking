'use client';

import { useEffect, useContext, useRef } from 'react';

import { DispatchContext, StateContext } from '@/store';
import { dispatchAccount } from './dispatchAccount';
import { BrowserProvider } from 'quais';

// ---- get accounts ---- //
// called in background on page load, gets user accounts and provider if pelagus is connected
// sets up accountsChanged listener to handle account changes
// polls for Pelagus installation if not initially detected

const useGetAccounts = () => {
  const dispatch = useContext(DispatchContext);
  const { web3Provider } = useContext(StateContext);
  const listenerSetupRef = useRef(false);

  useEffect(() => {
    const getAccounts = async (provider: any) => {
      let account;
      await provider
        .send('quai_accounts')
        .then((accounts: Array<string>) => {
          account = dispatchAccount(accounts, dispatch);
        })
        .catch((err: Error) => {
          console.log('Error getting accounts.', err);
        });
      return account;
    };

    const setupPelagus = () => {
      if (window.pelagus && !listenerSetupRef.current) {
        const web3provider = new BrowserProvider(window.pelagus);
        getAccounts(web3provider);
        window.pelagus.on('accountsChanged', (accounts: Array<string>) => {
          dispatchAccount(accounts, dispatch);
        });
        dispatch({ type: 'SET_PROVIDER', payload: web3provider });
        listenerSetupRef.current = true;
        return true;
      }
      return false;
    };

    // Try to setup immediately
    if (setupPelagus()) {
      return;
    }

    // If Pelagus not found, poll for it (user might install it after page load)
    const pollInterval = setInterval(() => {
      if (setupPelagus()) {
        clearInterval(pollInterval);
      }
    }, 1000);

    // Cleanup polling after 60 seconds to avoid indefinite polling
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useGetAccounts;
