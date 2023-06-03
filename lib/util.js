export function makeSerializable(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export const fetcher = (...args) => fetch(...args).then((res) => res.json());
