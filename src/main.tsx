import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { ZeroProvider } from './components/zero-provider'
import { routeTree } from './routeTree.gen'
import './main.css'

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
		<ZeroProvider>
			<RouterProvider router={router} />
		</ZeroProvider>,
	)
}
