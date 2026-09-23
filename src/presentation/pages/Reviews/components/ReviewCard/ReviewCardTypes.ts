import type { IRestaurantReview } from 'shared/entities/IReview';

export interface IReviewCardProps {
	restaurantId: string;
	review: IRestaurantReview;
}
