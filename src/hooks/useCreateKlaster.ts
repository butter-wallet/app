import { useState, useEffect, useCallback } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
	type BiconomyV2AccountInitData,
	initKlaster,
	klasterNodeHost,
	type KlasterSDK,
	loadBiconomyV2Account,
} from "klaster-sdk";
import { getKlasterClient } from "@/lib/klaster";

export function useCreateKlaster() {
	const { primaryWallet } = useDynamicContext();
	const [klaster, setKlaster] =
		useState<KlasterSDK<BiconomyV2AccountInitData> | null>(null);

	const createAndSetKlaster = useCallback(async () => {
		if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
			setKlaster(null);
			return;
		}

		if (!primaryWallet.connector.isEmbeddedWallet) {
			alert("No embedded wallet selected");
			return;
		}

		const walletClient = await primaryWallet.getWalletClient();
		if (walletClient && !klaster) {
			const [address] = await walletClient.getAddresses();
			const klaster = await getKlasterClient(address);
			setKlaster(klaster);
		}
	}, [primaryWallet, klaster]);

	useEffect(() => {
		createAndSetKlaster();
	}, [createAndSetKlaster]);

	return klaster;
}
