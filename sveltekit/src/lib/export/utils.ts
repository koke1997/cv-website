import type { CVData, ATSProfile } from './types';
import { experiences, education, certifications, projects } from '$lib/data/experience';
import { skills } from '$lib/data/skills';
import { languages } from '$lib/data/languages';

// Convert internal data to CVData format
export function getCVData(): CVData {
	return {
		personal: {
			name: 'Ivan Kokalović',
			title: 'Backend Developer & Infrastructure Engineer',
			email: 'ivan.kokalovic@gmail.com',
			phone: '+49 152 5959 5959',
			location: 'Leipzig, Germany',
			linkedin: 'https://linkedin.com/in/ivankokalovic',
			github: 'https://github.com/koke1997'
		},
		summary: 'Experienced Backend Developer and Infrastructure Engineer with 7+ years of expertise in Java, Python, Terraform, and cloud technologies. Proven track record in building scalable systems, automating infrastructure, and leading technical teams.',
		experience: experiences.map((exp) => ({
			company: exp.company,
			position: exp.position,
			location: exp.location,
			startDate: exp.startDate,
			endDate: exp.endDate,
			highlights: exp.highlights,
			skills: exp.skills
		})),
		education: education.map((edu) => ({
			institution: edu.institution,
			degree: edu.degree,
			area: edu.area,
			startDate: edu.startDate,
			endDate: edu.endDate,
			highlights: edu.highlights
		})),
		skills: skills.map((s) => ({
			name: s.name,
			category: s.category
		})),
		certifications: certifications.map((cert) => ({
			name: cert.name,
			issuer: cert.issuer
		})),
		projects: projects.map((proj) => ({
			name: proj.name,
			description: proj.description,
			url: proj.url,
			technologies: proj.technologies || []
		})),
		languages: languages.map((lang) => ({
			name: lang.name,
			level: lang.level,
			levelNumber: lang.levelNumber
		}))
	};
}

// Format date based on ATS profile preference
export function formatDate(date: string, format: ATSProfile['dateFormat']): string {
	if (date === 'present' || date === 'Present') return 'Present';

	const parts = date.split('-');
	const year = parts[0];
	const month = parts[1] ? parseInt(parts[1]) : null;

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	switch (format) {
		case 'MM/YYYY':
			return month ? `${String(month).padStart(2, '0')}/${year}` : year;
		case 'YYYY-MM':
			return month ? `${year}-${String(month).padStart(2, '0')}` : year;
		case 'DD.MM.YYYY':
			return month ? `01.${String(month).padStart(2, '0')}.${year}` : year;
		case 'MMMM YYYY':
			return month ? `${monthNames[month - 1]} ${year}` : year;
		default:
			return month ? `${String(month).padStart(2, '0')}/${year}` : year;
	}
}

// Format date range
export function formatDateRange(startDate: string, endDate: string, format: ATSProfile['dateFormat']): string {
	return `${formatDate(startDate, format)} - ${formatDate(endDate, format)}`;
}

// Clean text for ATS compatibility (remove special characters)
export function cleanTextForATS(text: string): string {
	return text
		.replace(/[""]/g, '"')
		.replace(/['']/g, "'")
		.replace(/[–—]/g, '-')
		.replace(/…/g, '...')
		.replace(/€/g, 'EUR')
		.replace(/[^\x00-\x7F]/g, (char) => {
			// Handle common accented characters
			const accents: Record<string, string> = {
				'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
				'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue',
				'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
				'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
				'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
				'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
				'ú': 'u', 'ù': 'u', 'û': 'u',
				'ñ': 'n', 'ć': 'c', 'č': 'c', 'ş': 's',
				'ž': 'z', 'đ': 'd'
			};
			return accents[char] || char;
		});
}

// Wrap text to specified line length
export function wrapText(text: string, maxLength: number): string[] {
	const words = text.split(' ');
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		if (currentLine.length + word.length + 1 <= maxLength) {
			currentLine += (currentLine ? ' ' : '') + word;
		} else {
			if (currentLine) lines.push(currentLine);
			currentLine = word;
		}
	}
	if (currentLine) lines.push(currentLine);

	return lines;
}

// Generate filename for download
export function generateFileName(format: string, atsProfile?: string): string {
	const name = 'Ivan_Kokalovic';
	const profileSuffix = atsProfile ? `_${atsProfile}` : '';
	return `${name}_CV${profileSuffix}.${format}`;
}

// Download file utility
export async function downloadFile(blob: Blob, filename: string): Promise<void> {
	const { saveAs } = await import('file-saver');
	saveAs(blob, filename);
}

// Group skills by category
export function groupSkillsByCategory(skillList: { name: string; category: string }[]): Record<string, string[]> {
	const grouped: Record<string, string[]> = {};
	for (const skill of skillList) {
		if (!grouped[skill.category]) {
			grouped[skill.category] = [];
		}
		grouped[skill.category].push(skill.name);
	}
	return grouped;
}
