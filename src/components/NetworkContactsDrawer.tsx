// NetworkContactsDrawer.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

type Network = {
  id: string;
  name: string;
  imageUrl: string;
};

type Token = {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
};

type NetworkContactsDrawerProps = {
  onClose: () => void;
  onSelectNetworkToken: (selection: { network: string; token: string }) => void;
  initialNetwork?: string;
  initialToken?: string;
};

const networks: Network[] = [
  { 
    id: 'ethereum', 
    name: 'Ethereum',
    imageUrl: '/networks/ethereum.webp'
  },
  { 
    id: 'polygon', 
    name: 'Polygon',
    imageUrl: '/networks/polygon.webp'
  },
  { 
    id: 'arbitrum', 
    name: 'Arbitrum',
    imageUrl: '/networks/arbitrum.webp'
  },
  { 
    id: 'optimism', 
    name: 'Optimism',
    imageUrl: '/networks/optimism.webp'
  },
  { 
    id: 'base', 
    name: 'Base',
    imageUrl: '/networks/base.webp'
  }
];

const tokens: Token[] = [
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    imageUrl: '/tokens/usdc.webp'
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    imageUrl: '/tokens/usdt.webp'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    imageUrl: '/tokens/eth.webp'
  },
];

export default function NetworkContactsDrawer({ 
  onClose, 
  onSelectNetworkToken,
  initialNetwork = 'Polygon',
  initialToken = 'USDC',
}: NetworkContactsDrawerProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(initialNetwork);
  const [selectedToken, setSelectedToken] = useState<string>(initialToken);

  const currentToken = tokens.find(token => token.symbol === selectedToken);
  const currentNetwork = networks.find(network => network.name === selectedNetwork);

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network.name);
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token.symbol);
  };

  const handleProceed = () => {
    if (currentNetwork && currentToken) {
      onSelectNetworkToken({
        network: selectedNetwork,
        token: selectedToken
      });
      onClose(); // Close the drawer after selection
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Select Network & Token</h2>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Networks Section */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4">Network</h3>
              <div className="flex flex-wrap gap-4">
                {networks.map((network) => (
                  <Button
                    key={network.id}
                    variant="ghost"
                    className={`flex-shrink-0 w-12 h-12 rounded-full p-0 overflow-hidden ${
                      selectedNetwork === network.name ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                    }`}
                    onClick={() => handleNetworkSelect(network)}
                    aria-label={network.name}
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage 
                        src={network.imageUrl} 
                        alt={network.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-200">
                        {network.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ))}
              </div>
            </div>

            {/* Tokens Section */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4">Token</h3>
              <div className="space-y-2">
                {tokens.map((token) => (
                  <Button
                    key={token.id}
                    variant="ghost"
                    className={`w-full p-4 hover:bg-gray-100 flex items-center gap-4 justify-start ${
                      selectedToken === token.symbol ? 'bg-purple-50 hover:bg-purple-50' : ''
                    }`}
                    onClick={() => handleTokenSelect(token)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={token.imageUrl}
                        alt={token.name}
                        className="object-contain"
                      />
                      <AvatarFallback className="bg-gray-100">
                        {token.symbol.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{token.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="border-t p-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClose}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="sm"
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}