import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Store for the active chapter in the Creative page
// This allows the ImmersiveBackground in the layout to know which chapter is active
export const creativeChapter = writable<number>(1);

// Pattern configuration interface
export interface PatternConfig {
	opacity: number;         // 0-1 multiplier
	speed: number;           // Animation speed multiplier
	density: number;         // Particle/element count multiplier
	mouseInfluence: number;  // Mouse interaction strength
}

// Default configuration
export const defaultPatternConfig: PatternConfig = {
	opacity: 1,
	speed: 1,
	density: 1,
	mouseInfluence: 1
};

// Load saved config from localStorage
function loadPatternConfig(): PatternConfig {
	if (!browser) return { ...defaultPatternConfig };
	try {
		const saved = localStorage.getItem('patternConfig');
		if (saved) {
			return { ...defaultPatternConfig, ...JSON.parse(saved) };
		}
	} catch (e) {
		console.warn('Failed to load pattern config from localStorage:', e);
	}
	return { ...defaultPatternConfig };
}

// Create the store with persistence
function createPatternConfigStore() {
	const { subscribe, set, update } = writable<PatternConfig>(loadPatternConfig());

	return {
		subscribe,
		set: (value: PatternConfig) => {
			if (browser) {
				localStorage.setItem('patternConfig', JSON.stringify(value));
			}
			set(value);
		},
		update: (fn: (config: PatternConfig) => PatternConfig) => {
			update((current) => {
				const newValue = fn(current);
				if (browser) {
					localStorage.setItem('patternConfig', JSON.stringify(newValue));
				}
				return newValue;
			});
		},
		reset: () => {
			if (browser) {
				localStorage.removeItem('patternConfig');
			}
			set({ ...defaultPatternConfig });
		}
	};
}

export const patternConfig = createPatternConfigStore();
