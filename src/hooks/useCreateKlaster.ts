import { useState, useEffect, useCallback } from "react";
import type { BiconomyV2AccountInitData, KlasterSDK } from "klaster-sdk";
import { getKlasterClient } from "@/lib/klaster";
import { useWalletClient } from "./useWalletClient";

export function useCreateKlaster() {
	const { walletClient } = useWalletClient();
	const [klaster, setKlaster] =
		useState<KlasterSDK<BiconomyV2AccountInitData> | null>(null);

	const createAndSetKlaster = useCallback(async () => {
		if (!walletClient) {
			setKlaster(null);
			return;
		}

		if (!klaster) {
			const [address] = await walletClient.getAddresses();
			const klaster = await getKlasterClient(address);
			setKlaster(klaster);
		}
	}, [walletClient, klaster]);

	useEffect(() => {
		createAndSetKlaster();
	}, [createAndSetKlaster]);

	return klaster;
}
