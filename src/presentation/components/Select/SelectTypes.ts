import { Select as SelectPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

export interface ISelectTriggerProps extends ComponentProps<typeof SelectPrimitive.Trigger> {
	size?: 'sm' | 'default';
}
