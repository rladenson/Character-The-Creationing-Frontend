<script>
	import {
		Input,
		FormGroup,
		InputGroup,
		InputGroupText,
		FormCheck
	} from '@sveltestrap/sveltestrap';
	export let character, record;
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
	<Input type="text" bind:value={character.race} style="max-width: {width}" />
</FormGroup>
<FormGroup floating label="Exaltation">
	<Input type="text" bind:value={character.exaltation} style="max-width: {width}" />
</FormGroup>
<InputGroup style="max-width: {width}">
	<FormGroup floating label="Resource Stat Name">
		<Input type="text" bind:value={character.resource} />
	</FormGroup>
	<FormGroup floating label="Power Stat Name">
		<Input type="text" bind:value={character.power} />
	</FormGroup>
</InputGroup>
<FormGroup floating label="Alignment">
	<Input type="text" bind:value={character.alignment} style="max-width: {width}" />
</FormGroup>
<FormGroup floating label="Starting Class">
	<Input type="text" bind:value={character.class} style="max-width: {width}" />
</FormGroup>
<FormGroup>
	<InputGroup>
		<InputGroupText>
			<FormCheck
				bind:checked={record.showExtraLevels}
				on:change={(e) => {
					if (!e.target.checked) {
						character.classes = undefined;
						character.level = undefined;
					}
				}}
			/>
			Start beyond first level?
		</InputGroupText>
	</InputGroup>
</FormGroup>
{#if record.showExtraLevels}
	<FormGroup floating label="Completed Classes (Separate with Commas)">
		<Input type="text" bind:value={character.classes} style="max-width: {width}" />
	</FormGroup>
	<FormGroup floating label="Level (Character level is equal to level of highest class completed or currently in)">
		<Input type="number" bind:value={character.level} style="max-width: {width}" />
	</FormGroup>
{/if}
