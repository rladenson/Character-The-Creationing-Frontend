<script>
	import { Input, FormGroup } from '@sveltestrap/sveltestrap';
	export let character;
</script>

<h2>Flavor</h2>
<FormGroup floating label="Name">
	<Input type="text" required feedback="Name is required" bind:value={character.name} />
</FormGroup>
<FormGroup floating label="Age" bind:value={character.age}>
	<Input type="text" />
</FormGroup>
