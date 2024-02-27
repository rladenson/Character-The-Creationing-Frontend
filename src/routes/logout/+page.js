import { browser } from '$app/environment';

export async function load() {
	if (browser) {
		window.localStorage.clear();
		return {};
	}
}
