import { valibotResolver } from '@hookform/resolvers/valibot'
import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'
import * as v from 'valibot'
import { Button } from '~/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const FormSchema = v.object({
	name: v.string(),
})

type TFormSchema = v.InferOutput<typeof FormSchema>

export function AddRoutineForm() {
	const form = useForm<TFormSchema>({
		resolver: valibotResolver(FormSchema),
		defaultValues: {
			name: '',
		},
	})

	return (
		<Form {...form}>
			<form className="grid items-start gap-4 px-4">
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

				<div>
					<Button className="w-full">Add Exercise</Button>
				</div>
			</form>
		</Form>
	)
}
