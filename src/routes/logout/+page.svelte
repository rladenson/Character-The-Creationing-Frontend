<script lang="ts">
	export let data;
</script>

{#if !data}
	<h1>Logging you out...</h1>
{:else}
	<h1>Successfully logged out!</h1>
	<h2>Go <a href="/">Home</a>!</h2>
{/if}
