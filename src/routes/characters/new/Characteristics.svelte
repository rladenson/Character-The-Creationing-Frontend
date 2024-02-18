<script>
	import { Form, Input, FormGroup, Button, Table } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	export let character;
	let mental = 3;
	$: mental =
		Number(character.characteristics.intelligence || 0) +
		Number(character.characteristics.wisdom || 0) +
		Number(character.characteristics.willpower || 0);
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
		Number(character.characteristics.strength || 0) +
		Number(character.characteristics.dexterity || 0) +
		Number(character.characteristics.constitution || 0);
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
		Number(character.characteristics.charisma || 0) +
		Number(character.characteristics.fellowship || 0) +
		Number(character.characteristics.composure || 0);
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
							bind:value={character.characteristics.intelligence}
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
							bind:value={character.characteristics.strength}
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
							bind:value={character.characteristics.charisma}
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
							bind:value={character.characteristics.wisdom}
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
							bind:value={character.characteristics.dexterity}
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
							bind:value={character.characteristics.fellowship}
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
							bind:value={character.characteristics.willpower}
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
							bind:value={character.characteristics.constitution}
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
							bind:value={character.characteristics.composure}
						/>
					</FormGroup>
				</td>
			</tr>
			<tr>
				<th scope="row">Total</th>
				<td>
					<Input type="number" readonly id="mental-total" bind:value={mental} class="is-valid" />
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
