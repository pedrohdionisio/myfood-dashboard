function applyPattern(digits: string, pattern: string): string {
	let result = '';
	let digitIndex = 0;

	for (const patternChar of pattern) {
		if (digitIndex >= digits.length) {
			break;
		}

		if (patternChar === '#') {
			result += digits[digitIndex];
			digitIndex += 1;

			continue;
		}

		result += patternChar;
	}

	return result;
}

function remove(value: string): string {
	return value.replace(/\D/g, '');
}

function cnpj(value: string): string {
	return applyPattern(remove(value), '##.###.###/####-##');
}

function zipCode(value: string): string {
	return applyPattern(remove(value), '#####-###');
}

function phone(value: string): string {
	const digits = remove(value);

	return applyPattern(digits, digits.length > 10 ? '(##) #####-####' : '(##) ####-####');
}

export const Mask = {
	remove,
	cnpj,
	zipCode,
	phone
};
