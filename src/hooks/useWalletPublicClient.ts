import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import type { PublicClient } from "viem";

export const useWalletPublicClient = () => {
	const { primaryWallet } = useDynamicContext();

	const [isLoading, setIsLoading] = useState(true);
	const [walletClient, setWalletClient] = useState<PublicClient | null>(null);

	useEffect(() => {
		let isCurrent = true;
		async function getWalletClient() {
			setIsLoading(true);
			if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
				return;
			}

			if (!primaryWallet.connector.isEmbeddedWallet) {
				alert("No embedded wallet selected");
				return;
			}

			const walletClient = await primaryWallet.getPublicClient();
			if (isCurrent) {
				setWalletClient(walletClient);
				setIsLoading(false);
			}
		}

		getWalletClient();

		return () => {
			isCurrent = false;
		};
	}, [primaryWallet]);

	return { walletClient, isLoading };
};
