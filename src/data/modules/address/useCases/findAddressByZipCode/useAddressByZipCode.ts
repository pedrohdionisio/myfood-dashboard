import { useQuery } from '@tanstack/react-query';
import { AddressQueryKeys } from 'data/modules/address/keys/AddressKeys';
import { AddressService } from 'data/modules/address/services/AddressService';
import { Mask } from 'shared/utils/Mask';

export function useAddressByZipCode(zipCode: string) {
	const zipCodeDigits = Mask.remove(zipCode);

	const { data, isFetching, error } = useQuery({
		queryKey: [AddressQueryKeys.ADDRESS_BY_ZIP_CODE, zipCodeDigits],
		queryFn: () => AddressService.findByZipCode(zipCodeDigits),
		enabled: zipCodeDigits.length === 8,
		staleTime: Number.POSITIVE_INFINITY
	});

	return {
		address: data ?? null,
		isZipCodeNotFound: data === null,
		isLoadingAddress: isFetching,
		addressError: error
	};
}
