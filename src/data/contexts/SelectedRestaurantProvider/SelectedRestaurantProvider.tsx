import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { createContext, type PropsWithChildren, use, useCallback, useState } from 'react';
import { SELECTED_RESTAURANT_STORAGE_KEY } from 'shared/constants/storage';
import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';
import type { ISelectedRestaurantContextValue } from './SelectedRestaurantProviderTypes';

const SelectedRestaurantContext = createContext<ISelectedRestaurantContextValue | null>(null);

function resolveSelectedRestaurant(
	myRestaurants: IRestaurantMembership[],
	storedRestaurantId: string | null
): IRestaurantMembership | null {
	if (myRestaurants.length === 1) {
		return myRestaurants[0] ?? null;
	}

	return myRestaurants.find(({ restaurantId }) => restaurantId === storedRestaurantId) ?? null;
}

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
		<SelectedRestaurantContext.Provider value={{ selectedRestaurant, selectRestaurant }}>
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
