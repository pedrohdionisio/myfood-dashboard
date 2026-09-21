import type { useSortable } from '@dnd-kit/sortable';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import type { dataTableStyles } from './DataTableStyles';

export type DataTableSortableHandle = Pick<
	ReturnType<typeof useSortable>,
	'attributes' | 'listeners' | 'setActivatorNodeRef'
>;

export interface IDataTableContextValue {
	columnCount: number;
}

export interface IDataTableRootProps extends ComponentProps<'table'> {
	columnCount: number;
}

export interface IDataTableHeadProps
	extends Omit<ComponentProps<'th'>, 'align'>,
		VariantProps<typeof dataTableStyles> {}

export interface IDataTableCellProps
	extends Omit<ComponentProps<'td'>, 'align'>,
		VariantProps<typeof dataTableStyles> {}

export interface IDataTableSortableBodyProps extends ComponentProps<'tbody'> {
	ids: string[];
	onReorder: (ids: string[]) => void;
}

export interface IDataTableSortableRowProps extends ComponentProps<'tr'> {
	id: string;
}

export interface IDataTableDragHandleProps extends ComponentProps<'button'> {
	children: ReactNode;
}
