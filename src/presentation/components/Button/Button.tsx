import { cn } from 'cn';
import { LoaderCircleIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import type { IButtonProps } from './ButtonTypes';
import { buttonVariants } from './buttonVariants';

export function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	isLoading = false,
	disabled,
	children,
	...props
}: IButtonProps) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			data-loading={isLoading || undefined}
			aria-busy={isLoading || undefined}
			disabled={disabled || isLoading}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<>
					{isLoading ? <LoaderCircleIcon className="animate-spin" aria-hidden="true" /> : null}
					{children}
				</>
			)}
		</Comp>
	);
}
