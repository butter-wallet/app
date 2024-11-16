import {
	type BiconomyV2AccountInitData,
	encodeBridgingOps,
	type KlasterSDK,
} from "klaster-sdk";
import { mcClient, type SupportedToken, tokenMappings } from "../klaster";
import { AcrossBridgePlugin } from "../bridge-plugins/AcrossBridgePlugin";

interface InitParams {
	token: SupportedToken;
	amountToBridge: bigint;
	destinationChainId: number;
}

export async function getBridgeOps(
	klaster: KlasterSDK<BiconomyV2AccountInitData>,
	{ token, amountToBridge, destinationChainId }: InitParams,
) {
	const bridgingOps = await encodeBridgingOps({
		bridgePlugin: AcrossBridgePlugin,
		tokenMapping: tokenMappings[token].addresses,
		account: klaster.account,
		amount: amountToBridge,
		client: mcClient,
		destinationChainId: destinationChainId,
	});
	return bridgingOps;
}
