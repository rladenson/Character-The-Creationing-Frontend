<script lang="ts">
	import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from '@sveltestrap/sveltestrap';
	import { page } from '$app/stores';

	const logout = (e: Event) => {
		e.preventDefault();
		localStorage.clear();
		window.location.replace('/');
	};
</script>

<svelte:head>
	<title>Petal Ladenson</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
	/>
</svelte:head>

<Navbar color="dark" theme="dark">
	<NavbarBrand href="/">Home</NavbarBrand>
	<Nav underline theme="dark">
		{#if $page.data.token}
			<NavItem>
				<NavLink href="/characters">My Characters</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/characters/new">New Character</NavLink>
			</NavItem>
			<NavItem>
				<form class="nav-link" method="POST" on:submit={logout}>
					<button type="submit" style="all: unset; cursor: pointer;">Logout</button>
				</form>
			</NavItem>
		{:else if $page.data.done}
			<NavItem>
				<NavLink href="/login">Login</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/signup">Signup</NavLink>
			</NavItem>
		{:else}
			<NavItem style="color: white">Loading...</NavItem>
		{/if}
	</Nav>
</Navbar>
<main>
	<slot />
</main>

<style>
	main {
		margin-left: 1em;
		margin-right: 1em;
	}
</style>
