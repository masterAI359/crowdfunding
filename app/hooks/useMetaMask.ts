"use client";

import { useState, useEffect, useCallback } from 'react';
import {
    isMetaMaskInstalled,
    getAccounts,
    onAccountsChanged,
    safeConnectMetaMask,
    type EthereumProvider,
} from '../lib/wallet';

export interface UseMetaMaskReturn {
    isInstalled: boolean;
    isConnected: boolean;
    accounts: string[];
    connecting: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

/**
 * React hook for MetaMask integration
 * Provides safe connection handling and account management
 */
export function useMetaMask(): UseMetaMaskReturn {
    const [isInstalled, setIsInstalled] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if MetaMask is installed on mount
    useEffect(() => {
        setIsInstalled(isMetaMaskInstalled());
    }, []);

    // Get initial accounts if already connected
    useEffect(() => {
        if (isInstalled) {
            getAccounts().then((accs) => {
                if (accs.length > 0) {
                    setAccounts(accs);
                    setIsConnected(true);
                }
            });
        }
    }, [isInstalled]);

    // Listen for account changes
    useEffect(() => {
        if (!isInstalled) return;

        const cleanup = onAccountsChanged((newAccounts) => {
            setAccounts(newAccounts);
            setIsConnected(newAccounts.length > 0);
        });

        return cleanup;
    }, [isInstalled]);

    // Connect to MetaMask
    const connect = useCallback(async () => {
        if (!isInstalled) {
            setError('MetaMask extension not found. Please install MetaMask to continue.');
            return;
        }

        setConnecting(true);
        setError(null);

        const result = await safeConnectMetaMask();

        if (result.success && result.accounts) {
            setAccounts(result.accounts);
            setIsConnected(true);
        } else {
            setError(result.error || 'Failed to connect to MetaMask');
            setIsConnected(false);
        }

        setConnecting(false);
    }, [isInstalled]);

    // Disconnect (just clears local state, doesn't disconnect from MetaMask)
    const disconnect = useCallback(() => {
        setAccounts([]);
        setIsConnected(false);
        setError(null);
    }, []);

    return {
        isInstalled,
        isConnected,
        accounts,
        connecting,
        error,
        connect,
        disconnect,
    };
}

