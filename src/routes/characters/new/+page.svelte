<script>
	import { Form, Button } from '@sveltestrap/sveltestrap';
	import { shallowCopyObj as copy } from '$lib/shallowCopyObj.js';
	import Characteristics from './Characteristics.svelte';
	import Flavor from './Flavor.svelte';

	let validated = false;
	let page = 1;
	const maxPage = 3;
	const characterBase = {
		characteristics: {
			intelligence: 1,
			wisdom: 1,
			willpower: 1,
			strength: 1,
			dexterity: 1,
			constitution: 1,
			charisma: 1,
			fellowship: 1,
			composure: 1
		}
	};
	let character = copy(characterBase);
	let nextAction = '';

	const handleSubmit = (e) => {
		e.preventDefault();
		switch (nextAction) {
			case '+':
				if (page < maxPage) page++;
				validated = false;
				break;
			case '-':
				if (page > 1) page--;
				validated = false;
				break;
		}
		if (page === 2) {
			validated = true;
		}
	};
	const handleClick = (e) => {
		nextAction = e.target.dataset.action;
		validated = true;
	};
	const resetProgress = (e) => {
		e.preventDefault();
		character = copy(characterBase);
		page = 1;
		validated = false;
	};
</script>

<Form {validated} on:submit={handleSubmit}>
	<h1>New Character</h1>
	{#if page === 1}
		<Flavor bind:character />
	{:else if page === 2}
		<Characteristics bind:character />
	{/if}
	<Button type="submit" on:click={handleClick} data-action="-" disabled={page <= 1}>
		Previous Page
	</Button>
	<Button type="submit" on:click={handleClick} data-action="+" disabled={page >= maxPage}>
		Next Page
	</Button>
	<Button on:click={resetProgress}>Reset Progress</Button>
</Form>
