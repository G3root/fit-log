import {
	type Row,
	createSchema,
	definePermissions,
	number,
	relationships,
	string,
	table,
} from '@rocicorp/zero'

const user = table('user')
	.columns({
		id: string(),
		plan: string(),
		modified: number(),
		created: number(),
	})
	.primaryKey('id')

const exercise = table('exercise')
	.columns({
		id: string(),
		name: string(),
		modified: number(),
		created: number(),
	})
	.primaryKey('id')

const workout = table('workout')
	.columns({
		id: string(),
		name: string().optional(),
		notes: string().optional(),
		creatorID: string(),
		modified: number(),
		created: number(),
	})
	.primaryKey('id')

const workoutExercise = table('workoutExercise')
	.columns({
		id: string(),
		workoutID: string(),
		exerciseID: string(),
	})
	.primaryKey('id')

const exerciseSet = table('exerciseSet')
	.columns({
		id: string(),
		reps: number().optional(),
		weight: number().optional(),
		workoutExerciseID: string(),
		created: number(),
	})
	.primaryKey('id')

const workoutRelationships = relationships(workout, ({ many, one }) => ({
	labels: many(
		{
			sourceField: ['id'],
			destSchema: workoutExercise,
			destField: ['workoutID'],
		},
		{
			sourceField: ['exerciseID'],
			destSchema: exercise,
			destField: ['id'],
		},
	),
	creator: one({
		sourceField: ['creatorID'],
		destField: ['id'],
		destSchema: user,
	}),
}))

const workoutExerciseRelationships = relationships(
	workoutExercise,
	({ many }) => ({
		createdIssues: many({
			sourceField: ['id'],
			destField: ['workoutExerciseID'],
			destSchema: exerciseSet,
		}),
	}),
)

export const schema = createSchema(1, {
	tables: [exercise, workoutExercise, workout, exerciseSet, user],
	relationships: [workoutRelationships, workoutExerciseRelationships],
})

type AuthData = {
	sub: string | null
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	return {}
})

export type Schema = typeof schema
export type Exercise = Row<typeof schema.tables.exercise>
