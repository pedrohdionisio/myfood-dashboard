import { App } from 'presentation/App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('root');

if (!container) {
	throw new Error('Elemento #root não encontrado no index.html');
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>
);
