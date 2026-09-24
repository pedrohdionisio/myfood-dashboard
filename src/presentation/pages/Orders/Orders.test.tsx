import { screen, waitFor, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { DashboardTemplate } from 'presentation/templates/DashboardTemplate/DashboardTemplate';
import { Route, Routes } from 'react-router-dom';
import type { IOrder, OrderStatus } from 'shared/entities/IOrder';
import { restaurantUrl } from 'tests/apiUrl';
import { createEventStream } from 'tests/eventStream';
import { buildOrder, buildOrdersPage } from 'tests/fixtures/orders';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { Orders } from './Orders';

let orders: IOrder[];
let eventStream: ReturnType<typeof createEventStream>;

function setOrderStatus(orderId: string, status: OrderStatus) {
	orders = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
}

beforeEach(() => {
	orders = [buildOrder()];
	eventStream = createEventStream();

	server.use(
		http.get(restaurantUrl('/orders'), ({ request }) => {
			const status = new URL(request.url).searchParams.get('status');

			return HttpResponse.json(buildOrdersPage(orders.filter((order) => order.status === status)));
		}),
		http.get(restaurantUrl('/orders/stream'), () => eventStream.respond())
	);
});

function renderOrders() {
	return renderSignedIn(
		<Routes>
			<Route element={<DashboardTemplate />}>
				<Route path="/pedidos" element={<Orders />} />
			</Route>
		</Routes>,
		'/pedidos'
	);
}

async function findColumn(label: string) {
	const heading = await screen.findByRole('heading', { name: label });
	const section = heading.closest('section');

	if (!section) {
		throw new Error(`Column ${label} not found`);
	}

	return within(section);
}

async function openOrder(user: ReturnType<typeof renderOrders>['user'], displayNumber: number) {
	await user.click(await screen.findByRole('button', { name: new RegExp(`#${displayNumber}`) }));

	return within(await screen.findByRole('dialog'));
}

describe('Orders', () => {
	it('places each order in the column of its status', async () => {
		orders = [buildOrder(), buildOrder({ id: 'order-2', displayNumber: 102, status: 'READY' })];
		renderOrders();

		expect(await (await findColumn('Novos')).findByText('#101')).toBeInTheDocument();
		expect(await (await findColumn('Prontos')).findByText('#102')).toBeInTheDocument();
		expect(
			await (await findColumn('Aceitos')).findByText('Nenhum pedido aqui.')
		).toBeInTheDocument();
	});

	it('accepts a new order', async () => {
		server.use(
			http.post(restaurantUrl('/orders/order-1/confirm'), () => {
				setOrderStatus('order-1', 'CONFIRMED');

				return HttpResponse.json(orders[0]);
			})
		);
		const { user } = renderOrders();

		const dialog = await openOrder(user, 101);
		await user.click(dialog.getByRole('button', { name: 'Aceitar' }));

		expect(await screen.findByText('Pedido atualizado.')).toBeInTheDocument();
		expect(await (await findColumn('Aceitos')).findByText('#101')).toBeInTheDocument();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('asks for confirmation and sends the reason when rejecting', async () => {
		let sentReason: unknown;
		server.use(
			http.post(restaurantUrl('/orders/order-1/reject'), async ({ request }) => {
				sentReason = ((await request.json()) as { reason?: string }).reason;
				setOrderStatus('order-1', 'REJECTED');

				return HttpResponse.json(orders[0]);
			})
		);
		const { user } = renderOrders();

		const dialog = await openOrder(user, 101);
		await user.click(dialog.getByRole('button', { name: 'Recusar' }));

		expect(dialog.getByRole('heading', { name: 'Recusar pedido' })).toBeInTheDocument();

		await user.type(dialog.getByLabelText('Motivo (opcional)'), 'x');
		expect(dialog.getByText('Escreva ao menos 3 caracteres ou deixe vazio')).toBeInTheDocument();
		expect(dialog.getByRole('button', { name: 'Recusar' })).toBeDisabled();

		await user.type(dialog.getByLabelText('Motivo (opcional)'), ' sem entregador');
		await user.click(dialog.getByRole('button', { name: 'Recusar' }));

		await waitFor(() => expect(sentReason).toBe('x sem entregador'));
		expect(await (await findColumn('Novos')).findByText('Nenhum pedido aqui.')).toBeInTheDocument();
	});

	it('dispatches a ready order to an active driver', async () => {
		orders = [buildOrder({ status: 'READY' })];
		let sentDriver: unknown;
		server.use(
			http.get(restaurantUrl('/members'), () =>
				HttpResponse.json([
					{
						id: 'member-driver',
						userId: 'user-2',
						name: 'João Entregador',
						email: 'joao@myfood.com',
						phone: null,
						role: 'DRIVER',
						active: true
					},
					{
						id: 'member-inactive',
						userId: 'user-3',
						name: 'Ana Inativa',
						email: 'ana@myfood.com',
						phone: null,
						role: 'DRIVER',
						active: false
					}
				])
			),
			http.post(restaurantUrl('/orders/order-1/dispatch'), async ({ request }) => {
				sentDriver = ((await request.json()) as { driverMemberId: string }).driverMemberId;
				setOrderStatus('order-1', 'OUT_FOR_DELIVERY');

				return HttpResponse.json(orders[0]);
			})
		);
		const { user } = renderOrders();

		const dialog = await openOrder(user, 101);
		await user.click(dialog.getByRole('button', { name: 'Despachar' }));
		await user.click(await dialog.findByRole('combobox', { name: 'Entregador' }));

		expect(screen.queryByRole('option', { name: 'Ana Inativa' })).not.toBeInTheDocument();

		await user.click(await screen.findByRole('option', { name: 'João Entregador' }));
		await user.click(dialog.getByRole('button', { name: 'Despachar' }));

		await waitFor(() => expect(sentDriver).toBe('member-driver'));
		expect(await screen.findByText('Pedido despachado.')).toBeInTheDocument();
		expect(await (await findColumn('Saiu para entrega')).findByText('#101')).toBeInTheDocument();
	});

	it('announces orders placed while the board is open', async () => {
		renderOrders();

		await (await findColumn('Novos')).findByText('#101');
		await waitFor(() => expect(eventStream.isConnected()).toBe(true));

		orders = [...orders, buildOrder({ id: 'order-2', displayNumber: 102 })];
		eventStream.send({
			type: 'ORDER_PLACED',
			orderId: 'order-2',
			displayNumber: 102,
			status: 'PENDING',
			occurredAt: new Date().toISOString()
		});

		expect(await screen.findByText('Novo pedido #102')).toBeInTheDocument();
		expect(await (await findColumn('Novos')).findByText('#102')).toBeInTheDocument();
	});

	it('keeps the open order in sync when its status changes elsewhere', async () => {
		const { user } = renderOrders();

		const dialog = await openOrder(user, 101);
		await waitFor(() => expect(eventStream.isConnected()).toBe(true));

		setOrderStatus('order-1', 'CONFIRMED');
		eventStream.send({
			type: 'ORDER_STATUS_CHANGED',
			orderId: 'order-1',
			displayNumber: 101,
			status: 'CONFIRMED',
			occurredAt: new Date().toISOString()
		});

		expect(await dialog.findByRole('button', { name: 'Pôr em preparo' })).toBeInTheDocument();
		expect(dialog.getByText(/^Aceito ·/)).toBeInTheDocument();
		expect(dialog.queryByRole('button', { name: 'Aceitar' })).not.toBeInTheDocument();
	});
});
