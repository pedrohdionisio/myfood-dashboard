import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type ReplyFormType,
	replySchema
} from 'data/modules/reviews/useCases/replyToReview/schemas/replySchema';
import { useReplyToReview } from 'data/modules/reviews/useCases/replyToReview/useReplyToReview';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { IReviewCardProps } from './ReviewCardTypes';

export function useReviewCardController({ restaurantId, review }: IReviewCardProps) {
	const { replyToReview } = useReplyToReview();
	const [isReplying, setIsReplying] = useState(false);

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<ReplyFormType>({
		resolver: zodResolver(replySchema),
		defaultValues: { reply: '' }
	});

	function handleStartReply() {
		setIsReplying(true);
	}

	function handleCancelReply() {
		reset();
		setIsReplying(false);
	}

	async function onSubmit({ reply }: ReplyFormType) {
		try {
			await replyToReview({ restaurantId, reviewId: review.id, reply });

			setIsReplying(false);
			toast.success('Resposta publicada.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		register,
		replyError: errors.reply?.message,
		isSubmitting,
		canReply: !review.reply,
		isReplying,
		handleStartReply,
		handleCancelReply,
		handleSubmit: handleSubmit(onSubmit)
	};
}
