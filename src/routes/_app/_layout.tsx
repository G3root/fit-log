import { Outlet, createFileRoute } from '@tanstack/react-router'
import { BottomNav } from '~/features/common/components/bottom-nav'

export const Route = createFileRoute('/_app/_layout')({
	component: LayoutComponent,
})

function LayoutComponent() {
	return (
		<>
			{/* <TopBar /> */}
			<Outlet />
			<BottomNav />
		</>
	)
}
