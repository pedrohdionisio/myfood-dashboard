import { cn } from 'cn';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from 'presentation/components/Dialog/Dialog';
import type { ComponentProps } from 'react';
import { modalContentStyles } from './ModalStyles';
import type { IModalContentProps } from './ModalTypes';

function ModalRoot({ ...props }: ComponentProps<typeof Dialog>) {
	return <Dialog {...props} />;
}

function ModalTrigger({ ...props }: ComponentProps<typeof DialogTrigger>) {
	return <DialogTrigger {...props} />;
}

function ModalContent({ className, size, ...props }: IModalContentProps) {
	return <DialogContent className={cn(modalContentStyles({ size }), className)} {...props} />;
}

function ModalHeader({ className, ...props }: ComponentProps<'div'>) {
	return (
		<DialogHeader className={cn('border-b border-border p-6 text-left', className)} {...props} />
	);
}

function ModalTitle({ className, ...props }: ComponentProps<typeof DialogTitle>) {
	return <DialogTitle className={cn('text-title-sm', className)} {...props} />;
}

function ModalDescription({ className, ...props }: ComponentProps<typeof DialogDescription>) {
	return <DialogDescription className={cn('text-body-sm', className)} {...props} />;
}

function ModalBody({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="modal-body"
			className={cn('flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6', className)}
			{...props}
		/>
	);
}

function ModalFooter({ className, ...props }: ComponentProps<'div'>) {
	return <DialogFooter className={cn('border-t border-border p-6', className)} {...props} />;
}

function ModalClose({ ...props }: ComponentProps<typeof DialogClose>) {
	return <DialogClose {...props} />;
}

export const Modal = {
	Root: ModalRoot,
	Trigger: ModalTrigger,
	Content: ModalContent,
	Header: ModalHeader,
	Title: ModalTitle,
	Description: ModalDescription,
	Body: ModalBody,
	Footer: ModalFooter,
	Close: ModalClose
};
