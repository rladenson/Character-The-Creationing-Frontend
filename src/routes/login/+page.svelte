<script>
	import { baseUrl } from '$lib/stores.js';
	import { browser } from '$app/environment';
	const login = async (e) => {
		e.preventDefault();
		if (browser) {
			const data = new FormData(e.target);

			const dataObj = {
				username: data.get('username'),
				password: data.get('password')
			};

			const res = await fetch(baseUrl + 'api/auth/signin', {
				method: 'POST',
				body: JSON.stringify(dataObj),
				headers: {
					'content-type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});

			if (res.status === 200) {
				const json = await res.json();
				for (const [key, val] of Object.entries(json)) {
					window.localStorage.setItem(key, val);
				}
				window.location.replace('/');
			}
		}
	};
</script>

<h1>Login</h1>
<form method="POST" on:submit={login}>
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
