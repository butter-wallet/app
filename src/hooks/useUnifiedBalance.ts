import { getKlasterBalance, mcClient, tokenMappings, type SupportedToken } from "@/lib/klaster";
import { useKlaster } from "@/providers/SmartAccountProvider";
import type { MultichainTokenMapping } from "klaster-sdk";
import useSWR from "swr";
import { useWalletClient } from "./useWalletClient";
import { useState, useEffect } from 'react';

const ONEINCH_PROXY_BASE_URL = 'http://localhost:3000';

export const useUnifiedBalance = (
  tokenName: SupportedToken,
  tokenMapping: MultichainTokenMapping,
) => {
  const klaster = useKlaster();
  const { walletClient, isLoading: isWalletLoading } = useWalletClient();
  const [ethBalances, setEthBalances] = useState<Record<number, string>>({});
  const [ethLoading, setEthLoading] = useState(true);
  const [ethError, setEthError] = useState<Error | null>(null);

  // Fetch token balances using Klaster
  const { 
    data, 
    error: tokenError, 
    isLoading: tokenLoading 
  } = useSWR(
    klaster.account ? `/tokens/balance/${tokenName}` : null,
    async () => {
      try {
        return await getKlasterBalance(mcClient, klaster.account, tokenMapping);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch ${tokenName} balance: ${errorMessage}`);
      }
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000 // Refresh every 30 seconds
    }
  );

  // Fetch ETH balances from 1inch proxy
  useEffect(() => {
    async function fetchEthBalances() {
      if (!walletClient || isWalletLoading || !klaster.account) {
        setEthLoading(false);
        return;
      }

      try {
        setEthLoading(true);
        setEthError(null);
        
        const [address] = await walletClient.getAddresses();
        const chainIds = tokenMapping.map(t => t.chainId);
        const allEthBalances: Record<number, string> = {};

        await Promise.all(
          chainIds.map(async (chainId) => {
            try {
              const response = await fetch(
                `${ONEINCH_PROXY_BASE_URL}/balance/v1.2/${chainId}/eth/${address}`
              );

              if (!response.ok) {
                throw new Error(`Failed to fetch ETH balance for chain ${chainId}`);
              }

              const data = await response.json();
              allEthBalances[chainId] = data.balance ?? '0';
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              console.error(`Error fetching ETH balance for chain ${chainId}:`, errorMessage);
              allEthBalances[chainId] = '0';
            }
          })
        );

        setEthBalances(allEthBalances);
      } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error('Failed to fetch ETH balances');
        setEthError(errorMessage);
      } finally {
        setEthLoading(false);
      }
    }

    fetchEthBalances();

    // Set up interval for ETH balance updates
    const interval = setInterval(fetchEthBalances, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [walletClient, isWalletLoading, tokenMapping, klaster.account]);

  // Calculate total ETH balance
  const totalEthBalance = Object.values(ethBalances).reduce(
    (sum, balance) => sum + BigInt(balance),
    BigInt(0)
  ).toString();

  return {
    // Token data from Klaster
    data,
    error: tokenError || ethError,
    isLoading: tokenLoading || ethLoading || isWalletLoading,
    
    // ETH data from 1inch proxy
    ethBalances,
    ethBalance: totalEthBalance,
    
    // Separate loading and error states
    tokenLoading,
    ethLoading,
    tokenError,
    ethError
  };
};