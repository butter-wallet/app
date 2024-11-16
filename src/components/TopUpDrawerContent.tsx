import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useKlaster } from "@/providers/SmartAccountProvider";
import { base } from "viem/chains";

const VITE_COINBASE_APP_ID = import.meta.env.VITE_COINBASE_APP_ID;
const VITE_COINBASE_DEFAULT_FUNDING_CHAIN = "base";

export default function TopUpDrawerContent() {
  const [copied, setCopied] = useState(false);
  const klaster = useKlaster();
  const address = klaster.account.getAddress(base.id);

  if (!address) {
    return (
      <div className="mx-auto w-full max-w-sm p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const launchCoinbaseOnramp = () => {
    if (!address) return;
    const onrampUrl = `https://pay.coinbase.com/buy/select-asset?appId=${VITE_COINBASE_APP_ID}&destinationWallets=[{"address":"${address}","blockchains":["${VITE_COINBASE_DEFAULT_FUNDING_CHAIN}"]}]`;
    window.open(onrampUrl, '_blank', 'popup,width=540,height=700');
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col gap-6 p-6">
        <h2 className="text-xl font-semibold">Top-up Your Wallet</h2>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-2">Your wallet address</div>
            <div className="flex items-center justify-between gap-2 break-all">
              <div className="text-sm font-medium">{address}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && (
              <div className="text-xs text-green-500 mt-1">
                Address copied to clipboard!
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              Buy crypto directly with your card
            </div>
            <Button 
              onClick={launchCoinbaseOnramp}
              className="w-full"
              size="lg"
              disabled={!address}
            >
              Open Coinbase
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}