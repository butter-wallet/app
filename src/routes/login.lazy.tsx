import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
	component: Login,
});

function Login() {
	return (
		<div className="p-2">
			<DynamicWidget />
		</div>
	);
}
