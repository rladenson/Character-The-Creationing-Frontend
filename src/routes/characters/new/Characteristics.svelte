<script>
	import { Input, FormGroup, Table, Button, Alert } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	export let character, record;
	let characteristics = character.characteristics;

	const checkTotal = (stat, statMax, statName) => {
		switch (statName) {
			case 'mental':
				mental = updateCharacteristic(
					characteristics.intelligence,
					characteristics.wisdom,
					characteristics.willpower,
					mentalMax
				);
				break;
			case 'physical':
				physical = updateCharacteristic(
					characteristics.strength,
					characteristics.dexterity,
					characteristics.constitution,
					physicalMax
				);
				break;
			case 'social':
				social = updateCharacteristic(
					characteristics.charisma,
					characteristics.fellowship,
					characteristics.composure,
					socialMax
				);
				break;
		}
	};
	const updateCharacteristic = (a, b, c, statMax) => {
		return Number(a || 0) + Number(b || 0) + Number(c || 0) + ' out of ' + statMax;
	};

	let mental = 3;
	let mentalMax = 9;
	$: mental = updateCharacteristic(
		characteristics.intelligence,
		characteristics.wisdom,
		characteristics.willpower,
		mentalMax
	);
	$: checkTotal(mental, mentalMax, 'mental');

	let physical = 3;
	let physicalMax = 7;
	$: physical = updateCharacteristic(
		characteristics.strength,
		characteristics.dexterity,
		characteristics.constitution,
		physicalMax
	);
	$: checkTotal(physical, physicalMax, 'physical');

	let social = 3;
	let socialMax = 5;
	$: social = updateCharacteristic(
		characteristics.charisma,
		characteristics.fellowship,
		characteristics.composure,
		socialMax
	);
	$: checkTotal(social, socialMax, 'social');

	let primary = record.primary;
	let secondary = record.secondary;
	let tertiary = record.tertiary;
	$: resolveConflicts(primary, secondary, tertiary);
	const resolveConflicts = () => {
		if (browser) {
			try {
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
				checkTotal(mental, mentalMax, 'mental');
				checkTotal(physical, physicalMax, 'physical');
				checkTotal(social, socialMax, 'social');
			} catch {
				return;
			}
		}
	};
</script>

<h2>Characteristics</h2>
<Alert
	id="cha-dupe-error"
	color="danger"
	hidden={primary !== secondary && primary !== tertiary && secondary !== tertiary ? '' : null}
>
	Each priority (primary, secondary, tertiary) must have a unique characteristic category (mental,
	physical, social).
</Alert>
<div id="characteristic-priorities">
	<FormGroup floating label="Primary">
		<Input
			type="select"
			class={primary === secondary || primary === tertiary ? 'is-invalid' : 'is-valid'}
			style="width: unset"
			bind:value={primary}
			id="primary"
		>
			<option>Mental</option>
			<option>Physical</option>
			<option>Social</option>
		</Input>
	</FormGroup>
	<FormGroup floating label="Secondary">
		<Input
			type="select"
			class={secondary === primary || secondary === tertiary ? 'is-invalid' : 'is-valid'}
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
		<Input
			type="select"
			class={tertiary === primary || tertiary === secondary ? 'is-invalid' : 'is-valid'}
			style="width: unset"
			bind:value={tertiary}
			id="tertiary"
		>
			<option>Mental</option>
			<option>Physical</option>
			<option>Social</option>
		</Input>
	</FormGroup>
</div>
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
				<Input
					readonly
					id="mental-total"
					bind:value={mental}
					class={mental.split(' ')[0] === mental.split(' ')[3] ? 'is-valid' : 'is-invalid'}
				/>
			</td>
			<td>
				<Input
					readonly
					id="physical-total"
					bind:value={physical}
					class={physical.split(' ')[0] === physical.split(' ')[3] ? 'is-valid' : 'is-invalid'}
				/>
			</td>
			<td>
				<Input
					readonly
					id="social-total"
					bind:value={social}
					class={social.split(' ')[0] === social.split(' ')[3] ? 'is-valid' : 'is-invalid'}
				/>
			</td>
		</tr>
	</tbody>
</Table>

<style>
	div#characteristic-priorities {
		display: flex;
		gap: 1em;
	}
</style>
