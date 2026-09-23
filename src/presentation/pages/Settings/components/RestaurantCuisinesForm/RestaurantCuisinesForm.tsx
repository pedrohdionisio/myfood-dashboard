import { cn } from 'cn';
import { CheckIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import type { IRestaurantCuisinesFormProps } from './RestaurantCuisinesFormTypes';
import { useRestaurantCuisinesFormController } from './useRestaurantCuisinesFormController';

export function RestaurantCuisinesForm({
	restaurantId,
	cuisineCatalog,
	restaurantCuisines
}: IRestaurantCuisinesFormProps) {
	const {
		selectedIds,
		isDirty,
		isAtLimit,
		maxCuisines,
		isReplacingRestaurantCuisines,
		handleToggleCuisine,
		handleSubmit
	} = useRestaurantCuisinesFormController({ restaurantId, restaurantCuisines });

	return (
		<Card>
			<CardHeader>
				<CardTitle>Culinárias</CardTitle>

				<CardDescription>
					É por elas que o cliente encontra a loja nos filtros do app, e elas aparecem no card do
					restaurante. Escolha até {maxCuisines}.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent>
					<ul className="flex flex-wrap gap-2">
						{cuisineCatalog.map((cuisine) => {
							const isSelected = selectedIds.includes(cuisine.id);

							return (
								<li key={cuisine.id}>
									<button
										type="button"
										aria-pressed={isSelected}
										disabled={!isSelected && isAtLimit}
										onClick={() => handleToggleCuisine(cuisine.id)}
										className={cn(
											'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-body-sm outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
											isSelected
												? 'border-primary bg-primary/10 text-primary'
												: 'bg-card text-foreground hover:bg-accent'
										)}
									>
										{isSelected ? <CheckIcon className="size-3.5" aria-hidden="true" /> : null}
										{cuisine.name}
									</button>
								</li>
							);
						})}
					</ul>
				</CardContent>

				<CardFooter className="mt-6 justify-end border-t pt-6">
					<Button type="submit" disabled={!isDirty} isLoading={isReplacingRestaurantCuisines}>
						Salvar culinárias
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
