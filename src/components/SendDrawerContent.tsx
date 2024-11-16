import type React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ChevronDown, Loader2 } from "lucide-react";
import { parseUnits } from 'viem';
import { normalize } from 'viem/ens';
import NetworkContactsDrawer from './NetworkContactsDrawer';
import SuccessScreen from './SuccessScreen';
import { useSend } from "@/hooks/useSend";
import { useTransactions } from "@/hooks/useTransactions";
import { SupportedToken } from "@/lib/klaster";
import { useWalletPublicClient } from '@/hooks/useWalletPublicClient';

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
  'Ethereum': 1,
  'Polygon': 137,
  'Arbitrum': 42161,
  'Optimism': 10,
  'Base': 8453,
};

const TOKEN_TO_SUPPORTED_TOKEN: Record<string, SupportedToken> = {
  'USDC': SupportedToken.USDC,
  'USDT': SupportedToken.USDT,
  'ETH': SupportedToken.ETH,
};

export default function SendDrawerContent() {
  const [step, setStep] = useState('recipient');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [selectedNetwork, setSelectedNetwork] = useState('Polygon');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNetworkDrawer, setShowNetworkDrawer] = useState(false);
  const [error, setError] = useState('');
  const [isResolvingEns, setIsResolvingEns] = useState(false);

  const { walletClient: walletPublicClient } = useWalletPublicClient();
  const chainId = NETWORK_TO_CHAIN_ID[selectedNetwork];
  const token = TOKEN_TO_SUPPORTED_TOKEN[selectedCurrency];

  const { isLoading: isPreparing, operations } = useSend({
    amount: amount
      ? parseUnits(amount, token === SupportedToken.ETH ? 18 : 6)
      : parseUnits("0", token === SupportedToken.ETH ? 18 : 6),
    chainId,
    recipient: recipientAddress as `0x${string}`,
    token,
  });

  const { isLoading: isExecuting, execute } = useTransactions({ operations });

  if (!walletPublicClient) {
    return null;
  }

  const isLoading = isExecuting || isResolvingEns;

  const validateRecipientAddress = async (input: string) => {
    if (!input) {
      setError('Please enter a recipient address or ENS name');
      return false;
    }

    try {
      // Check if it's an ENS name
      if (input.toLowerCase().endsWith('.eth')) {
        setIsResolvingEns(true);

        const resolvedAddress = await walletPublicClient.getEnsAddress({
          name: normalize(input),
        });

        setIsResolvingEns(false);

        if (!resolvedAddress) {
          setError('Could not resolve ENS name');
          return false;
        }

        setRecipientAddress(resolvedAddress);
        setError('');
        return true;
      }

      // Simply set the address without validation
      setRecipientAddress(input);
      setError('');
      return true;
    } catch (err) {
      setIsResolvingEns(false);
      setError('Error resolving address. Please try again.');
      return false;
    }
  };

  const validateAmount = (value: string) => {
    const numAmount = Number.parseFloat(value);
    if (!value || Number.isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return false;
    }
    if (numAmount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    setError('');
    return true;
  };

  const handleContinue = async () => {
    if (isLoading) return;

    if (step === 'recipient') {
      const isValid = await validateRecipientAddress(recipientAddress);
      if (isValid) {
        setStep('amount');
        setError('');
      }
    } else if (step === 'amount') {
      if (validateAmount(amount)) {
        try {
          if (!execute) {
            setError('Transaction cannot be executed at this time');
            return;
          }
          execute();
          setShowSuccess(true);
          setError('');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Transaction failed');
        }
      }
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setRecipientAddress(input);
    setError('');
  };

  const handleNetworkTokenSelection = ({ network, token }: { network: string; token: string }) => {
    setSelectedNetwork(network);
    setSelectedCurrency(token);
    setShowNetworkDrawer(false);
  };

  if (showSuccess) {
    return <SuccessScreen />;
  }

  if (step === 'amount') {
    return (
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col gap-6 p-6">
          <h2 className="text-xl font-semibold">How much?</h2>
          <div className="flex items-center w-full rounded-full border border-gray-200 bg-white px-6 py-3">
            <Input
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="border-0 bg-transparent p-0 text-lg outline-none flex-1"
              disabled={isLoading}
            />
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => !isLoading && setShowNetworkDrawer(true)}
              onKeyDown={(e) => {
                if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                  setShowNetworkDrawer(true);
                }
              }}
            >
              <span className="text-base font-medium">{selectedCurrency}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div
            className="text-center text-sm text-gray-500 cursor-pointer"
            onClick={() => !isLoading && setShowNetworkDrawer(true)}
            onKeyDown={(e) => {
              if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                setShowNetworkDrawer(true);
              }
            }}
          >
            Send on {selectedNetwork}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            onClick={handleContinue}
            disabled={!amount || isLoading}
            className="relative"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isPreparing ? 'Preparing...' : 'Sending...'}
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>

        <Drawer open={showNetworkDrawer} onOpenChange={setShowNetworkDrawer}>
          <DrawerContent>
            <NetworkContactsDrawer
              initialNetwork={selectedNetwork}
              initialToken={selectedCurrency}
              onClose={() => setShowNetworkDrawer(false)}
              onSelectNetworkToken={handleNetworkTokenSelection}
            />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col gap-6 p-6">
        <h2 className="text-xl font-semibold">Send to?</h2>
        <Input
          type="text"
          placeholder="Enter Ethereum address or ENS name"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-300"
          value={recipientAddress}
          onChange={handleAddressChange}
          disabled={isLoading}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button
          onClick={handleContinue}
          disabled={!recipientAddress || isLoading}
          className="relative"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isResolvingEns ? 'Resolving ENS...' : 'Processing...'}
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}