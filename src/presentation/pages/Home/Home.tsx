import { Button } from 'presentation/components/Button/Button';
import { Link } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { useHomeController } from './useHomeController';

export function Home() {
	const { userName, restaurantName, canSwitchRestaurant, handleSignOut } = useHomeController();

	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4">
			<header className="flex flex-col items-center gap-2 text-center">
				<img src={logo} alt="MyFood" className="h-10 w-auto" />
				<h1 className="text-title-md">{restaurantName}</h1>
				<p className="text-body-md text-muted-foreground">Sessão ativa como {userName}</p>
			</header>

			<div className="flex items-center gap-3">
				{canSwitchRestaurant ? (
					<Button variant="outline" asChild>
						<Link to={APP_ROUTES.restaurantSelection}>Trocar restaurante</Link>
					</Button>
				) : null}

				<Button variant="outline" onClick={handleSignOut}>
					Sair
				</Button>
			</div>
		</main>
	);
}
