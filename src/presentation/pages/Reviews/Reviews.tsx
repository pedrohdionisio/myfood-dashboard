import { StarIcon, TriangleAlertIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from 'presentation/components/Pagination/Pagination';
import { RestaurantGateNotice } from 'presentation/components/RestaurantGateNotice/RestaurantGateNotice';
import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import { ReviewCard } from './components/ReviewCard/ReviewCard';
import { useReviewsController } from './useReviewsController';

const SKELETON_KEYS = ['first', 'second', 'third'];

export function Reviews() {
	const {
		restaurantId,
		restaurantGate,
		canSeeReviews,
		reviews,
		ratingAvg,
		ratingCount,
		page,
		hasMoreReviews,
		isLoadingReviews,
		isFetchingReviews,
		reviewsErrorMessage,
		isEmpty,
		handlePreviousPage,
		handleNextPage
	} = useReviewsController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-title-md">Avaliações</h1>

					<p className="text-body-sm text-muted-foreground">
						O que os clientes disseram depois de receber o pedido.
					</p>
				</div>

				{canSeeReviews && ratingCount > 0 ? (
					<div className="flex items-center gap-2">
						<StarIcon aria-hidden="true" className="size-5 fill-warning text-warning" />

						<strong className="font-mono text-title-sm tabular-nums">
							{ratingAvg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
						</strong>

						<span className="text-body-sm text-muted-foreground">
							de 5 · {ratingCount} {ratingCount === 1 ? 'avaliação' : 'avaliações'}
						</span>
					</div>
				) : null}
			</header>

			{restaurantId ? (
				<RestaurantGateNotice gate={restaurantGate} restaurantId={restaurantId} />
			) : null}

			{reviewsErrorMessage ? (
				<Alert variant="destructive">
					<TriangleAlertIcon aria-hidden="true" />

					<AlertTitle>Não foi possível carregar as avaliações</AlertTitle>

					<AlertDescription>{reviewsErrorMessage}</AlertDescription>
				</Alert>
			) : null}

			{isLoadingReviews ? (
				<div className="flex flex-col gap-4">
					{SKELETON_KEYS.map((skeletonKey) => (
						<Skeleton key={skeletonKey} className="h-40 w-full rounded-xl" />
					))}
				</div>
			) : null}

			{isEmpty && canSeeReviews ? (
				<p className="rounded-xl border bg-card p-10 text-center text-body-sm text-muted-foreground">
					Nenhuma avaliação ainda. Elas aparecem aqui depois que o cliente recebe o pedido e dá a
					nota.
				</p>
			) : null}

			{reviews.length > 0 ? (
				<div
					data-fetching={isFetchingReviews || undefined}
					className="flex flex-col gap-4 data-fetching:opacity-60"
				>
					{restaurantId
						? reviews.map((review) => (
								<ReviewCard key={review.id} restaurantId={restaurantId} review={review} />
							))
						: null}
				</div>
			) : null}

			{page > 1 || hasMoreReviews ? (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious disabled={page === 1} onClick={handlePreviousPage} />
						</PaginationItem>

						<PaginationItem>
							<span className="px-3 text-body-sm text-muted-foreground">Página {page}</span>
						</PaginationItem>

						<PaginationItem>
							<PaginationNext disabled={!hasMoreReviews} onClick={handleNextPage} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			) : null}
		</div>
	);
}
