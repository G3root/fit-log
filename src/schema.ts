import {
	type ExpressionBuilder,
	NOBODY_CAN,
	definePermissions,
} from '@rocicorp/zero'
import { type Schema, schema } from '~/generated/zero/schema'
import type { LoginState } from './lib/zero-setup'

type TableName = keyof Schema['tables']

type AuthData = LoginState['decoded']

const permissions = definePermissions<AuthData, Schema>(schema, () => {
	const userIsLoggedIn = (
		authData: AuthData,
		{ cmpLit }: ExpressionBuilder<Schema, TableName>,
	) => cmpLit(authData.sub, 'IS NOT', null)

	const loggedInUserIsCreator = (
		authData: AuthData,
		eb: ExpressionBuilder<Schema, 'exercise'>,
	) =>
		eb.and(userIsLoggedIn(authData, eb), eb.cmp('creatorID', '=', authData.sub))

	return {
		// user: {
		// 	row: {
		// 		insert: NOBODY_CAN,
		// 		update: {
		// 			preMutation: NOBODY_CAN,
		// 		},
		// 		delete: NOBODY_CAN,
		// 	},
		// },
		exercise: {
			row: {
				insert: [
					// prevents setting the creatorID of an issue to someone
					// other than the user doing the creating
					loggedInUserIsCreator,
				],
				update: {
					preMutation: [loggedInUserIsCreator],
					postMutation: [loggedInUserIsCreator],
				},
				delete: [loggedInUserIsCreator],
				select: [loggedInUserIsCreator],
			},
		},
		routine: {
			row: {
				insert: [loggedInUserIsCreator],
				update: {
					preMutation: [loggedInUserIsCreator],
					postMutation: [loggedInUserIsCreator],
				},
				delete: [loggedInUserIsCreator],
				select: [loggedInUserIsCreator],
			},
		},
	}
})

export { schema, permissions, type Schema }
