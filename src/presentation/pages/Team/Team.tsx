import { PlusIcon } from 'lucide-react';
import { ActionModal } from 'presentation/components/ActionModal/ActionModal';
import { Button } from 'presentation/components/Button/Button';
import { DataTable } from 'presentation/components/DataTable/DataTable';
import type { MemberRole } from 'shared/entities/IRestaurantMembership';
import { Mask } from 'shared/utils/Mask';
import { DriverFormModal } from './components/DriverFormModal/DriverFormModal';
import { useTeamController } from './useTeamController';

const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
	OWNER: 'Dono',
	DRIVER: 'Entregador'
};

export function Team() {
	const {
		restaurantId,
		rows,
		isLoadingMembers,
		membersErrorMessage,
		isEmpty,
		isFormModalOpen,
		pendingActionCopy,
		isConfirmingAction,
		activatingMemberId,
		handleOpenCreateModal,
		handleCloseFormModal,
		handleRequestAction,
		handleCloseActionModal,
		handleConfirmAction,
		handleActivate
	} = useTeamController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-title-md">Equipe</h1>

					<p className="text-body-sm text-muted-foreground">
						Quem administra o restaurante e quem recebe o despacho dos pedidos.
					</p>
				</div>

				<Button type="button" onClick={handleOpenCreateModal}>
					<PlusIcon aria-hidden="true" />
					Novo entregador
				</Button>
			</header>

			<DataTable.Root columnCount={6}>
				<DataTable.Header>
					<DataTable.Head>Nome</DataTable.Head>

					<DataTable.Head>E-mail</DataTable.Head>

					<DataTable.Head>Telefone</DataTable.Head>

					<DataTable.Head>Papel</DataTable.Head>

					<DataTable.Head>Situação</DataTable.Head>

					<DataTable.Head align="right">Ações</DataTable.Head>
				</DataTable.Header>

				<DataTable.Body>
					{isLoadingMembers ? <DataTable.LoadingRows /> : null}

					{membersErrorMessage ? (
						<DataTable.ErrorRow>{membersErrorMessage}</DataTable.ErrorRow>
					) : null}

					{isEmpty ? <DataTable.EmptyRow>Ninguém na equipe ainda.</DataTable.EmptyRow> : null}

					{rows.map(({ member, isSelf }) => (
						<DataTable.Row key={member.id}>
							<DataTable.Cell className="font-medium">
								{member.name}
								{isSelf ? <span className="text-muted-foreground"> (você)</span> : null}
							</DataTable.Cell>

							<DataTable.Cell className="text-muted-foreground">{member.email}</DataTable.Cell>

							<DataTable.Cell className="text-muted-foreground">
								{member.phone ? Mask.phone(member.phone) : '—'}
							</DataTable.Cell>

							<DataTable.Cell>{MEMBER_ROLE_LABELS[member.role]}</DataTable.Cell>

							<DataTable.Cell>{member.active ? 'Ativo' : 'Inativo'}</DataTable.Cell>

							<DataTable.Cell align="right">
								{isSelf ? null : (
									<div className="flex items-center justify-end gap-2">
										{member.active ? (
											<>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() =>
														handleRequestAction(
															member,
															member.role === 'DRIVER' ? 'PROMOTE' : 'DEMOTE'
														)
													}
												>
													{member.role === 'DRIVER' ? 'Tornar dono' : 'Tornar entregador'}
												</Button>

												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => handleRequestAction(member, 'DEACTIVATE')}
												>
													Desativar
												</Button>
											</>
										) : (
											<Button
												type="button"
												variant="outline"
												size="sm"
												isLoading={activatingMemberId === member.id}
												onClick={() => handleActivate(member)}
											>
												Reativar
											</Button>
										)}
									</div>
								)}
							</DataTable.Cell>
						</DataTable.Row>
					))}
				</DataTable.Body>
			</DataTable.Root>

			<ActionModal
				isOpen={!!pendingActionCopy}
				title={pendingActionCopy?.title ?? ''}
				description={pendingActionCopy?.description ?? ''}
				confirmLabel={pendingActionCopy?.confirmLabel ?? ''}
				variant="destructive"
				isConfirming={isConfirmingAction}
				onConfirm={handleConfirmAction}
				onClose={handleCloseActionModal}
			/>

			{restaurantId ? (
				<DriverFormModal
					isOpen={isFormModalOpen}
					restaurantId={restaurantId}
					onClose={handleCloseFormModal}
				/>
			) : null}
		</div>
	);
}
