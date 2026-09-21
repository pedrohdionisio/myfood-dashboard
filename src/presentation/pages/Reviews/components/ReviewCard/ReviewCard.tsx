import { cn } from 'cn';
import { StarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from 'presentation/components/Card/Card';
import type { IReviewCardProps } from './ReviewCardTypes';
import { formatReviewDate } from './utils/formatReviewDate';

const RATING_STARS = [1, 2, 3, 4, 5];

export function ReviewCard({ review }: IReviewCardProps) {
	return (
		<Card className="gap-4 py-5">
			<CardHeader className="gap-2 px-5">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span
						role="img"
						aria-label={`${review.rating} de 5 estrelas`}
						className="flex items-center gap-0.5"
					>
						{RATING_STARS.map((star) => (
							<StarIcon
								key={star}
								aria-hidden="true"
								className={cn(
									'size-4',
									star <= review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
								)}
							/>
						))}
					</span>

					<span className="text-body-sm font-medium">{review.customerName}</span>

					<span className="text-body-sm text-muted-foreground">
						Pedido #{review.orderDisplayNumber} · {formatReviewDate(review.createdAt)}
					</span>
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-4 px-5">
				{review.comment ? (
					<p className="text-body-sm whitespace-pre-line">{review.comment}</p>
				) : (
					<p className="text-body-sm text-muted-foreground italic">
						O cliente deu a nota sem escrever um comentário.
					</p>
				)}

				{review.reply ? (
					<div className="flex flex-col gap-1 rounded-lg border-l-2 border-brand bg-muted/50 p-3">
						<span className="text-eyebrow text-muted-foreground uppercase">
							Sua resposta
							{review.repliedAt ? ` · ${formatReviewDate(review.repliedAt)}` : ''}
						</span>

						<p className="text-body-sm whitespace-pre-line">{review.reply}</p>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
