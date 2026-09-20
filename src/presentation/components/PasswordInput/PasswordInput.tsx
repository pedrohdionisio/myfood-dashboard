import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { useState } from 'react';
import type { IPasswordInputProps } from './PasswordInputTypes';

export function PasswordInput({ disabled, ...props }: IPasswordInputProps) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<TextInput
			type={isVisible ? 'text' : 'password'}
			disabled={disabled}
			endSlot={
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					disabled={disabled}
					aria-pressed={isVisible}
					aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
					className="text-muted-foreground hover:text-foreground"
					onClick={() => setIsVisible((current) => !current)}
				>
					{isVisible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
				</Button>
			}
			{...props}
		/>
	);
}
