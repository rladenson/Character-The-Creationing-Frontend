<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
</script>

<div id="back"><Button href="/characters">&lt; Back to My Characters</Button></div>

<slot />

<style>
	#back {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
</style>
