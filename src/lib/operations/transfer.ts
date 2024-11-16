import {
	type BiconomyV2AccountInitData,
	type KlasterSDK,
	rawTx,
	singleTx,
	type TransactionBatch,
} from "klaster-sdk";
import { encodeFunctionData, erc20Abi } from "viem";
import { getKlasterBalance, tokenMappings } from "../klaster";
import { mcClient, type SupportedToken } from "../klaster";
import { getBridgeOps } from "./bridge";

interface InitParams {
	chainId: number;
	token: SupportedToken;
	recipient: `0x${string}`;
	amount: bigint;
}

export const getTransferTxs = async (
	klaster: KlasterSDK<BiconomyV2AccountInitData>,
	{ chainId, token, recipient, amount }: InitParams,
) => {
	const txs: TransactionBatch[] = [];

	const tokenMapping = tokenMappings[token].addresses;
	const balance = await getKlasterBalance(
		mcClient,
		klaster.account,
		tokenMapping,
	);

	console.log(balance);

	const destChainTokenAddress = tokenMapping.find(
		(m) => m.chainId === chainId,
	)?.address;
	if (!destChainTokenAddress) {
		throw new Error("Unsupported token");
	}

	const destChainTokenBalance =
		balance.breakdown.find((b) => b.chainId === chainId)?.amount ?? 0n;
	const needsBridging = destChainTokenBalance < amount;

	let amountBridged = 0n;
	if (needsBridging) {
		// Need to bridge. Add the bridging operations to the txs
		const bridgingOps = await getBridgeOps(klaster, {
			token,
			amountToBridge: amount - destChainTokenBalance,
			destinationChainId: chainId,
		});
		amountBridged = bridgingOps.totalReceivedOnDestination;
		txs.push(...bridgingOps.steps);
	}

	// Add the transfer operation
	const sendERC20Op = rawTx({
		gasLimit: 100000n,
		to: destChainTokenAddress,
		data: encodeFunctionData({
			abi: erc20Abi,
			functionName: "transfer",
			args: [
				recipient,
				needsBridging ? amountBridged + destChainTokenBalance : amount,
			],
		}),
	});
	const tx = singleTx(chainId, sendERC20Op);
	txs.push(tx);

	return txs;
};
