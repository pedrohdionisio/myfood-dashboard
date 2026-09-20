import { Dialog as SheetPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

export interface ISheetContentProps extends ComponentProps<typeof SheetPrimitive.Content> {
	side?: 'top' | 'right' | 'bottom' | 'left';
	showCloseButton?: boolean;
}
