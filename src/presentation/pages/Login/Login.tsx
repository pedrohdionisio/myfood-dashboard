import { LoginForm } from './components/LoginForm/LoginForm';
import { LoginHeader } from './components/LoginHeader/LoginHeader';

export function Login() {
	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="w-full max-w-sm">
				<LoginHeader />
				<LoginForm />
			</div>
		</main>
	);
}
