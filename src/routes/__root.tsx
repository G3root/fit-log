import { ZeroProvider } from '@rocicorp/zero/react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useCallback, useSyncExternalStore } from 'react'
import { Providers } from '~/components/providers'
import { zeroRef } from '~/lib/zero-setup'

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	const z = useSyncExternalStore(
		zeroRef.onChange,
		useCallback(() => zeroRef.value, []),
	)

	if (!z) {
		return null
	}
	return (
		<Providers>
			<ZeroProvider zero={z}>
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</ZeroProvider>
		</Providers>
	)
}
