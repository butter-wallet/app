import { createRouter, RouterProvider } from "@tanstack/react-router";
import {
	DynamicContextProvider,
	useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { routeTree } from "./routeTree.gen";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SWRConfig } from "swr";
import ChatBot from './components/ui/chatbot'


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

	if (!sdkHasLoaded) {
		return null;
	}

	return <RouterProvider router={router} />;
}

const DYNAMIC_ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;

export function App() {
	return (
		<SWRConfig value={{ refreshInterval: 5000 }}>
			<DynamicContextProvider
				settings={{
					environmentId: DYNAMIC_ENVIRONMENT_ID,
					walletConnectors: [EthereumWalletConnectors],
				}}
			>
				<InnerApp />
			</DynamicContextProvider>
			<ChatBot />

		</SWRConfig>
	);
}
