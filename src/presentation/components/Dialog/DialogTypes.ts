import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

export interface IDialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
	showCloseButton?: boolean;
}

export interface IDialogFooterProps extends ComponentProps<'div'> {
	showCloseButton?: boolean;
}
