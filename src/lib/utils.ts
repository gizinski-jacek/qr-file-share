export const padNumber = (x: number): string => {
	return x.toString().padStart(2, '0');
};

export const convertMsToCountdown = (value: number): string => {
	const ms = value % 1000;
	value = (value - ms) / 1000;
	const secs = value % 60;
	value = (value - secs) / 60;
	const mins = value % 60;

	return padNumber(mins) + ':' + padNumber(secs);
};
