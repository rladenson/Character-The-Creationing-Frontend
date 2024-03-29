<script lang="ts">
	import { Card, CardHeader, CardTitle, CardBody, CardText } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Button, InputGroup, InputGroupText, Input, Form } from '@sveltestrap/sveltestrap';
	import { Styles, Icon, Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import { baseUrl, characteristics, skills } from '$lib/stores';
	import { Character } from '$lib/characterTypes';
	import { page } from '$app/stores';
	import { createPatch } from 'rfc6902';
	import type { Operation } from 'rfc6902/diff.d.ts';
	let tab = 'overview';
	let character: Character = new Character();
	let characterBase: Character = character;
	type overviewField = [field: string, name: string, required: boolean, type: string];
	let overviewFields: overviewField[] = [
		['name', 'Name', true, 'string'],
		['age', 'Age', false, 'number'],
		['race', 'Race', true, 'string'],
		['exaltation', 'Exaltation', true, 'string'],
		['alignment', 'Alignment', false, 'string'],
		['currentClass', 'Class', true, 'string'],
		['completedClasses', 'Completed Classes*', false, 'array']
	];
	const globalStyle = '<style>input::placeholder{font-style:italic}</style>';

	const reset = (e: Event) => {
		e.preventDefault();
		let target: HTMLElement | null = <HTMLElement>e.target;
		if (target?.nodeName === 'I') target = target?.parentElement;
		const field = target?.dataset.field;
		if (!field) return;
		character[field] = characterBase[field];
	};

	const resetStat = (e: Event) => {
		e.preventDefault();
		let target: HTMLElement | null = <HTMLElement>e.target;
		if (target.nodeName === 'I') target = target.parentElement;
		const field = target?.dataset.field;
		if (!field) return;
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

		characterBase = new Character(char);

		character = new Character(char);
	});

	let summaryOpen = false;
	let validated = false;
	let changed = false;
	let patch: Operation[] = [];
	$: changed = JSON.stringify(character) === JSON.stringify(characterBase);
	let errorOpen = false;
	let errors: string[] = [];
	const errorToggle = () => (errorOpen = !errorOpen);
	let summary: string[][] = [];
	const summaryToggle = () => {
		if (summaryOpen) return (summaryOpen = false);
		const autoPatch = characterBase.createPatch(character);
		getClassesPatch();
		errors = autoPatch.errors;
		summary = autoPatch.summary;
		patch = autoPatch.patch;
		console.log(patch);
		if (errors.length > 0) return (errorOpen = true);
		if (patch.length === 0) return;
		summaryOpen = true;
	};

	const getClassesPatch = () => {
		const oldClasses = characterBase.completedClassesArr;
		character.calculateCompletedClasses();
		const newClasses = character.completedClassesArr;
		if (JSON.stringify(oldClasses) === JSON.stringify(newClasses)) return;
		const classesPatch = createPatch(
			{ completedClasses: oldClasses },
			{ completedClasses: newClasses }
		);
		if (classesPatch.length === 0) return;

		patch.push(...classesPatch);
		summary.push([
			'Completed Classes',
			oldClasses.length > 0 ? oldClasses.join(', ') : 'None',
			newClasses.join(', ')
		]);
	};

	const submit = async (e: Event) => {
		if (patch.length === 0) return;
		const res = await fetch(`${baseUrl}api/characters/${characterBase.id}`, {
			method: 'PATCH',
			body: JSON.stringify(patch),
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
				'Content-Type': 'application/json-patch+json'
			}
		});
		if (res.status === 200) window.location.replace(`/characters/${characterBase.id}`);
		else console.log(res);
	};
</script>

{#if character.stats}
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
			{#each summary as [name, oldVal, newVal]}
				<li>
					<strong>{name}: </strong>{oldVal}
					<Icon name="arrow-right" />
					{#if newVal && newVal !== ''}
						{newVal}
					{:else}
						<i>&lt;blank&gt;</i>
					{/if}
				</li>
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
				<TabContent on:tab={(e) => (tab = e.detail.toString())}>
					<TabPane tabId="overview" tab="Overview" active>
						<ul id="overview-list">
							{#each overviewFields as [field, name, required, type]}
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
											pattern={type === 'number' ? null : '[\\S\\s]*\\S[\\S\\s]*'}
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
							{#each characteristics as { stat, name }}
								<div>
									<h5>{name}</h5>
									<InputGroup>
										<Input
											style="text-align:center"
											placeholder={characterBase.stats[stat].val}
											bind:value={character.stats[stat].val}
											required
											type="number"
										/>
										<Button
											on:click={resetStat}
											data-field={stat}
											style="border-top-right-radius:0"
										>
											<Icon name="arrow-counterclockwise" />
										</Button>
									</InputGroup>
								</div>
							{/each}
						</div>
						<br />
						<h4>Skills</h4>
						<div id="skillsGrid">
							{#each skills as { stat, name, advanced, type }, i}
								<div>
									<h5>
										{name}{#if advanced}*{/if}
									</h5>
									<InputGroup>
										<Input
											style="text-align:center"
											placeholder={characterBase.stats[`${type}Skills`][i % 9].val}
											bind:value={character.stats[`${type}Skills`][i % 9].val}
											required
											type="number"
										/>
										<Button
											on:click={resetStat}
											data-field={stat}
											style="border-top-right-radius:0"
										>
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
{:else}
	<h1>Loading...</h1>
{/if}

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
	#characteristicsGrid,
	#skillsGrid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		grid-auto-flow: column;
		gap: 2px;
	}
	#characteristicsGrid > *,
	#skillsGrid > * {
		text-align: center;
		border: 1px solid rgba(200, 200, 200, 1);
		border-radius: 10px;
	}
	#skillsGrid {
		grid-template-rows: repeat(9, 1fr);
	}
</style>
