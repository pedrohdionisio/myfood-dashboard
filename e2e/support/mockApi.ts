import type { Page, Route } from '@playwright/test';
import type { IOrderStreamEvent } from '../../src/data/modules/orders/types/OrderTypes';
import type { IMenuCategory } from '../../src/shared/entities/IMenuCategory';
import type { IOpeningHour } from '../../src/shared/entities/IOpeningHour';
import type { IOrder, OrderStatus } from '../../src/shared/entities/IOrder';
import type { IProduct } from '../../src/shared/entities/IProduct';
import type { IRestaurant } from '../../src/shared/entities/IRestaurant';
import type { IRestaurantMembership } from '../../src/shared/entities/IRestaurantMembership';
import { buildAnalytics } from '../../tests/fixtures/analytics';
import { buildMenuCategory, buildProduct } from '../../tests/fixtures/menu';
import { buildOrdersPage } from '../../tests/fixtures/orders';
import { buildMembership, buildRestaurant, RESTAURANT_ID } from '../../tests/fixtures/restaurants';
import { buildUser } from '../../tests/fixtures/users';

export interface IStorageUpload {
	declaredContentType: string;
	fileContentType: string;
}

export interface IMockApiState {
	memberships: IRestaurantMembership[];
	restaurant: IRestaurant;
	orders: IOrder[];
	menuCategories: IMenuCategory[];
	products: IProduct[];
	openingHours: IOpeningHour[];
	storageUploads: IStorageUpload[];
	streamEvents: IOrderStreamEvent[];
}

const STATUS_BY_TRANSITION: Record<string, OrderStatus> = {
	confirm: 'CONFIRMED',
	reject: 'REJECTED',
	preparing: 'PREPARING',
	ready: 'READY',
	cancel: 'CANCELED',
	'delivery-failed': 'DELIVERY_FAILED'
};

const SESSION = {
	user: buildUser(),
	session: {
		accessToken: 'access-token',
		idToken: 'id-token',
		refreshToken: 'refresh-token',
		expiresIn: 3600
	}
};

