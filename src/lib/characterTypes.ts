import type { Operation } from 'rfc6902/diff.d.ts';
import { characteristics } from './stores';

export class Character {
	[key: string]: any;

	id: string;
	name: string;
	age: number | null;
	campaign: string | null;
	race: string;
	exaltation: string;
	resource: string;
	power: string;
	alignment: string | null;
	currentClass: string;
	completedClassesArr: string[];
	completedClasses: string;
	stats: CharacterStats;
	derived: Derived | undefined;

	constructor(char?: CharacterInner, derived?: Derived) {
		this.id = char?.id ?? '';
		this.name = char?.name ?? '';
		this.age = char?.age ?? null;
		this.campaign = char?.campaign ?? '';
		this.race = char?.race ?? '';
		this.exaltation = char?.exaltation ?? '';
		this.resource = char?.resource ?? '';
		this.power = char?.power ?? '';
		this.alignment = char?.alignment ?? '';
		this.currentClass = char?.currentClass ?? '';
		this.completedClassesArr = char?.completedClasses ?? [];
		this.completedClasses = char?.completedClasses.join(', ') ?? '';
		this.stats = new CharacterStats(char);
		this.derived = derived;
	}

	calculateCompletedClasses() {
		this.completedClassesArr = [];
		const arr = this.completedClasses.split(/, ?/);
		arr.forEach((item) => {
			if (item.trim() !== '') this.completedClassesArr.push(item);
		});
	}

	createPatch(newChar: Character): { patch: Operation[]; errors: string[]; summary: string[][] } {
		const patch: Operation[] = [];
		const errors: string[] = [];
		const summary: string[][] = [];

		const requiredFields = ['name', 'race', 'exaltation', 'resource', 'power', 'currentClass'];
		const optionalFields = ['age', 'campaign', 'alignment'];

		requiredFields.forEach((field) => {
			console.log(field, this[field], newChar[field]);
			if (newChar[field].trim() === '') return errors.push(field);
			if (this[field] === newChar[field].trim()) return;
			addChange(patch, summary, this[field], newChar[field].trim(), `/${field}`, field, 'replace');
		});
		optionalFields.forEach((field) => {
			if (isEmpty(this[field]) && isEmpty(newChar[field])) return;
			if (isEmpty(newChar[field]))
				return addChange(patch, summary, this[field], null, `/${field}`, field, 'remove');
			if (this[field] === newChar[field].trim()) return;
			addChange(patch, summary, this[field], newChar[field].trim(), `/${field}`, field, 'replace');
		});

		this.stats.createPatch(newChar.stats, { patch, errors, summary });

		return { patch, errors, summary };
	}
}

function isEmpty(a: any) {
	return (
		a === null ||
		a === undefined ||
		(typeof a === 'string' && a.trim() === '') ||
		(typeof a === 'number' && isNaN(a))
	);
}

function addChange(
	patch: Operation[],
	summary: string[][],
	oldVal: any,
	newVal: any,
	path: string,
	fieldName: string,
	op: string
) {
	switch (op) {
		case 'replace':
			patch.push({ op, path, value: newVal });
			summary.push([fieldName, oldVal.toString(), newVal.toString()]);
			break;
		case 'remove':
			patch.push({ op, path });
			summary.push([fieldName, oldVal.toString(), '<blank>']);
			break;
	}
}

class CharacterStats {
	[key: string]: any;

	intelligence: Characteristic = {
		stat: 'intelligence',
		name: 'Intelligence',
		abbrev: 'INT',
		val: -1
	};
	wisdom: Characteristic = {
		stat: 'wisdom',
		name: 'Wisdom',
		abbrev: 'WIS',
		val: -1
	};
	willpower: Characteristic = {
		stat: 'willpower',
		name: 'Willpower',
		abbrev: 'WIL',
		val: -1
	};
	strength: Characteristic = {
		stat: 'strength',
		name: 'Strength',
		abbrev: 'STR',
		val: -1
	};
	dexterity: Characteristic = {
		stat: 'dexterity',
		name: 'Dexterity',
		abbrev: 'DEX',
		val: -1
	};
	constitution: Characteristic = {
		stat: 'constitution',
		name: 'Constitution',
		abbrev: 'CON',
		val: -1
	};
	charisma: Characteristic = {
		stat: 'charisma',
		name: 'Charisma',
		abbrev: 'CHA',
		val: -1
	};
	fellowship: Characteristic = {
		stat: 'fellowship',
		name: 'Fellowship',
		abbrev: 'FEL',
		val: -1
	};
	composure: Characteristic = {
		stat: 'composure',
		name: 'Composure',
		abbrev: 'COM',
		val: -1
	};
	level: number;
	size: number;
	xp: number | null;

