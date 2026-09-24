import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { createContext, type PropsWithChildren, use, useCallback, useState } from 'react';
import { SELECTED_RESTAURANT_STORAGE_KEY } from 'shared/constants/storage';
import type { ISelectedRestaurantContextValue } from './SelectedRestaurantProviderTypes';
import { resolveRestaurantGate } from './utils/resolveRestaurantGate';
import { resolveSelectedRestaurant } from './utils/resolveSelectedRestaurant';

const SelectedRestaurantContext = createContext<ISelectedRestaurantContextValue | null>(null);

export function SelectedRestaurantProvider({ children }: PropsWithChildren) {
	const { myRestaurants } = useMyRestaurants();
	const [storedRestaurantId, setStoredRestaurantId] = useState(() =>
		localStorage.getItem(SELECTED_RESTAURANT_STORAGE_KEY)
	);

	const selectRestaurant = useCallback((restaurantId: string) => {
		localStorage.setItem(SELECTED_RESTAURANT_STORAGE_KEY, restaurantId);
		setStoredRestaurantId(restaurantId);
	}, []);

	const selectedRestaurant = resolveSelectedRestaurant(myRestaurants, storedRestaurantId);

	return (
		<SelectedRestaurantContext.Provider
			value={{
				selectedRestaurant,
				restaurantId: selectedRestaurant?.restaurantId ?? null,
				restaurantGate: resolveRestaurantGate(selectedRestaurant?.restaurantStatus),
				selectRestaurant
			}}
		>
			{children}
		</SelectedRestaurantContext.Provider>
	);
}

export function useSelectedRestaurant() {
	const context = use(SelectedRestaurantContext);

	if (!context) {
		throw new Error('useSelectedRestaurant must be used within SelectedRestaurantProvider');
	}

	return context;
}
