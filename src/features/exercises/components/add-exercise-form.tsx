import { valibotResolver } from '@hookform/resolvers/valibot'
import { nanoid } from 'nanoid'
import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { FieldError, FieldGroup, Input, Label } from '~/components/ui/field'
import { Form } from '~/components/ui/form'
import { TextField } from '~/components/ui/text-field'
import { useZero } from '~/hooks/use-zero'

const FormSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty('name is required')),
})

type TFormSchema = v.InferOutput<typeof FormSchema>

export function AddExerciseForm() {
	const z = useZero()
	const { control, handleSubmit } = useForm<TFormSchema>({
		resolver: valibotResolver(FormSchema),
		defaultValues: {
			name: '',
		},
	})

	return (
		<Form
			id="add-exercise-form"
			onSubmit={handleSubmit(async (data) => {
				await z.mutate.exercise.insert({
					id: nanoid(32),
					name: data.name,
					created: Date.now(),
					modified: Date.now(),
					creatorID: z.userID,
				})
			})}
		>
			<Controller
				control={control}
				name="name"
				render={({
					field: { name, value, onChange, onBlur, ref },
					fieldState: { invalid, error },
				}) => (
					<TextField
						name={name}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						isRequired
						validationBehavior="aria"
						isInvalid={invalid}
					>
						<Label>Name</Label>

						<FieldGroup isInvalid={!!error?.message}>
							{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
							<Input ref={ref as any} />
						</FieldGroup>
						<FieldError>{error?.message}</FieldError>
					</TextField>
				)}
			/>
		</Form>
	)
}
