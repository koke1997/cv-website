import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const defaultTheme: Theme = 'light';

	// Get initial theme from localStorage or default
	const initialTheme: Theme = browser
		? (localStorage.getItem('theme') as Theme) || defaultTheme
		: defaultTheme;

	const { subscribe, set, update } = writable<Theme>(initialTheme);

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const newTheme: Theme = current === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', newTheme);
					document.documentElement.setAttribute('data-theme', newTheme);
				}
				return newTheme;
			});
		},
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.setAttribute('data-theme', theme);
			}
			set(theme);
		}
	};
}

export const theme = createThemeStore();
