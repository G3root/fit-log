import { PrismaClient, type User } from '@prisma/client'
import * as arctic from 'arctic'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { handle } from 'hono/vercel'
import { type JWTPayload, SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { PLANS } from '../src/constants'
import { TimeSpan, createDate } from '../src/lib/date'
import { SYNC_TOKEN_NAME } from '../src/lib/sync-token'

interface GitHubUser {
	id: string
	login: string
	email: string
	name: string
}

interface Env {
	Variables: {
		userId: string
	}
}

interface TokenPayload extends JWTPayload {
	name: string | null
	plan: string
}

const JWT_CONFIG = {
	algorithm: 'HS256',
	syncTokenExpiry: '2m',
	authTokenExpiry: '30days',
} as const

const SECRET = new TextEncoder().encode(process.env.ZERO_AUTH_SECRET)
const GITHUB_CONFIG = {
	clientId: process.env.GITHUB_CLIENT_ID as string,
	clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
}

// Services
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class TokenService {
	static async generateAuthToken(data: TokenPayload): Promise<string> {
		return new SignJWT(data)
			.setProtectedHeader({ alg: JWT_CONFIG.algorithm })
			.setIssuedAt()
			.setExpirationTime(JWT_CONFIG.authTokenExpiry)
			.sign(SECRET)
	}

	static async generateSyncToken(): Promise<string> {
		return new SignJWT({})
			.setProtectedHeader({ alg: JWT_CONFIG.algorithm })
			.setIssuedAt()
			.setExpirationTime(JWT_CONFIG.syncTokenExpiry)
			.sign(SECRET)
	}

	static async verifyToken(token: string) {
		return jwtVerify(token, SECRET)
	}
}

class UserService {
	private prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	async findOrCreateUser(githubUser: GitHubUser): Promise<User> {
		const existingUser = await this.prisma.user.findFirst({
			where: { githubID: String(githubUser.id) },
		})

		if (existingUser) {
			return existingUser
		}

		return this.prisma.user.create({
			data: {
				id: nanoid(),
				modified: Date.now(),
				created: Date.now(),
				githubID: String(githubUser.id),
				name: githubUser.name,
				plan: PLANS.free,
			},
		})
	}

	async upgradeUser(userId: string): Promise<User> {
		return this.prisma.user.update({
			where: { id: userId, plan: PLANS.free },
			data: { plan: PLANS.starter },
		})
	}
}

const authMiddleware = createMiddleware<Env>(async (c, next) => {
	const authHeader = c.req.header('Authorization')
	if (!authHeader?.startsWith('Bearer ')) {
		return c.text('Unauthorized', 401)
	}

	try {
		const token = authHeader.slice(7)
		const { payload } = await TokenService.verifyToken(token)
		c.set('userId', payload.sub as string)
		await next()
	} catch (err) {
		return c.json({ error: 'Invalid or expired token' }, 401)
	}
})

const github = new arctic.GitHub(
	GITHUB_CONFIG.clientId,
	GITHUB_CONFIG.clientSecret,
	null,
)

export const app = new Hono<Env>().basePath('/api')
const userService = new UserService()

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
	const state = c.req.query('state')
	const storedState = getCookie(c).github_oauth_state
	const code = c.req.query('code')

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
		const user = await userService.findOrCreateUser(githubUser)

		const jwt = await TokenService.generateAuthToken({
			sub: user.id,
			iat: Math.floor(Date.now() / 1000),
			name: user.name,
			plan: user.plan,
		})

		setCookie(c, 'jwt', jwt, {
			expires: createDate(new TimeSpan(30, 'd')),
		})

		if (user.plan === PLANS.starter) {
			const sync = await TokenService.generateSyncToken()
			setCookie(c, SYNC_TOKEN_NAME, sync, {
				expires: createDate(new TimeSpan(2, 'm')),
			})
		}

		return c.redirect('/')
	} catch (error) {
		if (
			error instanceof arctic.OAuth2RequestError &&
			error.message === 'bad_verification_code'
		) {
			return c.body(null, 400)
		}
		return c.body(null, 500)
	}
})

app.post('/upgrade', authMiddleware, async (c) => {
	try {
		const userId = c.get('userId')
		const user = await userService.upgradeUser(userId)

		const jwt = await TokenService.generateAuthToken({
			sub: user.id,
			iat: Math.floor(Date.now() / 1000),
			name: user.name,
			plan: user.plan,
		})

		setCookie(c, 'jwt', jwt, {
			expires: createDate(new TimeSpan(30, 'd')),
		})

		return c.json({ data: user, success: true }, 200)
	} catch (error) {
		console.error('Upgrade error:', error)
		return c.json(
			{ error: 'An error occurred during upgrade', success: false },
			400,
		)
	}
})

export default handle(app)
