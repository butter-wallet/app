import React from 'react';
import { Button } from "@/components/ui/button";
import TopUpDrawerContent from './TopUpDrawerContent';
import { Balance } from "./Balance";
import { WalletAddress } from "./WalletAddress";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import SendDrawerContent from './SendDrawerContent';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { base } from "viem/chains";

const WalletDashboard = () => {
  return (
    <div className="flex flex-col items-center w-full mx-auto px-20 py-6 space-y-8 max-w-xl">
      {/* Balance Card */}
      <Card className="w-full bg-primary/10 border-0">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-2">
            <WalletAddress chainId={base.id} />
            <div className="text-4xl font-bold mt-4">
              <Balance />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="w-full space-y-4 max-w-md">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="w-full h-12 text-lg"
              size="lg"
            >
              <ArrowUpRight className="w-5 h-5 mr-2" />
              Send
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <SendDrawerContent />
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="w-full h-12 text-lg"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Top-up / Receive
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <TopUpDrawerContent />
          </DrawerContent>
        </Drawer>

        <Button
          className="w-full h-12 text-lg"
          size="lg"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Invest
        </Button>
      </div>

    </div>
  );
};

export default WalletDashboard;