	mentalSkills: Skill[] = [
		{
			stat: 'academicLore',
			name: 'Academic Lore',
			advanced: true,
			type: 'mental',
			val: -1
		},
		{
			stat: 'arcana',
			name: 'Arcana',
			advanced: true,
			type: 'mental',
			val: -1
		},
		{
			stat: 'commonLore',
			name: 'Common Lore',
			advanced: true,
			type: 'mental',
			val: -1
		},
		{
			stat: 'crafts',
			name: 'Crafts',
			advanced: false,
			type: 'mental',
			val: -1
		},
		{
			stat: 'forbiddenLore',
			name: 'Forbidden Lore',
			advanced: true,
			type: 'mental',
			val: -1
		},
		{
			stat: 'medicae',
			name: 'Medicae',
			advanced: true,
			type: 'mental',
			val: -1
		},
		{
			stat: 'perception',
			name: 'Perception',
			advanced: false,
			type: 'mental',
			val: -1
		},
		{
			stat: 'politics',
			name: 'Politics',
			advanced: true,
			type: 'mental',
			val: -1
		},
		{
			stat: 'techUse',
			name: 'Tech-Use',
			advanced: false,
			type: 'mental',
			val: -1
		}
	];
	physicalSkills: Skill[] = [
		{
			stat: 'acrobatics',
			name: 'Acrobatics',
			advanced: true,
			type: 'physical',
			val: -1
		},
		{
			stat: 'athletics',
			name: 'Athletics',
			advanced: false,
			type: 'physical',
			val: -1
		},
		{
			stat: 'drive',
			name: 'Drive',
			advanced: false,
			type: 'physical',
			val: -1
		},
		{
			stat: 'larceny',
			name: 'Larceny',
			advanced: false,
			type: 'physical',
			val: -1
		},
		{
			stat: 'pilot',
			name: 'Pilot',
			advanced: true,
			type: 'physical',
			val: -1
		},
		{
			stat: 'stealth',
			name: 'Stealth',
			advanced: false,
			type: 'physical',
			val: -1
		},
		{
			stat: 'ballistics',
			name: 'Ballistics',
			advanced: false,
			type: 'physical',
			val: -1
		},
		{
			stat: 'brawl',
			name: 'Brawl',
			advanced: false,
			type: 'physical',
			val: -1
		},
		{
			stat: 'weaponry',
			name: 'Weaponry',
			advanced: false,
			type: 'physical',
			val: -1
		}
	];
	socialSkills: Skill[] = [
		{
			stat: 'animalKen',
			name: 'Animal Ken',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'charm',
			name: 'Charm',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'command',
			name: 'Command',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'deceive',
			name: 'Deceive',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'disguise',
			name: 'Disguise',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'intimidation',
			name: 'Intimidation',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'performer',
			name: 'Performer',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'persuasion',
			name: 'Persuasion',
			advanced: false,
			type: 'social',
			val: -1
		},
		{
			stat: 'scrutiny',
			name: 'Scrutiny',
			advanced: false,
			type: 'social',
			val: -1
		}
	];

