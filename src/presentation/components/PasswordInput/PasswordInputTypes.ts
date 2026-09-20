import type { ITextInputProps } from 'presentation/components/TextInput/TextInputTypes';

export type IPasswordInputProps = Omit<ITextInputProps, 'type' | 'endSlot'>;
