<script>
	import { Card, CardBody, CardHeader, CardText, CardTitle } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { Button, Spinner, Alert } from '@sveltestrap/sveltestrap';
	import { baseUrl } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let tab = 'overview';

	let character = {stats: {}};
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

		owner = json.userId == window.localStorage.getItem('id')
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
					<h4>Characteristics</h4>
					<div id="grid">
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
	#grid {
		display: grid;
		grid-template-columns: repeat(3, fr);
		gap: 2px;
	}
	#grid > * {
		text-align: center;
		border: 1px solid rgba(200, 200, 200, 1);
		border-radius: 10px;
	}
</style>
