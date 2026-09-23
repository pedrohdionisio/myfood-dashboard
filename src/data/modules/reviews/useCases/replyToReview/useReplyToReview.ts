import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewMutationKeys, ReviewQueryKeys } from 'data/modules/reviews/keys/ReviewKeys';
import { ReviewsService } from 'data/modules/reviews/services/ReviewsService';
import type { IReplyToReviewVariables } from 'data/modules/reviews/types/ReviewTypes';

export function useReplyToReview() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [ReviewMutationKeys.REPLY_TO_REVIEW],
		mutationFn: ({ restaurantId, reviewId, ...payload }: IReplyToReviewVariables) =>
			ReviewsService.reply(restaurantId, reviewId, payload),
		async onSuccess(_result, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [ReviewQueryKeys.REVIEWS, restaurantId]
			});
		}
	});

	return {
		replyToReview: mutateAsync,
		isReplyingToReview: isPending
	};
}
