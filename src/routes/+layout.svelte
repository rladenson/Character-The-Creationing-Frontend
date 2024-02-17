<script>
    import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from "@sveltestrap/sveltestrap";
    export let data;
</script>
<Navbar color="dark" theme="dark">
    <NavbarBrand href="/">Home</NavbarBrand>
    <Nav underline theme="dark">
        {#if !data.jwt}
            <NavItem>
                <NavLink href="login">Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="signup">Signup</NavLink>
            </NavItem>
        {:else}
            <NavItem>
                <NavLink href="logout">Logout</NavLink>
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