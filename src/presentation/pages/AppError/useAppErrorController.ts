import type { IAppErrorProps } from './AppErrorTypes';
import { isChunkLoadError } from './utils/isChunkLoadError';

export function useAppErrorController({ error }: IAppErrorProps) {
	function handleReload() {
		window.location.reload();
	}

	return {
		isOutdated: isChunkLoadError(error),
		handleReload
	};
}
