import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '~/lib/db'

export function ExercisesList() {
	const allExercises = useLiveQuery(() => db.exercises.toArray())

	return (
		<ul>
			{allExercises?.map((item) => (
				<li key={item.id}> {item.name}</li>
			))}
		</ul>
	)
}
