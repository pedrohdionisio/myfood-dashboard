import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
	return (
		<HotToaster
			position="top-right"
			toastOptions={{
				className: 'text-body-sm',
				style: {
					background: 'var(--background)',
					color: 'var(--foreground)',
					border: '1px solid var(--border)',
					borderRadius: 'var(--radius-md)'
				},
				error: {
					iconTheme: { primary: 'var(--destructive)', secondary: 'var(--background)' }
				},
				success: {
					iconTheme: { primary: 'var(--brand)', secondary: 'var(--background)' }
				}
			}}
		/>
	);
}
