<script>
	import { baseUrl } from '$lib/stores.js';
	import { browser } from '$app/environment';

	const signup = async (e) => {
		e.preventDefault();

		if (browser) {
			const data = new FormData(e.target);

			const dataObj = {
				username: data.get('username'),
				password: data.get('password')
			};

			const res = await fetch(baseUrl + 'api/auth/signup', {
				method: 'POST',
				body: JSON.stringify(dataObj),
				headers: {
					'content-type': 'application/json'
				}
			});

			if (res.status === 200) {
				window.location.replace('/login');
			}
		}
	};
</script>

<h1>Sign Up</h1>
<form method="POST" on:submit={signup}>
	<label>Username:<input name="username" /></label><br />
	<label>Password:<input name="password" type="password" /></label><br />
	<input type="submit" value="Sign Up" />
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
