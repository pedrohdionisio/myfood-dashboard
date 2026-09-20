import logo from 'shared/assets/black-red-logo.svg';

export function LoginHeader() {
	return (
		<header className="flex flex-col items-center gap-2">
			<p className="text-body-md text-muted-foreground">Bem-vindo(a) ao</p>
			<h1>
				<img src={logo} alt="MyFood" className="h-12 w-auto" />
			</h1>
		</header>
	);
}
