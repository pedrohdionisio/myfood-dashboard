import { Button } from 'presentation/components/Button/Button';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Link } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { useForgotPasswordController } from './useForgotPasswordController';

export function ForgotPassword() {
	const { register, errors, isSubmitting, handleSubmit } = useForgotPasswordController();

	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="w-full max-w-sm">
				<header className="flex flex-col items-center gap-6 text-center">
					<img src={logo} alt="MyFood" className="h-10 w-auto" />

					<div className="flex flex-col gap-2">
						<h1 className="text-title-md">Esqueceu a senha?</h1>

						<p className="text-body-sm text-muted-foreground">
							Informe o e-mail da sua conta e enviaremos um código para você criar uma senha nova.
						</p>
					</div>
				</header>

				<form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
					<TextInput
						id="email"
						type="email"
						label="E-mail"
						placeholder="Seu e-mail de acesso"
						autoComplete="email"
						error={errors.email?.message}
						{...register('email')}
					/>

					<Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
						Enviar código
					</Button>
				</form>

				<p className="mt-6 text-center text-body-sm text-muted-foreground">
					Lembrou a senha?{' '}
					<Link
						to={APP_ROUTES.login}
						className="font-medium text-primary underline-offset-4 hover:underline"
					>
						Voltar para o login
					</Link>
				</p>
			</div>
		</main>
	);
}
