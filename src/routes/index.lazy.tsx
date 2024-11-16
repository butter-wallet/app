import { Balance } from "@/components/Balance";
import Send from "@/components/Send";
import { WalletAddress } from "@/components/WalletAddress";
import { KlasterProvider } from "@/providers/SmartAccountProvider";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { createLazyFileRoute, Navigate } from "@tanstack/react-router";
import { base } from "viem/chains";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const isAuthenticated = useIsLoggedIn();
	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	return (
		<KlasterProvider>
			<div className="p-2">
				<WalletAddress chainId={base.id} />
				<Balance />
				<Send />
			</div>
		</KlasterProvider>
	);
}
