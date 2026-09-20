import { LayoutDashboardIcon } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from 'presentation/components/Sidebar/Sidebar';
import { NavLink, useMatch } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';

export function DashboardSidebar() {
	const isOverviewActive = !!useMatch(APP_ROUTES.home);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="h-16 flex-row items-center px-4 group-data-[collapsible=icon]:px-2">
				<img src={logo} alt="MyFood" className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isOverviewActive} tooltip="Visão geral">
									<NavLink to={APP_ROUTES.home}>
										<LayoutDashboardIcon aria-hidden="true" />
										<span>Visão geral</span>
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
