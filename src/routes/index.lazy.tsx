import WalletDashboard from "@/components/WalletDashboard";
import { KlasterProvider } from "@/providers/SmartAccountProvider";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

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
			<WalletDashboard />
		</KlasterProvider>
	);
}
