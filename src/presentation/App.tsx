import { Button } from 'presentation/components/Button/Button';

export function App() {
	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-4">
			<h1 className="text-2xl font-semibold">MyFood Dashboard</h1>
			<p className="text-sm text-muted-foreground">Scaffold inicial.</p>
			<Button>Tudo certo</Button>
		</main>
	);
}
