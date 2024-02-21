<script>
	import { Card, CardHeader, CardTitle, CardBody, CardText } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Button, InputGroup, InputGroupText, Input, Form } from '@sveltestrap/sveltestrap';
	import { Styles, Icon } from '@sveltestrap/sveltestrap';
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
		const field = e.target.dataset.field;
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

	const submit = (e) => {
		e.preventDefault();
		console.log('test');
	};
</script>

<Form on:submit={submit}>
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
					<Button color="success">Submit</Button>
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
	.margin {
		margin-top: 0.5em;
	}
</style>
