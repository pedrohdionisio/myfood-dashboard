import { useHomeController } from './useHomeController';

export function Home() {
	const { userName, isRestaurantDraft } = useHomeController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-title-md">Olá, {userName}</h1>

				<p className="text-body-sm text-muted-foreground">Acompanhe seu restaurante por aqui.</p>
			</header>

			{isRestaurantDraft ? (
				<section className="flex flex-col gap-2 rounded-lg border bg-card p-6">
					<h2 className="text-title-sm">Seu restaurante ainda não está publicado</h2>

					<p className="text-body-sm text-muted-foreground">
						Para abrir a loja, cadastre os horários de funcionamento e pelo menos um produto
						disponível no cardápio.
					</p>
				</section>
			) : null}
		</div>
	);
}
