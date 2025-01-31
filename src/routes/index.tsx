import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: HomeComponent,
})

function HomeComponent() {
	return (
		<div className="p-2 text-red-600">
			<h3>Welcome Home!</h3>
		</div>
	)
}
