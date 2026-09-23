import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MemberMutationKeys, MemberQueryKeys } from 'data/modules/members/keys/MemberKeys';
import { MembersService } from 'data/modules/members/services/MembersService';
import type { IUpdateMemberVariables } from 'data/modules/members/types/MemberTypes';

export function useUpdateMember() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [MemberMutationKeys.UPDATE_MEMBER],
		mutationFn: ({ restaurantId, memberId, ...payload }: IUpdateMemberVariables) =>
			MembersService.update(restaurantId, memberId, payload),
		async onSuccess(_member, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [MemberQueryKeys.MEMBERS, restaurantId]
			});
		}
	});

	return {
		updateMember: mutateAsync,
		isUpdatingMember: isPending
	};
}
