import { Button } from 'presentation/components/Button/Button';
import logo from 'shared/assets/black-red-logo.svg';
import { useHomeController } from './useHomeController';

export function Home() {
	const { userName, handleSignOut } = useHomeController();

	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4">
			<header className="flex flex-col items-center gap-2 text-center">
				<img src={logo} alt="MyFood" className="h-10 w-auto" />
				<p className="text-body-md text-muted-foreground">Sessão ativa como {userName}</p>
			</header>

			<Button variant="outline" onClick={handleSignOut}>
				Sair
			</Button>
		</main>
	);
}
