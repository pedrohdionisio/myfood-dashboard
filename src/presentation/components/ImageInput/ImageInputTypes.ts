export interface IImageInputProps {
	label?: string;
	hint?: string;
	previewUrl: string | null;
	aspect: number;
	outputWidth: number;
	disabled?: boolean;
	isUploading?: boolean;
	error?: string;
	onSelect: (file: Blob) => void;
	onRemove: () => void;
	onCroppingChange?: (isCropping: boolean) => void;
}

export interface IUseImageInputControllerParams {
	previewUrl: string | null;
	outputWidth: number;
	disabled?: boolean;
	onSelect: (file: Blob) => void;
	onCroppingChange?: (isCropping: boolean) => void;
}