	constructor(char?: CharacterInner) {
		this.intelligence.val = char?.stats.intelligence ?? 1;
		this.wisdom.val = char?.stats.wisdom ?? 1;
		this.willpower.val = char?.stats.willpower ?? 1;
		this.strength.val = char?.stats.strength ?? 1;
		this.dexterity.val = char?.stats.dexterity ?? 1;
		this.constitution.val = char?.stats.constitution ?? 1;
		this.charisma.val = char?.stats.charisma ?? 1;
		this.fellowship.val = char?.stats.fellowship ?? 1;
		this.composure.val = char?.stats.composure ?? 1;

		this.level = char?.stats.level ?? 1;
		this.size = char?.stats.size ?? 4;
		this.xp = char?.stats.xp ?? null;

		this.mentalSkills[0].val = char?.stats.mentalSkills.academicLore ?? 0;
		this.mentalSkills[1].val = char?.stats.mentalSkills.arcana ?? 0;
		this.mentalSkills[2].val = char?.stats.mentalSkills.commonLore ?? 0;
		this.mentalSkills[3].val = char?.stats.mentalSkills.crafts ?? 0;
		this.mentalSkills[4].val = char?.stats.mentalSkills.forbiddenLore ?? 0;
		this.mentalSkills[5].val = char?.stats.mentalSkills.medicae ?? 0;
		this.mentalSkills[6].val = char?.stats.mentalSkills.perception ?? 0;
		this.mentalSkills[7].val = char?.stats.mentalSkills.politics ?? 0;
		this.mentalSkills[8].val = char?.stats.mentalSkills.techUse ?? 0;

		this.physicalSkills[0].val = char?.stats.physicalSkills.acrobatics ?? 0;
		this.physicalSkills[1].val = char?.stats.physicalSkills.athletics ?? 0;
		this.physicalSkills[2].val = char?.stats.physicalSkills.drive ?? 0;
		this.physicalSkills[3].val = char?.stats.physicalSkills.larceny ?? 0;
		this.physicalSkills[4].val = char?.stats.physicalSkills.pilot ?? 0;
		this.physicalSkills[5].val = char?.stats.physicalSkills.stealth ?? 0;
		this.physicalSkills[6].val = char?.stats.physicalSkills.ballistics ?? 0;
		this.physicalSkills[7].val = char?.stats.physicalSkills.brawl ?? 0;
		this.physicalSkills[8].val = char?.stats.physicalSkills.weaponry ?? 0;

		this.socialSkills[0].val = char?.stats.socialSkills.animalKen ?? 0;
		this.socialSkills[1].val = char?.stats.socialSkills.charm ?? 0;
		this.socialSkills[2].val = char?.stats.socialSkills.command ?? 0;
		this.socialSkills[3].val = char?.stats.socialSkills.deceive ?? 0;
		this.socialSkills[4].val = char?.stats.socialSkills.disguise ?? 0;
		this.socialSkills[5].val = char?.stats.socialSkills.intimidation ?? 0;
		this.socialSkills[6].val = char?.stats.socialSkills.performer ?? 0;
		this.socialSkills[7].val = char?.stats.socialSkills.persuasion ?? 0;
		this.socialSkills[8].val = char?.stats.socialSkills.scrutiny ?? 0;
	}

	createPatch(
		newStats: CharacterStats,
		{ patch, errors, summary }: { patch: Operation[]; errors: string[]; summary: string[][] }
	) {
		characteristics.forEach(({ stat }) => {
			const num: number = newStats[stat].val;
			if (isNaN(num) || num < 1) return errors.push(this[stat].name);
			if (this[stat].val === num) return;
			addChange(patch, summary, this[stat].val, num, `/stats/${stat}`, stat, 'replace');
		});
		this.mentalSkills.forEach((field: Skill, i: number) => {
			const num = newStats.mentalSkills[i].val;
			if (isNaN(num) || num < 0) return errors.push(this.mentalSkills[i].name);
			if (this.mentalSkills[i].val === num) return;
			addChange(
				patch,
				summary,
				this.mentalSkills[i].val,
				num,
				`/stats/mentalSkills/${field.stat}`,
				field.name,
				'replace'
			);
		});
		this.physicalSkills.forEach((field: Skill, i: number) => {
			const num = newStats.physicalSkills[i].val;
			if (isNaN(num) || num < 0) return errors.push(this.physicalSkills[i].name);
			if (this.physicalSkills[i].val === num) return;
			addChange(
				patch,
				summary,
				this.physicalSkills[i].val,
				num,
				`/stats/physicalSkills/${field.stat}`,
				field.name,
				'replace'
			);
		});
		this.socialSkills.forEach((field: Skill, i: number) => {
			const num = newStats.socialSkills[i].val;
			if (isNaN(num) || num < 0) return errors.push(this.socialSkills[i].name);
			if (this.socialSkills[i].val === num) return;
			addChange(
				patch,
				summary,
				this.socialSkills[i].val,
				num,
				`/stats/socialSkills/${field.stat}`,
				field.name,
				'replace'
			);
		});

		// level, size, xp
		if (this.level !== newStats.level) {
			if (isEmpty(newStats.level) || newStats.level < 1 || newStats.level > 5) errors.push('Level');
			else
				addChange(patch, summary, this.level, newStats.level, '/stats/level', 'Level', 'replace');
		}
		if (this.size !== newStats.size) {
			if (isEmpty(newStats.size) || newStats.size < 1) errors.push('size');
			else addChange(patch, summary, this.size, newStats.size, '/stats/size', 'Size', 'replace');
		}
		if (this.xp !== newStats.xp) {
			if (isEmpty(newStats.xp))
				addChange(patch, summary, this.xp, null, '/stats/xp', 'XP', 'remove');
			else addChange(patch, summary, this.xp, newStats.xp, '/stats/xp', 'XP', 'replace');
		}
	}

