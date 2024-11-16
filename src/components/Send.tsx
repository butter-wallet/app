import { useSend } from "@/hooks/useSend";
import { parseUnits } from "viem";
import { optimism } from "viem/chains";
import { SupportedToken } from "@/lib/klaster";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import SendDrawerContent from './SendDrawerContent';

export default function Send() {
  const { isLoading, operations } = useSend({
		amount: parseUnits("1", 6),
		chainId: optimism.id,
		recipient: "0x95a223299319022a842d0dfe4851c145a2f615b9",
		token: SupportedToken.USDC,
	});

	const { execute } = useTransactions({ operations });
  
  return (
    <div className="flex justify-center items-center">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="lg">
            Send
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <SendDrawerContent />
        </DrawerContent>
      </Drawer>
    </div>
  );
}