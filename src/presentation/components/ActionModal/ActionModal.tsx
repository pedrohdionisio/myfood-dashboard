import { Button } from 'presentation/components/Button/Button';
import { Modal } from 'presentation/components/Modal/Modal';
import type { IActionModalProps } from './ActionModalTypes';

export function ActionModal({
	isOpen,
	title,
	description,
	confirmLabel,
	cancelLabel = 'Cancelar',
	variant = 'destructive',
	isConfirming = false,
	onConfirm,
	onClose
}: IActionModalProps) {
	return (
		<Modal.Root open={isOpen} onOpenChange={onClose}>
			<Modal.Content size="sm" showCloseButton={false}>
				<Modal.Header>
					<Modal.Title>{title}</Modal.Title>

					<Modal.Description>{description}</Modal.Description>
				</Modal.Header>

				<Modal.Footer>
					<Modal.Close asChild>
						<Button type="button" variant="ghost" disabled={isConfirming}>
							{cancelLabel}
						</Button>
					</Modal.Close>

					<Button type="button" variant={variant} isLoading={isConfirming} onClick={onConfirm}>
						{confirmLabel}
					</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
}
