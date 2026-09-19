import { cn } from 'cn';
import { Slot } from 'radix-ui';
import type { IButtonProps } from './ButtonTypes';
import { buttonVariants } from './buttonVariants';

export function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: IButtonProps) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}
