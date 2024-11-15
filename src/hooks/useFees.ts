import { SupportedToken, tokenMappings } from "@/lib/klaster";
import { useUnifedBalance } from "./useUnifiedBalance";
import { useMemo } from "react";
import type { UnifiedBalanceResult } from "klaster-sdk";

function findChainWithLargestBalance(
	unifiedBalance?: UnifiedBalanceResult,
): number | null {
	if (!unifiedBalance?.breakdown || unifiedBalance.breakdown.length === 0) {
		return null;
	}

	const maxChain = unifiedBalance.breakdown.reduce(
		(maxChain, current) => {
			if (current.amount > maxChain.amount) {
				return current;
			}
			return maxChain;
		},
		{ chainId: null, amount: 0n } as { chainId: number | null; amount: bigint },
	);

	return maxChain.chainId;
}

export const useFees = () => {
	const usdcBalance = useUnifedBalance(
		SupportedToken.USDC,
		tokenMappings[SupportedToken.USDC].addresses,
	);

	const isLoading = usdcBalance.isLoading;

	const feeChainId = useMemo(
		() => findChainWithLargestBalance(usdcBalance.data),
		[usdcBalance],
	);

	console.log("feeChainId", feeChainId);
	return {
		isLoading,
		chainId: feeChainId,
	};
};
