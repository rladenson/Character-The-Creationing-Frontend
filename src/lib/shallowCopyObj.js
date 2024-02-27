export function shallowCopyObj(base) {
	const obj = { ...base };
	for (const [key, val] of Object.entries(base)) {
		if (typeof val === 'object' && val !== null) {
			obj[key] = shallowCopyObj(val);
		}
	}
	return obj;
}
