import type { ATSProfile, SectionHeadings } from '../types';

// Default English section headings
const defaultHeadings: SectionHeadings = {
	summary: 'Professional Summary',
	experience: 'Professional Experience',
	education: 'Education',
	skills: 'Technical Skills',
	certifications: 'Certifications',
	languages: 'Languages',
	projects: 'Notable Projects'
};

// German section headings for DACH region
const germanHeadings: SectionHeadings = {
	summary: 'Berufsprofil',
	experience: 'Berufserfahrung',
	education: 'Ausbildung',
	skills: 'Technische Kenntnisse',
	certifications: 'Zertifizierungen',
	languages: 'Sprachen',
	projects: 'Ausgewählte Projekte'
};

// Greenhouse - Popular for tech companies
// Based on: https://support.greenhouse.io/hc/en-us/articles/360052218132
export const greenhouse: ATSProfile = {
	id: 'greenhouse',
	name: 'Greenhouse',
	description: 'Modern ATS popular with tech companies. Handles formatting well.',
	docUrl: 'https://support.greenhouse.io/hc/en-us/articles/360052218132',
	dateFormat: 'MMMM YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true, // Greenhouse handles bold formatting fine
		allowItalicText: true,
		allowSectionHeaders: true,
		preferredFont: 'Arial',
		fontSize: 11
	}
};

// Lever - Modern ATS for startups
// Based on: https://help.lever.co/hc/en-us/articles/20087345054749
export const lever: ATSProfile = {
	id: 'lever',
	name: 'Lever',
	description: 'Modern startup ATS. Single-column layout, no tables.',
	docUrl: 'https://help.lever.co/hc/en-us/articles/20087345054749',
	dateFormat: 'MMMM YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true,
		allowItalicText: true,
		allowSectionHeaders: true,
		preferredFont: 'Calibri',
		fontSize: 11
	}
};

// Workday - Enterprise ATS with modern AI parsing
// Based on: https://www.workday.com/en-us/topics/hr/applicant-tracking-system.html
export const workday: ATSProfile = {
	id: 'workday',
	name: 'Workday',
	description: 'Enterprise ATS with AI/semantic parsing. Handles modern formatting.',
	docUrl: 'https://www.workday.com/en-us/topics/hr/applicant-tracking-system.html',
	dateFormat: 'MM/YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true, // Modern Workday uses AI parsing, handles formatting
		allowItalicText: false,
		allowSectionHeaders: true,
		preferredFont: 'Arial',
		fontSize: 11
	}
};

// Taleo (Oracle) - Legacy enterprise system
// Based on: https://docs.oracle.com/en/cloud/saas/taleo-enterprise
export const taleo: ATSProfile = {
	id: 'taleo',
	name: 'Taleo (Oracle)',
	description: 'Legacy enterprise system. Conservative formatting recommended.',
	docUrl: 'https://docs.oracle.com/en/cloud/saas/taleo-enterprise/23b/otcug/c-plaintextresumeparsingmobile.html',
	dateFormat: 'MM/YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: false, // Keep conservative for legacy parsing
		allowItalicText: false,
		allowSectionHeaders: true,
		maxLineLength: 70,
		preferredFont: 'Arial',
		fontSize: 10,
		compactLayout: true
	}
};

// iCIMS - Mid-market ATS
// Based on: https://www.icims.com/blog/what-is-cv-resume-parsing/
export const icims: ATSProfile = {
	id: 'icims',
	name: 'iCIMS',
	description: 'Mid-market ATS. Prefers .docx style simplicity.',
	docUrl: 'https://www.icims.com/blog/what-is-cv-resume-parsing/',
	dateFormat: 'MMMM YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true,
		allowItalicText: false,
		allowSectionHeaders: true,
		preferredFont: 'Arial',
		fontSize: 11
	}
};

