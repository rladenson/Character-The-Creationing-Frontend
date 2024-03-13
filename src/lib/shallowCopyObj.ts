export function shallowCopyObj(base: object) {
	const obj = { ...base };
	for (const [key, val] of Object.entries(base)) {
		if (typeof val === 'object' && val !== null) {
			(obj as IIndexable)[key] = shallowCopyObj(val);
		}
	}
	return obj;
}

interface IIndexable<T = any> {
	[key: string]: T;
}
