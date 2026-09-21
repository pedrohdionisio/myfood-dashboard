import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MemberMutationKeys, MemberQueryKeys } from 'data/modules/members/keys/MemberKeys';
import { MembersService } from 'data/modules/members/services/MembersService';
import type { ICreateMemberVariables } from 'data/modules/members/types/MemberTypes';

export function useCreateMember() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [MemberMutationKeys.CREATE_MEMBER],
		mutationFn: ({ restaurantId, ...payload }: ICreateMemberVariables) =>
			MembersService.create(restaurantId, payload),
		async onSuccess(_member, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [MemberQueryKeys.MEMBERS, restaurantId]
			});
		}
	});

	return {
		createMember: mutateAsync,
		isCreatingMember: isPending
	};
}
