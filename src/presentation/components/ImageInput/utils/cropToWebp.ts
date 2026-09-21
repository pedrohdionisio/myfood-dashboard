import type { Area } from 'react-easy-crop';

export async function cropToWebp(
	sourceUrl: string,
	area: Area,
	outputWidth: number
): Promise<Blob> {
	const image = new Image();
	image.src = sourceUrl;

	await image.decode();

	const width = Math.min(outputWidth, Math.round(area.width));
	const height = Math.round((width * area.height) / area.width);

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext('2d');

	if (!context) {
		throw new Error('Não foi possível preparar a imagem neste navegador.');
	}

	context.imageSmoothingQuality = 'high';
	context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height);

	const blob = await new Promise<Blob | null>((resolve) => {
		canvas.toBlob(resolve, 'image/webp', 0.9);
	});

	if (!blob) {
		throw new Error('Não foi possível preparar a imagem neste navegador.');
	}

	return blob;
}
