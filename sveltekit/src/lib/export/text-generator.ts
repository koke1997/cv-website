import type { CVData } from './types';
import { cleanTextForATS, formatDateRange, groupSkillsByCategory } from './utils';

export function generatePlainText(cvData: CVData): string {
	const lines: string[] = [];

	const addLine = (text: string = '') => lines.push(cleanTextForATS(text));
	const addSection = (title: string) => {
		addLine();
		addLine('='.repeat(title.length + 4));
		addLine(`  ${title.toUpperCase()}`);
		addLine('='.repeat(title.length + 4));
		addLine();
	};

	// ==================
	// HEADER
	// ==================
	addLine(cvData.personal.name.toUpperCase());
	addLine(cvData.personal.title);
	addLine();
	addLine([cvData.personal.email, cvData.personal.phone, cvData.personal.location].filter(Boolean).join(' | '));

	const links = [];
	if (cvData.personal.linkedin) links.push(cvData.personal.linkedin);
	if (cvData.personal.github) links.push(cvData.personal.github);
	if (links.length > 0) {
		addLine(links.join(' | '));
	}

	// ==================
	// SUMMARY
	// ==================
	if (cvData.summary) {
		addSection('Professional Summary');
		addLine(cvData.summary);
	}

	// ==================
	// EXPERIENCE
	// ==================
	addSection('Professional Experience');

	for (const exp of cvData.experience) {
		const dateRange = formatDateRange(exp.startDate, exp.endDate, 'MM/YYYY');
		addLine(`${exp.position}`);
		addLine(`${exp.company} | ${exp.location} | ${dateRange}`);
		addLine();

		for (const highlight of exp.highlights) {
			addLine(`  * ${highlight}`);
		}
		addLine();
	}

	// ==================
	// EDUCATION
	// ==================
	addSection('Education');

	for (const edu of cvData.education) {
		const dateRange = formatDateRange(edu.startDate, edu.endDate, 'MM/YYYY');
		addLine(`${edu.degree}`);
		addLine(`${edu.institution} | ${edu.area} | ${dateRange}`);

		for (const highlight of edu.highlights) {
			addLine(`  * ${highlight}`);
		}
		addLine();
	}

	// ==================
	// SKILLS
	// ==================
	addSection('Technical Skills');

	const groupedSkills = groupSkillsByCategory(cvData.skills);
	for (const [category, skillNames] of Object.entries(groupedSkills)) {
		addLine(`${category}: ${skillNames.join(', ')}`);
	}

	// ==================
	// CERTIFICATIONS
	// ==================
	if (cvData.certifications && cvData.certifications.length > 0) {
		addSection('Certifications');
		for (const cert of cvData.certifications) {
			addLine(`  * ${cert.name} - ${cert.issuer}`);
		}
	}

	// ==================
	// LANGUAGES
	// ==================
	if (cvData.languages && cvData.languages.length > 0) {
		addSection('Languages');
		addLine(cvData.languages.map((l) => `${l.name} (${l.level})`).join(', '));
	}

	// ==================
	// PROJECTS
	// ==================
	if (cvData.projects && cvData.projects.length > 0) {
		addSection('Notable Projects');
		for (const project of cvData.projects.slice(0, 4)) {
			addLine(`${project.name}`);
			addLine(`  ${project.description}`);
			if (project.technologies && project.technologies.length > 0) {
				addLine(`  Technologies: ${project.technologies.join(', ')}`);
			}
			addLine();
		}
	}

	return lines.join('\n');
}

// Copy to clipboard
export async function copyToClipboard(cvData: CVData): Promise<void> {
	const text = generatePlainText(cvData);
	await navigator.clipboard.writeText(text);
}

// Download as .txt file
export async function downloadTXT(cvData: CVData): Promise<void> {
	const text = generatePlainText(cvData);
	const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
	const { saveAs } = await import('file-saver');
	saveAs(blob, 'Ivan_Kokalovic_CV.txt');
}
