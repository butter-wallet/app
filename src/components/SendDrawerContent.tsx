// SendDrawerContent.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ChevronDown } from "lucide-react";
import { isAddress } from 'viem';
import NetworkContactsDrawer from './NetworkContactsDrawer';
import SuccessScreen from './SuccessScreen';

export default function SendDrawerContent() {
  const [step, setStep] = useState('recipient');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedNetwork, setSelectedNetwork] = useState('Polygon');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNetworkDrawer, setShowNetworkDrawer] = useState(false);
  const [error, setError] = useState('');

  const validateRecipientAddress = (address: string) => {
    if (!address) {
      setError('Please enter a recipient address');
      return false;
    }
    if (!isAddress(address)) {
      setError('Please enter a valid Ethereum address');
      return false;
    }
    setError('');
    return true;
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

  const handleContinue = () => {
    if (step === 'recipient') {
      if (validateRecipientAddress(recipientAddress)) {
        setStep('amount');
        setError('');
      }
    } else if (step === 'amount') {
      if (validateAmount(amount)) {
        setShowSuccess(true);
        setError('');
      }
    }
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
            />
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowNetworkDrawer(true)}
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
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
            onClick={() => setShowNetworkDrawer(true)}
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowNetworkDrawer(true);
              }
            }}
          >
            Sent on {selectedNetwork}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button 
            onClick={handleContinue}
            disabled={!amount}
          >
            Continue
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
        <h2 className="text-xl font-semibold">Send to</h2>
        <Input
          type="text"
          placeholder="Enter Ethereum address"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-300"
          value={recipientAddress}
          onChange={(e) => {
            setRecipientAddress(e.target.value);
            setError('');
          }}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button 
          onClick={handleContinue}
          disabled={!recipientAddress}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}