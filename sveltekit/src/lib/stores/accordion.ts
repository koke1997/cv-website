import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'cv-accordion-section';

function createAccordionStore() {
	// Try to get the initial value from localStorage
	const initialValue = browser ? localStorage.getItem(STORAGE_KEY) || 'experience' : 'experience';

	const { subscribe, set, update } = writable<string>(initialValue);

	return {
		subscribe,
		setActive: (sectionId: string) => {
			set(sectionId);
			if (browser) {
				localStorage.setItem(STORAGE_KEY, sectionId);
			}
		},
		toggle: (sectionId: string) => {
			update(current => {
				const newValue = current === sectionId ? '' : sectionId;
				if (browser) {
					localStorage.setItem(STORAGE_KEY, newValue);
				}
				return newValue;
			});
		}
	};
}

export const activeSection = createAccordionStore();

// Section metadata for accordion headers
export const sectionMeta = {
	experience: {
		title: 'Experience',
		subtitle: '7+ years of professional journey',
		icon: 'briefcase'
	},
	education: {
		title: 'Education',
		subtitle: 'Academic background',
		icon: 'graduation'
	},
	skills: {
		title: 'Technical Skills',
		subtitle: 'Technologies & tools',
		icon: 'code'
	},
	certifications: {
		title: 'Certifications',
		subtitle: 'Professional credentials',
		icon: 'certificate'
	},
	languages: {
		title: 'Languages',
		subtitle: 'Communication abilities',
		icon: 'globe'
	},
	projects: {
		title: 'Notable Projects',
		subtitle: 'Open source & personal work',
		icon: 'folder'
	}
} as const;

export type SectionId = keyof typeof sectionMeta;
