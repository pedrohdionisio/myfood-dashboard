import type { Area } from 'react-easy-crop';

function toBlob(canvas: HTMLCanvasElement, type: string) {
	return new Promise<Blob | null>((resolve) => {
		canvas.toBlob(resolve, type, 0.9);
	});
}

export async function cropImage(sourceUrl: string, area: Area, outputWidth: number): Promise<Blob> {
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

	const webpBlob = await toBlob(canvas, 'image/webp');
	const blob = webpBlob?.type === 'image/webp' ? webpBlob : await toBlob(canvas, 'image/jpeg');

	if (!blob) {
		throw new Error('Não foi possível preparar a imagem neste navegador.');
	}

	return blob;
}
