/**
 * Wallet utility functions for MetaMask integration
 * Handles safe detection and connection to MetaMask
 */

export interface EthereumProvider {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, handler: (...args: unknown[]) => void) => void;
    removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

/**
 * Safely checks if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    return typeof window.ethereum !== 'undefined' && window.ethereum?.isMetaMask === true;
}

/**
 * Safely gets the Ethereum provider
 */
export function getEthereumProvider(): EthereumProvider | null {
    if (typeof window === 'undefined') return null;
    return window.ethereum || null;
}

/**
 * Connects to MetaMask wallet
 * @returns Promise that resolves to an array of account addresses
 * @throws Error if MetaMask is not installed or connection fails
 */
export async function connectMetaMask(): Promise<string[]> {
    if (!isMetaMaskInstalled()) {
        throw new Error(
            'MetaMask extension not found. Please install MetaMask to continue.'
        );
    }

    const provider = getEthereumProvider();
    if (!provider) {
        throw new Error('Ethereum provider not available');
    }

    try {
        // Request account access
        const accounts = await provider.request({
            method: 'eth_requestAccounts',
        }) as string[];

        return accounts;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to connect to MetaMask: ${error.message}`);
        }
        throw new Error('Failed to connect to MetaMask');
    }
}

/**
 * Gets the current connected accounts
 */
export async function getAccounts(): Promise<string[]> {
    if (!isMetaMaskInstalled()) {
        return [];
    }

    const provider = getEthereumProvider();
    if (!provider) {
        return [];
    }

    try {
        const accounts = await provider.request({
            method: 'eth_accounts',
        }) as string[];

        return accounts;
    } catch (error) {
        console.error('Error getting accounts:', error);
        return [];
    }
}

/**
 * Listens for account changes
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
    const provider = getEthereumProvider();
    if (!provider) {
        return () => { }; // Return no-op function
    }

    const handler = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        callback(accounts);
    };

    provider.on('accountsChanged', handler);

    // Return cleanup function
    return () => {
        provider.removeListener('accountsChanged', handler);
    };
}

/**
 * Safely handles MetaMask connection with error handling
 * Use this in your components to connect to MetaMask
 */
export async function safeConnectMetaMask(): Promise<{
    success: boolean;
    accounts?: string[];
    error?: string;
}> {
    try {
        const accounts = await connectMetaMask();
        return {
            success: true,
            accounts,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

