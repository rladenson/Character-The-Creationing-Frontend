<script>
    import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from "@sveltestrap/sveltestrap";
    import { page } from "$app/stores";
    import { enhance } from '$app/forms';
</script>
<Navbar color="dark" theme="dark">
    <NavbarBrand href="/">Home</NavbarBrand>
    <Nav underline theme="dark">
        {#if !$page.data.jwt}
            <NavItem>
                <NavLink href="login">Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="signup">Signup</NavLink>
            </NavItem>
        {:else}
            <NavItem>
                    <form class="nav-link" method="POST" action="/?/logout" use:enhance>
                        <button type="submit" style="all: unset; cursor: pointer;">Logout</button>
                    </form>
            </NavItem>
        {/if}
    </Nav>
</Navbar>
<main>
    <slot/>
</main>

<style>
    main {
        margin-left: 1em;
        margin-right: 1em;
    }
</style>