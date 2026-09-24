import { HttpResponse, http } from 'msw';
import { apiUrl } from './apiUrl';
import { buildMembership, buildRestaurant, RESTAURANT_ID } from './fixtures/restaurants';
import { buildUser } from './fixtures/users';

export const defaultHandlers = [
	http.get(apiUrl('/restaurant-users/me'), () => HttpResponse.json(buildUser())),
	http.get(apiUrl('/restaurant-users/me/restaurants'), () =>
		HttpResponse.json([buildMembership()])
	),
	http.get(apiUrl(`/restaurants/${RESTAURANT_ID}`), () => HttpResponse.json(buildRestaurant())),
	http.get(
		apiUrl(`/restaurants/${RESTAURANT_ID}/orders/stream`),
		() =>
			new HttpResponse(new ReadableStream(), {
				headers: { 'Content-Type': 'text/event-stream' }
			})
	)
];
