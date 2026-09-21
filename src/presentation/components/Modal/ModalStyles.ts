import { cva } from 'class-variance-authority';

export const modalContentStyles = cva('flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0', {
	variants: {
		size: {
			sm: 'sm:max-w-md',
			md: 'sm:max-w-xl',
			lg: 'sm:max-w-3xl'
		}
	},
	defaultVariants: {
		size: 'md'
	}
});
