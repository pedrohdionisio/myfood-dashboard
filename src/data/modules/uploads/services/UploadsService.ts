import axios from 'axios';
import { api } from 'data/config/api';
import type { IImageUpload, IImageUploadPayload } from 'data/modules/uploads/types/UploadTypes';

async function create(restaurantId: string, payload: IImageUploadPayload): Promise<IImageUpload> {
	const { data } = await api.post<IImageUpload>(
		`/restaurants/${restaurantId}/uploads/images`,
		payload
	);

	return data;
}

async function sendToStorage({ url, fields }: IImageUpload, file: Blob): Promise<void> {
	const form = new FormData();

	for (const [field, value] of Object.entries(fields)) {
		form.append(field, value);
	}

	form.append('file', file);

	await axios.post(url, form);
}

export const UploadsService = {
	create,
	sendToStorage
};
