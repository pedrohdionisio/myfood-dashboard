import { Textarea } from 'presentation/components/Textarea/Textarea';
import { useId } from 'react';
import type { ITextareaInputProps } from './TextareaInputTypes';

export function TextareaInput({ id, className, label, error, ...props }: ITextareaInputProps) {
	const generatedId = useId();
	const textareaId = id ?? generatedId;
	const errorId = error ? `${textareaId}-error` : undefined;

	return (
		<div data-slot="textarea-input" className="flex w-full flex-col gap-2">
			{label ? (
				<label htmlFor={textareaId} className="text-label">
					{label}
				</label>
			) : null}

			<Textarea
				id={textareaId}
				aria-invalid={!!error}
				aria-describedby={errorId}
				className={className}
				{...props}
			/>

			{error ? (
				<p id={errorId} className="text-body-sm text-destructive">
					{error}
				</p>
			) : null}
		</div>
	);
}
