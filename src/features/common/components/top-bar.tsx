import { RotateCcw } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function TopBar() {
	return (
		<header className="flex items-center justify-between p-4 border-b border-gray-800">
			<h1 className="text-2xl font-normal">Workout</h1>
			<Button variant="ghost" size="icon">
				<RotateCcw className="h-6 w-6 text-blue-500" />
			</Button>
		</header>
	)
}
