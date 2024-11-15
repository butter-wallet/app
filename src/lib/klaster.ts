import {
	buildMultichainReadonlyClient,
	buildRpcInfo,
	buildTokenMapping,
	deployment,
	initKlaster,
	klasterNodeHost,
	loadBiconomyV2Account,
	MultichainAccount,
	MultichainClient,
	MultichainTokenMapping,
} from "klaster-sdk";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

export async function getKlasterClient(address: `0x${string}`) {
	console.log("getKlasterClient", { address });
	const klaster = await initKlaster({
		accountInitData: loadBiconomyV2Account({
			owner: address,
		}),
		nodeUrl: klasterNodeHost.default,
	});
	return klaster;
}

export const mcClient = buildMultichainReadonlyClient([
	buildRpcInfo(
		mainnet.id,
		`https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	),
	buildRpcInfo(
		polygon.id,
		`https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	),
	buildRpcInfo(
		base.id,
		`https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	),
	// buildRpcInfo(
	// 	arbitrum.id,
	// 	`https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	// ),
	// buildRpcInfo(
	// 	optimism.id,
	// 	`https://opt-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	// ),
]);

export enum SupportedTokens {
	USDC = "USDC",
}

export const tokenMappings: Record<
	SupportedTokens,
	{
		decimals: number;
		addresses: MultichainTokenMapping;
	}
> = {
	USDC: {
		decimals: 6,
		addresses: buildTokenMapping([
			deployment(mainnet.id, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
			deployment(polygon.id, "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"),
			deployment(base.id, "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
		]),
	},
};

export async function getKlasterBalance(
	mcClient: MultichainClient,
	account: MultichainAccount,
	tokenMapping: MultichainTokenMapping,
) {
	return mcClient.getUnifiedErc20Balance({
		account,
		tokenMapping,
	});
}
