import { useQuery } from '@tanstack/react-query';
import { CuisinesService } from 'data/modules/cuisines/services/CuisinesService';
import { CuisineQueryKeys } from '../../keys/CuisineKeys';

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
