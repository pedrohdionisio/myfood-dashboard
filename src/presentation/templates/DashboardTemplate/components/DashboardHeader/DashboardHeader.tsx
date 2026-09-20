import { ArrowLeftRightIcon, LogOutIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import { SidebarTrigger } from 'presentation/components/Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { useDashboardHeaderController } from './useDashboardHeaderController';

export function DashboardHeader() {
	const { userName, restaurantName, canSwitchRestaurant, handleSignOut } =
		useDashboardHeaderController();

	return (
		<header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-6">
			<div className="flex min-w-0 items-center gap-2">
				<SidebarTrigger className="-ml-2" />

				<h2 className="truncate text-title-sm">{restaurantName}</h2>

				{canSwitchRestaurant ? (
					<Button variant="ghost" size="sm" asChild>
						<Link to={APP_ROUTES.restaurantSelection}>
							<ArrowLeftRightIcon aria-hidden="true" />
							Trocar
						</Link>
					</Button>
				) : null}
			</div>

			<div className="flex items-center gap-3">
				<span className="hidden text-body-sm text-muted-foreground sm:inline">{userName}</span>

				<Button variant="outline" size="sm" onClick={handleSignOut}>
					<LogOutIcon aria-hidden="true" />
					Sair
				</Button>
			</div>
		</header>
	);
}
