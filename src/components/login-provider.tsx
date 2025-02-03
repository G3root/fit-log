import { useCallback, useSyncExternalStore } from 'react'
import { loginContext } from '~/hooks/use-login'
import { clearJwt } from '~/lib/jwt'
import { authRef } from '~/lib/zero-setup'

export function LoginProvider({ children }: { children: React.ReactNode }) {
	const loginState = useSyncExternalStore(
		authRef.onChange,
		useCallback(() => authRef.value, []),
	)

	return (
		<loginContext.Provider
			value={{
				logout: () => {
					clearJwt()
					authRef.value = undefined
				},
				loginState,
			}}
		>
			{children}
		</loginContext.Provider>
	)
}
