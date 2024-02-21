<script>
	import { Card, CardBody, CardHeader, CardText, CardTitle } from '@sveltestrap/sveltestrap';
	import { TabContent, TabPane } from '@sveltestrap/sveltestrap';
	let status = 'overview';

	export let data;
</script>

<br />
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
		<TabContent on:tab={(e) => (status = e.detail)}>
			<TabPane tabId="overview" tab="Overview" active>
				<ul id="overview-list">
					<li><strong>Race: </strong>{data.character.race}<br /></li>
					<li><strong>Current Class: </strong>{data.character.currentClass}</li>
					<li><strong>Exaltation: </strong>{data.character.exaltation}</li>
					<li><strong>Alignment: </strong>{data.character.alignment || "None"}</li>
				</ul>
			</TabPane>
			<TabPane tabId="stats" tab="Stats">
				Stats will go here
			</TabPane>
		</TabContent>
	</CardBody>
</Card>

<style>
	#overview-list {
		list-style-type: '\27BB\00A0';
	}
</style>
