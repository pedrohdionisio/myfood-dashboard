import { getApiErrorMessage } from 'data/config/apiError';
import { useMembers } from 'data/modules/members/useCases/listMembers/useMembers';
import { useChangeOrderStatus } from 'data/modules/orders/useCases/changeOrderStatus/useChangeOrderStatus';
import { useDispatchOrder } from 'data/modules/orders/useCases/dispatchOrder/useDispatchOrder';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { IOrderDetailsModalProps } from './OrderDetailsModalTypes';
import { getOrderActions, type IOrderAction } from './utils/getOrderActions';

export function useOrderDetailsModalController({
	isOpen,
	restaurantId,
	order,
	onClose
}: IOrderDetailsModalProps) {
	const { changeOrderStatus, isChangingOrderStatus, changingTransition } = useChangeOrderStatus();
	const { dispatchOrder, isDispatchingOrder } = useDispatchOrder();

	const [confirmingAction, setConfirmingAction] = useState<IOrderAction | null>(null);
	const [isChoosingDriver, setIsChoosingDriver] = useState(false);
	const [reason, setReason] = useState('');
	const [driverMemberId, setDriverMemberId] = useState('');

	const { members, isLoadingMembers } = useMembers(isChoosingDriver ? restaurantId : null);

	useEffect(() => {
		if (isOpen) {
			setConfirmingAction(null);
			setIsChoosingDriver(false);
			setReason('');
			setDriverMemberId('');
		}
	}, [isOpen]);

	const isReasonTooShort = reason.trim().length > 0 && reason.trim().length < 3;

	async function runTransition(action: IOrderAction, actionReason?: string) {
		if (!order) {
			return;
		}

		try {
			await changeOrderStatus({
				restaurantId,
				orderId: order.id,
				transition: action.transition,
				reason: actionReason
			});
			toast.success('Pedido atualizado.');
			onClose();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	function handleSelectAction(action: IOrderAction) {
		if (action.isDestructive) {
			setReason('');
			setConfirmingAction(action);

			return;
		}

		runTransition(action);
	}

	function handleConfirmAction() {
		if (!confirmingAction || isReasonTooShort) {
			return;
		}

		runTransition(confirmingAction, reason.trim() || undefined);
	}

	function handleOpenDriverStep() {
		setDriverMemberId('');
		setIsChoosingDriver(true);
	}

	function handleBackToDetails() {
		setConfirmingAction(null);
		setIsChoosingDriver(false);
	}

	async function handleConfirmDispatch() {
		if (!order || !driverMemberId) {
			return;
		}

		try {
			await dispatchOrder({ restaurantId, orderId: order.id, driverMemberId });
			toast.success('Pedido despachado.');
			onClose();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		actions: order ? getOrderActions(order.status) : [],
		canDispatch: order?.status === 'READY',
		confirmingAction,
		isChoosingDriver,
		reason,
		isReasonTooShort,
		driverMemberId,
		drivers: members.filter((member) => member.role === 'DRIVER' && member.active),
		isLoadingMembers,
		isSubmitting: isChangingOrderStatus || isDispatchingOrder,
		changingTransition,
		handleSelectAction,
		handleConfirmAction,
		handleOpenDriverStep,
		handleBackToDetails,
		handleConfirmDispatch,
		handleChangeReason: setReason,
		handleChangeDriver: setDriverMemberId
	};
}
