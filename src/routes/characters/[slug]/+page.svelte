<script>
	import { Card, CardBody, CardHeader, CardText, CardTitle } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import { Modal, ModalFooter } from '@sveltestrap/sveltestrap';
	import { Button, Spinner, Alert } from '@sveltestrap/sveltestrap';
	import { baseUrl } from '$lib/stores.js';
	let tab = 'overview';

	export let data;
	let open = false;
	let status = '';

	const toggleDeletePrompt = () => {
		open = !open;
	};
	const deleteCharacter = async (e) => {
		e.preventDefault();
		status = 'deleting';
		toggleDeletePrompt();

		const res = await fetch(baseUrl + `api/characters/${data.character.id}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
			}
		});

		if (res.status === 204) status = 'deleted';
		else status = `delete res: ${res.status}`;
	};
</script>

<Modal body header="Delete {data.character.name}?" isOpen={open} toggle={toggleDeletePrompt}>
	Are you sure you want to delete this character? This operation cannot be reversed!<br />
	<ModalFooter>
		<Button color="danger" on:click={deleteCharacter}>
			Yes: Delete {data.character.name}
		</Button>
		<Button color="secondary" on:click={toggleDeletePrompt}>No: Cancel Deletion</Button>
	</ModalFooter>
</Modal>

{#if status === ''}
	<Card>
		<CardHeader>
			<CardTitle>
				{data.character.name}
			</CardTitle>
			{#if data.character.age}
				<CardText>{data.character.age} years old</CardText>
			{/if}
		</CardHeader>
		<CardBody>
			<TabContent on:tab={(e) => (tab = e.detail)}>
				<TabPane tabId="overview" tab="Overview" active>
					<ul id="overview-list">
						<li><strong>Race: </strong>{data.character.race}<br /></li>
						<li><strong>Current Class: </strong>{data.character.currentClass}</li>
						<li><strong>Exaltation: </strong>{data.character.exaltation}</li>
						<li><strong>Alignment: </strong>{data.character.alignment || 'None'}</li>
					</ul>
                    {#if data.owner}
                    <Button href="/characters/{data.character.id}/edit" color="warning">Edit</Button>
					<Button on:click={toggleDeletePrompt} color="danger">Delete</Button>
                    {/if}
				</TabPane>
				<TabPane tabId="stats" tab="Stats">Stats will go here</TabPane>
			</TabContent>
		</CardBody>
	</Card>
{:else if status === 'deleting'}
	<Alert color="info">
		<Spinner color="info" />&nbsp;&nbsp;
		<h3 style="display: inline">{data.character.name} is being deleted.</h3>
	</Alert>
{:else if status == 'deleted'}
	<Alert color="success" heading="{data.character.name} was deleted" />
	<Button href="/characters" color="primary">Back to My Characters</Button>
{:else if status == 'delete res: 401'}
	<Alert color="danger" heading="You cannot delete someone else's character!" />
	<Button href="/characters" color="primary">Back to My Characters</Button>
{:else}
	<Alert color="danger" heading="Something went wrong">Please try again later</Alert>
	<Button href="/characters" color="primary">Back to My Characters</Button>
{/if}

<style>
	#overview-list {
		list-style-type: '\27BB\00A0';
	}
</style>
