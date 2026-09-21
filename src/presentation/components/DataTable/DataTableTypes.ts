import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type { dataTableStyles } from './DataTableStyles';

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
