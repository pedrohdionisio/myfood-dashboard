import { useRouteError } from 'react-router-dom';
import { isChunkLoadError } from './utils/isChunkLoadError';

export function useAppErrorController() {
	const error = useRouteError();

	function handleReload() {
		window.location.reload();
	}

	return {
		isOutdated: isChunkLoadError(error),
		handleReload
	};
}
