interface IEventStreamMessage {
	event: string;
	data: string;
}

export interface IOpenEventStreamParams {
	url: string;
	resolveAuthorization: () => string | null;
	renewAuthorization: () => Promise<void>;
	onMessage: (message: IEventStreamMessage) => void;
}

const DEFAULT_RETRY_MS = 3000;
const MAX_BACKOFF_MS = 30000;

function waitFor(ms: number, signal: AbortSignal) {
	return new Promise<void>((resolve) => {
		const timeoutId = setTimeout(resolve, ms);

		signal.addEventListener(
			'abort',
			() => {
				clearTimeout(timeoutId);
				resolve();
			},
			{ once: true }
		);
	});
}

function isPermanentFailure(status: number) {
	return status >= 400 && status < 500 && status !== 408 && status !== 429;
}

function toBackoffMs(retryMs: number, failures: number) {
	return Math.min(retryMs * 2 ** Math.max(failures - 1, 0), MAX_BACKOFF_MS);
}

function parseBlock(block: string, onRetry: (retryMs: number) => void) {
	let event = 'message';
	const dataLines: string[] = [];

	for (const line of block.split('\n')) {
		if (line === '' || line.startsWith(':')) {
			continue;
		}

		const separatorIndex = line.indexOf(':');
		const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
		const rawValue = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1);
		const value = rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;

		if (field === 'event') {
			event = value;
		} else if (field === 'data') {
			dataLines.push(value);
		} else if (field === 'retry' && /^\d+$/.test(value)) {
			onRetry(Number(value));
		}
	}

	return dataLines.length > 0 ? { event, data: dataLines.join('\n') } : null;
}

async function readMessages(
	body: ReadableStream<Uint8Array>,
	onMessage: (message: IEventStreamMessage) => void,
	onRetry: (retryMs: number) => void
) {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { value, done } = await reader.read();

		if (done) {
			return;
		}

		buffer += decoder.decode(value, { stream: true }).replace(/\r\n?/g, '\n');

		let boundaryIndex = buffer.indexOf('\n\n');

		while (boundaryIndex !== -1) {
			const message = parseBlock(buffer.slice(0, boundaryIndex), onRetry);

			buffer = buffer.slice(boundaryIndex + 2);
			boundaryIndex = buffer.indexOf('\n\n');

			if (message) {
				onMessage(message);
			}
		}
	}
}

export function openEventStream({
	url,
	resolveAuthorization,
	renewAuthorization,
	onMessage
}: IOpenEventStreamParams): () => void {
	const controller = new AbortController();
	const { signal } = controller;

	async function run() {
		let retryMs = DEFAULT_RETRY_MS;
		let failures = 0;
		let hasRenewedAuthorization = false;

		function handleRetry(nextRetryMs: number) {
			retryMs = nextRetryMs;
		}

		while (!signal.aborted) {
			try {
				const authorization = resolveAuthorization();
				const response = await fetch(url, {
					headers: {
						Accept: 'text/event-stream',
						...(authorization ? { Authorization: authorization } : {})
					},
					signal
				});

				if (response.status === 401 && !hasRenewedAuthorization) {
					hasRenewedAuthorization = true;
					await renewAuthorization();

					continue;
				}

				if (isPermanentFailure(response.status)) {
					return;
				}

				if (!response.ok || !response.body) {
					failures += 1;
					await waitFor(toBackoffMs(retryMs, failures), signal);

					continue;
				}

				failures = 0;
				hasRenewedAuthorization = false;
				await readMessages(response.body, onMessage, handleRetry);
				await waitFor(retryMs, signal);
			} catch {
				if (signal.aborted) {
					return;
				}

				failures += 1;
				await waitFor(toBackoffMs(retryMs, failures), signal);
			}
		}
	}

	run();

	return () => controller.abort();
}
