<script lang="ts">
	import { baseUrl } from '$lib/stores';
	import { browser } from '$app/environment';
	const login = async (e: Event) => {
		e.preventDefault();
		if (browser) {
			const form: HTMLFormElement | null = document.querySelector('form#signin-form');
			if (!form) return;
			const data = new FormData(form);

			const dataObj = {
				username: data.get('username'),
				password: data.get('password')
			};

			const res = await fetch(baseUrl + 'api/auth/signin', {
				method: 'POST',
				body: JSON.stringify(dataObj),
				headers: {
					'content-type': 'application/json'
				}
			});

			if (res.status === 200) {
				const json: object = await res.json();
				for (const [key, val] of Object.entries(json)) {
					window.localStorage.setItem(key, val);
				}
				window.location.replace('/');
			}
		}
	};
</script>

<h1>Login</h1>
<form method="POST" on:submit={login} id="signin-form">
	<label>Username:<input name="username" /></label><br />
	<label>Password:<input name="password" type="password" /></label><br />
	<input type="submit" value="Login" />
</form>

<style>
	form > * {
		margin-left: 1em;
		margin-bottom: 0.5em;
	}
	label > input {
		margin-left: 0.5em;
	}
</style>
