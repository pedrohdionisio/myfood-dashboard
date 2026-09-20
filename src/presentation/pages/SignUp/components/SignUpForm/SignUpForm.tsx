import { Button } from 'presentation/components/Button/Button';
import { PasswordInput } from 'presentation/components/PasswordInput/PasswordInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { Mask } from 'shared/utils/Mask';
import { useSignUpFormController } from './useSignUpFormController';

export function SignUpForm() {
	const { register, errors, isSubmitting, handleSubmit } = useSignUpFormController();

	return (
		<form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
			<TextInput
				id="name"
				label="Nome"
				placeholder="Seu nome completo"
				autoComplete="name"
				error={errors.name?.message}
				{...register('name')}
			/>

			<TextInput
				id="email"
				type="email"
				label="E-mail"
				placeholder="Seu melhor e-mail"
				autoComplete="email"
				error={errors.email?.message}
				{...register('email')}
			/>

			<TextInput
				id="phone"
				type="tel"
				label="Telefone (opcional)"
				placeholder="(00) 00000-0000"
				autoComplete="tel"
				mask={Mask.phone}
				error={errors.phone?.message}
				{...register('phone')}
			/>

			<PasswordInput
				id="password"
				label="Senha"
				placeholder="8+ caracteres, com maiúscula e número"
				autoComplete="new-password"
				error={errors.password?.message}
				{...register('password')}
			/>

			<Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
				Continuar
			</Button>

			<p className="text-center text-body-sm text-muted-foreground">
				Já tem uma conta?{' '}
				<Link
					to={APP_ROUTES.login}
					className="font-medium text-primary underline-offset-4 hover:underline"
				>
					Fazer login
				</Link>
			</p>
		</form>
	);
}
