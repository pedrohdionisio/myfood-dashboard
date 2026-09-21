import { skipToken, useQuery } from '@tanstack/react-query';
import { ReviewQueryKeys } from 'data/modules/reviews/keys/ReviewKeys';
import { ReviewsService } from 'data/modules/reviews/services/ReviewsService';
import type { IListReviewsParams } from 'data/modules/reviews/types/ReviewTypes';

export function useReviews(restaurantId: string | null, params: IListReviewsParams) {
	const { data, isLoading, isFetching, error } = useQuery({
		queryKey: [ReviewQueryKeys.REVIEWS, restaurantId, params.page, params.perPage],
		queryFn: restaurantId ? () => ReviewsService.list(restaurantId, params) : skipToken,
		placeholderData: (previousData) => previousData
	});

	return {
		reviews: data?.items ?? [],
		hasMoreReviews: data?.hasMore ?? false,
		isLoadingReviews: isLoading,
		isFetchingReviews: isFetching,
		reviewsError: error
	};
}
