import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Area, MediaSize, Point } from 'react-easy-crop';
import type { IUseImageInputControllerParams } from './ImageInputTypes';
import { cropToWebp } from './utils/cropToWebp';

export function useImageInputController({
	previewUrl,
	outputWidth,
	disabled,
	onSelect,
	onCroppingChange
}: IUseImageInputControllerParams) {
	const [sourceUrl, setSourceUrl] = useState<string | null>(null);
	const [sourceWidth, setSourceWidth] = useState<number | null>(null);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isPreparing, setIsPreparing] = useState(false);
	const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
	const [brokenPreviewUrl, setBrokenPreviewUrl] = useState<string | null>(null);

	const sourceUrlRef = useRef<string | null>(null);

	const releaseSourceUrl = useCallback(() => {
		if (sourceUrlRef.current) {
			URL.revokeObjectURL(sourceUrlRef.current);
			sourceUrlRef.current = null;
		}
	}, []);

	useEffect(() => releaseSourceUrl, [releaseSourceUrl]);

	function closeCropper() {
		releaseSourceUrl();
		setSourceUrl(null);
		setSourceWidth(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		onCroppingChange?.(false);
	}

	const handleDrop = useCallback(
		(acceptedFiles: File[]) => {
			const [file] = acceptedFiles;

			if (!file) {
				return;
			}

			releaseSourceUrl();

			const url = URL.createObjectURL(file);
			sourceUrlRef.current = url;

			setRejectionMessage(null);
			setSourceUrl(url);
			setCrop({ x: 0, y: 0 });
			setZoom(1);
			setCroppedAreaPixels(null);
			onCroppingChange?.(true);
		},
		[onCroppingChange, releaseSourceUrl]
	);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop: handleDrop,
		onDropRejected() {
			setRejectionMessage('Envie uma imagem JPG, PNG ou WebP de até 20MB.');
		},
		accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
		maxSize: 20 * 1024 * 1024,
		multiple: false,
		noClick: true,
		noKeyboard: true,
		disabled
	});

	function handlePreviewError() {
		setBrokenPreviewUrl(previewUrl);
	}

	function handleMediaLoaded({ naturalWidth }: MediaSize) {
		setSourceWidth(naturalWidth);
	}

	function handleCropComplete(_croppedArea: Area, area: Area) {
		setCroppedAreaPixels(area);
	}

	async function handleConfirmCrop() {
		if (!sourceUrl || !croppedAreaPixels) {
			return;
		}

		setIsPreparing(true);

		try {
			const file = await cropToWebp(sourceUrl, croppedAreaPixels, outputWidth);

			closeCropper();
			onSelect(file);
		} catch (error) {
			setRejectionMessage(
				error instanceof Error ? error.message : 'Não foi possível preparar a imagem.'
			);
		} finally {
			setIsPreparing(false);
		}
	}

	return {
		sourceUrl,
		crop,
		zoom,
		isCropping: !!sourceUrl,
		isPreparing,
		isDragActive,
		isPreviewBroken: !!previewUrl && previewUrl === brokenPreviewUrl,
		isSourceTooSmall: !!sourceWidth && sourceWidth < outputWidth,
		rejectionMessage,
		getRootProps,
		getInputProps,
		openFilePicker: open,
		handleCropChange: setCrop,
		handleZoomChange: setZoom,
		handlePreviewError,
		handleMediaLoaded,
		handleCropComplete,
		handleConfirmCrop,
		handleCancelCrop: closeCropper
	};
}
