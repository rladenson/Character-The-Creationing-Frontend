<script>
	import { Card, CardBody, CardHeader, CardText, CardTitle } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { Button, Spinner, Alert } from '@sveltestrap/sveltestrap';
	import { baseUrl } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let tab = 'overview';

	let character = { stats: {}, derived: {} };
	let owner = false;

	let open = false;
	let status = '';

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

		character = json.character;
		character.derived = json.derivedStats;

		owner = json.userId == window.localStorage.getItem('id');

		console.log(character);
	});

	const toggleDeletePrompt = () => {
		open = !open;
	};
	const deleteCharacter = async (e) => {
		e.preventDefault();
		status = 'deleting';
		toggleDeletePrompt();

		const res = await fetch(baseUrl + `api/characters/${character.id}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
			}
		});

		if (res.status === 204) status = 'deleted';
		else status = `delete res: ${res.status}`;
	};
</script>

<Modal body header="Delete {character.name}?" isOpen={open} toggle={toggleDeletePrompt}>
	Are you sure you want to delete this character? This operation cannot be reversed!<br />
	<ModalFooter>
		<Button color="danger" on:click={deleteCharacter}>
			Yes: Delete {character.name}
		</Button>
		<Button color="secondary" on:click={toggleDeletePrompt}>No: Cancel Deletion</Button>
	</ModalFooter>
</Modal>

{#if status === ''}
	<Card>
		<CardHeader>
			<CardTitle>
				{character.name}
			</CardTitle>
			{#if character.age}
				<CardText>{character.age} years old</CardText>
			{/if}
		</CardHeader>
		<CardBody>
			<TabContent on:tab={(e) => (tab = e.detail)}>
				<TabPane tabId="overview" tab="Overview">
					<ul class="list">
						<li><strong>Race: </strong>{character.race}<br /></li>
						<li><strong>Current Class: </strong>{character.currentClass}</li>
						<li>
							<strong>Exaltation: </strong>{character.exaltation}
							<ul>
								<li><strong>Power Stat: </strong>{character.power}</li>
								<li><strong>Resource Stat: </strong>{character.resource}</li>
							</ul>
						</li>
						<li><strong>Alignment: </strong>{character.alignment || 'None'}</li>
						<li><strong>Completed Classes: </strong>{character.completedClasses || 'None'}</li>
					</ul>
					{#if owner}
						<Button href="/characters/{character.id}/edit" color="warning">Edit</Button>
						<Button on:click={toggleDeletePrompt} color="danger">Delete</Button>
					{/if}
				</TabPane>
				<TabPane tabId="stats" tab="Stats" active>
					<ul class="list" id="derived">
						<li><strong>Static Defense: </strong>{character.derived.staticDefense}</li>
						<li><strong>Max Hit Points: </strong>{character.derived.maxHP}</li>
						<li><strong>Mental Defense: </strong>{character.derived.mentalDefense}</li>
						<li><strong>Resilience: </strong>{character.derived.resilience}</li>
						<li><strong>Resolve: </strong>{character.derived.resolve}</li>
						<li><strong>Speed: </strong>{character.derived.speed}</li>
						<li><strong>Initiative: </strong>{character.derived.initiative}</li>
					</ul>
					<h3>Characteristics</h3>
					<div id="characteristics">
						<div style="grid-area: 1/1/1/1">
							<h5>INT</h5>
							{character.stats.intelligence}
						</div>
						<div style="grid-area: 2/1/2/1">
							<h5>WIS</h5>
							{character.stats.wisdom}
						</div>
						<div style="grid-area: 3/1/3/1">
							<h5>WIL</h5>
							{character.stats.willpower}
						</div>
						<div style="grid-area: 1/2/1/2">
							<h5>STR</h5>
							{character.stats.strength}
						</div>
						<div style="grid-area: 2/2/2/2">
							<h5>DEX</h5>
							{character.stats.dexterity}
						</div>
						<div style="grid-area: 3/2/3/2">
							<h5>CON</h5>
							{character.stats.constitution}
						</div>
						<div style="grid-area: 1/3/1/3">
							<h5>CHA</h5>
							{character.stats.charisma}
						</div>
						<div style="grid-area: 2/3/2/3">
							<h5>FEL</h5>
							{character.stats.fellowship}
						</div>
						<div style="grid-area: 3/3/3/3">
							<h5>COM</h5>
							{character.stats.composure}
						</div>
					</div>
					<h3>Skills</h3>
					<div id="skills">
						<div>
							<h5>Academic Lore*</h5>
							{character.stats.academicLore}
						</div>
						<div>
							<h5>Arcana*</h5>
							{character.stats.arcana}
						</div>
						<div>
							<h5>Common Lore*</h5>
							{character.stats.commonLore}
						</div>
						<div>
							<h5>Crafts</h5>
							{character.stats.crafts}
						</div>
						<div>
							<h5>Forbidden Lore*</h5>
							{character.stats.forbiddenLore}
						</div>
						<div>
							<h5>Medicae*</h5>
							{character.stats.medicae}
						</div>
						<div>
							<h5>Perception</h5>
							{character.stats.perception}
						</div>
						<div>
							<h5>Politics*</h5>
							{character.stats.politics}
						</div>
						<div>
							<h5>Tech-Use</h5>
							{character.stats.techUse}
						</div>
						<div>
							<h5>Acrobatics*</h5>
						{character.stats.acrobatics}
						</div>
						<div>
							<h5>Athletics</h5>
						{character.stats.athletics}
						</div>
						<div>
							<h5>Drive</h5>
						{character.stats.drive}
						</div>
						<div>
							<h5>Larceny</h5>
						{character.stats.larceny}
						</div>
						<div>
							<h5>Pilot*</h5>
						{character.stats.pilot}
						</div>
						<div>
							<h5>Stealth</h5>
						{character.stats.stealth}
						</div>
						<div>
							<h5>Ballistics</h5>
						{character.stats.ballistics}
						</div>
						<div>
							<h5>Brawl</h5>
						{character.stats.brawl}
						</div>
						<div>
							<h5>Weaponry</h5>
						{character.stats.weaponry}
						</div>
						<div>
							<h5>Animal Ken</h5>
						{character.stats.animalKen}
						</div>
						<div>
							<h5>Charm</h5>
						{character.stats.charm}
						</div>
						<div>
							<h5>Command</h5>
						{character.stats.command}
						</div>
						<div>
							<h5>Deceive</h5>
						{character.stats.deceive}
						</div>
						<div>
							<h5>Disguise</h5>
						{character.stats.disguise}
						</div>
						<div>
							<h5>Intimidation</h5>
						{character.stats.intimidation}
						</div>
						<div>
							<h5>Performer</h5>
						{character.stats.performer}
						</div>
						<div>
							<h5>Persuasion</h5>
						{character.stats.persuasion}
						</div>
						<div>
							<h5>Scrutiny</h5>
						{character.stats.scrutiny}
						</div>
					</div>
					<br />
					{#if owner}
						<Button href="/characters/{character.id}/edit" color="warning">Edit</Button>
						<Button on:click={toggleDeletePrompt} color="danger">Delete</Button>
					{/if}
				</TabPane>
			</TabContent>
		</CardBody>
	</Card>
{:else if status === 'deleting'}
	<Alert color="info">
		<Spinner color="info" />&nbsp;&nbsp;
		<h3 style="display: inline">{character.name} is being deleted.</h3>
	</Alert>
{:else if status == 'deleted'}
	<Alert color="success" heading="{character.name} was deleted" />
	<Button href="/characters" color="primary">Back to My Characters</Button>
{:else if status == 'delete res: 401'}
	<Alert color="danger" heading="You cannot delete someone else's character!" />
	<Button href="/characters" color="primary">Back to My Characters</Button>
{:else}
	<Alert color="danger" heading="Something went wrong">Please try again later</Alert>
	<Button href="/characters" color="primary">Back to My Characters</Button>
{/if}

<style>
	.list {
		list-style-type: '\27BB\00A0';
	}
	.list ul {
		list-style-type: '\27B3\00A0';
	}
	#characteristics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
	}
	#characteristics > div, #skills > div {
		text-align: center;
		border: 1px solid rgba(200, 200, 200, 1);
		border-radius: 10px;
	}
	#derived {
		column-count: 2;
		column-gap: 3em;
	}
	#skills {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(9, 1fr);
		grid-auto-flow: column;
		gap: 2px;
	}
	#skills h5 {
		margin: 3px;
		font-size: 14pt;
	}
</style>
