import { AddExerciseDrawer } from './add-exercise-drawer'

export function ExerciseTopBar() {
	return (
		<header className="flex items-center justify-between p-4 border-b">
			<h1 className="text-2xl font-normal">Exercises</h1>
			<div className="flex gap-3">
				<AddExerciseDrawer />
			</div>
		</header>
	)
}
