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

const DYNAMIC_ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;

export function App() {
	return (
		<DynamicContextProvider
			settings={{
				environmentId: DYNAMIC_ENVIRONMENT_ID,
				walletConnectors: [EthereumWalletConnectors]
			}}
		>
			<InnerApp />
		</DynamicContextProvider>
	);
}
