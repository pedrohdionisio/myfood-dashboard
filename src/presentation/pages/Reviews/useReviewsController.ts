import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useRestaurant } from 'data/modules/restaurants/useCases/getRestaurant/useRestaurant';
import { useReviews } from 'data/modules/reviews/useCases/listReviews/useReviews';
import { useState } from 'react';

const REVIEWS_PER_PAGE = 10;

export function useReviewsController() {
	const { restaurantId, restaurantGate } = useSelectedRestaurant();

	const [page, setPage] = useState(1);

	const canSeeReviews = restaurantGate === 'OPERATING';
	const scopedRestaurantId = canSeeReviews ? restaurantId : null;

	const { reviews, hasMoreReviews, isLoadingReviews, isFetchingReviews, reviewsError } = useReviews(
		scopedRestaurantId,
		{ page, perPage: REVIEWS_PER_PAGE }
	);
	const { restaurant } = useRestaurant(scopedRestaurantId);

	function handlePreviousPage() {
		setPage((currentPage) => Math.max(1, currentPage - 1));
	}

	function handleNextPage() {
		setPage((currentPage) => currentPage + 1);
	}

	return {
		restaurantId,
		restaurantGate,
		canSeeReviews,
		reviews,
		ratingAvg: restaurant?.ratingAvg ?? 0,
		ratingCount: restaurant?.ratingCount ?? 0,
		page,
		hasMoreReviews,
		isLoadingReviews,
		isFetchingReviews,
		reviewsErrorMessage: reviewsError ? getApiErrorMessage(reviewsError) : null,
		isEmpty: !isLoadingReviews && !reviewsError && reviews.length === 0,
		handlePreviousPage,
		handleNextPage
	};
}
