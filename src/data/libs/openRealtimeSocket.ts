export interface IRealtimeTicket {
	url: string;
	ticket: string;
}

export interface IOpenRealtimeSocketParams {
	requestTicket: () => Promise<IRealtimeTicket | null>;
	onMessage: (data: string) => void;
	onReconnect: () => void;
}

const RETRY_MS = 3000;
const MAX_BACKOFF_MS = 30000;
// O API Gateway derruba a conexão parada há 10 minutos; o ping chega bem antes disso.
const PING_INTERVAL_MS = 5 * 60 * 1000;

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

function toBackoffMs(failures: number) {
	return Math.min(RETRY_MS * 2 ** Math.max(failures - 1, 0), MAX_BACKOFF_MS);
}

function listen(
	{ url, ticket }: IRealtimeTicket,
	signal: AbortSignal,
	onOpen: () => void,
	onMessage: (data: string) => void
) {
	return new Promise<boolean>((resolve) => {
		const socket = new WebSocket(`${url}?ticket=${encodeURIComponent(ticket)}`);
		let opened = false;
		let pingId: ReturnType<typeof setInterval> | undefined;

		function close() {
			socket.close();
		}

		signal.addEventListener('abort', close, { once: true });

		socket.addEventListener('open', () => {
			opened = true;
			onOpen();
			pingId = setInterval(() => socket.send('{"action":"ping"}'), PING_INTERVAL_MS);
		});

		socket.addEventListener('message', (event) => {
			if (typeof event.data === 'string') {
				onMessage(event.data);
			}
		});

		socket.addEventListener('close', () => {
			clearInterval(pingId);
			signal.removeEventListener('abort', close);
			resolve(opened);
		});
	});
}

export function openRealtimeSocket({
	requestTicket,
	onMessage,
	onReconnect
}: IOpenRealtimeSocketParams): () => void {
	const controller = new AbortController();
	const { signal } = controller;

	async function run() {
		let failures = 0;
		let hasConnected = false;

		function handleOpen() {
			failures = 0;

			// Eventos emitidos enquanto a conexão estava caída não voltam: quem chama recarrega.
			if (hasConnected) {
				onReconnect();
			}

			hasConnected = true;
		}

		while (!signal.aborted) {
			try {
				const ticket = await requestTicket();

				if (!ticket || signal.aborted) {
					return;
				}

				const opened = await listen(ticket, signal, handleOpen, onMessage);

				if (signal.aborted) {
					return;
				}

				if (opened) {
					await waitFor(RETRY_MS, signal);

					continue;
				}
			} catch {
				if (signal.aborted) {
					return;
				}
			}

			failures += 1;
			await waitFor(toBackoffMs(failures), signal);
		}
	}

	run();

	return () => controller.abort();
}
