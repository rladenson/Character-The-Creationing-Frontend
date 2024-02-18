import { baseUrl } from './stores';
import { browser } from '$app/environment';

export async function pingServer(token) {
	if (browser) {
		if (token) {
			const res = await fetch(baseUrl + 'greeting', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (res.status === 200) {
				return true;
			}
			localStorage.clear();
		}
	}
	return false;
}
