import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
	// The ReturnType of your useAuth hook or the value of your AuthContext
	auth?: {
		isAuthenticated: boolean;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
