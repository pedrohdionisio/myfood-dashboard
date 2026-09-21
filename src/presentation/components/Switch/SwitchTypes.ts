import type { Switch as SwitchPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

export interface ISwitchProps extends ComponentProps<typeof SwitchPrimitive.Root> {
	size?: 'sm' | 'default';
}
