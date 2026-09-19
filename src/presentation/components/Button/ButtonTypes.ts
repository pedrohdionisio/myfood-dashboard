import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { buttonVariants } from './buttonVariants';

export interface IButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}
