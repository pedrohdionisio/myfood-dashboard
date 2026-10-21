import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openRealtimeSocket } from './openRealtimeSocket';

class FakeSocket extends EventTarget {
	static instances: FakeSocket[] = [];
	readonly sent: string[] = [];
	closed = false;

	constructor(readonly url: string) {
		super();
		FakeSocket.instances.push(this);
	}

	send(data: string) {
		this.sent.push(data);
	}

	close() {
		if (!this.closed) {
			this.closed = true;
			this.dispatchEvent(new Event('close'));
		}
	}

	serverOpen() {
		this.dispatchEvent(new Event('open'));
	}

	serverSend(data: string) {
		this.dispatchEvent(new MessageEvent('message', { data }));
	}
}

function lastSocket() {
	const socket = FakeSocket.instances.at(-1);

	if (!socket) {
		throw new Error('nenhum socket aberto');
	}

	return socket;
}

function open(requestTicket: () => Promise<{ url: string; ticket: string } | null>) {
	const onMessage = vi.fn();
	const onReconnect = vi.fn();
	const close = openRealtimeSocket({ requestTicket, onMessage, onReconnect });

	return { close, onMessage, onReconnect };
}

let tickets = 0;

function issueTicket() {
	tickets += 1;

	return Promise.resolve({ url: 'wss://realtime.test/dev', ticket: `t ${tickets}` });
}

beforeEach(() => {
	vi.useFakeTimers();
	vi.stubGlobal('WebSocket', FakeSocket);
	FakeSocket.instances = [];
	tickets = 0;
});

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('openRealtimeSocket', () => {
	it('should connect with an encoded ticket and forward text messages', async () => {
		const { close, onMessage, onReconnect } = open(issueTicket);
		await vi.advanceTimersByTimeAsync(0);

		const socket = lastSocket();
		socket.serverOpen();
		socket.serverSend('{"type":"ORDER_PLACED"}');

		expect(socket.url).toBe('wss://realtime.test/dev?ticket=t%201');
		expect(onMessage).toHaveBeenCalledWith('{"type":"ORDER_PLACED"}');
		expect(onReconnect).not.toHaveBeenCalled();
		close();
	});

	it('should reconnect with a new ticket after the connection drops and ask for a reload', async () => {
		const { close, onReconnect } = open(issueTicket);
		await vi.advanceTimersByTimeAsync(0);
		lastSocket().serverOpen();

		lastSocket().close();
		await vi.advanceTimersByTimeAsync(3000);
		lastSocket().serverOpen();

		expect(FakeSocket.instances).toHaveLength(2);
		expect(lastSocket().url).toContain('t%202');
		expect(onReconnect).toHaveBeenCalledTimes(1);
		close();
	});

	it('should ping while connected so the gateway does not drop an idle connection', async () => {
		const { close } = open(issueTicket);
		await vi.advanceTimersByTimeAsync(0);
		lastSocket().serverOpen();

		await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

		expect(lastSocket().sent).toEqual(['{"action":"ping"}']);
		close();
	});

	it('should give up when no ticket can be issued', async () => {
		open(() => Promise.resolve(null));
		await vi.advanceTimersByTimeAsync(60_000);

		expect(FakeSocket.instances).toHaveLength(0);
	});

	it('should retry after a failed ticket request and stop everything when closed', async () => {
		const requestTicket = vi
			.fn()
			.mockRejectedValueOnce(new Error('network'))
			.mockImplementation(issueTicket);
		const { close } = open(requestTicket);

		await vi.advanceTimersByTimeAsync(3000);
		const socket = lastSocket();
		close();
		await vi.advanceTimersByTimeAsync(60_000);

		expect(requestTicket).toHaveBeenCalledTimes(2);
		expect(socket.closed).toBe(true);
		expect(FakeSocket.instances).toHaveLength(1);
	});
});
