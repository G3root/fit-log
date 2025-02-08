import { Dumbbell, Plus, User } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function BottomNav() {
	return (
		<div className="fixed bottom-0 left-0 z-50 w-full grid grid-cols-4 border-t">
			<Button
				appearance="plain"
				className="flex flex-col items-center justify-center h-16 gap-1"
			>
				<Plus className="h-6 w-6" />
				<span className="text-xs">Workout</span>
			</Button>
			<Button
				appearance="plain"
				className="flex flex-col items-center justify-center h-16 gap-1"
			>
				<Dumbbell className="h-6 w-6" />
				<span className="text-xs">Exercises</span>
			</Button>

			<Button
				appearance="plain"
				className="flex flex-col items-center justify-center h-16 gap-1"
			>
				<Dumbbell className="h-6 w-6" />
				<span className="text-xs">History</span>
			</Button>

			<Button
				appearance="plain"
				className="flex flex-col items-center justify-center h-16 gap-1"
			>
				<User className="h-6 w-6" />
				<span className="text-xs">Profile</span>
			</Button>
		</div>
	)
}
