export default {
	'*.{ts,tsx,js,json,css,md}': ['biome check --error-on-warnings --no-errors-on-unmatched'],
	'*.{ts,tsx}': () => 'tsc -b'
};
