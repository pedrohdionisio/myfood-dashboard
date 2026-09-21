import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from 'presentation/components/Button/buttonVariants';
import type { ComponentProps } from 'react';

export interface IPaginationLinkProps extends ComponentProps<'button'> {
	isActive?: boolean;
	size?: VariantProps<typeof buttonVariants>['size'];
}
