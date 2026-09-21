import type { IRestaurantReview } from 'shared/entities/IReview';

export interface IListReviewsParams {
	page?: number;
	perPage?: number;
}

export interface IReviewsPage {
	items: IRestaurantReview[];
	page: number;
	perPage: number;
	hasMore: boolean;
}
