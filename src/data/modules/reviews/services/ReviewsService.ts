import { api } from 'data/config/api';
import type {
	IListReviewsParams,
	IReplyToReviewPayload,
	IReviewsPage
} from 'data/modules/reviews/types/ReviewTypes';

async function list(restaurantId: string, params: IListReviewsParams): Promise<IReviewsPage> {
	const { data } = await api.get<IReviewsPage>(`/restaurants/${restaurantId}/reviews`, { params });

	return data;
}

async function reply(
	restaurantId: string,
	reviewId: string,
	payload: IReplyToReviewPayload
): Promise<void> {
	await api.post(`/restaurants/${restaurantId}/reviews/${reviewId}/reply`, payload);
}

export const ReviewsService = {
	list,
	reply
};
