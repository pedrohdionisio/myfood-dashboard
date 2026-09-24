import { Button } from 'presentation/components/Button/Button';
import { Link } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';

export function NotFound() {
	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
				<img src={logo} alt="MyFood" className="h-10 w-auto" />

				<div className="flex flex-col gap-2">
					<span className="text-eyebrow text-muted-foreground uppercase">Erro 404</span>

					<h1 className="text-title-md">Página não encontrada</h1>

					<p className="text-body-sm text-muted-foreground">
						O endereço que você abriu não existe ou mudou de lugar. Confira o link ou volte para o
						início do painel.
					</p>
				</div>

				<Button asChild>
					<Link to={APP_ROUTES.home}>Voltar ao início</Link>
				</Button>
			</div>
		</main>
	);
}
