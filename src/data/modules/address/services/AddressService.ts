import { viaCepApi } from 'data/config/viaCepApi';
import { AddressMapper } from 'data/modules/address/mappers/AddressMapper';
import type { IPersistenceViaCepAddress } from 'data/modules/address/types/AddressTypes';
import type { IAddress } from 'shared/entities/IAddress';
import { Mask } from 'shared/utils/Mask';

async function findAddressByZipCode(zipCode: string): Promise<IAddress | null> {
	const { data } = await viaCepApi.get<IPersistenceViaCepAddress>(`/${Mask.remove(zipCode)}/json/`);

	if (data.erro) {
		return null;
	}

	return AddressMapper.toDomain(data);
}

export const AddressService = {
	findAddressByZipCode
};
