<script lang="ts">
	import { activeSection, sectionMeta, type SectionId } from '$lib/stores/accordion';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { sectionId, children }: { sectionId: SectionId; children: any } = $props();

	const meta = sectionMeta[sectionId];
	let isActive = $derived($activeSection === sectionId);

	function handleClick() {
		activeSection.setActive(sectionId);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	// Icon components
	const icons: Record<string, string> = {
		briefcase: 'M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-8h16v8z',
		graduation: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72L5.18 9L12 5.28L18.82 9zM17 15.99l-5 2.73l-5-2.73v-3.72L12 15l5-2.73v3.72z',
		code: 'M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2a2 2 0 0 0 2-2V5h2V3H8m6 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2z',
		certificate: 'M4 3c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2h8v5l3-3l3 3v-5h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm8 2l3 2l-3 2l-3-2l3-2zm-7 4h6v1H5V9zm8 0h6v1h-6V9zM5 11h6v1H5v-1zm8 0h6v1h-6v-1z',
		globe: 'M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93c0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2v1.93M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2z',
		folder: 'M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'
	};
</script>

<div class="accordion-section" class:active={isActive}>
	<button
		class="accordion-header"
		onclick={handleClick}
		onkeydown={handleKeydown}
		aria-expanded={isActive}
		aria-controls="section-{sectionId}"
	>
		<div class="header-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d={icons[meta.icon]} />
			</svg>
		</div>
		<div class="header-content">
			<h2 class="header-title">{meta.title}</h2>
			<span class="header-subtitle">{meta.subtitle}</span>
		</div>
		<div class="header-chevron" class:rotated={isActive}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42z" />
			</svg>
		</div>
	</button>

	{#if isActive}
		<div
			id="section-{sectionId}"
			class="accordion-content"
			transition:slide={{ duration: 400, easing: cubicOut }}
		>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.accordion-section {
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s ease;
		margin-bottom: var(--space-sm);
	}

	.accordion-section:hover {
		border-color: var(--cv-accent-light);
	}

	.accordion-section.active {
		border-color: var(--cv-accent);
		box-shadow: 0 4px 24px rgba(211, 82, 51, 0.1);
	}

	.accordion-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		width: 100%;
		padding: var(--space-md) var(--space-lg);
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s ease;
	}

	.accordion-header:hover {
		background: var(--cv-cream);
	}

	.accordion-section.active .accordion-header {
		background: var(--cv-accent-glow);
		border-bottom: 1px solid var(--cv-border);
	}

	.header-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--cv-accent-glow);
		border-radius: 12px;
		color: var(--cv-accent);
		flex-shrink: 0;
		transition: all 0.3s ease;
	}

	.accordion-section.active .header-icon {
		background: var(--cv-accent);
		color: white;
	}

	.header-content {
		flex: 1;
		min-width: 0;
	}

	.header-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0;
		transition: color 0.3s ease;
	}

	.accordion-section.active .header-title {
		color: var(--cv-accent);
	}

	.header-subtitle {
		font-size: 0.875rem;
		color: var(--cv-text-muted);
	}

	.header-chevron {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--cv-text-muted);
		transition: transform 0.3s ease, color 0.3s ease;
		flex-shrink: 0;
	}

	.header-chevron.rotated {
		transform: rotate(180deg);
		color: var(--cv-accent);
	}

	.accordion-content {
		padding: var(--space-lg);
		background: var(--cv-paper);
	}

	@media (max-width: 768px) {
		.accordion-header {
			padding: var(--space-sm) var(--space-md);
			gap: var(--space-sm);
		}

		.header-icon {
			width: 40px;
			height: 40px;
		}

		.header-title {
			font-size: 1rem;
		}

		.header-subtitle {
			font-size: 0.75rem;
		}

		.accordion-content {
			padding: var(--space-md);
		}
	}
</style>
