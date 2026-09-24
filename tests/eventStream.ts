import { HttpResponse } from 'msw';

export function createEventStream() {
	const encoder = new TextEncoder();
	let streamController: ReadableStreamDefaultController<Uint8Array> | null = null;

	function respond() {
		return new HttpResponse(
			new ReadableStream<Uint8Array>({
				start(controller) {
					streamController = controller;
				}
			}),
			{ headers: { 'Content-Type': 'text/event-stream' } }
		);
	}

	function send(payload: unknown) {
		streamController?.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
	}

	function isConnected() {
		return streamController !== null;
	}

	return { respond, send, isConnected };
}
