import { useQuery } from '@rocicorp/zero/react'
import { useZero } from '~/hooks/use-zero'

export function ExercisesList() {
	const z = useZero()
	const [allExercises] = useQuery(z.query.exercise)

	return (
		<ul>
			{allExercises.map((item) => (
				<li key={item.id}> {item.name}</li>
			))}
		</ul>
	)
}
