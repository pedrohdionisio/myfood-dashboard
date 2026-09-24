import { RESTAURANT_ID } from './fixtures/restaurants';

export function apiUrl(path: string) {
	return `http://api.test${path}`;
}

export function restaurantUrl(path = '') {
	return apiUrl(`/restaurants/${RESTAURANT_ID}${path}`);
}
