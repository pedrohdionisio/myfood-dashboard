import type { IInputProps } from 'presentation/components/Input/InputTypes';
import type { ReactNode } from 'react';

export interface ITextInputProps extends IInputProps {
	label?: string;
	error?: string;
	startIcon?: ReactNode;
	endSlot?: ReactNode;
}

export interface IUseTextInputControllerParams {
	id?: string;
	error?: string;
}
