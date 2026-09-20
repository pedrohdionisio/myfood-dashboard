import { useId } from 'react';
import type { IUseTextInputControllerParams } from './TextInputTypes';

export function useTextInputController({ id, error }: IUseTextInputControllerParams) {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	return {
		inputId,
		errorId: error ? `${inputId}-error` : undefined
	};
}