// Personio - DACH region specialist
// Based on: https://support.personio.de/hc/en-us/articles/360010193018
export const personio: ATSProfile = {
	id: 'personio',
	name: 'Personio',
	description: 'DACH region ATS. German headings, DD.MM.YYYY dates.',
	docUrl: 'https://support.personio.de/hc/en-us/articles/360010193018',
	region: 'DACH',
	dateFormat: 'DD.MM.YYYY',
	sectionHeadings: germanHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true,
		allowItalicText: true,
		allowSectionHeaders: true,
		preferredFont: 'Arial',
		fontSize: 11
	}
};

// SAP SuccessFactors - Enterprise HR (similar to Workday, modern parsing)
export const successfactors: ATSProfile = {
	id: 'successfactors',
	name: 'SAP SuccessFactors',
	description: 'Enterprise HR suite with modern parsing capabilities.',
	region: 'Global',
	dateFormat: 'MM/YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true,
		allowItalicText: false,
		allowSectionHeaders: true,
		preferredFont: 'Arial',
		fontSize: 11
	}
};

// Softgarden - Modern German ATS
export const softgarden: ATSProfile = {
	id: 'softgarden',
	name: 'Softgarden',
	description: 'Modern German ATS. German headings, European date format.',
	region: 'DACH',
	dateFormat: 'DD.MM.YYYY',
	sectionHeadings: germanHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true,
		allowItalicText: true,
		allowSectionHeaders: true,
		preferredFont: 'Calibri',
		fontSize: 11
	}
};

// Universal - General purpose, balanced settings
export const universal: ATSProfile = {
	id: 'universal',
	name: 'Universal',
	description: 'General purpose format. Compatible with most ATS systems.',
	dateFormat: 'MMMM YYYY',
	sectionHeadings: defaultHeadings,
	features: {
		allowBulletPoints: true,
		allowBoldText: true, // Most modern ATS handle bold fine
		allowItalicText: false,
		allowSectionHeaders: true,
		preferredFont: 'Arial',
		fontSize: 11
	}
};

// All profiles
export const atsProfiles: Record<string, ATSProfile> = {
	greenhouse,
	lever,
	workday,
	taleo,
	icims,
	personio,
	successfactors,
	softgarden,
	universal
};

// Get profile by ID
export function getATSProfile(id: string): ATSProfile {
	return atsProfiles[id] || universal;
}

// Get all profile IDs
export function getATSProfileIds(): string[] {
	return Object.keys(atsProfiles);
}

// Profile metadata for UI with improved descriptions
export const profileMetadata = [
	{
		id: 'universal',
		name: 'Universal',
		description: 'General purpose - works with most systems',
		icon: '🌐',
		details: 'Balanced formatting that works across most ATS systems.'
	},
	{
		id: 'greenhouse',
		name: 'Greenhouse',
		description: 'Tech companies & startups',
		icon: '🌿',
		details: 'Popular with tech companies. Handles modern formatting well.'
	},
	{
		id: 'lever',
		name: 'Lever',
		description: 'Modern startups',
		icon: '⚡',
		details: 'Modern ATS. Single-column layout recommended.'
	},
	{
		id: 'workday',
		name: 'Workday',
		description: 'Enterprise (AI parsing)',
		icon: '🏢',
		details: 'Enterprise ATS with AI/semantic parsing. Simple headings work best.'
	},
	{
		id: 'taleo',
		name: 'Taleo (Oracle)',
		description: 'Legacy corporations',
		icon: '🔶',
		details: 'Legacy system. Conservative formatting, compact layout.'
	},
	{
		id: 'icims',
		name: 'iCIMS',
		description: 'Mid-market',
		icon: '📋',
		details: 'Mid-market ATS. Prefers simple Word-style formatting.'
	},
	{
		id: 'personio',
		name: 'Personio',
		description: 'DACH region',
		icon: '🇩🇪',
		details: 'German headings, DD.MM.YYYY dates. Popular in Germany, Austria, Switzerland.'
	},
	{
		id: 'successfactors',
		name: 'SAP SuccessFactors',
		description: 'Enterprise HR',
		icon: '💼',
		details: 'Enterprise HR suite with modern parsing capabilities.'
	},
	{
		id: 'softgarden',
		name: 'Softgarden',
		description: 'Modern German ATS',
		icon: '🌱',
		details: 'Modern German ATS with German section headings.'
	}
];
