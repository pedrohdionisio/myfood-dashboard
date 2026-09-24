import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from 'cn';
import { GripVerticalIcon, TriangleAlertIcon } from 'lucide-react';
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
	DataTableSortableHandle,
	IDataTableCellProps,
	IDataTableContextValue,
	IDataTableDragHandleProps,
	IDataTableHeadProps,
	IDataTableRootProps,
	IDataTableSortableBodyProps,
	IDataTableSortableRowProps
} from './DataTableTypes';

const SKELETON_KEYS = ['first', 'second', 'third', 'fourth', 'fifth'];

const DataTableContext = createContext<IDataTableContextValue | null>(null);

const DataTableSortableRowContext = createContext<DataTableSortableHandle | null>(null);

function useDataTableContext() {
	const context = use(DataTableContext);

	if (!context) {
		throw new Error('DataTable parts must be used within DataTable.Root');
	}

	return context;
}

function useDataTableSortableRowContext() {
	const context = use(DataTableSortableRowContext);

	if (!context) {
		throw new Error('DataTable.DragHandle must be used within DataTable.SortableRow');
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

function DataTableSortableBody({
	ids,
	onReorder,
	children,
	...props
}: IDataTableSortableBodyProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (!over || active.id === over.id) {
			return;
		}

		const activeIndex = ids.indexOf(String(active.id));
		const overIndex = ids.indexOf(String(over.id));

		if (activeIndex === -1 || overIndex === -1) {
			return;
		}

		onReorder(arrayMove(ids, activeIndex, overIndex));
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			accessibility={{ container: document.body }}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={ids} strategy={verticalListSortingStrategy}>
				<TableBody {...props}>{children}</TableBody>
			</SortableContext>
		</DndContext>
	);
}

function DataTableSortableRow({ id, className, children, ...props }: IDataTableSortableRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id });

	const contextValue = useMemo(
		() => ({ attributes, listeners, setActivatorNodeRef }),
		[attributes, listeners, setActivatorNodeRef]
	);

	return (
		<DataTableSortableRowContext.Provider value={contextValue}>
			<TableRow
				ref={setNodeRef}
				style={{ transform: CSS.Translate.toString(transform), transition }}
				data-dragging={isDragging || undefined}
				className={cn(
					'data-dragging:relative data-dragging:z-10 data-dragging:bg-muted',
					className
				)}
				{...props}
			>
				{children}
			</TableRow>
		</DataTableSortableRowContext.Provider>
	);
}

function DataTableDragHandle({ className, children, ...props }: IDataTableDragHandleProps) {
	const { attributes, listeners, setActivatorNodeRef } = useDataTableSortableRowContext();

	return (
		<button
			type="button"
			ref={setActivatorNodeRef}
			className={cn(
				'flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing',
				className
			)}
			{...attributes}
			{...listeners}
			{...props}
		>
			<GripVerticalIcon aria-hidden="true" className="size-4" />
			<span className="sr-only">{children}</span>
		</button>
	);
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
	SortableBody: DataTableSortableBody,
	SortableRow: DataTableSortableRow,
	DragHandle: DataTableDragHandle,
	LoadingRows: DataTableLoadingRows,
	EmptyRow: DataTableEmptyRow,
	ErrorRow: DataTableErrorRow
};
