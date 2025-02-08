import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import './main.css'
import { Providers } from './components/providers'

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
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
		<Providers>
			<RouterProvider router={router} />
		</Providers>,
	)
}
