<script lang="ts">
	import type { Character } from '$lib/characterTypes';
	import {
		Input,
		FormGroup,
		InputGroup,
		InputGroupText,
		FormCheck
	} from '@sveltestrap/sveltestrap';
	export let character: Character, record: any;
	const width = '40em';

	const toggleExtraLevels = (e: Event) => {
		if (!(<HTMLInputElement>e.target).checked) {
			character.completedClasses.joined = "";
			character.level = 1;
		}
	};
</script>

<h2>Miscellaneous</h2>
<FormGroup floating label="Size">
	<Input type="number" bind:value={character.size} required style="max-width: {width}" />
</FormGroup>
<FormGroup floating label="XP">
	<Input type="number" bind:value={character.xp} style="max-width: {width}" />
</FormGroup>
<FormGroup floating label="Current Class">
	<Input type="text" bind:value={character.currentClass} style="max-width: {width}" required />
</FormGroup>
<FormGroup>
	<InputGroup>
		<InputGroupText>
			<FormCheck bind:checked={record.showExtraLevels} on:change={toggleExtraLevels} />
			Start beyond first level?
		</InputGroupText>
	</InputGroup>
</FormGroup>
{#if record.showExtraLevels}
	<FormGroup floating label="Completed Classes (Separate with Commas)">
		<Input type="text" bind:value={character.completedClasses} style="max-width: {width}" />
	</FormGroup>
	<FormGroup
		floating
		label="Level (Character level is equal to level of highest class completed or currently in)"
	>
		<Input type="number" bind:value={character.level} style="max-width: {width}" />
	</FormGroup>
{/if}
