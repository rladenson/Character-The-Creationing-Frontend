<script>
	import { Card, CardHeader, CardTitle, CardBody, CardText } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Button, InputGroup, InputGroupText, Input, Form } from '@sveltestrap/sveltestrap';
	import { Styles, Icon, Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import { baseUrl, characteristics } from '$lib/stores.js';
	import { page } from '$app/stores';
	import { shallowCopyObj as copy } from '$lib/shallowCopyObj.js';
	import { createPatch } from 'rfc6902';
	let tab = 'overview';
	let character = { stats: {} };
	let characterBase = { stats: {} };
	let overviewFields = [
		['name', 'Name', true],
		['age', 'Age', false],
		['race', 'Race', true],
		['exaltation', 'Exaltation', true],
		['alignment', 'Alignment', false],
		['currentClass', 'Class', true],
		['completedClasses', 'Completed Classes*', false]
	];
	const globalStyle = '<style>input::placeholder{font-style:italic}</style>';

	const reset = (e) => {
		e.preventDefault();
		let target = e.target;
		if (target.nodeName === 'I') target = target.parentElement;
		const field = target.dataset.field;
		character[field] = characterBase[field];
	};

	const resetStat = (e) => {
		e.preventDefault();
		let target = e.target;
		if (target.nodeName === 'I') target = target.parentElement;
		const field = target.dataset.field;
		character.stats[field] = characterBase.stats[field];
	};

	onMount(async () => {
		const res = await fetch(baseUrl + `api/characters/${$page.params.slug}`, {
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
			}
		});
		if (res.status !== 200) {
			throw res.status;
		}

		const json = await res.json();
		const char = json.character;

		if (json.userId != window.localStorage.getItem('id'))
			window.location.replace(`/characters/${char.id}`);

		characterBase = char;
		characterBase.completedClasses =
			characterBase.completedClasses && characterBase.completedClasses.length > 0
				? characterBase.completedClasses.reduce((prev, cur) => {
						if (prev) prev += ', ' + cur;
					})
				: '';

		character = copy(characterBase);

		console.log(character);
	});

	let summaryOpen = false;
	let validated = false;
	let changed = false;
	let patch = [];
	let statsPatch = [];
	$: changed = JSON.stringify(character) === JSON.stringify(characterBase);
	let errorOpen = false;
	let errors = [];
	const errorToggle = () => (errorOpen = !errorOpen);
	const summaryToggle = () => {
		if (summaryOpen) return (summaryOpen = false);
		errors = [];
		patch = [];
		statsPatch = [];
		overviewFields.forEach(([field, name, required]) => {
			if (['completedClasses'].indexOf(field) !== -1) return;
			let newVal = character[field];
			if (typeof newVal === 'string') newVal = newVal.trim();
			const oldVal = characterBase[field];

			if (newVal === '') {
				if (required) return errors.push(name);
				if (oldVal === null) return;
				return patch.push({ op: 'remove', path: `/${field}` });
			}
			if (oldVal == newVal) return;
			patch.push({ op: 'replace', path: `/${field}`, value: newVal });
		});
		getClassesPatch();
		characteristics.forEach(({ stat }) => {
			let newVal = Number(character.stats[stat]);
			newVal = Number(newVal);
			if (isNaN(newVal) || newVal < 1) return errors.push(stat);

			const oldVal = Number(characterBase.stats[stat]);

			if (oldVal == newVal) return;
			statsPatch.push({ op: 'replace', path: `/${stat}`, value: newVal });
		});
		if (errors.length > 0) return (errorOpen = true);
		if (patch.length === 0 && statsPatch.length === 0) return;
		summaryOpen = true;
	};

	const getClassesPatch = () => {
		const oldClasses =
			characterBase.completedClasses !== '' ? characterBase.completedClasses.split(/, ?/) : '';
		const midClasses = character.completedClasses.split(/, ?/);
		if (JSON.stringify(oldClasses) === JSON.stringify(midClasses)) return;
		const newClasses = [];
		midClasses.forEach((val) => {
			val = val.trim();
			if (val === '') return;
			newClasses.push(val);
		});
		const classesPatch = createPatch(
			{ completedClasses: oldClasses },
			{ completedClasses: newClasses }
		);
		if (classesPatch.length > 0) patch.push(...classesPatch);
	};

	const submit = async (e) => {
		if (patch.length === 0 && statsPatch.length === 0) return;
		const statuses = [];
		const reses = [];
		if (patch.length > 0) {
			const res = await fetch(`${baseUrl}api/characters/${characterBase.id}`, {
				method: 'PATCH',
				body: JSON.stringify(patch),
				headers: {
					Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
					'Content-Type': 'application/json-patch+json'
				}
			});
			reses.push(res);
			statuses.push(res.status);
		}
		if (statsPatch.length > 0) {
			const res = await fetch(`${baseUrl}api/characters/${characterBase.id}/stats`, {
				method: 'PATCH',
				body: JSON.stringify(statsPatch),
				headers: {
					Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
					'Content-Type': 'application/json-patch+json'
				}
			});
			reses.push(res);
			statuses.push(res.status);
		}

		if (statuses.every((val) => val === 200)) {
			window.location.replace(`/characters/${characterBase.id}`);
		} else {
			console.log(reses);
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
		{#each characteristics as { stat, name }}
			{#if character.stats[stat] != characterBase.stats[stat]}
				<li>
					<strong>{name}: </strong>
					{characterBase.stats[stat]}
					<Icon name="arrow-right" />
					{#if character.stats[stat] && character.stats[stat] !== ''}
						{character.stats[stat]}
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
						{#each overviewFields as [field, name, required]}
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
					<Button type="submit" color="success" disabled={changed}>Submit</Button><br />
					<small>*Separate with commas</small>
				</TabPane>
				<TabPane tabId="stats" tab="Stats">
					<h4>Characteristics</h4>
					<div id="characteristicsGrid">
						{#each characteristics as {stat, name}}
							<div>
								<h5>{name}</h5>
								<InputGroup>
									<Input
										style="text-align:center"
										placeholder={characterBase.stats[stat]}
										bind:value={character.stats[stat]}
										required
									/>
									<Button on:click={resetStat} data-field={stat} style="border-top-right-radius:0">
										<Icon name="arrow-counterclockwise" />
									</Button>
								</InputGroup>
							</div>
						{/each}
					</div>
					<br />
					<Button href="/characters/{characterBase.id}">Cancel</Button>
					<Button type="submit" color="success" disabled={changed}>Submit</Button>
				</TabPane>
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
	#characteristicsGrid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		grid-auto-flow: column;
		gap: 2px;
	}
	#characteristicsGrid > * {
		text-align: center;
		border: 1px solid rgba(200, 200, 200, 1);
		border-radius: 10px;
	}
</style>
