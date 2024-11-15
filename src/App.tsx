import { createRouter, RouterProvider } from "@tanstack/react-router";
import {
	DynamicContextProvider,
	useDynamicContext,
	useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { routeTree } from "./routeTree.gen";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: {
		auth: undefined, // This will be set after we wrap the app in an AuthProvider
	},
});

function InnerApp() {
	const { sdkHasLoaded } = useDynamicContext();
	const isAuthenticated = useIsLoggedIn();

	console.log({ sdkHasLoaded, isAuthenticated });
	return (
		<RouterProvider
			router={router}
			context={{ auth: { isLoaded: sdkHasLoaded, isAuthenticated } }}
		/>
	);
}

export function App() {
	return (
		<DynamicContextProvider
			settings={{
				environmentId: "b8dd6091-f692-4489-afcc-90857d949509",
				walletConnectors: [EthereumWalletConnectors],
			}}
		>
			<InnerApp />
		</DynamicContextProvider>
	);
}
