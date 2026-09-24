import { LoaderCircleIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Mask } from 'shared/utils/Mask';
import { useRestaurantOnboardingFormController } from './useRestaurantOnboardingFormController';

export function RestaurantOnboardingForm() {
	const { register, errors, isLoadingAddress, isSubmitting, handleSignOut, handleSubmit } =
		useRestaurantOnboardingFormController();

	return (
		<form className="mt-10 flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
			<fieldset>
				<legend className="text-label text-muted-foreground">Dados do restaurante</legend>

				<div className="mt-4 flex flex-col gap-6">
					<TextInput
						id="tradeName"
						label="Nome fantasia"
						placeholder="Como o cliente vê seu restaurante"
						error={errors.tradeName?.message}
						{...register('tradeName')}
					/>

					<TextInput
						id="legalName"
						label="Razão social"
						placeholder="Razão social da empresa"
						error={errors.legalName?.message}
						{...register('legalName')}
					/>

					<TextInput
						id="cnpj"
						inputMode="numeric"
						label="CNPJ"
						placeholder="00.000.000/0000-00"
						mask={Mask.cnpj}
						error={errors.cnpj?.message}
						{...register('cnpj')}
					/>

					<div className="grid gap-6 sm:grid-cols-2">
						<TextInput
							id="restaurantPhone"
							type="tel"
							label="Telefone (opcional)"
							placeholder="(00) 00000-0000"
							mask={Mask.phone}
							error={errors.phone?.message}
							{...register('phone')}
						/>

						<TextInput
							id="restaurantEmail"
							type="email"
							label="E-mail (opcional)"
							placeholder="contato@restaurante.com"
							error={errors.email?.message}
							{...register('email')}
						/>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend className="text-label text-muted-foreground">Endereço</legend>

				<div className="mt-4 flex flex-col gap-6">
					<div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
						<TextInput
							id="zipCode"
							inputMode="numeric"
							label="CEP"
							placeholder="00000-000"
							mask={Mask.zipCode}
							endSlot={
								isLoadingAddress ? (
									<LoaderCircleIcon
										aria-label="Buscando endereço"
										className="mr-2 size-4 animate-spin text-muted-foreground"
									/>
								) : null
							}
							error={errors.zipCode?.message}
							{...register('zipCode')}
						/>

						<TextInput
							id="street"
							label="Rua"
							placeholder="Nome da rua"
							disabled={isLoadingAddress}
							error={errors.street?.message}
							{...register('street')}
						/>
					</div>

					<div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
						<TextInput
							id="number"
							label="Número"
							placeholder="000"
							disabled={isLoadingAddress}
							error={errors.number?.message}
							{...register('number')}
						/>

						<TextInput
							id="complement"
							label="Complemento (opcional)"
							placeholder="Sala, bloco, referência"
							disabled={isLoadingAddress}
							error={errors.complement?.message}
							{...register('complement')}
						/>
					</div>

					<TextInput
						id="neighborhood"
						label="Bairro"
						placeholder="Nome do bairro"
						disabled={isLoadingAddress}
						error={errors.neighborhood?.message}
						{...register('neighborhood')}
					/>

					<div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
						<TextInput
							id="city"
							label="Cidade"
							placeholder="Nome da cidade"
							disabled={isLoadingAddress}
							error={errors.city?.message}
							{...register('city')}
						/>

						<TextInput
							id="state"
							label="UF"
							placeholder="SP"
							maxLength={2}
							disabled={isLoadingAddress}
							error={errors.state?.message}
							{...register('state')}
						/>
					</div>
				</div>
			</fieldset>

			<Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
				Concluir cadastro
			</Button>

			<Button
				type="button"
				variant="ghost"
				className="w-full"
				disabled={isSubmitting}
				onClick={handleSignOut}
			>
				Sair
			</Button>
		</form>
	);
}
