import { baseUrl } from '$lib/stores.js';
import { pingServer } from '$lib/pingServer.js';

export async function load({ fetch }) {
	const token = window.localStorage.getItem('accessToken');
	if (!token) throw redirect(303, '/');
	const loggedIn = await pingServer(token);
	if (!loggedIn) throw redirect(303, '/');
	
	const data = await fetch(baseUrl + 'api/characters', {
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	return {
		members: (await data.json()).characters
	};
}
