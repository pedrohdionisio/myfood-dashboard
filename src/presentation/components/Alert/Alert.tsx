import { cn } from 'cn';
import type { ComponentProps } from 'react';
import { alertStyles } from './AlertStyles';
import type { IAlertProps } from './AlertTypes';

export function Alert({ className, variant, ...props }: IAlertProps) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertStyles({ variant }), className)}
			{...props}
		/>
	);
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-title"
			className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
			{...props}
		/>
	);
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed',
				className
			)}
			{...props}
		/>
	);
}
