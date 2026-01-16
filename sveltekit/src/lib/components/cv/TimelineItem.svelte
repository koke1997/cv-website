<script lang="ts">
	import { selectedJobId, selectJob } from '$lib/stores/timeline';
	import { companies } from '$lib/data/companies';
	import { formatDateRange } from '$lib/data/experience';
	import type { Experience } from '$lib/data/experience';

	let { experience }: { experience: Experience } = $props();

	const company = companies[experience.company];
	const isSelected = $derived($selectedJobId === experience.id);
</script>

<button
	class="timeline-item"
	class:selected={isSelected}
	onclick={() => selectJob(experience.id)}
	type="button"
>
	<div class="timeline-marker">
		<span class="marker-dot"></span>
		<span class="marker-line"></span>
	</div>

	<div class="timeline-content">
		<div class="timeline-header">
			<div class="company-info">
				{#if company?.logo}
					<img src={company.logo} alt={company.shortName} class="company-logo" />
				{/if}
				<div class="company-text">
					<h3 class="position">{experience.position}</h3>
					<div class="company-name">
						{#if company?.url}
							<a href={company.url} target="_blank" rel="noopener noreferrer" onclick={(e) => e.stopPropagation()}>
								{company.shortName || experience.company}
							</a>
						{:else}
							<span>{experience.company}</span>
						{/if}
					</div>
				</div>
			</div>
			<div class="timeline-meta">
				<span class="date">{formatDateRange(experience.startDate, experience.endDate)}</span>
				<span class="location">{experience.location}</span>
			</div>
		</div>

		<div class="timeline-preview">
			<p class="preview-text">{experience.highlights[0]}</p>
		</div>

		<div class="expand-indicator">
			<span class="expand-text">{isSelected ? 'Click to collapse' : 'Click for details'}</span>
			<svg
				class="expand-icon"
				class:rotated={isSelected}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="16"
				height="16"
			>
				<path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z" />
			</svg>
		</div>
	</div>
</button>

<style>
	.timeline-item {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-md);
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 12px;
		cursor: pointer;
		transition: var(--transition-smooth);
		width: 100%;
		text-align: left;
	}

	.timeline-item:hover {
		border-color: var(--cv-accent);
		box-shadow: 0 4px 20px rgba(211, 82, 51, 0.1);
	}

	.timeline-item.selected {
		border-color: var(--cv-accent);
		background: var(--cv-accent-glow);
	}

	.timeline-marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.25rem;
	}

	.marker-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--cv-border);
		border: 2px solid var(--cv-paper);
		box-shadow: 0 0 0 2px var(--cv-border);
		transition: var(--transition-fast);
	}

	.timeline-item:hover .marker-dot,
	.timeline-item.selected .marker-dot {
		background: var(--cv-accent);
		box-shadow: 0 0 0 2px var(--cv-accent);
	}

	.marker-line {
		width: 2px;
		flex: 1;
		min-height: 40px;
		background: var(--cv-border);
		margin-top: 0.5rem;
	}

	.timeline-item.selected .marker-line {
		background: var(--cv-accent);
	}

	.timeline-content {
		flex: 1;
	}

	.timeline-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
	}

	.company-info {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.company-logo {
		width: 40px;
		height: 40px;
		object-fit: contain;
		border-radius: 8px;
		background: var(--cv-cream);
		padding: 4px;
	}

	.company-text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.position {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.company-name {
		font-size: 0.9375rem;
		color: var(--cv-text-muted);
	}

	.company-name a {
		color: var(--cv-accent);
		text-decoration: none;
	}

	.company-name a:hover {
		text-decoration: underline;
	}

	.timeline-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.125rem;
	}

	.date {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--cv-charcoal);
	}

	.location {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
	}

	.timeline-preview {
		margin-bottom: var(--space-sm);
	}

	.preview-text {
		font-size: 0.9375rem;
		color: var(--cv-text);
		line-height: 1.5;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.expand-indicator {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8125rem;
		color: var(--cv-accent);
	}

	.expand-icon {
		transition: transform var(--transition-fast);
	}

	.expand-icon.rotated {
		transform: rotate(180deg);
	}

	@media (max-width: 640px) {
		.timeline-header {
			flex-direction: column;
			gap: var(--space-xs);
		}

		.timeline-meta {
			align-items: flex-start;
		}
	}
</style>
