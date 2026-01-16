// CV Editor Store - Manages editable CV data
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { CVData } from '$lib/export/types';
import { getCVData } from '$lib/export/utils';

const STORAGE_KEY = 'cv-editor-data';
const MODE_STORAGE_KEY = 'cv-editor-mode';

export type EditorMode = 'form' | 'yaml';

// Initialize CV data from localStorage or from the default data
function loadInitialData(): CVData {
	if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				// Fall through to default
			}
		}
	}
	return getCVData();
}

function createEditorStore() {
	const initialData = loadInitialData();
	const { subscribe, set, update } = writable<CVData>(initialData);

	return {
		subscribe,
		set: (data: CVData) => {
			set(data);
			if (browser) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			}
		},
		update: (fn: (data: CVData) => CVData) => {
			update((current) => {
				const updated = fn(current);
				if (browser) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				}
				return updated;
			});
		},
		reset: () => {
			const defaultData = getCVData();
			set(defaultData);
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
			}
		},
		// Personal info updates
		updatePersonal: (field: string, value: string) => {
			update((data) => {
				const updated = {
					...data,
					personal: { ...data.personal, [field]: value }
				};
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Summary update
		updateSummary: (value: string) => {
			update((data) => {
				const updated = { ...data, summary: value };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Experience operations
		updateExperience: (index: number, entry: CVData['experience'][0]) => {
			update((data) => {
				const experience = [...data.experience];
				experience[index] = entry;
				const updated = { ...data, experience };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		addExperience: () => {
			update((data) => {
				const newEntry = {
					company: '',
					position: '',
					location: '',
					startDate: '',
					endDate: '',
					highlights: [],
					skills: []
				};
				const updated = { ...data, experience: [...data.experience, newEntry] };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		removeExperience: (index: number) => {
			update((data) => {
				const experience = data.experience.filter((_, i) => i !== index);
				const updated = { ...data, experience };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Education operations
		updateEducation: (index: number, entry: CVData['education'][0]) => {
			update((data) => {
				const education = [...data.education];
				education[index] = entry;
				const updated = { ...data, education };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		addEducation: () => {
			update((data) => {
				const newEntry = {
					institution: '',
					degree: '',
					area: '',
					startDate: '',
					endDate: '',
					highlights: []
				};
				const updated = { ...data, education: [...data.education, newEntry] };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		removeEducation: (index: number) => {
			update((data) => {
				const education = data.education.filter((_, i) => i !== index);
				const updated = { ...data, education };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Skills operations
		updateSkills: (skills: CVData['skills']) => {
			update((data) => {
				const updated = { ...data, skills };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		addSkill: (skill: CVData['skills'][0]) => {
			update((data) => {
				const updated = { ...data, skills: [...data.skills, skill] };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		removeSkill: (index: number) => {
			update((data) => {
				const skills = data.skills.filter((_, i) => i !== index);
				const updated = { ...data, skills };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Certifications
		updateCertifications: (certs: CVData['certifications']) => {
			update((data) => {
				const updated = { ...data, certifications: certs };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		addCertification: () => {
			update((data) => {
				const newEntry = { name: '', issuer: '' };
				const updated = { ...data, certifications: [...data.certifications, newEntry] };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		removeCertification: (index: number) => {
			update((data) => {
				const certifications = data.certifications.filter((_, i) => i !== index);
				const updated = { ...data, certifications };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Projects
		updateProjects: (projects: CVData['projects']) => {
			update((data) => {
				const updated = { ...data, projects };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		addProject: () => {
			update((data) => {
				const newEntry = { name: '', description: '', technologies: [] };
				const updated = { ...data, projects: [...data.projects, newEntry] };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		removeProject: (index: number) => {
			update((data) => {
				const projects = data.projects.filter((_, i) => i !== index);
				const updated = { ...data, projects };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		// Languages
		updateLanguages: (languages: CVData['languages']) => {
			update((data) => {
				const updated = { ...data, languages };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		addLanguage: () => {
			update((data) => {
				const newEntry = { name: '', level: '', levelNumber: 1 };
				const updated = { ...data, languages: [...data.languages, newEntry] };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		},
		removeLanguage: (index: number) => {
			update((data) => {
				const languages = data.languages.filter((_, i) => i !== index);
				const updated = { ...data, languages };
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		}
	};
}

// Editor mode store
function createModeStore() {
	const initialMode: EditorMode = browser
		? (localStorage.getItem(MODE_STORAGE_KEY) as EditorMode) || 'form'
		: 'form';

	const { subscribe, set } = writable<EditorMode>(initialMode);

	return {
		subscribe,
		set: (mode: EditorMode) => {
			set(mode);
			if (browser) {
				localStorage.setItem(MODE_STORAGE_KEY, mode);
			}
		},
		toggle: () => {
			let currentMode: EditorMode = 'form';
			subscribe((m) => (currentMode = m))();
			const newMode = currentMode === 'form' ? 'yaml' : 'form';
			set(newMode);
			if (browser) {
				localStorage.setItem(MODE_STORAGE_KEY, newMode);
			}
		}
	};
}

// Dirty state tracking
function createDirtyStore() {
	const { subscribe, set, update } = writable(false);
	return {
		subscribe,
		markDirty: () => set(true),
		markClean: () => set(false)
	};
}

export const cvEditor = createEditorStore();
export const editorMode = createModeStore();
export const isDirty = createDirtyStore();

// Derived store for YAML representation
export const cvAsYAML = derived(cvEditor, ($cv) => {
	return JSON.stringify($cv, null, 2);
});
