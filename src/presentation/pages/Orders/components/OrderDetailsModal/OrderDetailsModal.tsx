import { Button } from 'presentation/components/Button/Button';
import { Modal } from 'presentation/components/Modal/Modal';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'presentation/components/Select/Select';
import { TextareaInput } from 'presentation/components/TextareaInput/TextareaInput';
import type { OrderStatus } from 'shared/entities/IOrder';
import { Mask } from 'shared/utils/Mask';
import { formatOrderTime } from '../OrderCard/utils/formatOrderTime';
import type { IOrderDetailsModalProps } from './OrderDetailsModalTypes';
import { useOrderDetailsModalController } from './useOrderDetailsModalController';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	PENDING_PAYMENT: 'Aguardando pagamento',
	PENDING: 'Novo',
	CONFIRMED: 'Aceito',
	PREPARING: 'Em preparo',
	READY: 'Pronto',
	OUT_FOR_DELIVERY: 'Saiu para entrega',
	DELIVERED: 'Entregue',
	DELIVERY_FAILED: 'Entrega frustrada',
	REJECTED: 'Recusado',
	CANCELED: 'Cancelado'
};

const PAYMENT_METHOD_LABELS = {
	ONLINE: 'Pix',
	CASH: 'Dinheiro',
	CARD_ON_DELIVERY: 'Cartão na entrega'
};

const PAYMENT_STATUS_LABELS = {
	PENDING: 'Aguardando',
	PAID: 'Pago',
	FAILED: 'Falhou',
	REFUNDED: 'Estornado'
};

