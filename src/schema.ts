import {
	type Row,
	createSchema,
	definePermissions,
	string,
	table,
} from '@rocicorp/zero'

const exercise = table('exercise')
	.columns({
		id: string(),
		name: string(),
	})
	.primaryKey('id')

export const schema = createSchema(1, {
	tables: [exercise],
})

type AuthData = {
	sub: string | null
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	return {}
})

export type Schema = typeof schema
export type Exercise = Row<typeof schema.tables.exercise>
