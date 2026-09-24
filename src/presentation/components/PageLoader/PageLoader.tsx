import { LoaderCircleIcon } from 'lucide-react';

export function PageLoader() {
	return (
		<div role="status" className="flex min-h-svh items-center justify-center bg-background">
			<LoaderCircleIcon aria-hidden="true" className="size-6 animate-spin text-muted-foreground" />

			<span className="sr-only">Carregando</span>
		</div>
	);
}
