import { cn } from 'cn';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { buttonVariants } from 'presentation/components/Button/buttonVariants';
import type { ComponentProps } from 'react';
import type { IPaginationLinkProps } from './PaginationTypes';

export function Pagination({ className, ...props }: ComponentProps<'nav'>) {
	return (
		<nav
			aria-label="Paginação"
			data-slot="pagination"
			className={cn('mx-auto flex w-full justify-center', className)}
			{...props}
		/>
	);
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn('flex flex-row items-center gap-1', className)}
			{...props}
		/>
	);
}

export function PaginationItem({ ...props }: ComponentProps<'li'>) {
	return <li data-slot="pagination-item" {...props} />;
}

export function PaginationLink({
	className,
	isActive,
	size = 'icon',
	...props
}: IPaginationLinkProps) {
	return (
		<button
			type="button"
			aria-current={isActive ? 'page' : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			className={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className)}
			{...props}
		/>
	);
}

export function PaginationPrevious({ className, ...props }: IPaginationLinkProps) {
	return (
		<PaginationLink
			aria-label="Ir para a página anterior"
			size="default"
			className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
			{...props}
		>
			<ChevronLeftIcon />
			<span className="hidden sm:block">Anterior</span>
		</PaginationLink>
	);
}

export function PaginationNext({ className, ...props }: IPaginationLinkProps) {
	return (
		<PaginationLink
			aria-label="Ir para a próxima página"
			size="default"
			className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
			{...props}
		>
			<span className="hidden sm:block">Próxima</span>
			<ChevronRightIcon />
		</PaginationLink>
	);
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn('flex size-9 items-center justify-center', className)}
			{...props}
		>
			<MoreHorizontalIcon className="size-4" />
			<span className="sr-only">Mais páginas</span>
		</span>
	);
}
