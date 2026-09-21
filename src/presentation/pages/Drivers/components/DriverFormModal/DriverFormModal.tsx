import { Button } from 'presentation/components/Button/Button';
import { Modal } from 'presentation/components/Modal/Modal';
import { PasswordInput } from 'presentation/components/PasswordInput/PasswordInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Mask } from 'shared/utils/Mask';
import type { IDriverFormModalProps } from './DriverFormModalTypes';
import { useDriverFormModalController } from './useDriverFormModalController';

export function DriverFormModal({ isOpen, restaurantId, onClose }: IDriverFormModalProps) {
	const { register, errors, isSubmitting, handleSubmit } = useDriverFormModalController({
		isOpen,
		restaurantId,
		onClose
	});

	return (
		<Modal.Root open={isOpen} onOpenChange={onClose}>
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>Novo entregador</Modal.Title>

					<Modal.Description>
						Ele entra no app com este e-mail e senha, e passa a aparecer no despacho de pedidos.
					</Modal.Description>
				</Modal.Header>

				<form
					className="flex min-h-0 flex-1 flex-col overflow-hidden"
					onSubmit={handleSubmit}
					noValidate
				>
					<Modal.Body>
						<TextInput
							id="name"
							label="Nome"
							placeholder="João da Silva"
							autoComplete="off"
							error={errors.name?.message}
							{...register('name')}
						/>

						<TextInput
							id="email"
							label="E-mail"
							type="email"
							placeholder="joao@email.com"
							autoComplete="off"
							error={errors.email?.message}
							{...register('email')}
						/>

						<TextInput
							id="phone"
							label="Telefone (opcional)"
							placeholder="(11) 99999-9999"
							inputMode="numeric"
							autoComplete="off"
							mask={Mask.phone}
							error={errors.phone?.message}
							{...register('phone')}
						/>

						<PasswordInput
							id="password"
							label="Senha"
							placeholder="Mínimo de 8 caracteres"
							autoComplete="new-password"
							error={errors.password?.message}
							{...register('password')}
						/>

						<p className="text-body-sm text-muted-foreground">
							Você define a senha e repassa ao entregador. Se este e-mail já tiver conta no MyFood,
							ele continua entrando com a senha dele e só ganha acesso a este restaurante.
						</p>
					</Modal.Body>

					<Modal.Footer>
						<Modal.Close asChild>
							<Button type="button" variant="outline" disabled={isSubmitting}>
								Cancelar
							</Button>
						</Modal.Close>

						<Button type="submit" isLoading={isSubmitting}>
							Adicionar entregador
						</Button>
					</Modal.Footer>
				</form>
			</Modal.Content>
		</Modal.Root>
	);
}
