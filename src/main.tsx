import { Monitoring } from 'data/libs/Monitoring';
import { SessionRecording } from 'data/libs/SessionRecording';
import { App } from 'presentation/App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

Monitoring.init();
SessionRecording.init();

const container = document.getElementById('root');

if (!container) {
	throw new Error('Element #root not found in index.html');
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>
);
