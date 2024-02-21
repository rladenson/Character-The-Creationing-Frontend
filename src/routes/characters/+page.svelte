<script>
    import { Card, CardHeader, CardTitle, CardBody, CardText, Button } from "@sveltestrap/sveltestrap";
    export let data;
</script>

<h1>My Characters</h1>
<Button href="/characters/new" color="primary">New Character</Button>
<br /><br />
<div id="memberBlock">
{#each data.members as member}
<Card style="min-width: 11em">
    <CardHeader>
        <CardTitle>
            {member.name}
        </CardTitle>
    </CardHeader>
    <CardBody>
        <CardText><strong>Race:</strong> {member.race}</CardText>
        <CardText><strong>Class:</strong> {member.currentClass}</CardText>
        <CardText><strong>Exaltation:</strong> {member.exaltation}</CardText>
        <Button href="/characters/{member.id}">View More Details</Button>
    </CardBody>
</Card>
{/each}
</div>

<style>
    #memberBlock {
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>