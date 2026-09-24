import { useQuery } from '@tanstack/react-query';
import { CuisineQueryKeys } from 'data/modules/cuisines/keys/CuisineKeys';
import { CuisinesService } from 'data/modules/cuisines/services/CuisinesService';

const CATALOG_STALE_TIME_MS = 60 * 60 * 1000;

export function useCuisineCatalog() {
	const { data, isLoading, error } = useQuery({
		queryKey: [CuisineQueryKeys.CUISINE_CATALOG],
		queryFn: CuisinesService.listCatalog,
		staleTime: CATALOG_STALE_TIME_MS
	});

	return {
		cuisineCatalog: data ?? [],
		isLoadingCuisineCatalog: isLoading,
		cuisineCatalogError: error
	};
}
