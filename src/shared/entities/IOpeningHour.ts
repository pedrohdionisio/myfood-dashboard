export interface IShift {
	dayOfWeek: number;
	opensAt: string;
	closesAt: string;
}

export interface IOpeningHour extends IShift {
	id: string;
}
