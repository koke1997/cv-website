import { jsPDF } from 'jspdf';
import type { CVData, ATSProfile } from './types';
import { getATSProfile } from './ats-profiles';
import { formatDateRange, cleanTextForATS, groupSkillsByCategory } from './utils';

interface PDFGeneratorOptions {
	atsProfileId?: string;
	includeProjects?: boolean;
}

export async function generatePDF(cvData: CVData, options: PDFGeneratorOptions = {}): Promise<Blob> {
	const profile = getATSProfile(options.atsProfileId || 'universal');
	const headings = profile.sectionHeadings;
	const isCompact = profile.features.compactLayout || false;

	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4'
	});

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = isCompact ? 12 : 15;
	const contentWidth = pageWidth - margin * 2;

	let y = margin;

	// Helper functions
	const setFont = (style: 'normal' | 'bold' | 'italic' = 'normal', size: number = profile.features.fontSize) => {
		doc.setFontSize(size);
		if (style === 'bold' && profile.features.allowBoldText) {
			doc.setFont('helvetica', 'bold');
		} else if (style === 'italic' && profile.features.allowItalicText) {
			doc.setFont('helvetica', 'italic');
		} else {
			doc.setFont('helvetica', 'normal');
		}
	};

	const addText = (text: string, x: number = margin, options: { maxWidth?: number; align?: 'left' | 'center' | 'right' } = {}) => {
		const cleanText = cleanTextForATS(text);
		const maxWidth = options.maxWidth || contentWidth;

		if (options.align === 'center') {
			doc.text(cleanText, pageWidth / 2, y, { align: 'center', maxWidth });
		} else if (options.align === 'right') {
			doc.text(cleanText, pageWidth - margin, y, { align: 'right', maxWidth });
		} else {
			doc.text(cleanText, x, y, { maxWidth });
		}
	};

	const addLine = (height: number = 0.3) => {
		doc.setDrawColor(200, 200, 200);
		doc.setLineWidth(height);
		doc.line(margin, y, pageWidth - margin, y);
	};

	const checkPageBreak = (neededSpace: number) => {
		if (y + neededSpace > pageHeight - margin) {
			doc.addPage();
			y = margin;
			return true;
		}
		return false;
	};

	const addSectionHeader = (title: string) => {
		if (!profile.features.allowSectionHeaders) return;

		checkPageBreak(15);
		y += isCompact ? 2 : 3;
		setFont('bold', profile.features.fontSize + 2);
		addText(title.toUpperCase());
		y += isCompact ? 4 : 5;
		addLine(0.5);
		y += isCompact ? 3 : 4;
	};

	// ==================
	// HEADER SECTION
	// ==================
	setFont('bold', 18);
	addText(cvData.personal.name, margin, { align: 'center' });
	y += 6;

	setFont('normal', profile.features.fontSize);
	addText(cvData.personal.title, margin, { align: 'center' });
	y += 5;

	// Contact info
	const contactParts = [
		cvData.personal.email,
		cvData.personal.phone,
		cvData.personal.location
	].filter(Boolean);
	addText(contactParts.join(' | '), margin, { align: 'center' });
	y += 4;

	// Links
	const linkParts: string[] = [];
	if (cvData.personal.linkedin) linkParts.push(cvData.personal.linkedin.replace('https://', ''));
	if (cvData.personal.github) linkParts.push(cvData.personal.github.replace('https://', ''));
	if (linkParts.length > 0) {
		addText(linkParts.join(' | '), margin, { align: 'center' });
		y += 2;
	}

	y += 3;
	addLine();
	y += 6;

	// ==================
	// SUMMARY SECTION
	// ==================
	if (cvData.summary) {
		addSectionHeader(headings.summary);
		setFont('normal');
		const summaryLines = doc.splitTextToSize(cleanTextForATS(cvData.summary), contentWidth);
		doc.text(summaryLines, margin, y);
		y += summaryLines.length * (isCompact ? 4 : 4.5) + 2;
	}

	// ==================
	// EXPERIENCE SECTION
	// ==================
	addSectionHeader(headings.experience);

	for (const exp of cvData.experience) {
		checkPageBreak(30);

		// Company and Position
		setFont('bold');
		addText(exp.position);
		y += 4;

		setFont('normal');
		const dateRange = formatDateRange(exp.startDate, exp.endDate, profile.dateFormat);
		addText(`${exp.company} | ${exp.location}`);

		// Date on the right
		doc.text(dateRange, pageWidth - margin, y - 4, { align: 'right' });
		y += 5;

		// Highlights (bullet points)
		if (exp.highlights && exp.highlights.length > 0) {
			for (const highlight of exp.highlights) {
				checkPageBreak(8);
				const bullet = profile.features.allowBulletPoints ? '• ' : '- ';
				const lines = doc.splitTextToSize(cleanTextForATS(bullet + highlight), contentWidth - 5);
				doc.text(lines, margin + 3, y);
				y += lines.length * 4 + 1;
			}
		}
		y += 3;
	}

	// ==================
	// EDUCATION SECTION
	// ==================
	addSectionHeader(headings.education);

	for (const edu of cvData.education) {
		checkPageBreak(20);

		setFont('bold');
		addText(edu.degree);
		y += 4;

		setFont('normal');
		addText(`${edu.institution} | ${edu.area}`);

		const dateRange = formatDateRange(edu.startDate, edu.endDate, profile.dateFormat);
		doc.text(dateRange, pageWidth - margin, y - 4, { align: 'right' });
		y += 5;

		if (edu.highlights && edu.highlights.length > 0) {
			for (const highlight of edu.highlights) {
				const bullet = profile.features.allowBulletPoints ? '• ' : '- ';
				const lines = doc.splitTextToSize(cleanTextForATS(bullet + highlight), contentWidth - 5);
				doc.text(lines, margin + 3, y);
				y += lines.length * 4;
			}
		}
		y += 3;
	}

	// ==================
	// SKILLS SECTION
	// ==================
	addSectionHeader(headings.skills);

	const groupedSkills = groupSkillsByCategory(cvData.skills);
	for (const [category, skillNames] of Object.entries(groupedSkills)) {
		checkPageBreak(10);

		setFont('bold');
		addText(`${category}: `);

		setFont('normal');
		const skillsText = skillNames.join(', ');
		const skillLines = doc.splitTextToSize(cleanTextForATS(skillsText), contentWidth - 30);

		// Position skills after the category label
		const categoryWidth = doc.getTextWidth(category + ': ');
		if (skillLines.length === 1 && doc.getTextWidth(skillsText) < contentWidth - categoryWidth - 5) {
			doc.text(skillsText, margin + categoryWidth, y);
			y += 5;
		} else {
			y += 4;
			doc.text(skillLines, margin + 3, y);
			y += skillLines.length * 4 + 1;
		}
	}
	y += 2;

	// ==================
	// CERTIFICATIONS SECTION
	// ==================
	if (cvData.certifications && cvData.certifications.length > 0) {
		addSectionHeader(headings.certifications);

		for (const cert of cvData.certifications) {
			checkPageBreak(8);
			const bullet = profile.features.allowBulletPoints ? '• ' : '- ';
			setFont('normal');
			addText(`${bullet}${cert.name} - ${cert.issuer}`);
			y += 5;
		}
		y += 2;
	}

	// ==================
	// LANGUAGES SECTION
	// ==================
	if (cvData.languages && cvData.languages.length > 0) {
		addSectionHeader(headings.languages);

		const langText = cvData.languages.map((l) => `${l.name} (${l.level})`).join(', ');
		setFont('normal');
		addText(langText);
		y += 5;
	}

	// ==================
	// PROJECTS SECTION (optional)
	// ==================
	if (options.includeProjects && cvData.projects && cvData.projects.length > 0) {
		addSectionHeader(headings.projects);

		for (const project of cvData.projects.slice(0, 4)) {
			checkPageBreak(15);

			setFont('bold');
			addText(project.name);
			y += 4;

			setFont('normal');
			const descLines = doc.splitTextToSize(cleanTextForATS(project.description), contentWidth - 3);
			doc.text(descLines, margin + 3, y);
			y += descLines.length * 4 + 1;

			if (project.technologies && project.technologies.length > 0) {
				setFont('italic');
				addText(`Technologies: ${project.technologies.join(', ')}`, margin + 3);
				y += 5;
			}
			y += 2;
		}
	}

	return doc.output('blob');
}

// Convenience function to generate and download PDF
export async function downloadPDF(cvData: CVData, atsProfileId?: string, includeProjects: boolean = true): Promise<void> {
	const blob = await generatePDF(cvData, { atsProfileId, includeProjects });
	const { saveAs } = await import('file-saver');
	const profile = getATSProfile(atsProfileId || 'universal');
	const filename = `Ivan_Kokalovic_CV_${profile.id}.pdf`;
	saveAs(blob, filename);
}
