import { Mask } from './Mask';

function checkDigit(digits: string, length: number): number {
	let weight = length - 7;
	let sum = 0;

	for (let index = 0; index < length; index += 1) {
		sum += Number(digits[index]) * weight;
		weight -= 1;

		if (weight < 2) {
			weight = 9;
		}
	}

	const rest = sum % 11;

	return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(value: string): boolean {
	const digits = Mask.remove(value);

	if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) {
		return false;
	}

	return (
		checkDigit(digits, 12) === Number(digits[12]) && checkDigit(digits, 13) === Number(digits[13])
	);
}
