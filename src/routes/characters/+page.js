import { baseUrl } from '$lib/stores.js';

export async function load({ fetch }) {
	const data = await fetch(baseUrl + 'api/characters', {
		headers: {
			Authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
		}
	});
	return {
		members: (await data.json()).characters
	};
}
