<script>
	import { Input, FormGroup, Table, Button } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	export let character;
    let characteristics = character.characteristics;
	let mental = 3;
	$: mental =
		Number(characteristics.intelligence || 0) +
		Number(characteristics.wisdom || 0) +
		Number(characteristics.willpower || 0);
	$: if (mental > 8 || mental < 3) {
		if (browser) {
			const tot = document.getElementById('mental-total');
			if (tot) {
				tot.classList.add('is-invalid');
			}
		}
	} else {
		if (browser) {
			const tot = document.getElementById('mental-total');
			if (tot) {
				tot.classList.remove('is-invalid');
			}
		}
	}
	let physical = 3;
	$: physical =
		Number(characteristics.strength || 0) +
		Number(characteristics.dexterity || 0) +
		Number(characteristics.constitution || 0);
	$: if (physical > 8) {
		if (browser) {
			const tot = document.getElementById('physical-total');
			if (tot) {
				tot.classList.add('is-invalid');
			}
		}
	} else {
		if (browser) {
			const tot = document.getElementById('physical-total');
			if (tot) {
				tot.classList.remove('is-invalid');
			}
		}
	}
	let social = 3;
	$: social =
		Number(characteristics.charisma || 0) +
		Number(characteristics.fellowship || 0) +
		Number(characteristics.composure || 0);
	$: if (social > 8) {
		if (browser) {
			const tot = document.getElementById('social-total');
			if (tot) {
				tot.classList.add('is-invalid');
			}
		}
	} else {
		if (browser) {
			const tot = document.getElementById('social-total');
			if (tot) {
				tot.classList.remove('is-invalid');
			}
		}
	}
</script>

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
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.intelligence}
						/>
					</FormGroup>
				</td>
				<td>
					<FormGroup floating label="Strength">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.strength}
						/>
					</FormGroup>
				</td>
				<td>
					<FormGroup floating label="Charisma">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.charisma}
						/>
					</FormGroup>
				</td>
			</tr>
			<tr>
				<th scope="row">Finesse</th>
				<td>
					<FormGroup floating label="Wisdom">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.wisdom}
						/>
					</FormGroup>
				</td>
				<td>
					<FormGroup floating label="Dexterity">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.dexterity}
						/>
					</FormGroup>
				</td>
				<td>
					<FormGroup floating label="Fellowship">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.fellowship}
						/>
					</FormGroup>
				</td>
			</tr>
			<tr>
				<th scope="row">Resistence</th>
				<td>
					<FormGroup floating label="Willpower">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.willpower}
						/>
					</FormGroup>
				</td>
				<td>
					<FormGroup floating label="Constitution">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.constitution}
						/>
					</FormGroup>
				</td>
				<td>
					<FormGroup floating label="Composure">
						<Input
							type="number"
							required
							min="1"
							max="4"
							bind:value={characteristics.composure}
						/>
					</FormGroup>
				</td>
			</tr>
			<tr>
				<th scope="row">Total</th>
				<td>
					<Input 
                        type="number" 
                        readonly 
                        id="mental-total" 
                        bind:value={mental} 
                        class="is-valid"
                    />
				</td>
				<td>
					<Input
						type="number"
						readonly
						id="physical-total"
						bind:value={physical}
						class="is-valid"
					/>
				</td>
				<td>
					<Input
						type="number"
						readonly
						max="8"
						id="social-total"
						bind:value={social}
						class="is-valid"
					/>
				</td>
			</tr>
		</tbody>
	</Table>
</div>