	getAcademicLore() {
		return this.mentalSkills[0];
	}
	getArcana() {
		return this.mentalSkills[1];
	}
	getCommonLore() {
		return this.mentalSkills[2];
	}
	getCrafts() {
		return this.mentalSkills[3];
	}
	getForbiddenLore() {
		return this.mentalSkills[4];
	}
	getMedicae() {
		return this.mentalSkills[5];
	}
	getPerception() {
		return this.mentalSkills[6];
	}
	getPolitics() {
		return this.mentalSkills[7];
	}
	getTechUse() {
		return this.mentalSkills[8];
	}
	getAcrobatics() {
		return this.physicalSkills[0];
	}
	getAthletics() {
		return this.physicalSkills[1];
	}
	getDrive() {
		return this.physicalSkills[2];
	}
	getLarceny() {
		return this.physicalSkills[3];
	}
	getPilot() {
		return this.physicalSkills[4];
	}
	getStealth() {
		return this.physicalSkills[5];
	}
	getBallistics() {
		return this.physicalSkills[6];
	}
	getBrawl() {
		return this.physicalSkills[7];
	}
	getWeaponry() {
		return this.physicalSkills[8];
	}
	getAnimalKen() {
		return this.socialSkills[0];
	}
	getCharm() {
		return this.socialSkills[1];
	}
	getCommand() {
		return this.socialSkills[2];
	}
	getDeceive() {
		return this.socialSkills[3];
	}
	getDisguise() {
		return this.socialSkills[4];
	}
	getIntimidation() {
		return this.socialSkills[5];
	}
	getPerformer() {
		return this.socialSkills[6];
	}
	getPersuasion() {
		return this.socialSkills[7];
	}
	getScrutiny() {
		return this.socialSkills[8];
	}
}

type Skill = {
	stat: string;
	name: string;
	advanced: boolean;
	type: string;
	val: number;
};

type Characteristic = {
	stat: string;
	name: string;
	abbrev: string;
	val: number;
};

type Derived = {
	staticDefense: number;
	maxHP: number;
	mentalDefense: number;
	resilience: number;
	resolve: number;
	speed: number;
	initiative: number;
};

type CharacterInner = {
	id: string;

	name: string;
	age: number | null;
	campaign: string | null;
	race: string;
	exaltation: string;
	resource: string;
	power: string;
	alignment: string | null;
	currentClass: string;
	completedClasses: string[];

	stats: {
		charisma: number;
		composure: number;
		constitution: number;
		dexterity: number;
		fellowship: number;
		intelligence: number;
		strength: number;
		willpower: number;
		wisdom: number;

		level: number;
		size: number;
		xp: number | null;

		mentalSkills: {
			academicLore: number;
			arcana: number;
			commonLore: number;
			crafts: number;
			forbiddenLore: number;
			medicae: number;
			perception: number;
			politics: number;
			techUse: number;
		};
		physicalSkills: {
			acrobatics: number;
			athletics: number;
			ballistics: number;
			brawl: number;
			drive: number;
			larceny: number;
			pilot: number;
			stealth: number;
			weaponry: number;
		};
		socialSkills: {
			animalKen: number;
			charm: number;
			command: number;
			deceive: number;
			disguise: number;
			intimidation: number;
			performer: number;
			persuasion: number;
			scrutiny: number;
		};
	};
};
