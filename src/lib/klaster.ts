import {
	BiconomyV2AccountInitData,
	buildMultichainReadonlyClient,
	buildRpcInfo,
	buildTokenMapping,
	deployment,
	initKlaster,
	InterchainTransaction,
	klasterNodeHost,
	KlasterSDK,
	loadBicoV2Account,
	type MultichainAccount,
	type MultichainClient,
	type MultichainTokenMapping,
} from "klaster-sdk";
import { WalletClient } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

export async function getKlasterClient(address: `0x${string}`) {
	const klaster = await initKlaster({
		accountInitData: loadBicoV2Account({
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
	buildRpcInfo(
		arbitrum.id,
		`https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	),
	buildRpcInfo(
		optimism.id,
		`https://opt-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
	),
]);

export enum SupportedToken {
	USDC = "USDC",
}

export const tokenMappings: Record<
	SupportedToken,
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
			deployment(arbitrum.id, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
			deployment(optimism.id, "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"),
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

export async function executeItx(
	klaster: KlasterSDK<BiconomyV2AccountInitData>,
	walletClient: WalletClient,
	iTx: InterchainTransaction,
) {
	if (!walletClient?.account) {
		throw new Error("No account");
	}

	const quote = await klaster.getQuote(iTx);
	const signature = await walletClient.signMessage({
		account: walletClient.account.address,
		message: {
			raw: quote.itxHash,
		},
	});

	return klaster.execute(quote, signature);
}
