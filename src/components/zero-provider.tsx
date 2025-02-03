import { Zero } from '@rocicorp/zero'
import { ZeroProvider as Provider } from '@rocicorp/zero/react'
import type { ReactNode } from 'react'
import { schema } from '~/schema'

const userID = 'anon'

const zSync = new Zero({
	userID,
	// auth: () => encodedJWT,
	server: import.meta.env.VITE_PUBLIC_SERVER,
	schema,
	// This is often easier to develop with if you're frequently changing
	// the schema. Switch to 'idb' for local-persistence.
	kvStore: 'mem',
})

const zUnSync = new Zero({
	userID,
	// auth: () => encodedJWT,
	schema,
	// This is often easier to develop with if you're frequently changing
	// the schema. Switch to 'idb' for local-persistence.
	kvStore: 'idb',
})

export function ZeroProvider({ children }: { children: ReactNode }) {
	const isPaidUser = false

	return <Provider zero={zUnSync}>{children}</Provider>
}
