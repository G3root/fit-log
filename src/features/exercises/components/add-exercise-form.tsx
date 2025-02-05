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
import { useZero } from '~/hooks/use-zero'

const FormSchema = v.object({
	name: v.string(),
})

type TFormSchema = v.InferOutput<typeof FormSchema>

export function AddExerciseForm() {
	const z = useZero()
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
					await z.mutate.exercise.insert({
						id: nanoid(32),
						name: data.name,
						created: Date.now(),
						modified: Date.now(),
						creatorID: z.userID,
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
