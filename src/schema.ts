import { type Row, createSchema, string, table } from '@rocicorp/zero'

const exercise = table('exercise')
	.columns({
		id: string(),
		name: string(),
	})
	.primaryKey('id')

export const schema = createSchema(1, {
	tables: [exercise],
})

export type Schema = typeof schema
export type Exercise = Row<typeof schema.tables.exercise>
