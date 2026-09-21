import { LayersIcon, LayoutDashboardIcon, SettingsIcon } from 'lucide-react';
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
import { NavLink, useLocation } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';

const DASHBOARD_MENU_ITEMS = [
	{ label: 'Visão geral', to: APP_ROUTES.home, icon: LayoutDashboardIcon },
	{ label: 'Categorias', to: APP_ROUTES.menuCategories, icon: LayersIcon },
	{ label: 'Configurações', to: APP_ROUTES.settings, icon: SettingsIcon }
];

export function DashboardSidebar() {
	const { pathname } = useLocation();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="h-16 flex-row items-center px-4 group-data-[collapsible=icon]:px-2">
				<img src={logo} alt="MyFood" className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{DASHBOARD_MENU_ITEMS.map(({ label, to, icon: Icon }) => (
								<SidebarMenuItem key={to}>
									<SidebarMenuButton asChild isActive={pathname === to} tooltip={label}>
										<NavLink to={to}>
											<Icon aria-hidden="true" />
											<span>{label}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
