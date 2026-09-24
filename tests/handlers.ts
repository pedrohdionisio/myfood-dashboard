import { HttpResponse, http } from 'msw';
import { apiUrl, restaurantUrl } from './apiUrl';
import { buildAnalytics } from './fixtures/analytics';
import { buildOrdersPage } from './fixtures/orders';
import { buildMembership, buildRestaurant } from './fixtures/restaurants';
import { buildUser } from './fixtures/users';

export const defaultHandlers = [
	http.get(apiUrl('/restaurant-users/me'), () => HttpResponse.json(buildUser())),
	http.get(apiUrl('/restaurant-users/me/restaurants'), () =>
		HttpResponse.json([buildMembership()])
	),
	http.get(restaurantUrl(), () => HttpResponse.json(buildRestaurant())),
	http.get(restaurantUrl('/analytics'), () => HttpResponse.json(buildAnalytics())),
	http.get(restaurantUrl('/orders'), () => HttpResponse.json(buildOrdersPage([]))),
	http.get(
		restaurantUrl('/orders/stream'),
		() =>
			new HttpResponse(new ReadableStream(), {
				headers: { 'Content-Type': 'text/event-stream' }
			})
	),
	http.get(restaurantUrl('/activation-checklist'), () =>
		HttpResponse.json({
			isReadyToActivate: false,
			requirements: [
				{ code: 'OPENING_HOURS', isMet: true },
				{ code: 'AVAILABLE_PRODUCT', isMet: false }
			]
		})
	),
	http.get(restaurantUrl('/menu-categories'), () => HttpResponse.json([])),
	http.get(restaurantUrl('/products'), () => HttpResponse.json([])),
	http.get(restaurantUrl('/members'), () => HttpResponse.json([])),
	http.get(restaurantUrl('/reviews'), () =>
		HttpResponse.json({ items: [], page: 1, perPage: 10, hasMore: false })
	),
	http.get(restaurantUrl('/opening-hours'), () => HttpResponse.json([])),
	http.get(restaurantUrl('/cuisines'), () => HttpResponse.json([])),
	http.get(apiUrl('/cuisine-categories'), () => HttpResponse.json([]))
];
