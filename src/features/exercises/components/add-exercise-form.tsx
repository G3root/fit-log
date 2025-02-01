import { valibotResolver } from '@hookform/resolvers/valibot'
import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'
import * as v from 'valibot'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { db } from '~/lib/db'

const FormSchema = v.object({
	name: v.string(),
})

type TFormSchema = v.InferOutput<typeof FormSchema>

export function AddExerciseForm() {
	const form = useForm<TFormSchema>({
		resolver: valibotResolver(FormSchema),
		defaultValues: {
			name: '',
		},
	})

	return (
		<Form {...form}>
			<form
				id="add-exercise-form"
				onSubmit={form.handleSubmit(async (data) => {
					await db.exercises.add({
						id: nanoid(32),
						name: data.name,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					})
				})}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
