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
	completedClasses: {
		raw: string[];
		joined: string;
	};
	stats: CharacterStats;

	constructor(char?: CharacterInner) {
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
		this.completedClasses = {
			raw: char?.completedClasses ?? [],
			joined: char?.completedClasses.join(', ') ?? ''
		};
		this.stats = new CharacterStats(char);
	}

	calculateCompletedClasses() {
		this.completedClasses.raw = [];
		const arr = this.completedClasses.joined.split(/, ?/);
		arr.forEach((item) => {
			if (item.trim() !== '') this.completedClasses.raw.push(item);
		});
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

type Characteristic = {
	stat: string;
	name: string;
	abbrev: string;
	val: number;
};
