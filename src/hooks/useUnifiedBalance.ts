import { getKlasterBalance, mcClient } from "@/lib/klaster";
import { useKlaster } from "@/providers/SmartAccountProvider";
import type { MultichainTokenMapping } from "klaster-sdk";
import useSWR from "swr";

export const useUnifedBalance = (
	tokenName: string,
	tokenMapping: MultichainTokenMapping,
) => {
	const klaster = useKlaster();
	return useSWR(
		`/tokens/balance/${tokenName}`,
		async () =>
			await getKlasterBalance(mcClient, klaster.account, tokenMapping),
	);
};
