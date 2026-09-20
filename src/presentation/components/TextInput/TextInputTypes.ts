import type { IInputProps } from 'presentation/components/Input/InputTypes';
import type { ChangeEventHandler, ReactNode } from 'react';

export type MaskFunction = (value: string) => string;

export interface ITextInputProps extends IInputProps {
	label?: string;
	error?: string;
	startIcon?: ReactNode;
	endSlot?: ReactNode;
	mask?: MaskFunction;
}

export interface IUseTextInputControllerParams {
	id?: string;
	error?: string;
	mask?: MaskFunction;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}