export function OrderDetailsModal({
	isOpen,
	restaurantId,
	order,
	onClose
}: IOrderDetailsModalProps) {
	const {
		actions,
		canDispatch,
		confirmingAction,
		isChoosingDriver,
		reason,
		isReasonTooShort,
		driverMemberId,
		drivers,
		isLoadingMembers,
		isSubmitting,
		changingTransition,
		handleSelectAction,
		handleConfirmAction,
		handleOpenDriverStep,
		handleBackToDetails,
		handleConfirmDispatch,
		handleChangeReason,
		handleChangeDriver
	} = useOrderDetailsModalController({ isOpen, restaurantId, order, onClose });

	return (
		<Modal.Root open={isOpen} onOpenChange={onClose}>
			<Modal.Content size="lg">
				{order ? (
					<>
						<Modal.Header>
							<Modal.Title>Pedido #{order.displayNumber}</Modal.Title>

							<Modal.Description>
								{ORDER_STATUS_LABELS[order.status]} · recebido às {formatOrderTime(order.createdAt)}
							</Modal.Description>
						</Modal.Header>

						{confirmingAction ? (
							<Modal.Body>
								<div className="flex flex-col gap-2">
									<h3 className="text-title-sm">{confirmingAction.confirmTitle}</h3>

									<p className="text-body-sm text-muted-foreground">
										{confirmingAction.confirmDescription}
									</p>
								</div>

								<TextareaInput
									id="reason"
									label="Motivo (opcional)"
									placeholder="Fica registrado no histórico do pedido."
									rows={3}
									value={reason}
									error={isReasonTooShort ? 'Escreva ao menos 3 caracteres ou deixe vazio' : ''}
									onChange={(event) => handleChangeReason(event.target.value)}
								/>
							</Modal.Body>
						) : null}

						{isChoosingDriver ? (
							<Modal.Body>
								<div className="flex flex-col gap-2">
									<h3 className="text-title-sm">Despachar pedido</h3>

									<p className="text-body-sm text-muted-foreground">
										Escolha quem vai levar. O entregador confirma a entrega com o código do cliente.
									</p>
								</div>

								{isLoadingMembers ? (
									<p className="text-body-sm text-muted-foreground">Carregando equipe…</p>
								) : null}

								{!isLoadingMembers && drivers.length === 0 ? (
									<p className="rounded-xl border border-border border-dashed p-6 text-center text-body-sm text-muted-foreground">
										Nenhum entregador ativo na equipe. Cadastre um entregador para poder despachar.
									</p>
								) : null}

								{drivers.length > 0 ? (
									<div className="flex w-full flex-col gap-2">
										<label htmlFor="driverMemberId" className="text-label">
											Entregador
										</label>

										<Select value={driverMemberId} onValueChange={handleChangeDriver}>
											<SelectTrigger id="driverMemberId" className="w-full">
												<SelectValue placeholder="Escolha um entregador" />
											</SelectTrigger>

											<SelectContent>
												{drivers.map((driver) => (
													<SelectItem key={driver.id} value={driver.id}>
														{driver.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								) : null}
							</Modal.Body>
						) : null}

						{!confirmingAction && !isChoosingDriver ? (
							<Modal.Body>
								<section className="flex flex-col gap-2">
									<h3 className="text-label">Cliente</h3>

									<p className="text-body-sm">{order.customer.name}</p>

									{order.customer.phone ? (
										<p className="text-body-sm text-muted-foreground">
											{Mask.phone(order.customer.phone)}
										</p>
									) : null}
								</section>

								<section className="flex flex-col gap-2">
									<h3 className="text-label">Entrega</h3>

									<p className="text-body-sm">
										{order.deliveryStreet}, {order.deliveryNumber}
										{order.deliveryComplement ? ` — ${order.deliveryComplement}` : ''}
									</p>

									<p className="text-body-sm text-muted-foreground">
										{order.deliveryNeighborhood} · {order.deliveryCity}/{order.deliveryState} · CEP{' '}
										{Mask.zipCode(order.deliveryZipCode)}
									</p>

									{order.deliveryReference ? (
										<p className="text-body-sm text-muted-foreground">
											Referência: {order.deliveryReference}
										</p>
									) : null}
								</section>

								<section className="flex flex-col gap-3">
									<h3 className="text-label">Itens</h3>

									<ul className="flex flex-col gap-3">
										{order.items.map((item) => (
											<li key={item.id} className="flex items-start justify-between gap-4">
												<div className="flex flex-col gap-0.5">
													<span className="text-body-sm">
														{item.quantity}× {item.productName}
													</span>

													{item.notes ? (
														<span className="text-body-sm text-muted-foreground">{item.notes}</span>
													) : null}
												</div>

												<span className="shrink-0 text-body-sm tabular-nums">
													R$ {Mask.currency(String(item.totalCents))}
												</span>
											</li>
										))}
									</ul>

									<div className="flex flex-col gap-1 border-t border-border pt-3">
										<div className="flex items-center justify-between gap-4 text-body-sm text-muted-foreground">
											<span>Subtotal</span>
											<span className="tabular-nums">
												R$ {Mask.currency(String(order.subtotalCents))}
											</span>
										</div>

										<div className="flex items-center justify-between gap-4 text-body-sm text-muted-foreground">
											<span>Entrega</span>
											<span className="tabular-nums">
												R$ {Mask.currency(String(order.deliveryFeeCents))}
											</span>
										</div>

										{order.discountCents > 0 ? (
											<div className="flex items-center justify-between gap-4 text-body-sm text-muted-foreground">
												<span>Desconto</span>
												<span className="tabular-nums">
													−R$ {Mask.currency(String(order.discountCents))}
												</span>
											</div>
										) : null}

										<div className="flex items-center justify-between gap-4 font-medium">
											<span>Total</span>
											<span className="tabular-nums">
												R$ {Mask.currency(String(order.totalCents))}
											</span>
										</div>
									</div>
								</section>

								<section className="flex flex-col gap-2">
									<h3 className="text-label">Pagamento</h3>

									<p className="text-body-sm">
										{PAYMENT_METHOD_LABELS[order.paymentMethod]} ·{' '}
										{PAYMENT_STATUS_LABELS[order.paymentStatus]}
									</p>

									{order.changeForCents ? (
										<p className="text-body-sm text-muted-foreground">
											Levar troco para R$ {Mask.currency(String(order.changeForCents))}
										</p>
									) : null}
								</section>

								{order.notes ? (
									<section className="flex flex-col gap-2">
										<h3 className="text-label">Observações do cliente</h3>

										<p className="text-body-sm">{order.notes}</p>
									</section>
								) : null}

								{order.cancellationReason ? (
									<section className="flex flex-col gap-2">
										<h3 className="text-label">Motivo do encerramento</h3>

										<p className="text-body-sm">{order.cancellationReason}</p>
									</section>
								) : null}
							</Modal.Body>
						) : null}

						<Modal.Footer>
							{confirmingAction ? (
								<>
									<Button
										type="button"
										variant="ghost"
										disabled={isSubmitting}
										onClick={handleBackToDetails}
									>
										Voltar
									</Button>

									<Button
										type="button"
										variant="destructive"
										disabled={isReasonTooShort}
										isLoading={isSubmitting}
										onClick={handleConfirmAction}
									>
										{confirmingAction.label}
									</Button>
								</>
							) : null}

							{isChoosingDriver ? (
								<>
									<Button
										type="button"
										variant="ghost"
										disabled={isSubmitting}
										onClick={handleBackToDetails}
									>
										Voltar
									</Button>

									<Button
										type="button"
										disabled={!driverMemberId}
										isLoading={isSubmitting}
										onClick={handleConfirmDispatch}
									>
										Despachar
									</Button>
								</>
							) : null}

							{!confirmingAction && !isChoosingDriver ? (
								<>
									<Modal.Close asChild>
										<Button type="button" variant="ghost" disabled={isSubmitting}>
											Fechar
										</Button>
									</Modal.Close>

									{actions.map((action) => (
										<Button
											key={action.transition}
											type="button"
											variant={action.isDestructive ? 'outline' : 'default'}
											disabled={isSubmitting}
											isLoading={changingTransition === action.transition}
											onClick={() => handleSelectAction(action)}
										>
											{action.label}
										</Button>
									))}

									{canDispatch ? (
										<Button type="button" disabled={isSubmitting} onClick={handleOpenDriverStep}>
											Despachar
										</Button>
									) : null}
								</>
							) : null}
						</Modal.Footer>
					</>
				) : null}
			</Modal.Content>
		</Modal.Root>
	);
}
