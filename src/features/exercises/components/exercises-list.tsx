import { useQuery, useZero } from '@rocicorp/zero/react'
import type { Schema } from '~/schema'

export function ExercisesList() {
	const z = useZero<Schema>()
	const [allExercises] = useQuery(z.query.exercise)

	return (
		<ul>
			{allExercises.map((item) => (
				<li key={item.id}> {item.name}</li>
			))}
		</ul>
	)
}
