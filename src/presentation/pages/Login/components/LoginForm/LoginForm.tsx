import { Button } from 'presentation/components/Button/Button';
import { PasswordInput } from 'presentation/components/PasswordInput/PasswordInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { useLoginFormController } from './useLoginFormController';

export function LoginForm() {
	const { register, errors, isSubmitting, handleSubmit } = useLoginFormController();

	return (
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

			<PasswordInput
				id="password"
				label="Senha"
				placeholder="Informe sua senha"
				autoComplete="current-password"
				error={errors.password?.message}
				{...register('password')}
			/>

			<Link
				to={APP_ROUTES.forgotPassword}
				className="-mt-3 self-end text-body-sm font-medium text-primary underline-offset-4 hover:underline"
			>
				Esqueci minha senha
			</Link>

			<Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
				Fazer Login
			</Button>
		</form>
	);
}
