import { Button } from 'presentation/components/Button/Button';
import { PasswordInput } from 'presentation/components/PasswordInput/PasswordInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
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

			<Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
				Fazer Login
			</Button>
		</form>
	);
}
