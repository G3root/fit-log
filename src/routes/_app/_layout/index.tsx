import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { AddRoutineDrawer } from '~/features/routine/components/add-routine-drawer'

export const Route = createFileRoute('/_app/_layout/')({
	component: HomeComponent,
})

function HomeComponent() {
	return (
		<>
			<div className="grow">
				<ScrollArea className="flex-1">
					<main className="p-4 gap-6 grid md:grid-cols-2">
						{/* Quick Start Section */}
						<section>
							<h2 className="text-2xl font-bold mb-4">Quick Start</h2>
							<Button className="w-full">Start Empty Workout</Button>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4">Routines</h2>
							<AddRoutineDrawer />
						</section>
					</main>
				</ScrollArea>
			</div>
		</>
	)
}
