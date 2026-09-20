export interface ICreateRestaurantPayload {
	legalName: string;
	tradeName: string;
	cnpj: string;
	phone?: string;
	email?: string;
	zipCode: string;
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
}
