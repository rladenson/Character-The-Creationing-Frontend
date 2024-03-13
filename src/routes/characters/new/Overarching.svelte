<script lang="ts">
	import {
		Input,
		FormGroup,
		InputGroup,
		InputGroupText,
		FormCheck
	} from '@sveltestrap/sveltestrap';
	import { type Character } from "$lib/types";
	export let character: Character;
	const width = '40em';
</script>

<h2>Overarching</h2>
<FormGroup floating label="Name">
	<Input
		type="text"
		required
		feedback="Name is required"
		bind:value={character.name}
		style="max-width: {width}"
	/>
</FormGroup>
<FormGroup floating label="Age">
	<Input type="text" bind:value={character.age} style="max-width: {width}" />
</FormGroup>
<FormGroup floating label="Campaign Name">
	<Input type="text" bind:value={character.campaign} style="max-width: {width}" />
</FormGroup>
<FormGroup floating label="Race">
	<Input type="text" bind:value={character.race} style="max-width: {width}" required />
</FormGroup>
<FormGroup floating label="Exaltation">
	<Input type="text" bind:value={character.exaltation} style="max-width: {width}" required />
</FormGroup>
<InputGroup style="max-width: {width}">
	<FormGroup floating label="Resource Stat Name">
		<Input type="text" bind:value={character.resource} required />
	</FormGroup>
	<FormGroup floating label="Power Stat Name">
		<Input type="text" bind:value={character.power} required />
	</FormGroup>
</InputGroup>
<FormGroup floating label="Alignment">
	<Input type="text" bind:value={character.alignment} style="max-width: {width}" />
</FormGroup>
