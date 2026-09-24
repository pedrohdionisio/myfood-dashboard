import type { IRestaurant } from 'shared/entities/IRestaurant';
import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';

export const RESTAURANT_ID = 'restaurant-1';

export function buildMembership(
	overrides: Partial<IRestaurantMembership> = {}
): IRestaurantMembership {
	return {
		restaurantId: RESTAURANT_ID,
		tradeName: 'Cantina da Nonna',
		role: 'OWNER',
		restaurantStatus: 'ACTIVE',
		...overrides
	};
}

export function buildRestaurant(overrides: Partial<IRestaurant> = {}): IRestaurant {
	return {
		id: RESTAURANT_ID,
		slug: 'cantina-da-nonna',
		legalName: 'Cantina da Nonna LTDA',
		tradeName: 'Cantina da Nonna',
		cnpj: '11222333000181',
		phone: '11987654321',
		email: 'contato@cantina.com',
		description: 'Massas artesanais',
		logoKey: null,
		bannerKey: null,
		logoUrls: null,
		bannerUrls: null,
		zipCode: '01310100',
		street: 'Avenida Paulista',
		number: '1000',
		complement: null,
		neighborhood: 'Bela Vista',
		city: 'São Paulo',
		state: 'SP',
		deliveryFeeCents: 700,
		minOrderCents: 2000,
		avgPrepTimeMin: 30,
		status: 'ACTIVE',
		isAcceptingOrders: true,
		ratingAvg: 4.5,
		ratingCount: 12,
		...overrides
	};
}
