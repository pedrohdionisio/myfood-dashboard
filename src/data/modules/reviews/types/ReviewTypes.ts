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

export interface IReplyToReviewPayload {
	reply: string;
}

export interface IReplyToReviewVariables extends IReplyToReviewPayload {
	restaurantId: string;
	reviewId: string;
}
