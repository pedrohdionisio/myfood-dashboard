import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { LoginForm } from './components/LoginForm/LoginForm';
import { LoginHeader } from './components/LoginHeader/LoginHeader';

export function Login() {
	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="w-full max-w-sm">
				<LoginHeader />
				<LoginForm />

				<p className="mt-6 text-center text-body-sm text-muted-foreground">
					Ainda não tem uma conta?{' '}
					<Link
						to={APP_ROUTES.signUp}
						className="font-medium text-primary underline-offset-4 hover:underline"
					>
						Cadastre seu restaurante
					</Link>
				</p>
			</div>
		</main>
	);
}
