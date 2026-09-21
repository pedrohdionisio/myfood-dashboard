export type ActionModalVariant = 'default' | 'destructive';

export interface IActionModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	confirmLabel: string;
	cancelLabel?: string;
	variant?: ActionModalVariant;
	isConfirming?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}
