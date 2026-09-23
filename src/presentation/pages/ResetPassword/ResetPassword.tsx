import { Button } from 'presentation/components/Button/Button';
import { PasswordInput } from 'presentation/components/PasswordInput/PasswordInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Link, Navigate } from 'react-router-dom';
import logo from 'shared/assets/black-red-logo.svg';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { useResetPasswordController } from './useResetPasswordController';

export function ResetPassword() {
	const {
		email,
		register,
		errors,
		isSubmitting,
		isSendingRecoveryCode,
		handleResendCode,
		handleSubmit
	} = useResetPasswordController();

	if (!email) {
		return <Navigate to={APP_ROUTES.forgotPassword} replace />;
	}

	return (
		<main className="flex min-h-svh items-center justify-center bg-background px-4">
			<div className="w-full max-w-sm">
				<header className="flex flex-col items-center gap-6 text-center">
					<img src={logo} alt="MyFood" className="h-10 w-auto" />

					<div className="flex flex-col gap-2">
						<h1 className="text-title-md">Crie uma senha nova</h1>

						<p className="text-body-sm text-muted-foreground">
							Se houver uma conta para <span className="font-medium text-foreground">{email}</span>,
							o código chegou por e-mail. Confira também a caixa de spam.
						</p>
					</div>
				</header>

				<form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
					<TextInput
						id="code"
						inputMode="numeric"
						label="Código"
						placeholder="Código de 6 dígitos"
						autoComplete="one-time-code"
						error={errors.code?.message}
						{...register('code')}
					/>

					<PasswordInput
						id="password"
						label="Nova senha"
						placeholder="Mínimo de 8 caracteres"
						autoComplete="new-password"
						error={errors.password?.message}
						{...register('password')}
					/>

					<PasswordInput
						id="passwordConfirmation"
						label="Confirme a nova senha"
						placeholder="Repita a nova senha"
						autoComplete="new-password"
						error={errors.passwordConfirmation?.message}
						{...register('passwordConfirmation')}
					/>

					<Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
						Salvar nova senha
					</Button>

					<Button
						type="button"
						variant="ghost"
						className="w-full"
						isLoading={isSendingRecoveryCode}
						onClick={handleResendCode}
					>
						Reenviar código
					</Button>
				</form>

				<p className="mt-6 text-center text-body-sm text-muted-foreground">
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
