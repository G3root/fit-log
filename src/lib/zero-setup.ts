import { Zero, type ZeroOptions } from '@rocicorp/zero'
import { PLANS, type TPlans } from '~/constants'
import { type Schema, schema } from '~/schema'
import { Atom } from './atom'
import { clearJwt, getJwt, getRawJwt } from './jwt'
import { getSyncData, getSyncToken, removeSyncData } from './sync-token'

export interface LoginState {
	encoded: string
	decoded: {
		sub: string
		name: string
		plan: TPlans
	}
}

interface SyncState {
	userId: string
}

const SERVER_URL = import.meta.env.VITE_PUBLIC_SERVER

const zeroAtom = new Atom<Zero<Schema>>()
const authAtom = new Atom<LoginState | undefined>()
const syncAtom = new Atom<SyncState | undefined>()

function initializeAuthState() {
	const encodedJwt = getRawJwt()
	const jwt = getJwt()

	if (!encodedJwt || !jwt) {
		return undefined
	}

	return {
		encoded: encodedJwt,
		decoded: jwt as LoginState['decoded'],
	}
}

function handleAuthError() {
	clearJwt()
	authAtom.value = undefined
}

export function initZero(auth?: LoginState): Zero<Schema> {
	const config: ZeroOptions<Schema> = {
		logLevel: 'info',
		userID: auth?.decoded?.sub ?? 'anon',
		auth: (error?: 'invalid-token') => {
			if (error === 'invalid-token') {
				handleAuthError()
				return undefined
			}
			return auth?.encoded
		},
		schema,
	}

	if (auth?.decoded?.sub && auth.decoded.plan !== PLANS.free) {
		config.server = SERVER_URL
	}

	return new Zero(config)
}

async function syncExercises(
	z: Zero<Schema>,
	auth: LoginState['decoded'],
	syncValue: SyncState,
) {
	if (!auth?.sub || auth.plan === PLANS.free || !syncValue) {
		return
	}

	try {
		const syncData = getSyncData()
		await z.mutateBatch(async (m) => {
			const exercises = syncData.exercises.map((exercise) => ({
				...exercise,
				creatorID: z.userID,
			}))

			for (const exercise of exercises) {
				await m.exercise.upsert(exercise)
			}
		})

		removeSyncData()
	} catch (error) {
		console.error('Failed to sync exercises:', error)
		// Handle sync error appropriately
	}
}

authAtom.value = initializeAuthState()
syncAtom.value = getSyncToken() as SyncState | undefined

// Setup observers
authAtom.onChange(async (auth) => {
	if (zeroAtom.value) {
		zeroAtom.value.close()
	}
	zeroAtom.value = initZero(auth)
})

syncAtom.onChange(async (syncValue) => {
	const z = zeroAtom.value
	const auth = authAtom.value?.decoded

	if (!z || !auth || !syncValue) {
		return
	}

	await syncExercises(z, auth, syncValue)
})

export { authAtom as authRef, zeroAtom as zeroRef, syncAtom as syncRef }
