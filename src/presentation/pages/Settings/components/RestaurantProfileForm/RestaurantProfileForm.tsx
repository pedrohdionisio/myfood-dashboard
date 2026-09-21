import { LoaderCircleIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import { TextareaInput } from 'presentation/components/TextareaInput/TextareaInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Mask } from 'shared/utils/Mask';
import type { IRestaurantProfileFormProps } from './RestaurantProfileFormTypes';
import { useRestaurantProfileFormController } from './useRestaurantProfileFormController';

export function RestaurantProfileForm({ restaurant }: IRestaurantProfileFormProps) {
	const { register, errors, isLoadingAddress, isSubmitting, isDirty, handleSubmit } =
		useRestaurantProfileFormController({ restaurant });

	return (
		<Card>
			<CardHeader>
				<CardTitle>Cadastro</CardTitle>

				<CardDescription>
					Dados que o cliente vê na loja e o endereço de onde os pedidos saem. O CNPJ{' '}
					{Mask.cnpj(restaurant.cnpj)} não muda por aqui.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit} noValidate>
				<CardContent className="flex flex-col gap-8">
					<fieldset>
						<legend className="text-label text-muted-foreground">Dados do restaurante</legend>

						<div className="mt-4 flex flex-col gap-6">
							<div className="grid gap-6 sm:grid-cols-2">
								<TextInput
									id="profileTradeName"
									label="Nome fantasia"
									placeholder="Como o cliente vê seu restaurante"
									error={errors.tradeName?.message}
									{...register('tradeName')}
								/>

								<TextInput
									id="profileLegalName"
									label="Razão social"
									placeholder="Razão social da empresa"
									error={errors.legalName?.message}
									{...register('legalName')}
								/>
							</div>

							<div className="grid gap-6 sm:grid-cols-2">
								<TextInput
									id="profilePhone"
									type="tel"
									inputMode="numeric"
									label="Telefone (opcional)"
									placeholder="(00) 00000-0000"
									mask={Mask.phone}
									error={errors.phone?.message}
									{...register('phone')}
								/>

								<TextInput
									id="profileEmail"
									type="email"
									label="E-mail (opcional)"
									placeholder="contato@restaurante.com"
									error={errors.email?.message}
									{...register('email')}
								/>
							</div>

							<TextareaInput
								id="profileDescription"
								label="Descrição (opcional)"
								placeholder="Um resumo curto do restaurante, como o cliente vê na página da loja."
								rows={4}
								error={errors.description?.message}
								{...register('description')}
							/>
						</div>
					</fieldset>

					<fieldset>
						<legend className="text-label text-muted-foreground">Endereço</legend>

						<div className="mt-4 flex flex-col gap-6">
							<div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
								<TextInput
									id="profileZipCode"
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
									id="profileStreet"
									label="Rua"
									placeholder="Nome da rua"
									error={errors.street?.message}
									{...register('street')}
								/>
							</div>

							<div className="grid gap-6 sm:grid-cols-2">
								<TextInput
									id="profileNumber"
									label="Número"
									placeholder="123"
									error={errors.number?.message}
									{...register('number')}
								/>

								<TextInput
									id="profileComplement"
									label="Complemento (opcional)"
									placeholder="Sala, galpão, referência"
									error={errors.complement?.message}
									{...register('complement')}
								/>
							</div>

							<div className="grid gap-6 sm:grid-cols-[2fr_2fr_1fr]">
								<TextInput
									id="profileNeighborhood"
									label="Bairro"
									placeholder="Bairro"
									error={errors.neighborhood?.message}
									{...register('neighborhood')}
								/>

								<TextInput
									id="profileCity"
									label="Cidade"
									placeholder="Cidade"
									error={errors.city?.message}
									{...register('city')}
								/>

								<TextInput
									id="profileState"
									label="UF"
									placeholder="SP"
									maxLength={2}
									error={errors.state?.message}
									{...register('state')}
								/>
							</div>
						</div>
					</fieldset>

					<fieldset>
						<legend className="text-label text-muted-foreground">Entrega</legend>

						<div className="mt-4 grid gap-6 sm:grid-cols-3">
							<TextInput
								id="profileDeliveryFee"
								inputMode="numeric"
								label="Taxa de entrega"
								placeholder="0,00"
								startIcon={<span className="text-body-sm">R$</span>}
								mask={Mask.currency}
								error={errors.deliveryFee?.message}
								{...register('deliveryFee')}
							/>

							<TextInput
								id="profileMinOrder"
								inputMode="numeric"
								label="Pedido mínimo"
								placeholder="0,00"
								startIcon={<span className="text-body-sm">R$</span>}
								mask={Mask.currency}
								error={errors.minOrder?.message}
								{...register('minOrder')}
							/>

							<TextInput
								id="profileAvgPrepTime"
								inputMode="numeric"
								label="Preparo médio (min)"
								placeholder="30"
								mask={Mask.remove}
								error={errors.avgPrepTimeMin?.message}
								{...register('avgPrepTimeMin')}
							/>
						</div>
					</fieldset>
				</CardContent>

				<CardFooter className="mt-6 justify-end border-t pt-6">
					<Button type="submit" disabled={!isDirty} isLoading={isSubmitting}>
						Salvar cadastro
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
