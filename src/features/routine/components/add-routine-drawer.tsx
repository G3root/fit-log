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
import { AddRoutineForm } from './add-routine-form'

export function AddRoutineDrawer() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button className="w-full">
					<Plus className="h-6 w-6 mr-2" />
					Add Routine
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Create New Routine</DrawerTitle>
					<DrawerDescription>
						Customize your workout journey by creating a new routine. Add
						exercises, set goals, and plan your sessions
					</DrawerDescription>
				</DrawerHeader>

				<AddRoutineForm />
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
