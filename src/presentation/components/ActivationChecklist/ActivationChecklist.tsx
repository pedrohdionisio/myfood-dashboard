import { CheckIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import { Link } from 'react-router-dom';
import type { IActivationChecklistProps } from './ActivationChecklistTypes';
import { useActivationChecklistController } from './useActivationChecklistController';

export function ActivationChecklist({ restaurantId }: IActivationChecklistProps) {
	const {
		requirements,
		isReadyToActivate,
		isLoadingActivationChecklist,
		activationChecklistErrorMessage,
		isActivatingRestaurant,
		handleActivate
	} = useActivationChecklistController({ restaurantId });

	return (
		<Card>
			<CardHeader>
				<CardTitle>Seu restaurante ainda não está publicado</CardTitle>

				<CardDescription>
					Enquanto a loja não for publicada, ela não aparece para os clientes e não recebe pedidos.
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				{isLoadingActivationChecklist ? (
					<>
						<Skeleton className="h-16 w-full rounded-lg" />

						<Skeleton className="h-16 w-full rounded-lg" />
					</>
				) : null}

				{activationChecklistErrorMessage ? (
					<div className="flex items-start gap-3 rounded-lg border border-border p-4">
						<TriangleAlertIcon aria-hidden="true" className="mt-0.5 size-5 text-destructive" />

						<p className="text-body-sm text-muted-foreground">{activationChecklistErrorMessage}</p>
					</div>
				) : null}

				{requirements.map((requirement) => (
					<div
						key={requirement.code}
						className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
					>
						<div className="flex items-start gap-3">
							<span
								aria-hidden="true"
								data-met={requirement.isMet || undefined}
								className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-input text-success data-met:border-success data-met:bg-success data-met:text-success-foreground"
							>
								{requirement.isMet ? <CheckIcon className="size-3.5" /> : null}
							</span>

							<div className="flex flex-col gap-0.5">
								<span className="text-body-sm font-medium">
									{requirement.label}

									<span className="sr-only">
										{requirement.isMet ? ' — concluído' : ' — pendente'}
									</span>
								</span>

								<span className="text-body-sm text-muted-foreground">
									{requirement.description}
								</span>
							</div>
						</div>

						{requirement.isMet ? null : (
							<Button variant="outline" size="sm" asChild>
								<Link to={requirement.to}>{requirement.actionLabel}</Link>
							</Button>
						)}
					</div>
				))}
			</CardContent>

			<CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-body-sm text-muted-foreground">
					{isReadyToActivate
						? 'Tudo pronto. Publique para começar a receber pedidos.'
						: 'Conclua os itens acima para liberar a publicação.'}
				</p>

				<Button
					type="button"
					disabled={!isReadyToActivate}
					isLoading={isActivatingRestaurant}
					onClick={handleActivate}
				>
					Publicar restaurante
				</Button>
			</CardFooter>
		</Card>
	);
}
