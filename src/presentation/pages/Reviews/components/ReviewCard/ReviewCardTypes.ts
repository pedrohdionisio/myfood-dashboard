import type { IRestaurantReview } from 'shared/entities/IRestaurantReview';

export interface IReviewCardProps {
	restaurantId: string;
	review: IRestaurantReview;
}
