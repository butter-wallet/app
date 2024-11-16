import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import type { WalletClient } from "viem";

export const useWalletClient = () => {
	const { primaryWallet } = useDynamicContext();

	const [isLoading, setIsLoading] = useState(true);
	const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

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

			const walletClient = await primaryWallet.getWalletClient();
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
