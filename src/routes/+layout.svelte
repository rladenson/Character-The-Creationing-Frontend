<script>
    import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from "@sveltestrap/sveltestrap";
</script>
<Navbar color="dark" theme="dark">
    <NavbarBrand href="/">Home</NavbarBrand>
    <Nav underline theme="dark">
        <NavItem>
            <NavLink href="login">Login</NavLink>
        </NavItem>
    </Nav>
</Navbar>
<slot />