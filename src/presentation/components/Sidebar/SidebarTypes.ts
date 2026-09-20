import type { VariantProps } from 'class-variance-authority';
import type { TooltipContent } from 'presentation/components/Tooltip/Tooltip';
import type { ComponentProps } from 'react';
import type { sidebarMenuButtonVariants } from './sidebarMenuButtonVariants';

export interface ISidebarContextValue {
	state: 'expanded' | 'collapsed';
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
}

export interface ISidebarProviderProps extends ComponentProps<'div'> {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface ISidebarProps extends ComponentProps<'div'> {
	side?: 'left' | 'right';
	variant?: 'sidebar' | 'floating' | 'inset';
	collapsible?: 'offcanvas' | 'icon' | 'none';
}

export interface ISidebarGroupLabelProps extends ComponentProps<'div'> {
	asChild?: boolean;
}

export interface ISidebarGroupActionProps extends ComponentProps<'button'> {
	asChild?: boolean;
}

export interface ISidebarMenuButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof sidebarMenuButtonVariants> {
	asChild?: boolean;
	isActive?: boolean;
	tooltip?: string | ComponentProps<typeof TooltipContent>;
}

export interface ISidebarMenuActionProps extends ComponentProps<'button'> {
	asChild?: boolean;
	showOnHover?: boolean;
}

export interface ISidebarMenuSkeletonProps extends ComponentProps<'div'> {
	showIcon?: boolean;
}

export interface ISidebarMenuSubButtonProps extends ComponentProps<'a'> {
	asChild?: boolean;
	size?: 'sm' | 'md';
	isActive?: boolean;
}
