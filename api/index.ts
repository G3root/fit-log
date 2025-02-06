import { PrismaClient } from '@prisma/client'
import * as arctic from 'arctic'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { handle } from 'hono/vercel'
import { type JWTPayload, SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { TimeSpan, createDate } from '../src/lib/date'
import { SYNC_TOKEN_NAME } from '../src/lib/sync-token'

interface GitHubUser {
	id: string
	login: string
	email: string
	name: string
}

type Env = {
	Variables: {
		userId: string
	}
}

const plans = { free: 'free', paid: 'paid' }

const createPrismaClient = () => new PrismaClient()

const github = new arctic.GitHub(
	process.env.GITHUB_CLIENT_ID as string,
	process.env.GITHUB_CLIENT_SECRET as string,
	null,
)

const secret = new TextEncoder().encode(process.env.ZERO_AUTH_SECRET)

interface TGenerateTokenArgs extends JWTPayload {
	name: string | null
	plan: string
}

async function generateToken(data: TGenerateTokenArgs) {
	return new SignJWT(data)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('30days')
		.sign(secret)
}

function generateSyncToken() {
	return new SignJWT({})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2m')
		.sign(secret)
}

const jwtMiddleware = createMiddleware<Env>(async (c, next) => {
	const authHeader = c.req.header('Authorization')
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return c.text('Unauthorized', 401)
	}

	const token = authHeader.slice(7) // Remove "Bearer "
	try {
		const { payload } = await jwtVerify(token, secret)
		c.set('userId', payload.sub as string)
		await next()
	} catch (err) {
		return c.json({ error: 'Invalid or expired token' }, 401)
	}
})

export const app = new Hono<Env>().basePath('/api')

app.get('/login/github', async (c) => {
	const state = arctic.generateState()
	const url = github.createAuthorizationURL(state, ['user:email'])

	setCookie(c, 'github_oauth_state', state, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'Lax',
	})

	return c.redirect(url.toString())
})

app.get('/login/github/callback', async (c) => {
	const state = c.req.query('state')?.toString() ?? null
	const storedState = getCookie(c).github_oauth_state ?? null
	const code = c.req.query('code')?.toString() ?? null

	if (!code || !state || !storedState || state !== storedState) {
		return c.body(null, 400)
	}

	try {
		const tokens = await github.validateAuthorizationCode(code)

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`,
				'Content-Type': 'application/json',
			},
		})

		const githubUser: GitHubUser = await githubUserResponse.json()

		const prisma = createPrismaClient()

		const existingUserId = await prisma.user.findFirst({
			where: { githubID: String(githubUser.id) },
			select: { id: true },
		})

		let userId = nanoid()
		if (existingUserId) {
			userId = existingUserId.id
		} else {
			await prisma.user.create({
				data: {
					id: userId,
					modified: Date.now(),
					created: Date.now(),
					githubID: String(githubUser.id),
					name: githubUser.name,
				},
			})
		}

		const user = await prisma.user.findFirstOrThrow({ where: { id: userId } })

		const jwt = await generateToken({
			sub: userId,
			iat: Math.floor(Date.now() / 1000),
			name: user.name,
			plan: user.plan,
		})

		setCookie(c, 'jwt', jwt, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		})

		if (user.plan === plans.paid) {
			const sync = await generateSyncToken()
			setCookie(c, SYNC_TOKEN_NAME, sync, {
				expires: createDate(new TimeSpan(2, 'm')),
			})
		}

		return c.redirect('/')
	} catch (e) {
		if (
			e instanceof arctic.OAuth2RequestError &&
			e.message === 'bad_verification_code'
		) {
			return c.body(null, 400)
		}
		return c.body(null, 500)
	}
})

app.post('/upgrade', jwtMiddleware, async (c) => {
	const userId = c.get('userId')

	try {
		const prisma = createPrismaClient()

		const user = await prisma.user.update({
			where: { id: userId, plan: plans.free },
			data: {
				plan: plans.paid,
			},
		})

		const jwt = await generateToken({
			sub: user.id,
			iat: Math.floor(Date.now() / 1000),
			name: user.name,
			plan: user.plan,
		})

		setCookie(c, 'jwt', jwt, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		})

		return c.json({ data: user, success: true }, 200)
	} catch (error) {
		return c.json({ error: 'An Error Occurred', success: false }, 400)
	}
})

export default handle(app)
