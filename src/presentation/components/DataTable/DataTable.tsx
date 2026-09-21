import { cn } from 'cn';
import { TriangleAlertIcon } from 'lucide-react';
import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from 'presentation/components/Table/Table';
import { type ComponentProps, createContext, use, useMemo } from 'react';
import { dataTableStyles } from './DataTableStyles';
import type {
	IDataTableCellProps,
	IDataTableContextValue,
	IDataTableHeadProps,
	IDataTableRootProps
} from './DataTableTypes';

const SKELETON_KEYS = ['first', 'second', 'third', 'fourth', 'fifth'];

const DataTableContext = createContext<IDataTableContextValue | null>(null);

function useDataTableContext() {
	const context = use(DataTableContext);

	if (!context) {
		throw new Error('As peças da DataTable precisam estar dentro de DataTable.Root.');
	}

	return context;
}

function DataTableRoot({ columnCount, className, children, ...props }: IDataTableRootProps) {
	const contextValue = useMemo(() => ({ columnCount }), [columnCount]);

	return (
		<DataTableContext.Provider value={contextValue}>
			<div className="w-full rounded-xl border border-border bg-background">
				<Table className={className} {...props}>
					{children}
				</Table>
			</div>
		</DataTableContext.Provider>
	);
}

function DataTableHeader({ children, ...props }: ComponentProps<'thead'>) {
	return (
		<TableHeader {...props}>
			<TableRow className="hover:bg-transparent">{children}</TableRow>
		</TableHeader>
	);
}

function DataTableHead({ className, align, ...props }: IDataTableHeadProps) {
	return <TableHead className={cn(dataTableStyles({ align }), className)} {...props} />;
}

function DataTableBody({ ...props }: ComponentProps<'tbody'>) {
	return <TableBody {...props} />;
}

function DataTableRow({ ...props }: ComponentProps<'tr'>) {
	return <TableRow {...props} />;
}

function DataTableCell({ className, align, ...props }: IDataTableCellProps) {
	return <TableCell className={cn(dataTableStyles({ align }), className)} {...props} />;
}

function DataTableLoadingRows() {
	const { columnCount } = useDataTableContext();

	return (
		<>
			{SKELETON_KEYS.map((skeletonKey) => (
				<TableRow key={skeletonKey} className="hover:bg-transparent">
					<TableCell colSpan={columnCount}>
						<Skeleton className="h-8 w-full" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
}

function DataTableEmptyRow({ className, ...props }: ComponentProps<'td'>) {
	const { columnCount } = useDataTableContext();

	return (
		<TableRow className="hover:bg-transparent">
			<TableCell
				colSpan={columnCount}
				className={cn(
					'p-10 text-center text-body-sm whitespace-normal text-muted-foreground',
					className
				)}
				{...props}
			/>
		</TableRow>
	);
}

function DataTableErrorRow({ className, children, ...props }: ComponentProps<'td'>) {
	const { columnCount } = useDataTableContext();

	return (
		<TableRow className="hover:bg-transparent">
			<TableCell
				colSpan={columnCount}
				className={cn('p-10 whitespace-normal', className)}
				{...props}
			>
				<div className="flex flex-col items-center justify-center gap-3 text-center">
					<TriangleAlertIcon aria-hidden="true" className="size-6 text-destructive" />

					<p className="text-body-sm text-muted-foreground">{children}</p>
				</div>
			</TableCell>
		</TableRow>
	);
}

export const DataTable = {
	Root: DataTableRoot,
	Header: DataTableHeader,
	Head: DataTableHead,
	Body: DataTableBody,
	Row: DataTableRow,
	Cell: DataTableCell,
	LoadingRows: DataTableLoadingRows,
	EmptyRow: DataTableEmptyRow,
	ErrorRow: DataTableErrorRow
};
