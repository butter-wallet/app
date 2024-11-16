import type { SupportedToken } from "@/lib/klaster";
import { useKlaster } from "@/providers/SmartAccountProvider";
import { getTransferTxs } from "@/lib/operations/transfer";
import type { TransactionBatch } from "klaster-sdk";
import { useEffect, useState } from "react";

interface InitParams {
	chainId: number;
	token: SupportedToken;
	recipient: `0x${string}`;
	amount: bigint;
}

export function useSend({ chainId, token, recipient, amount }: InitParams) {
	const klaster = useKlaster();

	const [isLoading, setIsLoading] = useState(false);
	const [operations, setOperations] = useState<TransactionBatch[] | null>(null);
	useEffect(() => {
		let isCurrent = true;

		async function getOperations() {
			setIsLoading(true);
			const batches = await getTransferTxs(klaster, {
				chainId,
				token,
				recipient,
				amount,
			});

			if (isCurrent) {
				setOperations(batches);
				setIsLoading(false);
			}
		}

		getOperations();

		return () => {
			isCurrent = false;
		};
	}, [klaster, chainId, token, recipient, amount]);

	return {
		isLoading,
		operations,
	};
}
