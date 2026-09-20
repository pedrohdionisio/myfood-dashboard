import { type ChangeEvent, useId } from 'react';
import type { IUseTextInputControllerParams } from './TextInputTypes';

export function useTextInputController({
	id,
	error,
	mask,
	onChange
}: IUseTextInputControllerParams) {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		if (mask) {
			event.target.value = mask(event.target.value);
		}

		onChange?.(event);
	}

	return {
		inputId,
		errorId: error ? `${inputId}-error` : undefined,
		handleChange
	};
}
