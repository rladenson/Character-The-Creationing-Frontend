<script>
	import { Form, Input, FormGroup, Button, Table } from '@sveltestrap/sveltestrap';
    import { shallowCopyObj as copy } from "$lib/shallowCopyObj.js";
    import { browser } from "$app/environment";

	let validated = false;
	let page = 1;
	const maxPage = 3;
	const characterBase = {
        characteristics: {
            intelligence: 1,
            wisdom: 1,
            willpower: 1,
            strength: 1,
            dexterity: 1,
            constitution: 1,
            charisma: 1,
            fellowship: 1,
            composure: 1,
        }
    };
    let character = copy(characterBase);
	let nextAction = '';
    let mental = 3;
    $: mental =   Number(character.characteristics.intelligence || 0)
                + Number(character.characteristics.wisdom || 0)
                + Number(character.characteristics.willpower || 0)
    $: if(mental > 8 || mental < 3) {
        if(browser) {
        const tot = document.getElementById("mental-total");
        if(tot ) {
            tot.classList.add("is-invalid");
        }}
    } else {
        if(browser) {
        const tot = document.getElementById("mental-total");
        if(tot) {
            tot.classList.remove("is-invalid");
        }}
    }
    let physical = 3;
    $: physical =   Number(character.characteristics.strength || 0)
                + Number(character.characteristics.dexterity || 0)
                + Number(character.characteristics.constitution || 0)
    $: if(physical > 8) {
        if(browser) {
        const tot = document.getElementById("physical-total");
        if(tot) {
            tot.classList.add("is-invalid");
        }}
    } else {
        if(browser) {
        const tot = document.getElementById("physical-total");
        if(tot) {
            tot.classList.remove("is-invalid");
        }}
    }
    let social = 3;
    $: social =   Number(character.characteristics.charisma || 0)
                + Number(character.characteristics.fellowship || 0)
                + Number(character.characteristics.composure || 0)
    $: if(social > 8) {
        if(browser) {
        const tot = document.getElementById("social-total");
        if(tot) {
            tot.classList.add("is-invalid");
        }}
    } else {
        if(browser) {
        const tot = document.getElementById("social-total");
        if(tot) {
            tot.classList.remove("is-invalid");
        }}
    }
	const handleSubmit = (e) => {
		e.preventDefault();
		switch (nextAction) {
			case '+':
				if (page < maxPage) page++;
                validated = false;
				break;
			case '-':
				if (page > 1) page--;
                validated = false;
				break;
		}
        if(page === 2) {
            validated = true;
        }
	};
	const handleClick = (e) => {
		nextAction = e.target.dataset.action;
		validated = true;
	};
	const resetProgress = (e) => {
		e.preventDefault();
		character = copy(characterBase);
		page = 1;
        validated = false;
	};
</script>

<Form {validated} on:submit={handleSubmit} method="POST">
	<h1>New Character</h1>
	{#if page === 1}
		<h2>Flavor</h2>
		<FormGroup floating label="Name">
			<Input type="text" required feedback="Name is required" bind:value={character.name} />
		</FormGroup>
		<FormGroup floating label="Age" bind:value={character.age}>
			<Input type="text" />
		</FormGroup>
    {:else if page === 2}
    <div id="page2">
        <h2>Characteristics</h2>
        <Table bordered>
            <thead>
                <tr>
                    <th></th>
                    <th>Mental</th>
                    <th>Physical</th>
                    <th>Social</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Power</th>
                    <td>
                        <FormGroup floating label="Intelligence">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.intelligence} />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup floating label="Strength">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.strength} />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup floating label="Charisma">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.charisma} />
                        </FormGroup>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Finesse</th>
                    <td>
                        <FormGroup floating label="Wisdom">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.wisdom} />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup floating label="Dexterity">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.dexterity} />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup floating label="Fellowship">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.fellowship} />
                        </FormGroup>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Resistence</th>
                    <td>
                        <FormGroup floating label="Willpower">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.willpower} />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup floating label="Constitution">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.constitution} />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup floating label="Composure">
                            <Input type="number" required min=1 max=4 bind:value={character.characteristics.composure} />
                        </FormGroup>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Total</th>
                    <td>
                        <Input type="number" readonly id="mental-total" bind:value={mental} class="is-valid"/>
                    </td>
                    <td>
                        <Input type="number" readonly id="physical-total" bind:value={physical} class="is-valid"/>
                    </td>
                    <td>
                        <Input type="number" readonly max=8 id="social-total" bind:value={social} class="is-valid"/>
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>
	{/if}
	<Button type="submit" on:click={handleClick} data-action="-" disabled={page <= 1}>
		Previous Page
	</Button>
	<Button type="submit" on:click={handleClick} data-action="+" disabled={page >= maxPage}>
		Next Page
	</Button>
	<Button on:click={resetProgress}>Reset Progress</Button>
</Form>
