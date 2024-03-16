import { pingServer } from '$lib/pingServer';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export async function load() {
	if (browser) {
		const token = window.localStorage.getItem('accessToken');
		const loggedIn = await pingServer(token);
		if (loggedIn) throw redirect(303, '/');
	}
}
