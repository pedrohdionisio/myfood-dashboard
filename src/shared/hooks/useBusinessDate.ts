import { useEffect, useState } from 'react';
import { toBusinessDate } from 'shared/utils/toBusinessDate';

export function useBusinessDate() {
	const [businessDate, setBusinessDate] = useState(() => toBusinessDate(new Date()));

	useEffect(() => {
		const intervalId = setInterval(() => setBusinessDate(toBusinessDate(new Date())), 60_000);

		return () => clearInterval(intervalId);
	}, []);

	return businessDate;
}
