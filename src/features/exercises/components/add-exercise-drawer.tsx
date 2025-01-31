import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '~/components/ui/drawer'
import { AddExerciseForm } from './add-exercise-form'

export function AddExerciseDrawer() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon">
					<Plus className="h-6 w-6" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>This action cannot be undone.</DrawerDescription>
				</DrawerHeader>
				<AddExerciseForm />
				<DrawerFooter>
					<Button type="submit" form="add-exercise-form">
						Submit
					</Button>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
