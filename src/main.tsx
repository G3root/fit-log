import { Zero } from '@rocicorp/zero'
import { ZeroProvider } from '@rocicorp/zero/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'

import './main.css'
import { schema } from './schema'

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
})

const userID = 'anon'

const z = new Zero({
	userID,
	// auth: () => encodedJWT,
	server: import.meta.env.VITE_PUBLIC_SERVER,
	schema,
	// This is often easier to develop with if you're frequently changing
	// the schema. Switch to 'idb' for local-persistence.
	kvStore: 'mem',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<ZeroProvider zero={z}>
			<RouterProvider router={router} />
		</ZeroProvider>,
	)
}
