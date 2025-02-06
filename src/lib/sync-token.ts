import { type JWTPayload, decodeJwt } from 'jose'
import Cookies from 'js-cookie'
import type { useZero } from '~/hooks/use-zero'

const STORAGE_KEY = 'syncData' as const
export const SYNC_TOKEN_NAME = 'sync' as const

interface SyncData {
	exercises: ReturnType<ReturnType<typeof useZero>['query']['exercise']['run']>
}

export function getSyncToken(): JWTPayload | undefined {
	const token = getRawSyncToken()

	if (!token) {
		return undefined
	}

	try {
		const payload = decodeJwt(token)
		const currentTime = Math.floor(Date.now() / 1000)

		if (!payload.exp || payload.exp < currentTime) {
			clearSyncToken()
			return undefined
		}

		return payload
	} catch (error) {
		clearSyncToken()
		return undefined
	}
}

export function getRawSyncToken(): string | undefined {
	return Cookies.get(SYNC_TOKEN_NAME)
}

export function clearSyncToken(): void {
	Cookies.remove(SYNC_TOKEN_NAME)
}

function createSyncData(z: ReturnType<typeof useZero>): SyncData {
	return {
		exercises: z.query.exercise.run(),
	}
}

export function setSyncData(z: ReturnType<typeof useZero>): void {
	try {
		const data = createSyncData(z)
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch (error) {
		throw new Error(
			`Failed to set sync data: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

export function removeSyncData(): void {
	window.localStorage.removeItem(STORAGE_KEY)
	clearSyncToken()
}

export function getSyncData(): SyncData {
	const data = window.localStorage.getItem(STORAGE_KEY)

	if (!data) {
		clearSyncToken()
		throw new Error('Sync data not found in localStorage')
	}

	try {
		return JSON.parse(data) as SyncData
	} catch (error) {
		clearSyncToken()
		throw new Error(
			`Failed to parse sync data: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}
