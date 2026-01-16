// CV Export System - Main Entry Point

// Types
export type { CVData, PersonalInfo, ExperienceEntry, EducationEntry, CertificationEntry, ProjectEntry, LanguageEntry, SkillEntry, ATSProfile, ExportOptions } from './types';

// Utilities
export { getCVData, formatDate, formatDateRange, cleanTextForATS, generateFileName, downloadFile, groupSkillsByCategory } from './utils';

// ATS Profiles
export { atsProfiles, getATSProfile, getATSProfileIds, profileMetadata, greenhouse, lever, workday, taleo, icims, personio, successfactors, softgarden, universal } from './ats-profiles';

// PDF Generator
export { generatePDF, downloadPDF } from './pdf-generator';

// DOCX Generator
export { generateDOCX, downloadDOCX } from './docx-generator';

// ODT Generator
export { generateODT, downloadODT } from './odt-generator';

// Plain Text Generator
export { generatePlainText, copyToClipboard, downloadTXT } from './text-generator';

// JSON Export
import type { CVData } from './types';
import { getCVData } from './utils';

export function generateJSON(cvData?: CVData): string {
	const data = cvData || getCVData();
	return JSON.stringify(data, null, 2);
}

export async function downloadJSON(cvData?: CVData): Promise<void> {
	const json = generateJSON(cvData);
	const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
	const { saveAs } = await import('file-saver');
	saveAs(blob, 'Ivan_Kokalovic_CV.json');
}

// Bulk export (all formats as ZIP)
export async function downloadAllFormats(cvData?: CVData): Promise<void> {
	const data = cvData || getCVData();
	const JSZip = (await import('jszip')).default;
	const zip = new JSZip();

	// Generate all formats
	const [pdfBlob, docxBlob, odtBlob] = await Promise.all([
		import('./pdf-generator').then((m) => m.generatePDF(data, { atsProfileId: 'universal', includeProjects: true })),
		import('./docx-generator').then((m) => m.generateDOCX(data)),
		import('./odt-generator').then((m) => m.generateODT(data))
	]);

	const { generatePlainText } = await import('./text-generator');
	const txtContent = generatePlainText(data);
	const jsonContent = generateJSON(data);

	// Add to ZIP
	zip.file('Ivan_Kokalovic_CV.pdf', pdfBlob);
	zip.file('Ivan_Kokalovic_CV.docx', docxBlob);
	zip.file('Ivan_Kokalovic_CV.odt', odtBlob);
	zip.file('Ivan_Kokalovic_CV.txt', txtContent);
	zip.file('Ivan_Kokalovic_CV.json', jsonContent);

	// Generate and download ZIP
	const zipBlob = await zip.generateAsync({ type: 'blob' });
	const { saveAs } = await import('file-saver');
	saveAs(zipBlob, 'Ivan_Kokalovic_CV_All_Formats.zip');
}

// All ATS PDFs as ZIP
export async function downloadAllATSPDFs(cvData?: CVData): Promise<void> {
	const data = cvData || getCVData();
	const { getATSProfileIds } = await import('./ats-profiles');
	const { generatePDF } = await import('./pdf-generator');
	const JSZip = (await import('jszip')).default;
	const zip = new JSZip();

	const profileIds = getATSProfileIds();

	// Generate PDFs for all ATS profiles in parallel
	const pdfPromises = profileIds.map(async (profileId) => {
		const blob = await generatePDF(data, { atsProfileId: profileId, includeProjects: true });
		return { profileId, blob };
	});

	const pdfs = await Promise.all(pdfPromises);

	// Add all to ZIP
	for (const { profileId, blob } of pdfs) {
		zip.file(`Ivan_Kokalovic_CV_${profileId}.pdf`, blob);
	}

	// Generate and download ZIP
	const zipBlob = await zip.generateAsync({ type: 'blob' });
	const { saveAs } = await import('file-saver');
	saveAs(zipBlob, 'Ivan_Kokalovic_CV_ATS_PDFs.zip');
}
