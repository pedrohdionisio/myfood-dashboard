import { skipToken, useQuery } from '@tanstack/react-query';
import { MemberQueryKeys } from 'data/modules/members/keys/MemberKeys';
import { MembersService } from 'data/modules/members/services/MembersService';

export function useMembers(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [MemberQueryKeys.MEMBERS, restaurantId],
		queryFn: restaurantId ? () => MembersService.list(restaurantId) : skipToken
	});

	return {
		members: data ?? [],
		isLoadingMembers: isLoading,
		membersError: error
	};
}
