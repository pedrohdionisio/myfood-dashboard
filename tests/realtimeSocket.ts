import { HttpResponse, http, ws } from 'msw';
import { restaurantUrl } from './apiUrl';

const SOCKET_URL = 'wss://realtime.test/dev';

export function createRealtimeSocket() {
	const link = ws.link(SOCKET_URL);
	let tickets = 0;

	const handlers = [
		http.post(restaurantUrl('/orders/stream-ticket'), () => {
			tickets += 1;

			return HttpResponse.json(
				{ url: SOCKET_URL, ticket: `ticket-${tickets}`, expiresAt: new Date().toISOString() },
				{ status: 201 }
			);
		}),
		link.addEventListener('connection', () => {})
	];

	function send(payload: unknown) {
		link.broadcast(JSON.stringify(payload));
	}

	function isConnected() {
		return link.clients.size > 0;
	}

	return { handlers, send, isConnected };
}
