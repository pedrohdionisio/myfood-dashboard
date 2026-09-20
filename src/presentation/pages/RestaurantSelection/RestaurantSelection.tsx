import { Button } from 'presentation/components/Button/Button';
import logo from 'shared/assets/black-red-logo.svg';
import { RestaurantOption } from './components/RestaurantOption/RestaurantOption';
import { useRestaurantSelectionController } from './useRestaurantSelectionController';

export function RestaurantSelection() {
	const {
		myRestaurants,
		isRefetchingMyRestaurants,
		errorMessage,
		handleSelectRestaurant,
		handleRetry
	} = useRestaurantSelectionController();

	return (
		<main className="flex min-h-svh justify-center bg-background px-4 py-12">
			<div className="flex w-full max-w-xl flex-col gap-8">
				<header className="flex flex-col items-center gap-8">
					<img src={logo} alt="MyFood" className="h-10 w-auto" />

					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-title-md">Qual restaurante você quer administrar?</h1>

						<p className="text-body-sm text-muted-foreground">
							Você pode trocar de restaurante quando quiser.
						</p>
					</div>
				</header>

				{errorMessage ? (
					<div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
						<p className="text-body-sm text-destructive">{errorMessage}</p>

						<Button variant="outline" onClick={handleRetry} isLoading={isRefetchingMyRestaurants}>
							Tentar novamente
						</Button>
					</div>
				) : (
					<ul className="flex flex-col gap-3">
						{myRestaurants.map((restaurant) => (
							<li key={restaurant.restaurantId}>
								<RestaurantOption restaurant={restaurant} onSelect={handleSelectRestaurant} />
							</li>
						))}
					</ul>
				)}
			</div>
		</main>
	);
}
