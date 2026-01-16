// CV Data Types for Export System

export interface PersonalInfo {
	name: string;
	title: string;
	email: string;
	phone: string;
	location: string;
	linkedin?: string;
	github?: string;
	website?: string;
}

export interface ExperienceEntry {
	company: string;
	position: string;
	location: string;
	startDate: string;
	endDate: string;
	highlights: string[];
	skills: string[];
}

export interface EducationEntry {
	institution: string;
	degree: string;
	area: string;
	startDate: string;
	endDate: string;
	highlights: string[];
}

export interface CertificationEntry {
	name: string;
	issuer: string;
	date?: string;
}

export interface ProjectEntry {
	name: string;
	description: string;
	url?: string;
	technologies: string[];
}

export interface LanguageEntry {
	name: string;
	level: string;
	levelNumber: number;
}

export interface SkillEntry {
	name: string;
	category: string;
}

export interface CVData {
	personal: PersonalInfo;
	summary?: string;
	experience: ExperienceEntry[];
	education: EducationEntry[];
	skills: SkillEntry[];
	certifications: CertificationEntry[];
	projects: ProjectEntry[];
	languages: LanguageEntry[];
}

// Section headings for different regions/languages
export interface SectionHeadings {
	summary: string;
	experience: string;
	education: string;
	skills: string;
	certifications: string;
	languages: string;
	projects: string;
}

// ATS Profile Configuration
export interface ATSProfile {
	id: string;
	name: string;
	description: string;
	docUrl?: string; // Official documentation URL
	region?: string;
	dateFormat: 'MM/YYYY' | 'YYYY-MM' | 'DD.MM.YYYY' | 'MMMM YYYY';
	sectionHeadings: SectionHeadings;
	features: {
		allowBulletPoints: boolean;
		allowBoldText: boolean;
		allowItalicText: boolean;
		allowSectionHeaders: boolean;
		maxLineLength?: number;
		preferredFont: string;
		fontSize: number;
		compactLayout?: boolean; // For legacy systems that prefer less whitespace
	};
}

// Export Options
export interface ExportOptions {
	format: 'pdf' | 'docx' | 'odt' | 'txt' | 'json';
	atsProfile?: string;
	includePhoto?: boolean;
	includeSummary?: boolean;
}
