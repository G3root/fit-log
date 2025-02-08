import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'

import { Modal } from '~/components/ui/modal'
import { AddExerciseForm } from './add-exercise-form'

export function AddExerciseDrawer() {
	return (
		<Modal>
			<Button size="square-petite" appearance="outline">
				<Plus className="h-4 w-4" />
			</Button>
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>Are you absolutely sure?</Modal.Title>
					<Modal.Description>This action cannot be undone.</Modal.Description>
				</Modal.Header>
				<Modal.Body className="pb-1">
					<AddExerciseForm />
				</Modal.Body>
				<Modal.Footer>
					<Modal.Close>Cancel</Modal.Close>
					<Button type="submit" form="add-exercise-form">
						Submit
					</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}
