import {
	ClipboardListIcon,
	HistoryIcon,
	LayersIcon,
	LayoutDashboardIcon,
	SettingsIcon,
	StarIcon,
	UsersIcon,
	UtensilsCrossedIcon
} from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from 'presentation/components/Sidebar/Sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';

const DASHBOARD_MENU_GROUPS = [
	{
		id: 'overview',
		label: null,
		items: [{ label: 'Visão geral', to: APP_ROUTES.home, icon: LayoutDashboardIcon }]
	},
	{
		id: 'orders',
		label: 'Pedidos',
		items: [
			{ label: 'Em aberto', to: APP_ROUTES.orders, icon: ClipboardListIcon },
			{ label: 'Histórico', to: APP_ROUTES.ordersHistory, icon: HistoryIcon }
		]
	},
	{
		id: 'reviews',
		label: null,
		items: [{ label: 'Avaliações', to: APP_ROUTES.reviews, icon: StarIcon }]
	},
	{
		id: 'menu',
		label: 'Cardápio',
		items: [
			{ label: 'Categorias', to: APP_ROUTES.menuCategories, icon: LayersIcon },
			{ label: 'Produtos', to: APP_ROUTES.products, icon: UtensilsCrossedIcon }
		]
	},
	{
		id: 'team',
		label: 'Equipe',
		items: [{ label: 'Membros', to: APP_ROUTES.team, icon: UsersIcon }]
	},
	{
		id: 'settings',
		label: null,
		items: [{ label: 'Configurações', to: APP_ROUTES.settings, icon: SettingsIcon }]
	}
];

export function DashboardSidebar() {
	const { pathname } = useLocation();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="h-16 flex-row items-center px-4 group-data-[collapsible=icon]:px-2">
				<img src={logo} alt="MyFood" className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
			</SidebarHeader>

			<SidebarContent>
				{DASHBOARD_MENU_GROUPS.map((group) => (
					<SidebarGroup key={group.id}>
						{group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}

						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map(({ label, to, icon: Icon }) => (
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
				))}
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
