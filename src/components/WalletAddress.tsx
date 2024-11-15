import { useKlaster } from "@/providers/SmartAccountProvider";

export const WalletAddress: React.FC<{ chainId: number }> = ({ chainId }) => {
	const klaster = useKlaster();
	return <div>{klaster.account.getAddress(chainId)}</div>;
};
