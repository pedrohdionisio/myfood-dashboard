export interface IRestaurantReview {
	id: string;
	rating: number;
	comment: string | null;
	reply: string | null;
	repliedAt: string | null;
	createdAt: string;
	customerName: string;
	orderId: string;
	orderDisplayNumber: number;
}
