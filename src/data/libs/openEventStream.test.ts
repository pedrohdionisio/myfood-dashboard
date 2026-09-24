import { afterEach, describe, expect, it, vi } from 'vitest';
import { openEventStream } from './openEventStream';

function streamResponse(chunks: string[]) {
	const encoder = new TextEncoder();

	return new Response(
		new ReadableStream({
			start(controller) {
				for (const chunk of chunks) {
					controller.enqueue(encoder.encode(chunk));
				}

				controller.close();
			}
		}),
		{ status: 200 }
	);
}

function openStream(fetchMock: ReturnType<typeof vi.fn>, authorization = 'Bearer first') {
	vi.stubGlobal('fetch', fetchMock);

	let currentAuthorization = authorization;
	const onMessage = vi.fn();
	const renewAuthorization = vi.fn(async () => {
		currentAuthorization = 'Bearer renewed';
	});

	const close = openEventStream({
		url: 'http://api.test/stream',
		resolveAuthorization: () => currentAuthorization,
		renewAuthorization,
		onMessage
	});

	return { close, onMessage, renewAuthorization };
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('openEventStream', () => {
	it('parses messages split across chunks, joining data lines and skipping comments', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				streamResponse([
					': keep-alive\r\n\r\n',
					'event: ORDER_PLACED\r\ndata: {"a":',
					'1}\r\n\r\ndata: first\ndata: second\n\n'
				])
			)
			.mockImplementation(() => new Promise(() => {}));

		const { close, onMessage } = openStream(fetchMock);

		await vi.waitFor(() => expect(onMessage).toHaveBeenCalledTimes(2));

		expect(onMessage).toHaveBeenNthCalledWith(1, { event: 'ORDER_PLACED', data: '{"a":1}' });
		expect(onMessage).toHaveBeenNthCalledWith(2, { event: 'message', data: 'first\nsecond' });
		expect(fetchMock).toHaveBeenCalledWith(
			'http://api.test/stream',
			expect.objectContaining({
				headers: { Accept: 'text/event-stream', Authorization: 'Bearer first' }
			})
		);

		close();
	});

	it('renews the authorization once after a 401 and reconnects with the new token', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(new Response(null, { status: 401 }))
			.mockImplementation(() => new Promise(() => {}));

		const { close, renewAuthorization } = openStream(fetchMock);

		await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

		expect(renewAuthorization).toHaveBeenCalledOnce();
		expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
			headers: { Authorization: 'Bearer renewed' }
		});

		close();
	});

	it('gives up on a permanent client error', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));

		const { close } = openStream(fetchMock);

		await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(fetchMock).toHaveBeenCalledOnce();

		close();
	});

	it('retries with backoff after a server error and stops when closed', async () => {
		vi.useFakeTimers();

		const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
		const { close } = openStream(fetchMock);

		await vi.advanceTimersByTimeAsync(0);
		expect(fetchMock).toHaveBeenCalledTimes(1);

		await vi.advanceTimersByTimeAsync(3000);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		await vi.advanceTimersByTimeAsync(3000);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		await vi.advanceTimersByTimeAsync(3000);
		expect(fetchMock).toHaveBeenCalledTimes(3);

		close();
		await vi.advanceTimersByTimeAsync(60_000);
		expect(fetchMock).toHaveBeenCalledTimes(3);

		vi.useRealTimers();
	});
});
