import {
	Document,
	Paragraph,
	TextRun,
	HeadingLevel,
	AlignmentType,
	BorderStyle,
	Packer,
	PageBreak,
	TabStopType,
	TabStopPosition
} from 'docx';
import type { CVData } from './types';
import { cleanTextForATS, formatDateRange, groupSkillsByCategory } from './utils';

export async function generateDOCX(cvData: CVData): Promise<Blob> {
	const sections = [];

	// Helper to create bullet point paragraph
	const bulletPoint = (text: string) =>
		new Paragraph({
			children: [new TextRun({ text: cleanTextForATS(text) })],
			bullet: { level: 0 },
			spacing: { after: 100 }
		});

	// Helper for section header
	const sectionHeader = (title: string) =>
		new Paragraph({
			children: [
				new TextRun({
					text: title.toUpperCase(),
					bold: true,
					size: 24
				})
			],
			spacing: { before: 300, after: 100 },
			border: {
				bottom: {
					color: 'CCCCCC',
					space: 1,
					style: BorderStyle.SINGLE,
					size: 6
				}
			}
		});

	// ==================
	// HEADER SECTION
	// ==================
	sections.push(
		// Name
		new Paragraph({
			children: [
				new TextRun({
					text: cvData.personal.name,
					bold: true,
					size: 36
				})
			],
			alignment: AlignmentType.CENTER,
			spacing: { after: 100 }
		}),
		// Title
		new Paragraph({
			children: [
				new TextRun({
					text: cvData.personal.title,
					size: 24
				})
			],
			alignment: AlignmentType.CENTER,
			spacing: { after: 100 }
		}),
		// Contact Info
		new Paragraph({
			children: [
				new TextRun({
					text: [cvData.personal.email, cvData.personal.phone, cvData.personal.location]
						.filter(Boolean)
						.join(' | '),
					size: 20
				})
			],
			alignment: AlignmentType.CENTER,
			spacing: { after: 50 }
		})
	);

	// Links
	const links = [];
	if (cvData.personal.linkedin) links.push(cvData.personal.linkedin.replace('https://', ''));
	if (cvData.personal.github) links.push(cvData.personal.github.replace('https://', ''));
	if (links.length > 0) {
		sections.push(
			new Paragraph({
				children: [new TextRun({ text: links.join(' | '), size: 20 })],
				alignment: AlignmentType.CENTER,
				spacing: { after: 200 }
			})
		);
	}

	// ==================
	// SUMMARY SECTION
	// ==================
	if (cvData.summary) {
		sections.push(
			sectionHeader('Professional Summary'),
			new Paragraph({
				children: [new TextRun({ text: cleanTextForATS(cvData.summary), size: 22 })],
				spacing: { after: 200 }
			})
		);
	}

	// ==================
	// EXPERIENCE SECTION
	// ==================
	sections.push(sectionHeader('Professional Experience'));

	for (const exp of cvData.experience) {
		// Position title
		sections.push(
			new Paragraph({
				children: [
					new TextRun({
						text: exp.position,
						bold: true,
						size: 24
					})
				],
				spacing: { before: 200, after: 50 }
			})
		);

		// Company, location, and dates
		const dateRange = formatDateRange(exp.startDate, exp.endDate, 'MMMM YYYY');
		sections.push(
			new Paragraph({
				children: [
					new TextRun({
						text: `${exp.company} | ${exp.location}`,
						size: 22
					}),
					new TextRun({
						text: `\t${dateRange}`,
						size: 22
					})
				],
				tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
				spacing: { after: 100 }
			})
		);

		// Highlights
		for (const highlight of exp.highlights) {
			sections.push(bulletPoint(highlight));
		}
	}

	// ==================
	// EDUCATION SECTION
	// ==================
	sections.push(sectionHeader('Education'));

	for (const edu of cvData.education) {
		sections.push(
			new Paragraph({
				children: [
					new TextRun({
						text: edu.degree,
						bold: true,
						size: 24
					})
				],
				spacing: { before: 200, after: 50 }
			})
		);

		const dateRange = formatDateRange(edu.startDate, edu.endDate, 'MMMM YYYY');
		sections.push(
			new Paragraph({
				children: [
					new TextRun({
						text: `${edu.institution} | ${edu.area}`,
						size: 22
					}),
					new TextRun({
						text: `\t${dateRange}`,
						size: 22
					})
				],
				tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
				spacing: { after: 100 }
			})
		);

		for (const highlight of edu.highlights) {
			sections.push(bulletPoint(highlight));
		}
	}

	// ==================
	// SKILLS SECTION
	// ==================
	sections.push(sectionHeader('Technical Skills'));

	const groupedSkills = groupSkillsByCategory(cvData.skills);
	for (const [category, skillNames] of Object.entries(groupedSkills)) {
		sections.push(
			new Paragraph({
				children: [
					new TextRun({
						text: `${category}: `,
						bold: true,
						size: 22
					}),
					new TextRun({
						text: skillNames.join(', '),
						size: 22
					})
				],
				spacing: { after: 100 }
			})
		);
	}

	// ==================
	// CERTIFICATIONS SECTION
	// ==================
	if (cvData.certifications && cvData.certifications.length > 0) {
		sections.push(sectionHeader('Certifications'));

		for (const cert of cvData.certifications) {
			sections.push(bulletPoint(`${cert.name} - ${cert.issuer}`));
		}
	}

	// ==================
	// LANGUAGES SECTION
	// ==================
	if (cvData.languages && cvData.languages.length > 0) {
		sections.push(sectionHeader('Languages'));

		const langText = cvData.languages.map((l) => `${l.name} (${l.level})`).join(', ');
		sections.push(
			new Paragraph({
				children: [new TextRun({ text: langText, size: 22 })],
				spacing: { after: 100 }
			})
		);
	}

	// ==================
	// PROJECTS SECTION
	// ==================
	if (cvData.projects && cvData.projects.length > 0) {
		sections.push(sectionHeader('Notable Projects'));

		for (const project of cvData.projects.slice(0, 4)) {
			sections.push(
				new Paragraph({
					children: [
						new TextRun({
							text: project.name,
							bold: true,
							size: 24
						})
					],
					spacing: { before: 150, after: 50 }
				}),
				new Paragraph({
					children: [new TextRun({ text: cleanTextForATS(project.description), size: 22 })],
					spacing: { after: 50 }
				})
			);

			if (project.technologies && project.technologies.length > 0) {
				sections.push(
					new Paragraph({
						children: [
							new TextRun({
								text: 'Technologies: ',
								italics: true,
								size: 20
							}),
							new TextRun({
								text: project.technologies.join(', '),
								italics: true,
								size: 20
							})
						],
						spacing: { after: 100 }
					})
				);
			}
		}
	}

	// Create document
	const doc = new Document({
		sections: [
			{
				properties: {
					page: {
						margin: {
							top: 720, // 0.5 inch
							bottom: 720,
							left: 720,
							right: 720
						}
					}
				},
				children: sections
			}
		]
	});

	return await Packer.toBlob(doc);
}

// Convenience function to generate and download DOCX
export async function downloadDOCX(cvData: CVData): Promise<void> {
	const blob = await generateDOCX(cvData);
	const { saveAs } = await import('file-saver');
	saveAs(blob, 'Ivan_Kokalovic_CV.docx');
}