function json(route: Route, body: unknown, status = 200) {
	return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

function readMultipartField(body: string, name: string) {
	return body.match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`))?.[1] ?? '';
}

function readMultipartFileType(body: string) {
	return body.match(/name="file"[^\r]*\r\nContent-Type: ([^\r]*)/)?.[1] ?? '';
}

export async function mockApi(page: Page, overrides: Partial<IMockApiState> = {}) {
	const state: IMockApiState = {
		memberships: [buildMembership()],
		restaurant: buildRestaurant(),
		orders: [],
		menuCategories: [],
		products: [],
		openingHours: [],
		storageUploads: [],
		streamEvents: [],
		...overrides
	};

	const restaurantPath = `/restaurants/${RESTAURANT_ID}`;

	await page.route('https://storage.test/**', async (route) => {
		const body = route.request().postDataBuffer()?.toString('latin1') ?? '';

		state.storageUploads.push({
			declaredContentType: readMultipartField(body, 'Content-Type'),
			fileContentType: readMultipartFileType(body)
		});

		await route.fulfill({ status: 204 });
	});

	await page.route('http://api.test/**', async (route) => {
		const request = route.request();
		const method = request.method();
		const url = new URL(request.url());
		const path = url.pathname;
		const body = request.postDataJSON() as Record<string, unknown> | null;

		if (method === 'POST' && path === '/auth/restaurant-users/sign-in') {
			return json(route, SESSION);
		}

		if (method === 'POST' && path === '/auth/restaurant-users/sign-up') {
			state.memberships = [];

			return json(route, SESSION, 201);
		}

		if (method === 'GET' && path === '/restaurant-users/me') {
			return json(route, SESSION.user);
		}

		if (method === 'GET' && path === '/restaurant-users/me/restaurants') {
			return json(route, state.memberships);
		}

		if (method === 'POST' && path === '/restaurants') {
			state.restaurant = buildRestaurant({ ...body, status: 'DRAFT' });
			state.memberships = [buildMembership({ restaurantStatus: 'DRAFT' })];

			return json(route, state.restaurant, 201);
		}

		if (method === 'GET' && path === restaurantPath) {
			return json(route, state.restaurant);
		}

		if (method === 'PATCH' && path === `${restaurantPath}/status`) {
			state.restaurant = { ...state.restaurant, status: 'ACTIVE' };
			state.memberships = [buildMembership({ restaurantStatus: 'ACTIVE' })];

			return json(route, state.restaurant);
		}

		if (method === 'GET' && path === `${restaurantPath}/activation-checklist`) {
			const hasOpeningHours = state.openingHours.length > 0;
			const hasAvailableProduct = state.products.some((product) => product.isAvailable);

			return json(route, {
				isReadyToActivate: hasOpeningHours && hasAvailableProduct,
				requirements: [
					{ code: 'OPENING_HOURS', isMet: hasOpeningHours },
					{ code: 'AVAILABLE_PRODUCT', isMet: hasAvailableProduct }
				]
			});
		}

		if (method === 'GET' && path === `${restaurantPath}/analytics`) {
			return json(route, buildAnalytics());
		}

		if (method === 'GET' && path === `${restaurantPath}/orders/stream`) {
			const events = state.streamEvents.splice(0);

			return route.fulfill({
				status: 200,
				contentType: 'text/event-stream',
				body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('')
			});
		}

		if (method === 'GET' && path === `${restaurantPath}/orders`) {
			const status = url.searchParams.get('status');

			return json(
				route,
				buildOrdersPage(state.orders.filter((order) => !status || order.status === status))
			);
		}

		const transition = path.match(/\/orders\/([^/]+)\/([a-z-]+)$/);

		if (method === 'POST' && transition) {
			const [, orderId, transitionPath] = transition;
			const status = STATUS_BY_TRANSITION[transitionPath ?? ''];
			state.orders = state.orders.map((order) =>
				order.id === orderId && status ? { ...order, status } : order
			);

			return json(
				route,
				state.orders.find((order) => order.id === orderId)
			);
		}

		if (method === 'GET' && path === `${restaurantPath}/menu-categories`) {
			return json(route, state.menuCategories);
		}

		if (method === 'POST' && path === `${restaurantPath}/menu-categories`) {
			const menuCategory = buildMenuCategory({
				id: crypto.randomUUID(),
				name: String(body?.name),
				position: state.menuCategories.length
			});
			state.menuCategories = [...state.menuCategories, menuCategory];

			return json(route, menuCategory, 201);
		}

		if (method === 'GET' && path === `${restaurantPath}/products`) {
			const menuCategoryId = url.searchParams.get('menuCategoryId');

			return json(
				route,
				state.products.filter((product) => product.menuCategoryId === menuCategoryId)
			);
		}

		if (method === 'POST' && path === `${restaurantPath}/products`) {
			const product = buildProduct({
				id: crypto.randomUUID(),
				menuCategoryId: String(body?.menuCategoryId),
				name: String(body?.name),
				description: typeof body?.description === 'string' ? body.description : null,
				priceCents: Number(body?.priceCents),
				imageKey: typeof body?.imageKey === 'string' ? body.imageKey : null
			});
			state.products = [...state.products, product];

			return json(route, product, 201);
		}

		if (method === 'POST' && path === `${restaurantPath}/uploads/images`) {
			const contentType = String(body?.contentType);

			return json(route, {
				imageKey: `uploads/${crypto.randomUUID()}`,
				url: 'https://storage.test/upload',
				fields: { key: 'uploads/key', 'Content-Type': contentType },
				maxBytes: 5 * 1024 * 1024,
				expiresInSeconds: 300
			});
		}

		if (method === 'GET' && path === `${restaurantPath}/opening-hours`) {
			return json(route, state.openingHours);
		}

		if (method === 'PUT' && path === `${restaurantPath}/opening-hours`) {
			const shifts = (body?.shifts ?? []) as Omit<IOpeningHour, 'id'>[];
			state.openingHours = shifts.map((shift, index) => ({ id: `shift-${index}`, ...shift }));

			return json(route, state.openingHours);
		}

		if (method === 'GET' && path === `${restaurantPath}/reviews`) {
			return json(route, { items: [], page: 1, perPage: 10, hasMore: false });
		}

		if (method === 'GET' && ['/cuisine-categories', `${restaurantPath}/cuisines`].includes(path)) {
			return json(route, []);
		}

		if (method === 'GET' && path === `${restaurantPath}/members`) {
			return json(route, []);
		}

		return json(route, { message: `Rota não mockada: ${method} ${path}` }, 501);
	});

	return state;
}

export async function seedSession(page: Page) {
	await page.addInitScript(() => {
		localStorage.setItem(
			'@myfood:auth-tokens',
			JSON.stringify({ accessToken: 'access-token', refreshToken: 'refresh-token' })
		);
	});
}
