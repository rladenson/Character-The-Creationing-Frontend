import { type IIndexable } from "./types";

export const shallowCopyObj: any = (base: object) => {
	const obj = { ...base };
	for (const [key, val] of Object.entries(base)) {
		if (typeof val === 'object' && val !== null) {
			(obj as IIndexable)[key] = shallowCopyObj(val);
		}
	}
	return obj;
}