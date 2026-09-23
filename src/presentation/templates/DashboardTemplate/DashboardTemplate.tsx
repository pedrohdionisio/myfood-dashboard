import { SidebarInset, SidebarProvider } from 'presentation/components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { DashboardSidebar } from './components/DashboardSidebar/DashboardSidebar';
import { useDashboardTemplateController } from './useDashboardTemplateController';

export function DashboardTemplate() {
	useDashboardTemplateController();

	return (
		<SidebarProvider>
			<DashboardSidebar />

			<SidebarInset>
				<DashboardHeader />

				<div className="flex-1 px-6 py-8">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
