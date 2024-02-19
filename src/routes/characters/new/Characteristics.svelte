<script>
	import { Input, FormGroup, Table, Button, Alert } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	export let character;
	let characteristics = character.characteristics;

	const checkTotal = (stat, statMax, statName) => {
		if (stat > statMax || stat < 3) {
			if (browser) {
				const tot = document.getElementById(statName + "-total");
				if (tot) {
					tot.classList.add('is-invalid');
				}
			}
		} else {
			if (browser) {
				const tot = document.getElementById(statName + "-total");
				if (tot) {
					tot.classList.remove('is-invalid');
				}
			}
		}
	};

	let mental = 3;
	let mentalMax = 9;
	$: mental =
		Number(characteristics.intelligence || 0) +
		Number(characteristics.wisdom || 0) +
		Number(characteristics.willpower || 0);
	$: checkTotal(mental, mentalMax, "mental");

	let physical = 3;
	let physicalMax = 7;
	$: physical =
		Number(characteristics.strength || 0) +
		Number(characteristics.dexterity || 0) +
		Number(characteristics.constitution || 0);
	$: checkTotal(physical, physicalMax, "physical");

	let social = 3;
	let socialMax = 5;
	$: social =
		Number(characteristics.charisma || 0) +
		Number(characteristics.fellowship || 0) +
		Number(characteristics.composure || 0);
	$: checkTotal(social, socialMax, "social");

	let primary = 'Mental';
	let secondary = 'Physical';
	let tertiary = 'Social';
	$: resolveConflicts(primary, secondary, tertiary);
	const invalidate = (el) => {
		el.classList.add('is-invalid');
		document.getElementById('cha-dupe-error').removeAttribute('hidden');
	};
	const resolveConflicts = () => {
		if (browser) {
			try {
				let primaryEl = document.getElementById('primary');
				let secondaryEl = document.getElementById('secondary');
				let tertiaryEl = document.getElementById('tertiary');
				document.getElementById('cha-dupe-error').setAttribute('hidden', true);
				primaryEl.classList.remove('is-invalid');
				secondaryEl.classList.remove('is-invalid');
				tertiaryEl.classList.remove('is-invalid');
				if (primary == secondary) {
					invalidate(primaryEl);
					invalidate(secondaryEl);
				}
				if (primary == tertiary) {
					invalidate(tertiaryEl);
					invalidate(primaryEl);
				}
				if (tertiary == secondary) {
					invalidate(tertiaryEl);
					invalidate(secondaryEl);
				}
				switch (tertiary) {
					case 'Mental':
						mentalMax = 5;
						break;
					case 'Physical':
						physicalMax = 5;
						break;
					case 'Social':
						socialMax = 5;
						break;
				}
				switch (secondary) {
					case 'Mental':
						mentalMax = 7;
						break;
					case 'Physical':
						physicalMax = 7;
						break;
					case 'Social':
						socialMax = 7;
						break;
				}
				switch (primary) {
					case 'Mental':
						mentalMax = 9;
						break;
					case 'Physical':
						physicalMax = 9;
						break;
					case 'Social':
						socialMax = 9;
						break;
				}
				checkTotal(mental, mentalMax, "mental");
				checkTotal(physical, physicalMax, "physical");
				checkTotal(social, socialMax, "social");
			} catch {
				return;
			}
		}
	};
</script>

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
	<tbody class="was-validated">
		<tr>
			<th scope="row">Power</th>
			<td>
				<FormGroup floating label="Intelligence">
					<Input type="number" required min="1" max="4" bind:value={characteristics.intelligence} />
				</FormGroup>
			</td>
			<td>
				<FormGroup floating label="Strength">
					<Input type="number" required min="1" max="4" bind:value={characteristics.strength} />
				</FormGroup>
			</td>
			<td>
				<FormGroup floating label="Charisma">
					<Input type="number" required min="1" max="4" bind:value={characteristics.charisma} />
				</FormGroup>
			</td>
		</tr>
		<tr>
			<th scope="row">Finesse</th>
			<td>
				<FormGroup floating label="Wisdom">
					<Input type="number" required min="1" max="4" bind:value={characteristics.wisdom} />
				</FormGroup>
			</td>
			<td>
				<FormGroup floating label="Dexterity">
					<Input type="number" required min="1" max="4" bind:value={characteristics.dexterity} />
				</FormGroup>
			</td>
			<td>
				<FormGroup floating label="Fellowship">
					<Input type="number" required min="1" max="4" bind:value={characteristics.fellowship} />
				</FormGroup>
			</td>
		</tr>
		<tr>
			<th scope="row">Resistence</th>
			<td>
				<FormGroup floating label="Willpower">
					<Input type="number" required min="1" max="4" bind:value={characteristics.willpower} />
				</FormGroup>
			</td>
			<td>
				<FormGroup floating label="Constitution">
					<Input type="number" required min="1" max="4" bind:value={characteristics.constitution} />
				</FormGroup>
			</td>
			<td>
				<FormGroup floating label="Composure">
					<Input type="number" required min="1" max="4" bind:value={characteristics.composure} />
				</FormGroup>
			</td>
		</tr>
		<tr>
			<th scope="row">Total</th>
			<td>
				<Input readonly id="mental-total" bind:value={mental} class="is-valid" />
			</td>
			<td>
				<Input readonly id="physical-total" bind:value={physical} class="is-valid" />
			</td>
			<td>
				<Input readonly id="social-total" bind:value={social} class="is-valid" />
			</td>
		</tr>
	</tbody>
</Table>
<Alert id="cha-dupe-error" color="danger" hidden>
	Each priority (primary, secondary, tertiary) must have a unique characteristic category (mental,
	physical, social).
</Alert>
<div id="characteristic-priorities">
	<FormGroup floating label="Primary">
		<Input type="select" class="is-valid" style="width: unset" bind:value={primary} id="primary">
			<option>Mental</option>
			<option>Physical</option>
			<option>Social</option>
		</Input>
	</FormGroup>
	<FormGroup floating label="Secondary">
		<Input
			type="select"
			class="is-valid"
			style="width: unset"
			bind:value={secondary}
			id="secondary"
		>
			<option>Mental</option>
			<option>Physical</option>
			<option>Social</option>
		</Input>
	</FormGroup>
	<FormGroup floating label="Tertiary">
		<Input type="select" class="is-valid" style="width: unset" bind:value={tertiary} id="tertiary">
			<option>Mental</option>
			<option>Physical</option>
			<option>Social</option>
		</Input>
	</FormGroup>
</div>

<style>
	div#characteristic-priorities {
		display: flex;
		gap: 1em;
	}
</style>
