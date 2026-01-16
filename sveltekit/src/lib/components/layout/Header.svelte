<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import ThemeToggle from './ThemeToggle.svelte';

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/cv', label: 'CV' },
		{ href: '/creative', label: 'Creative' },
		{ href: '/download', label: 'Download' },
		{ href: '/editor', label: 'Editor' },
		{ href: '/contact', label: 'Contact' }
	];

	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	$: currentPath = $page.url.pathname.replace(base, '') || '/';
</script>

<header class="header">
	<div class="header-content">
		<a href="{base}/" class="logo">
			<span class="logo-text">IK</span>
		</a>

		<nav class="nav" class:open={menuOpen}>
			{#each navItems as item}
				<a
					href="{base}{item.href}"
					class="nav-link"
					class:active={currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
					on:click={closeMenu}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="header-actions">
			<ThemeToggle />
			<button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle menu">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
					{#if menuOpen}
						<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
					{:else}
						<path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
					{/if}
				</svg>
			</button>
		</div>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--cv-paper);
		border-bottom: 1px solid var(--cv-border);
		backdrop-filter: blur(10px);
	}

	.header-content {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0 var(--space-md);
		height: var(--header-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	.logo-text {
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--cv-accent);
		font-weight: 400;
	}

	.nav {
		display: flex;
		gap: var(--space-xs);
	}

	.nav-link {
		padding: 0.5rem 1rem;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--cv-text-muted);
		text-decoration: none;
		border-radius: 8px;
		transition: var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--cv-text);
		background: var(--cv-cream);
	}

	.nav-link.active {
		color: var(--cv-accent);
		background: var(--cv-accent-glow);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.menu-toggle {
		display: none;
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		color: var(--cv-text);
		transition: var(--transition-fast);
	}

	.menu-toggle:hover {
		background: var(--cv-cream);
	}

	@media (max-width: 768px) {
		.nav {
			position: fixed;
			top: var(--header-height);
			left: 0;
			right: 0;
			background: var(--cv-paper);
			border-bottom: 1px solid var(--cv-border);
			flex-direction: column;
			padding: var(--space-sm);
			transform: translateY(-100%);
			opacity: 0;
			pointer-events: none;
			transition: var(--transition-smooth);
		}

		.nav.open {
			transform: translateY(0);
			opacity: 1;
			pointer-events: auto;
		}

		.nav-link {
			padding: 0.75rem 1rem;
		}

		.menu-toggle {
			display: flex;
		}
	}
</style>
