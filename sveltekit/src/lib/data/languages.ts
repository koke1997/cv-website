export interface Language {
	name: string;
	code: string;
	flagEmoji: string;
	flagSvg: string;
	level: string;
	levelNumber: number; // 1-6 for proficiency dots
	certified?: boolean;
}

export const languages: Language[] = [
	{
		name: 'German',
		code: 'de',
		flagEmoji: '\u{1F1E9}\u{1F1EA}',
		flagSvg: '/images/flags/de.svg',
		level: 'C2 Certified',
		levelNumber: 6,
		certified: true
	},
	{
		name: 'English',
		code: 'en',
		flagEmoji: '\u{1F1EC}\u{1F1E7}',
		flagSvg: '/images/flags/gb.svg',
		level: 'C2 Certified',
		levelNumber: 6,
		certified: true
	},
	{
		name: 'Croatian',
		code: 'hr',
		flagEmoji: '\u{1F1ED}\u{1F1F7}',
		flagSvg: '/images/flags/hr.svg',
		level: 'Native',
		levelNumber: 6
	},
	{
		name: 'Serbian',
		code: 'rs',
		flagEmoji: '\u{1F1F7}\u{1F1F8}',
		flagSvg: '/images/flags/rs.svg',
		level: 'Native',
		levelNumber: 6
	},
	{
		name: 'Slovenian',
		code: 'si',
		flagEmoji: '\u{1F1F8}\u{1F1EE}',
		flagSvg: '/images/flags/si.svg',
		level: 'Limited',
		levelNumber: 3
	},
	{
		name: 'Spanish',
		code: 'es',
		flagEmoji: '\u{1F1EA}\u{1F1F8}',
		flagSvg: '/images/flags/es.svg',
		level: 'Elementary',
		levelNumber: 1
	}
];

export function getLanguageByCode(code: string): Language | undefined {
	return languages.find((lang) => lang.code === code);
}

export function getLanguageByName(name: string): Language | undefined {
	return languages.find((lang) => lang.name.toLowerCase() === name.toLowerCase());
}
