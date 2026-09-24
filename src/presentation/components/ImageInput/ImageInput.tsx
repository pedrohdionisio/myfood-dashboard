import { cn } from 'cn';
import { ImageOffIcon, ImageUpIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import Cropper from 'react-easy-crop';
import type { IImageInputProps } from './ImageInputTypes';
import { useImageInputController } from './useImageInputController';

export function ImageInput({
	label,
	hint,
	previewUrl,
	aspect,
	outputWidth,
	disabled,
	isUploading,
	error,
	onSelect,
	onRemove,
	onCroppingChange
}: IImageInputProps) {
	const {
		sourceUrl,
		crop,
		zoom,
		isCropping,
		isPreparing,
		isDragActive,
		isPreviewBroken,
		isSourceTooSmall,
		rejectionMessage,
		getRootProps,
		getInputProps,
		openFilePicker,
		handleCropChange,
		handleZoomChange,
		handlePreviewError,
		handleMediaLoaded,
		handleCropComplete,
		handleConfirmCrop,
		handleCancelCrop
	} = useImageInputController({
		previewUrl,
		outputWidth,
		disabled: disabled || isUploading,
		onSelect,
		onCroppingChange
	});

	return (
		<div data-slot="image-input" className="flex w-full flex-col gap-2">
			{label ? <span className="text-label">{label}</span> : null}

			{isCropping && sourceUrl ? (
				<div className="flex flex-col gap-3">
					<div
						className="relative w-full overflow-hidden rounded-xl bg-muted"
						style={{ aspectRatio: aspect }}
					>
						<Cropper
							image={sourceUrl}
							crop={crop}
							zoom={zoom}
							aspect={aspect}
							showGrid
							onCropChange={handleCropChange}
							onZoomChange={handleZoomChange}
							onCropComplete={handleCropComplete}
							onMediaLoaded={handleMediaLoaded}
						/>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-body-sm text-muted-foreground">Zoom</span>

						<input
							type="range"
							min={1}
							max={3}
							step={0.05}
							value={zoom}
							aria-label="Zoom da imagem"
							className="h-1 w-full cursor-pointer accent-primary"
							onChange={(event) => handleZoomChange(Number(event.target.value))}
						/>
					</div>

					{isSourceTooSmall ? (
						<p className="flex items-start gap-2 text-body-sm text-muted-foreground">
							<TriangleAlertIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
							Esta imagem tem menos de {outputWidth}px de largura e pode sair sem nitidez para o
							cliente.
						</p>
					) : null}

					<div className="flex items-center justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={isPreparing}
							onClick={handleCancelCrop}
						>
							Cancelar
						</Button>

						<Button type="button" isLoading={isPreparing} onClick={handleConfirmCrop}>
							Cortar
						</Button>
					</div>
				</div>
			) : (
				<div {...getRootProps()} className="flex flex-col gap-3">
					<input {...getInputProps()} />

					{previewUrl ? (
						<div
							className="relative w-full overflow-hidden rounded-xl border border-border bg-muted"
							style={{ aspectRatio: aspect }}
						>
							{isPreviewBroken ? (
								<div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center">
									<ImageOffIcon aria-hidden="true" className="size-6 text-muted-foreground" />

									<span className="text-body-sm text-muted-foreground">
										Não foi possível carregar a imagem. Se você acabou de enviá-la, ela ainda pode
										estar sendo processada.
									</span>
								</div>
							) : (
								<img
									src={previewUrl}
									alt=""
									className="size-full object-cover"
									onError={handlePreviewError}
								/>
							)}

							{isUploading ? (
								<div className="absolute inset-0 flex items-center justify-center bg-background/70">
									<Loader2Icon aria-hidden="true" className="size-6 animate-spin" />
								</div>
							) : null}
						</div>
					) : (
						<button
							type="button"
							disabled={disabled}
							onClick={openFilePicker}
							style={{ aspectRatio: aspect }}
							className={cn(
								'flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-border border-dashed bg-background p-6 text-center transition-colors hover:border-ring hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
								isDragActive ? 'border-ring bg-accent' : undefined,
								error ? 'border-destructive' : undefined
							)}
						>
							<ImageUpIcon aria-hidden="true" className="size-6 text-muted-foreground" />

							<span className="text-body-sm">Arraste uma imagem aqui ou clique para escolher</span>

							{hint ? <span className="text-body-sm text-muted-foreground">{hint}</span> : null}
						</button>
					)}

					{previewUrl ? (
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={disabled || isUploading}
								onClick={openFilePicker}
							>
								Trocar imagem
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								disabled={disabled || isUploading}
								onClick={onRemove}
							>
								Remover
							</Button>
						</div>
					) : null}
				</div>
			)}

			{rejectionMessage ? (
				<p className="text-body-sm text-destructive">{rejectionMessage}</p>
			) : null}

			{error ? <p className="text-body-sm text-destructive">{error}</p> : null}
		</div>
	);
}
