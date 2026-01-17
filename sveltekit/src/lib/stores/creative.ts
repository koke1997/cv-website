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

// All available art patterns (25 total - includes Wasm physics engine)
// Icons are SVG identifiers - rendered in PatternConfigPanel.svelte
export const ART_PATTERNS = [
	{ id: 'wasm', name: 'Wasm Physics', icon: 'wasm', isWasm: true },
	{ id: 'particles', name: 'Particle Network', icon: 'particles' },
	{ id: 'flow', name: 'Flow Field', icon: 'flow' },
	{ id: 'gradient', name: 'Gradient Mesh', icon: 'gradient' },
	{ id: 'constellation', name: 'Constellation', icon: 'constellation' },
	{ id: 'ripple', name: 'Ripple Pulse', icon: 'ripple' },
	{ id: 'grid', name: 'Dot Grid', icon: 'grid' },
	{ id: 'voronoi', name: 'Voronoi Cells', icon: 'voronoi' },
	{ id: 'waves', name: 'Wave Contours', icon: 'waves' },
	{ id: 'hexagon', name: 'Hexagonal Grid', icon: 'hexagon' },
	{ id: 'orbits', name: 'Orbiting Rings', icon: 'orbits' },
	{ id: 'bokeh', name: 'Bokeh Lights', icon: 'bokeh' },
	{ id: 'curves', name: 'Bezier Curves', icon: 'curves' },
	{ id: 'magnetic', name: 'Magnetic Field', icon: 'magnetic' },
	{ id: 'spiral', name: 'Spiral Galaxy', icon: 'spiral' },
	{ id: 'lattice', name: 'Liquid Lattice', icon: 'lattice' },
	{ id: 'aurora', name: 'Aurora Borealis', icon: 'aurora' },
	{ id: 'circuit', name: 'Circuit Board', icon: 'circuit' },
	{ id: 'plasma', name: 'Plasma Wave', icon: 'plasma' },
	{ id: 'noise', name: 'Perlin Noise', icon: 'noise' },
	{ id: 'metaballs', name: 'Metaballs', icon: 'metaballs' },
	{ id: 'lightning', name: 'Lightning', icon: 'lightning' },
	{ id: 'terrain', name: 'Terrain Map', icon: 'terrain' },
	{ id: 'kaleidoscope', name: 'Kaleidoscope', icon: 'kaleidoscope' },
	{ id: 'matrix', name: 'Matrix Rain', icon: 'matrix' }
] as const;

export type ArtPatternId = typeof ART_PATTERNS[number]['id'];

// Selected pattern override (null = use route-based selection)
function loadSelectedPattern(): ArtPatternId | null {
	if (!browser) return null;
	try {
		const saved = localStorage.getItem('selectedPattern');
		if (saved && ART_PATTERNS.some(p => p.id === saved)) {
			return saved as ArtPatternId;
		}
	} catch (e) {
		console.warn('Failed to load selected pattern from localStorage:', e);
	}
	return null;
}

function createSelectedPatternStore() {
	const { subscribe, set } = writable<ArtPatternId | null>(loadSelectedPattern());

	return {
		subscribe,
		set: (value: ArtPatternId | null) => {
			if (browser) {
				if (value) {
					localStorage.setItem('selectedPattern', value);
				} else {
					localStorage.removeItem('selectedPattern');
				}
			}
			set(value);
		},
		clear: () => {
			if (browser) {
				localStorage.removeItem('selectedPattern');
			}
			set(null);
		}
	};
}

export const selectedPattern = createSelectedPatternStore();
