export function localeISODate(dt = new Date()) {
	const offset = dt.getTimezoneOffset() * 60000;
	const localDt = new Date(dt.getTime() - offset);
	const isoString = localDt.toISOString();
	return isoString;
}
