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

function currency(value: string): string {
	const digits = remove(value).slice(0, 11);

	if (digits === '') {
		return '';
	}

	const padded = digits.padStart(3, '0');
	const whole = padded.slice(0, -2).replace(/^0+(?=\d)/, '');
	const fraction = padded.slice(-2);

	return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${fraction}`;
}

export const Mask = {
	remove,
	cnpj,
	zipCode,
	phone,
	currency
};
