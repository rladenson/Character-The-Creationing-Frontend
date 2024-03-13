import { browser } from '$app/environment';

export const ssr = false;

export async function load() {
	if (browser) {
		return {
			token: localStorage.getItem('accessToken'),
			done: true
		};
	}
}
