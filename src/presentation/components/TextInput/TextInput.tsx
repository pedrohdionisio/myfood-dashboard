import { cn } from 'cn';
import { Input } from 'presentation/components/Input/Input';
import type { ITextInputProps } from './TextInputTypes';
import { useTextInputController } from './useTextInputController';

export function TextInput({
	id,
	className,
	label,
	error,
	startIcon,
	endSlot,
	mask,
	onChange,
	...props
}: ITextInputProps) {
	const { inputId, errorId, handleChange } = useTextInputController({ id, error, mask, onChange });

	return (
		<div data-slot="text-input" className="flex w-full flex-col gap-2">
			{label ? (
				<label htmlFor={inputId} className="text-label">
					{label}
				</label>
			) : null}

			<div className="relative w-full">
				{startIcon ? (
					<span
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4"
					>
						{startIcon}
					</span>
				) : null}

				<Input
					id={inputId}
					aria-invalid={!!error}
					aria-describedby={errorId}
					className={cn(startIcon ? 'pl-9' : undefined, endSlot ? 'pr-10' : undefined, className)}
					onChange={handleChange}
					{...props}
				/>

				{endSlot ? (
					<span className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center">
						{endSlot}
					</span>
				) : null}
			</div>

			{error ? (
				<p id={errorId} className="text-body-sm text-destructive">
					{error}
				</p>
			) : null}
		</div>
	);
}
