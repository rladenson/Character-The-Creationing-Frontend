<script>
	import { Card, CardHeader, CardTitle, CardBody, CardText } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Button, InputGroup, InputGroupText, Input, Form } from '@sveltestrap/sveltestrap';
	import { Styles, Icon, Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import { baseUrl } from '$lib/stores.js';
	import { page } from '$app/stores';
	import { shallowCopyObj as copy } from '$lib/shallowCopyObj.js';
	let tab = 'overview';
	let character = {};
	let characterBase = {};
	let overviewFields = [
		['race', 'Race', true],
		['currentClass', 'Class', true],
		['exaltation', 'Exaltation', true],
		['alignment', 'Alignment', false],
		['age', 'Age', false],
		['name', 'Name', true]
	];
	const globalStyle = '<style>input::placeholder{font-style:italic}</style>';

	const reset = (e) => {
		e.preventDefault();
		let target = e.target;
		if (target.nodeName === 'I') target = target.parentElement;
		const field = target.dataset.field;
		character[field] = characterBase[field];
	};

	onMount(async () => {
		const res = await fetch(baseUrl + `api/characters/${$page.params.slug}`, {
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
			}
		});
		if (res.status !== 200) {
			throw error(res.status);
		}

		const json = await res.json();
		const char = json.comprehensiveCharacter;

		if (char.userId != window.localStorage.getItem('id'))
			window.location.replace(`/characters/${char.id}`);

		characterBase = char;
		character = copy(characterBase);
	});

	let summaryOpen = false;
	let validated = false;
	let changed = false;
	let patch = [];
	$: changed = JSON.stringify(character) === JSON.stringify(characterBase);
	let errorOpen = false;
	let errors = [];
	const errorToggle = () => (errorOpen = !errorOpen);
	const summaryToggle = () => {
		if (summaryOpen) return (summaryOpen = false);
		errors = [];
		patch = [];
		overviewFields.forEach(([field, name, required]) => {
			let newVal = character[field];
			if (typeof newVal === 'string') newVal = newVal.trim();
			const oldVal = characterBase[field];

			if (newVal === '') {
				if (required) errors.push(name);
				if (oldVal === null) return;
				return patch.push({ op: 'remove', path: `/${field}` });
			}
			if (oldVal == newVal) return;
			patch.push({ op: 'replace', path: `/${field}`, value: newVal });
		});
		if (errors.length > 0) return (errorOpen = true);
		if (patch.length === 0) return;
		summaryOpen = true;
	};

	const submit = async (e) => {
		console.log(JSON.stringify(patch));
		const res = await fetch(`${baseUrl}api/characters/${characterBase.id}`, {
			method: 'PATCH',
			body: JSON.stringify(patch),
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
				'Content-Type': 'application/json-patch+json'
			}
		});

		if (res.status === 200) {
			window.location.replace(`/characters/${characterBase.id}`);
		} else {
			console.log(res);
		}
	};
</script>

<Modal
	isOpen={errorOpen}
	toggle={errorToggle}
	header="The following items have errors"
	body
	scrollable
>
	{#each errors as error}
		{error},&nbsp;
	{/each}
</Modal>
<Modal isOpen={summaryOpen} toggle={summaryToggle} header="Confirm Submission?" body scrollable>
	<ul id="summary-list">
		{#each overviewFields as [field, name]}
			{#if character[field] != characterBase[field]}
				<li>
					<strong>{name}: </strong>
					{characterBase[field]}
					<Icon name="arrow-right" />
					{#if character[field] && character[field] !== ''}
						{character[field]}
					{:else}
						<i>&lt;blank&gt;</i>
					{/if}
				</li>
			{/if}
		{/each}
	</ul>
	<ModalFooter>
		<Button on:click={summaryToggle}>Cancel</Button>
		<Button on:click={submit} color="success">Submit Changes</Button>
	</ModalFooter>
</Modal>

<Form {validated} on:submit={summaryToggle}>
	<Card>
		<CardHeader>
			<CardTitle>
				{characterBase.name}
			</CardTitle>
			{#if characterBase.age}
				<CardText>{characterBase.age} years old</CardText>
			{/if}
		</CardHeader>
		<CardBody>
			<TabContent on:tab={(e) => (tab = e.detail)}>
				<TabPane tabId="overview" tab="Overview" active>
					<ul id="overview-list">
						{#each overviewFields.sort((a, b) => a[0] > b[0]) as [field, name, required]}
							<li class="margin">
								<InputGroup>
									<InputGroupText>
										<strong>{name}: </strong>
									</InputGroupText>
									<Input
										id={field}
										placeholder={characterBase[field] || '<blank>'}
										bind:value={character[field]}
										{required}
									/>
									<Button on:click={reset} data-field={field}>
										<Icon name="arrow-counterclockwise" />
									</Button>
								</InputGroup>
							</li>
						{/each}
					</ul>
					<Button href="/characters/{characterBase.id}">Cancel</Button>
					<Button type="submit" color="success" disabled={changed}>Submit</Button>
				</TabPane>
				<TabPane tabId="stats" tab="Stats">Stats will go here</TabPane>
			</TabContent>
		</CardBody>
	</Card>
</Form>

<Styles />

{@html globalStyle}

<style>
	#overview-list {
		list-style: none;
		padding-left: unset;
	}
	#summary-list {
		list-style-type: '\27BB\00A0';
	}
	.margin {
		margin-top: 0.5em;
	}
</style>
