import type { ComponentProps } from 'react';

export interface ITextareaInputProps extends ComponentProps<'textarea'> {
	label?: string;
	error?: string;
}
