import { Button } from 'presentation/components/Button/Button';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import type { IAppErrorProps } from './AppErrorTypes';
import { useAppErrorController } from './useAppErrorController';

export function AppError({ error }: IAppErrorProps) {
	const { isOutdated, handleReload } = useAppErrorController({ error });

	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
				<img src={logo} alt="MyFood" className="h-10 w-auto" />

				<div className="flex flex-col gap-2">
					<h1 className="text-title-md">
						{isOutdated ? 'O painel foi atualizado' : 'Algo deu errado'}
					</h1>

					<p className="text-body-sm text-muted-foreground">
						{isOutdated
							? 'Uma nova versão foi publicada enquanto você usava o painel. Recarregue a página para continuar.'
							: 'Não conseguimos mostrar esta tela. Recarregue a página e, se o problema continuar, volte para o início.'}
					</p>
				</div>

				<div className="flex flex-col items-center gap-3 sm:flex-row">
					<Button onClick={handleReload}>Recarregar página</Button>

					{isOutdated ? null : (
						<Button variant="outline" asChild>
							<a href={APP_ROUTES.home}>Voltar ao início</a>
						</Button>
					)}
				</div>
			</div>
		</main>
	);
}
