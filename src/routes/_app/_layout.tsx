import { Outlet, createFileRoute } from '@tanstack/react-router'
import { BottomNav } from '~/features/common/components/bottom-nav'
import { TopBar } from '~/features/common/components/top-bar'

export const Route = createFileRoute('/_app/_layout')({
	component: LayoutComponent,
})

function LayoutComponent() {
	return (
		<>
			<TopBar />
			<Outlet />
			<BottomNav />
		</>
	)
}
