import { useUnifedBalance } from "@/hooks/useUnifiedBalance";
import { SupportedTokens, tokenMappings } from "@/lib/klaster";
import { formatUnits } from "viem";

export const Balance = () => {
	const balance = useUnifedBalance(
		SupportedTokens.USDC,
		tokenMappings[SupportedTokens.USDC].addresses,
	);

	return (
		<div>
			$
			{balance.data?.balance !== undefined
				? formatUnits(balance.data?.balance, 6)
				: null}
		</div>
	);
};
