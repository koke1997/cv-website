<script lang="ts">
	import { theme } from '$lib/stores/theme';
</script>

<button
	class="theme-toggle"
	on:click={() => theme.toggle()}
	aria-label="Toggle dark mode"
	title={$theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
	{#if $theme === 'light'}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M17.75 4.09L15.22 6.03l2.13 3.09l3.62-.83a9.02 9.02 0 0 0-3.22-4.2M12.88 3.03a8.97 8.97 0 0 0-5.24 1.5l2.1 2.1l3.14-3.6m4.52 10.5l1.88 2.89a9.02 9.02 0 0 0 1.22-5.3l-3.1.41m-3.12 5.38l-.6 3.72a9.03 9.03 0 0 0 4.02-1.87l-3.42-1.85m-6.56.76l-3.66 1.87a8.94 8.94 0 0 0 5.24 1.5l-1.58-3.37m-4.49-9.47a8.96 8.96 0 0 0-1.22 5.3l3.1-.41l-1.88-4.89M7.37 6.63L5.25 4.51a8.98 8.98 0 0 0-1.77 5.44l3.89-.85l-3-2.47m5.77-2.32l.61-3.72a9.04 9.04 0 0 0-4.03 1.88l3.42 1.84M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/>
		</svg>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z"/>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--cv-border);
		border-radius: 8px;
		cursor: pointer;
		color: var(--cv-text);
		transition: var(--transition-fast);
	}

	.theme-toggle:hover {
		background: var(--cv-cream);
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}
</style>
