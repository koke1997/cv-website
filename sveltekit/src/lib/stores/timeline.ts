import { writable } from 'svelte/store';

export const selectedJobId = writable<string | null>(null);

export function selectJob(id: string) {
	selectedJobId.update((current) => (current === id ? null : id));
}

export function clearSelection() {
	selectedJobId.set(null);
}
