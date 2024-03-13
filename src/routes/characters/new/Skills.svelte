<script lang="ts">
	import { Input, FormGroup, Alert } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	import { mentalSkills as mentalList, physicalSkills as physicalList, socialSkills as socialList } from '$lib/stores.js';
	export let character, record;
	const mentalSkills = character.mentalSkills;
	const physicalSkills = character.physicalSkills;
	const socialSkills = character.socialSkills;

	const checkTotal = (stat: string, statMax: number, statName: string) => {
		switch (statName) {
			case 'mental':
				mental = updateSkill(mentalSkills, mentalMax);
				break;
			case 'physical':
				physical = updateSkill(physicalSkills, physicalMax);
				break;
			case 'social':
				social = updateSkill(socialSkills, socialMax);
				break;
		}
	};
	const updateSkill = (obj: object, statMax: number) => {
		if (Object.entries(obj).length == 0) return '0 out of ' + statMax;
		const val = Object.entries(obj).reduce((prev, [stat, val]) => {
			return prev + Number(val || 0);
		}, 0);
		return Number(val || 0) + ' out of ' + statMax;
	};

	let mental = "0";
	let mentalMax = 8;
	$: mental = updateSkill(mentalSkills, mentalMax);
	$: checkTotal(mental, mentalMax, 'mental');

	let physical = "0";
	let physicalMax = 6;
	$: physical = updateSkill(physicalSkills, physicalMax);
	$: checkTotal(physical, physicalMax, 'physical');

	let social = "0";
	let socialMax = 4;
	$: social = updateSkill(socialSkills, socialMax);
	$: checkTotal(social, socialMax, 'social');

	let primary = record.primary;
	let secondary = record.secondary;
	let tertiary = record.tertiary;
	$: resolveConflicts();
	const resolveConflicts = () => {
		if (browser) {
			try {
				switch (tertiary) {
					case 'Mental':
						mentalMax = 4;
						break;
					case 'Physical':
						physicalMax = 4;
						break;
					case 'Social':
						socialMax = 4;
						break;
				}
				switch (secondary) {
					case 'Mental':
						mentalMax = 6;
						break;
					case 'Physical':
						physicalMax = 6;
						break;
					case 'Social':
						socialMax = 6;
						break;
				}
				switch (primary) {
					case 'Mental':
						mentalMax = 8;
						break;
					case 'Physical':
						physicalMax = 8;
						break;
					case 'Social':
						socialMax = 8;
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

<h2>Skills</h2>
<Alert
	id="cha-dupe-error"
	color="danger"
	hidden={primary !== secondary && primary !== tertiary && secondary !== tertiary ? true : null}
>
	Each priority (primary, secondary, tertiary) must have a unique skill category (mental, physical,
	social).
</Alert>
<div id="skill-priorities">
	<FormGroup floating label="Primary">
		<Input
			type="select"
			class={primary === secondary || primary === tertiary ? 'is-invalid' : 'is-valid'}
			style="widh3: unset"
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
			style="widh3: unset"
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
			style="widh3: unset"
			bind:value={tertiary}
			id="tertiary"
		>
			<option>Mental</option>
			<option>Physical</option>
			<option>Social</option>
		</Input>
	</FormGroup>
</div>
<div id="skills">
	<h4>Mental</h4>
	{#each mentalList as { stat, name, advanced }}
		<div>
			<FormGroup floating label={name + (advanced ? '*' : '')}>
				<Input type="number" min="0" max="3" bind:value={mentalSkills[stat]} />
			</FormGroup>
		</div>
	{/each}

	<div>
		<Input
			readonly
			id="mental-total"
			bind:value={mental}
			class={mental.split(' ')[0] === mental.split(' ')[3] ? 'is-valid' : 'is-invalid'}
		/>
	</div>

	<h4>Physical</h4>

	{#each physicalList as { stat, name, advanced }}
		<div>
			<FormGroup floating label={name + (advanced ? '*' : '')}>
				<Input type="number" min="0" max="3" bind:value={physicalSkills[stat]} />
			</FormGroup>
		</div>
	{/each}

	<div>
		<Input
			readonly
			id="physical-total"
			bind:value={physical}
			class={physical.split(' ')[0] === physical.split(' ')[3] ? 'is-valid' : 'is-invalid'}
		/>
	</div>

	<h4>Social</h4>

	{#each socialList as { stat, name, advanced }}
		<div>
			<FormGroup floating label={name + (advanced ? '*' : '')}>
				<Input type="number" min="0" max="3" bind:value={socialSkills[stat]} />
			</FormGroup>
		</div>
	{/each}

	<div>
		<Input
			readonly
			id="social-total"
			bind:value={social}
			class={social.split(' ')[0] === social.split(' ')[3] ? 'is-valid' : 'is-invalid'}
		/>
	</div>
</div>
<br />

<style>
	div#skill-priorities {
		display: flex;
		gap: 1em;
	}
	#skills {
		columns: 3;
	}
</style>
