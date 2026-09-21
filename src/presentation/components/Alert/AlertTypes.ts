import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { alertStyles } from './AlertStyles';

export interface IAlertProps extends ComponentProps<'div'>, VariantProps<typeof alertStyles> {}
