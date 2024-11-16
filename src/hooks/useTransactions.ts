import { useKlaster } from "@/providers/SmartAccountProvider";
import { buildItx, type TransactionBatch } from "klaster-sdk";
import { useFees } from "./useFees";
import { executeItx } from "@/lib/klaster";
import { useWalletClient } from "./useWalletClient";

interface InitParams {
	operations: TransactionBatch[] | null;
}

export const useTransactions = ({ operations }: InitParams) => {
	const klaster = useKlaster();
	const { isLoading, chainId } = useFees();
	const { isLoading: isWalletLoading, walletClient } = useWalletClient();

	if (isLoading || isWalletLoading) {
		return {
			isLoading: true,
		};
	}

	if (!chainId) {
		return {
			isLoading: false,
			execute: () => {},
		};
	}

	async function execute() {
		if (!chainId || !walletClient || !operations) return;

		const iTx = buildItx({
			steps: operations,
			feeTx: klaster.encodePaymentFee(chainId, "USDC"),
		});

		const signature = await executeItx(klaster, walletClient, iTx);
		return signature;
	}

	return {
		isLoading: false,
		execute,
	};
};
