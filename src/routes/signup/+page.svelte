<script lang="ts">
	import { baseUrl } from '$lib/stores';
	import { browser } from '$app/environment';

	const signup = async (e: Event) => {
		e.preventDefault();

		if (browser) {
			const form: HTMLFormElement | null = document.querySelector('form#signup-form');
			if (!form) return;
			const data = new FormData(form);

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
<form method="POST" on:submit={signup} id="signup-form">
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
