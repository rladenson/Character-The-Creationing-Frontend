<script lang="ts">
	import { Form, Button, Modal } from '@sveltestrap/sveltestrap';
	import { shallowCopyObj as copy } from '$lib/shallowCopyObj.js';
	import Characteristics from './Characteristics.svelte';
	import Overarching from './Overarching.svelte';
	import Skills from './Skills.svelte';
	import { baseUrl } from '$lib/stores.js';
	import Misc from './Misc.svelte';
	import { Character } from '$lib/characterTypes';

	let validated = false;
	let page = 1;
	const maxPage = 4;
	const characterBase = new Character();
	const recordBase = {
		primary: 'Mental',
		secondary: 'Physical',
		tertiary: 'Social'
	};
	let character = new Character();
	let record = copy(recordBase);
	let nextAction: string | undefined;
	let open = false;
	const toggle = () => (open = !open);

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		switch (nextAction) {
			case '+':
				if (document.querySelector('.is-invalid')) {
					return toggle();
				}
				if (page < maxPage) page++;
				validated = false;
				break;
			case '-':
				if (page > 1) page--;
				validated = false;
				break;
			case '>':
				submitForm();
				break;
		}
	};
	const submitForm = async () => {
		const res = await fetch(baseUrl + 'api/characters/new', {
			method: 'POST',
			body: JSON.stringify(character),
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
				'Content-Type': 'application/json'
			}
		});
		if (res.status === 201)
			window.location.replace(`/characters/${(await res.json()).character.id}`);
		else console.log(res);
	};
	const handleClick = (e: Event) => {
		nextAction = (<HTMLElement>e.target!).dataset.action;
		if (page !== 2) {
			validated = true;
		}
	};
	const resetProgress = (e: Event) => {
		e.preventDefault();
		character = copy(characterBase);
		record = copy(recordBase);
		page = 1;
		validated = false;
	};
</script>

<Modal body header="Errors Present" isOpen={open} {toggle}>
	Please fix errors before proceeding
</Modal>
<Form {validated} on:submit={handleSubmit}>
	<h1>New Character</h1>
	{#if page === 1}
		<Overarching bind:character />
	{:else if page === 2}
		<Characteristics bind:character bind:record />
	{:else if page === 3}
		<Skills bind:character bind:record />
	{:else if page === 4}
		<Misc bind:character bind:record />
	{/if}
	<Button type="submit" on:click={handleClick} data-action="-" disabled={page <= 1}>
		Previous Page
	</Button>
	<Button type="submit" on:click={handleClick} data-action="+" disabled={page >= maxPage}>
		Next Page
	</Button>
	<Button on:click={resetProgress}>Reset Progress</Button>
	<Button on:click={handleClick} data-action=">" hidden={page === maxPage ? null : true}>
		Submit
	</Button>
</Form>
