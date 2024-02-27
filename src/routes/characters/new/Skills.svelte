<script>
	import { Input, FormGroup, Table, Button, Alert } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	export let character, record;
	let skills = character.skills;

	const checkTotal = (stat, statMax, statName) => {
		switch (statName) {
			case 'mental':
				mental = updateSkill(skills.mental, mentalMax);
				break;
			case 'physical':
				physical = updateSkill(skills.physical, physicalMax);
				break;
			case 'social':
				social = updateSkill(skills.social, socialMax);
				break;
		}
	};
	const updateSkill = (obj, statMax) => {
		if (Object.entries(obj).length == 0) return '0 out of ' + statMax;
		const val = Object.entries(obj).reduce((prev, [stat, val]) => {
			return prev + Number(val || 0);
		}, 0);
		return Number(val || 0) + ' out of ' + statMax;
	};

	let mental = 0;
	let mentalMax = 8;
	$: mental = updateSkill(skills.mental, mentalMax);
	$: checkTotal(mental, mentalMax, 'mental');

	let physical = 0;
	let physicalMax = 6;
	$: physical = updateSkill(skills.physical, physicalMax);
	$: checkTotal(physical, physicalMax, 'physical');

	let social = 0;
	let socialMax = 4;
	$: social = updateSkill(skills.social, socialMax);
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
	hidden={primary !== secondary && primary !== tertiary && secondary !== tertiary ? '' : null}
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

	<div>
		<FormGroup floating label="Academic Lore*">
			<Input type="number" min="0" max="3" bind:value={skills.mental.academicLore} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Arcana">
			<Input type="number" min="0" max="3" bind:value={skills.mental.arcana} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Common Lore*">
			<Input type="number" min="0" max="3" bind:value={skills.mental.commonLore} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Crafts*">
			<Input type="number" min="0" max="3" bind:value={skills.mental.crafts} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Forbidden Lore*">
			<Input type="number" min="0" max="3" bind:value={skills.mental.forbiddenLore} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Medicae*">
			<Input type="number" min="0" max="3" bind:value={skills.mental.medicae} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Perception">
			<Input type="number" min="0" max="3" bind:value={skills.mental.perception} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Politics*">
			<Input type="number" min="0" max="3" bind:value={skills.mental.politics} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Tech-Use">
			<Input type="number" min="0" max="3" bind:value={skills.mental.techUse} />
		</FormGroup>
	</div>
	<div>
		<Input
			readonly
			id="mental-total"
			bind:value={mental}
			class={mental.split(' ')[0] === mental.split(' ')[3] ? 'is-valid' : 'is-invalid'}
		/>
	</div>

	<h4>Physical</h4>

	<div>
		<FormGroup floating label="Acrobatics*">
			<Input type="number" min="0" max="3" bind:value={skills.physical.acrobatics} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Athletics">
			<Input type="number" min="0" max="3" bind:value={skills.physical.athletics} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Drive">
			<Input type="number" min="0" max="3" bind:value={skills.physical.drive} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Larceny">
			<Input type="number" min="0" max="3" bind:value={skills.physical.larceny} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Pilot*">
			<Input type="number" min="0" max="3" bind:value={skills.physical.pilot} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Stealth">
			<Input type="number" min="0" max="3" bind:value={skills.physical.stealth} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Ballistics">
			<Input type="number" min="0" max="3" bind:value={skills.physical.ballistics} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Brawl">
			<Input type="number" min="0" max="3" bind:value={skills.physical.brawl} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Weaponry">
			<Input type="number" min="0" max="3" bind:value={skills.physical.weaponry} />
		</FormGroup>
	</div>
	<div>
		<Input
			readonly
			id="physical-total"
			bind:value={physical}
			class={physical.split(' ')[0] === physical.split(' ')[3] ? 'is-valid' : 'is-invalid'}
		/>
	</div>

	<h4>Social</h4>

	<div>
		<FormGroup floating label="Animal Ken">
			<Input type="number" min="0" max="3" bind:value={skills.social.animalKen} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Charm">
			<Input type="number" min="0" max="3" bind:value={skills.social.charm} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Command">
			<Input type="number" min="0" max="3" bind:value={skills.social.command} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Deceive">
			<Input type="number" min="0" max="3" bind:value={skills.social.deceive} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Disguise">
			<Input type="number" min="0" max="3" bind:value={skills.social.disguise} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Intimidation">
			<Input type="number" min="0" max="3" bind:value={skills.social.intimidation} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Performer">
			<Input type="number" min="0" max="3" bind:value={skills.social.performer} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Persuasion">
			<Input type="number" min="0" max="3" bind:value={skills.social.persuasion} />
		</FormGroup>
	</div>
	<div>
		<FormGroup floating label="Scrutiny">
			<Input type="number" min="0" max="3" bind:value={skills.social.scrutiny} />
		</FormGroup>
	</div>

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
