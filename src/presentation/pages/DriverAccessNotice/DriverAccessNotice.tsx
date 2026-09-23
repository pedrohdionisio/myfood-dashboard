import { Button } from 'presentation/components/Button/Button';
import logo from 'shared/assets/black-red-logo.svg';
import { useDriverAccessNoticeController } from './useDriverAccessNoticeController';

export function DriverAccessNotice() {
	const { userName, handleSignOut } = useDriverAccessNoticeController();

	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
				<img src={logo} alt="MyFood" className="h-10 w-auto" />

				<div className="flex flex-col gap-2">
					<h1 className="text-title-md">Olá, {userName}</h1>

					<p className="text-body-sm text-muted-foreground">
						O painel é para donos de restaurante. Suas entregas ficam no app MyFood: entre nele com
						este mesmo e-mail e senha, escolhendo o perfil de entregador.
					</p>
				</div>

				<Button variant="outline" onClick={handleSignOut}>
					Sair
				</Button>
			</div>
		</main>
	);
}
