import { useUnifedBalance } from "@/hooks/useUnifiedBalance";
import { SupportedToken, tokenMappings } from "@/lib/klaster";
import { formatUnits } from "viem";

export const Balance = () => {
	const balance = useUnifedBalance(
		SupportedToken.USDC,
		tokenMappings[SupportedToken.USDC].addresses,
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
