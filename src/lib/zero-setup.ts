import { Zero } from '@rocicorp/zero'
import { type Schema, schema } from '~/schema'
import { Atom } from './atom'
import { clearJwt, getJwt, getRawJwt } from './jwt'

export type LoginState = {
	encoded: string
	decoded: {
		sub: string
		name: string
		plan: 'free' | 'starter'
	}
}

const zeroAtom = new Atom<Zero<Schema>>()
const authAtom = new Atom<LoginState>()
const jwt = getJwt()
const encodedJwt = getRawJwt()

authAtom.value =
	encodedJwt && jwt
		? {
				encoded: encodedJwt,
				decoded: jwt as LoginState['decoded'],
			}
		: undefined

authAtom.onChange((auth) => {
	zeroAtom.value?.close()

	const z = new Zero({
		logLevel: 'info',
		server:
			auth?.decoded.plan !== 'free'
				? import.meta.env.VITE_PUBLIC_SERVER
				: undefined,
		userID: auth?.decoded?.sub ?? 'anon',
		auth: (error?: 'invalid-token') => {
			if (error === 'invalid-token') {
				clearJwt()
				authAtom.value = undefined
				return undefined
			}
			return auth?.encoded
		},
		schema,
	})
	zeroAtom.value = z
})

export { authAtom as authRef, zeroAtom as zeroRef }
