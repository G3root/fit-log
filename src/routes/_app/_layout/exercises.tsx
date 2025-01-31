import { createFileRoute } from '@tanstack/react-router'
import { ExerciseTopBar } from '~/features/exercises/components/exercise-top-bar'
import { ExercisesList } from '~/features/exercises/components/exercises-list'

export const Route = createFileRoute('/_app/_layout/exercises')({
	component: ExerciseComponent,
})

function ExerciseComponent() {
	return (
		<>
			<ExerciseTopBar />
			<div className="grow">
				<ExercisesList />
			</div>
		</>
	)
}
