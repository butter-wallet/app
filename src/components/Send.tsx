import { useSend } from "@/hooks/useSend";
import { parseUnits } from "viem";
import { optimism, polygon } from "viem/chains";
import { Button } from "./ui/button";
import { SupportedToken } from "@/lib/klaster";
import { useTransactions } from "@/hooks/useTransactions";

export const Send = () => {
	const { isLoading, operations } = useSend({
		amount: parseUnits("1", 6),
		chainId: optimism.id,
		recipient: "0x95a223299319022a842d0dfe4851c145a2f615b9",
		token: SupportedToken.USDC,
	});

	console.log(operations);

	const { execute } = useTransactions({ operations });

	return (
		<Button disabled={isLoading} onClick={execute}>
			Send
		</Button>
	);
};
