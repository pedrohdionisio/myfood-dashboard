const MAX_LENGTH = 22;

export function truncateProductName(productName: string): string {
	if (productName.length <= MAX_LENGTH) {
		return productName;
	}

	return `${productName.slice(0, MAX_LENGTH - 1).trimEnd()}…`;
}
