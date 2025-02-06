import { getRequestListener } from '@hono/node-server'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { app } from './api'

import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
	dotenv.config()
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		TanStackRouterVite({}),
		react(),
		tailwindcss(),
		{
			name: 'api-server',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					if (!req.url?.startsWith('/api')) {
						return next()
					}
					getRequestListener(async (request) => {
						return await app.fetch(request, {})
					})(req, res)
				})
			},
		},
	],
})
