import { pingServer } from '$lib/pingServer';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (browser) {
		const token = window.localStorage.getItem('accessToken');
		if (!token) throw redirect(303, '/');
		const loggedIn = await pingServer(token);
		if (!loggedIn) throw redirect(303, '/');
	}
}
