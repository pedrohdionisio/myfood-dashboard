import { api } from 'data/config/api';
import type { IListReviewsParams, IReviewsPage } from 'data/modules/reviews/types/ReviewTypes';

async function list(restaurantId: string, params: IListReviewsParams): Promise<IReviewsPage> {
	const { data } = await api.get<IReviewsPage>(`/restaurants/${restaurantId}/reviews`, { params });

	return data;
}

export const ReviewsService = {
	list
};
