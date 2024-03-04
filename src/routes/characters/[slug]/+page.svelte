<script>
	import { Card, CardBody, CardHeader, CardText, CardTitle } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { Button, Spinner, Alert } from '@sveltestrap/sveltestrap';
	import { baseUrl, characteristics, skills } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let tab = 'overview';

	let character = {};
	let owner = false;

	let open = false;
	let status = 'loading';

	onMount(async () => {
		const token = window.localStorage.getItem("accessToken");
		const res = await fetch(baseUrl + `api/characters/${$page.params.slug}`, {
			headers: {
				Authorization: token ? ('Bearer ' + token) : null,
			}
		});
		if (res.status !== 200) {
			window.location.replace('/');
		}

		const json = await res.json();

		character = json.character;
		character.derived = json.derivedStats;

		owner = json.userId == window.localStorage.getItem('id');

		status = '';
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
				<TabPane tabId="overview" tab="Overview" active>
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
				<TabPane tabId="stats" tab="Stats">
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
						{#each characteristics as char}
							<div>
								<h5>{char.abbrev}</h5>
								{character.stats[char.stat]}
							</div>
						{/each}
					</div>
					<h3>Skills</h3>
					<div id="skills">
						{#each skills as { stat, name, advanced, type }}
							<div>
								<h5>
									{name}{#if advanced}*{/if}
								</h5>
								{character.stats[`${type}Skills`][stat]}
							</div>
						{/each}
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
{:else if status === 'loading'}
<h1>Loading...</h1>
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
		grid-template-rows: repeat(3, 1fr);
		grid-auto-flow: column;
		gap: 2px;
	}
	#characteristics > div,
	#skills > div {
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
