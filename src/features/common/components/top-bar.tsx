import { RotateCcw } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useLogin } from '~/hooks/use-login'
import { useZero } from '~/hooks/use-zero'
import { setSyncData } from '~/lib/sync-token'

export function TopBar() {
	return (
		<header className="flex items-center justify-between p-4 border-b border-gray-800">
			<h1 className="text-2xl font-normal">Workout</h1>
			<div className="flex items-center gap-4">
				<UpgradeButton />

				<LoginButton />
			</div>
		</header>
	)
}

function LoginButton() {
	const z = useZero()

	return (
		<Button
			onPress={() => {
				setSyncData(z)
				window.location.href = '/api/login/github'
			}}
			size="square-petite"
			appearance="outline"
		>
			<RotateCcw className="h-3 w-3 text-blue-500" />
		</Button>
	)
}

function UpgradeButton() {
	const z = useZero()
	const login = useLogin()

	return (
		<Button
			onPress={async () => {
				const req = await fetch('/api/upgrade', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${login.loginState?.encoded}`,
					},
				})
				const res = (await req.json()) as { success: boolean }

				if (res.success) {
					window.location.reload()
				}
			}}
		>
			upgrade
		</Button>
	)
}
