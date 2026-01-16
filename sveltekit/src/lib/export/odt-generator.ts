import JSZip from 'jszip';
import type { CVData } from './types';
import { cleanTextForATS, formatDateRange, groupSkillsByCategory } from './utils';

// ODT is an OpenDocument format - a ZIP file containing XML files
export async function generateODT(cvData: CVData): Promise<Blob> {
	const zip = new JSZip();

	// Mimetype must be first and uncompressed
	zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });

	// Add META-INF/manifest.xml
	zip.file('META-INF/manifest.xml', generateManifestXML());

	// Add meta.xml (document metadata)
	zip.file('meta.xml', generateMetaXML(cvData));

	// Add styles.xml
	zip.file('styles.xml', generateStylesXML());

	// Add content.xml (main document content)
	zip.file('content.xml', generateContentXML(cvData));

	return await zip.generateAsync({
		type: 'blob',
		mimeType: 'application/vnd.oasis.opendocument.text'
	});
}

function escapeXML(text: string): string {
	return cleanTextForATS(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function generateManifestXML(): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
}

function generateMetaXML(cvData: CVData): string {
	const now = new Date().toISOString();
	return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
    xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    office:version="1.2">
  <office:meta>
    <dc:title>CV - ${escapeXML(cvData.personal.name)}</dc:title>
    <dc:creator>${escapeXML(cvData.personal.name)}</dc:creator>
    <dc:description>Curriculum Vitae</dc:description>
    <meta:creation-date>${now}</meta:creation-date>
    <dc:date>${now}</dc:date>
  </office:meta>
</office:document-meta>`;
}

function generateStylesXML(): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
    xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
    xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
    xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
    office:version="1.2">
  <office:styles>
    <style:style style:name="Standard" style:family="paragraph" style:class="text">
      <style:paragraph-properties fo:margin-top="0mm" fo:margin-bottom="2mm"/>
      <style:text-properties fo:font-size="11pt" fo:font-family="Arial"/>
    </style:style>
    <style:style style:name="Heading" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:paragraph-properties fo:margin-top="5mm" fo:margin-bottom="2mm" fo:border-bottom="0.5pt solid #CCCCCC"/>
      <style:text-properties fo:font-size="12pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Title" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:paragraph-properties fo:text-align="center" fo:margin-bottom="3mm"/>
      <style:text-properties fo:font-size="18pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Subtitle" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:paragraph-properties fo:text-align="center" fo:margin-bottom="2mm"/>
      <style:text-properties fo:font-size="12pt"/>
    </style:style>
    <style:style style:name="Contact" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:paragraph-properties fo:text-align="center" fo:margin-bottom="1mm"/>
      <style:text-properties fo:font-size="10pt"/>
    </style:style>
    <style:style style:name="JobTitle" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:paragraph-properties fo:margin-top="3mm"/>
      <style:text-properties fo:font-size="11pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Company" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:text-properties fo:font-size="11pt"/>
    </style:style>
    <style:style style:name="Bullet" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
      <style:paragraph-properties fo:margin-left="5mm"/>
      <style:text-properties fo:font-size="10pt"/>
    </style:style>
    <style:style style:name="Bold" style:family="text">
      <style:text-properties fo:font-weight="bold"/>
    </style:style>
  </office:styles>
  <office:automatic-styles>
    <style:page-layout style:name="pm1">
      <style:page-layout-properties fo:page-width="210mm" fo:page-height="297mm" fo:margin-top="15mm" fo:margin-bottom="15mm" fo:margin-left="15mm" fo:margin-right="15mm"/>
    </style:page-layout>
  </office:automatic-styles>
  <office:master-styles>
    <style:master-page style:name="Standard" style:page-layout-name="pm1"/>
  </office:master-styles>
</office:document-styles>`;
}

function generateContentXML(cvData: CVData): string {
	const paragraphs: string[] = [];

	// Helper to add paragraph
	const addParagraph = (text: string, style: string = 'Standard') => {
		paragraphs.push(`<text:p text:style-name="${style}">${escapeXML(text)}</text:p>`);
	};

	const addBullet = (text: string) => {
		paragraphs.push(`<text:p text:style-name="Bullet">• ${escapeXML(text)}</text:p>`);
	};

	const addHeading = (text: string) => {
		paragraphs.push(`<text:p text:style-name="Heading">${escapeXML(text.toUpperCase())}</text:p>`);
	};

	// ==================
	// HEADER
	// ==================
	addParagraph(cvData.personal.name, 'Title');
	addParagraph(cvData.personal.title, 'Subtitle');

	const contact = [cvData.personal.email, cvData.personal.phone, cvData.personal.location]
		.filter(Boolean)
		.join(' | ');
	addParagraph(contact, 'Contact');

	const links = [];
	if (cvData.personal.linkedin) links.push(cvData.personal.linkedin.replace('https://', ''));
	if (cvData.personal.github) links.push(cvData.personal.github.replace('https://', ''));
	if (links.length > 0) {
		addParagraph(links.join(' | '), 'Contact');
	}

	// ==================
	// SUMMARY
	// ==================
	if (cvData.summary) {
		addHeading('Professional Summary');
		addParagraph(cvData.summary);
	}

	// ==================
	// EXPERIENCE
	// ==================
	addHeading('Professional Experience');

	for (const exp of cvData.experience) {
		const dateRange = formatDateRange(exp.startDate, exp.endDate, 'MMMM YYYY');
		addParagraph(exp.position, 'JobTitle');
		addParagraph(`${exp.company} | ${exp.location} | ${dateRange}`, 'Company');

		for (const highlight of exp.highlights) {
			addBullet(highlight);
		}
	}

	// ==================
	// EDUCATION
	// ==================
	addHeading('Education');

	for (const edu of cvData.education) {
		const dateRange = formatDateRange(edu.startDate, edu.endDate, 'MMMM YYYY');
		addParagraph(edu.degree, 'JobTitle');
		addParagraph(`${edu.institution} | ${edu.area} | ${dateRange}`, 'Company');

		for (const highlight of edu.highlights) {
			addBullet(highlight);
		}
	}

	// ==================
	// SKILLS
	// ==================
	addHeading('Technical Skills');

	const groupedSkills = groupSkillsByCategory(cvData.skills);
	for (const [category, skillNames] of Object.entries(groupedSkills)) {
		paragraphs.push(
			`<text:p text:style-name="Standard"><text:span text:style-name="Bold">${escapeXML(category)}:</text:span> ${escapeXML(skillNames.join(', '))}</text:p>`
		);
	}

	// ==================
	// CERTIFICATIONS
	// ==================
	if (cvData.certifications && cvData.certifications.length > 0) {
		addHeading('Certifications');
		for (const cert of cvData.certifications) {
			addBullet(`${cert.name} - ${cert.issuer}`);
		}
	}

	// ==================
	// LANGUAGES
	// ==================
	if (cvData.languages && cvData.languages.length > 0) {
		addHeading('Languages');
		const langText = cvData.languages.map((l) => `${l.name} (${l.level})`).join(', ');
		addParagraph(langText);
	}

	// ==================
	// PROJECTS
	// ==================
	if (cvData.projects && cvData.projects.length > 0) {
		addHeading('Notable Projects');
		for (const project of cvData.projects.slice(0, 4)) {
			addParagraph(project.name, 'JobTitle');
			addParagraph(project.description, 'Company');
			if (project.technologies && project.technologies.length > 0) {
				addParagraph(`Technologies: ${project.technologies.join(', ')}`);
			}
		}
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
    xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
    xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
    office:version="1.2">
  <office:body>
    <office:text>
      ${paragraphs.join('\n      ')}
    </office:text>
  </office:body>
</office:document-content>`;
}

// Convenience function to generate and download ODT
export async function downloadODT(cvData: CVData): Promise<void> {
	const blob = await generateODT(cvData);
	const { saveAs } = await import('file-saver');
	saveAs(blob, 'Ivan_Kokalovic_CV.odt');
}
