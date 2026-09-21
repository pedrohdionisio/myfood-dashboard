import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import { ImageInput } from 'presentation/components/ImageInput/ImageInput';
import type { IRestaurantImagesFormProps } from './RestaurantImagesFormTypes';
import { useRestaurantImagesFormController } from './useRestaurantImagesFormController';

const IMAGE_OUTPUT_WIDTH = 1280;

export function RestaurantImagesForm({ restaurant }: IRestaurantImagesFormProps) {
	const { logoUrl, bannerUrl, isSavingLogo, isSavingBanner, handleSelectImage, handleRemoveImage } =
		useRestaurantImagesFormController({ restaurant });

	return (
		<Card>
			<CardHeader>
				<CardTitle>Imagens da loja</CardTitle>

				<CardDescription>
					A logo identifica o restaurante nas listas e o banner abre a página dele.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-6 lg:grid-cols-[2fr_3fr]">
				<ImageInput
					label="Logo"
					hint="Quadrada, a partir de 1280px"
					previewUrl={logoUrl}
					aspect={1}
					outputWidth={IMAGE_OUTPUT_WIDTH}
					isUploading={isSavingLogo}
					disabled={isSavingLogo}
					onSelect={(file) => handleSelectImage('RESTAURANT_LOGO', file)}
					onRemove={() => handleRemoveImage('RESTAURANT_LOGO')}
				/>

				<ImageInput
					label="Banner"
					hint="16:9, a partir de 1280px de largura"
					previewUrl={bannerUrl}
					aspect={16 / 9}
					outputWidth={IMAGE_OUTPUT_WIDTH}
					isUploading={isSavingBanner}
					disabled={isSavingBanner}
					onSelect={(file) => handleSelectImage('RESTAURANT_BANNER', file)}
					onRemove={() => handleRemoveImage('RESTAURANT_BANNER')}
				/>
			</CardContent>
		</Card>
	);
}
