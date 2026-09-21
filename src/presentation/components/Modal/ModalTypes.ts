import type { VariantProps } from 'class-variance-authority';
import type { IDialogContentProps } from 'presentation/components/Dialog/DialogTypes';
import type { modalContentStyles } from './ModalStyles';

export interface IModalContentProps
	extends IDialogContentProps,
		VariantProps<typeof modalContentStyles> {}
