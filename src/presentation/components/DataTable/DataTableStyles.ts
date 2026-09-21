import { cva } from 'class-variance-authority';

export const dataTableStyles = cva('', {
	variants: {
		align: {
			left: 'text-left',
			right: 'text-right'
		}
	},
	defaultVariants: {
		align: 'left'
	}
});
