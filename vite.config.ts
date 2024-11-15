import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		react(),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
