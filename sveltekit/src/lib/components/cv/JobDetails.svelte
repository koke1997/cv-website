<script lang="ts">
	import { selectedJobId, clearSelection } from '$lib/stores/timeline';
	import { getExperienceById, formatDateRange } from '$lib/data/experience';
	import { companies } from '$lib/data/companies';

	const experience = $derived($selectedJobId ? getExperienceById($selectedJobId) : null);
	const company = $derived(experience ? companies[experience.company] : null);
</script>

<aside class="job-details" class:visible={experience !== null}>
	{#if experience}
		<div class="details-header">
			<button class="close-btn" onclick={clearSelection} type="button" aria-label="Close details">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
					<path
						fill="currentColor"
						d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
					/>
				</svg>
			</button>
			<div class="header-content">
				{#if company?.logo}
					<img src={company.logo} alt={company.shortName} class="company-logo" />
				{/if}
				<div class="header-text">
					<h2 class="position">{experience.position}</h2>
					<div class="company-row">
						{#if company?.url}
							<a href={company.url} target="_blank" rel="noopener noreferrer" class="company-link">
								{company.shortName || experience.company}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
									<path
										fill="currentColor"
										d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7Z"
									/>
								</svg>
							</a>
						{:else}
							<span class="company-name">{experience.company}</span>
						{/if}
					</div>
					<div class="meta-row">
						<span class="date">{formatDateRange(experience.startDate, experience.endDate)}</span>
						<span class="divider">•</span>
						<span class="location">{experience.location}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="details-body">
			<section class="details-section">
				<h3 class="section-title">Responsibilities</h3>
				<ul class="highlights-list">
					{#each experience.highlights as highlight}
						<li>{highlight}</li>
					{/each}
				</ul>
			</section>

			{#if experience.achievements && experience.achievements.length > 0}
				<section class="details-section">
					<h3 class="section-title">Key Achievements</h3>
					<ul class="achievements-list">
						{#each experience.achievements as achievement}
							<li>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="16"
									height="16"
									class="achievement-icon"
								>
									<path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" />
								</svg>
								{achievement}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<section class="details-section">
				<h3 class="section-title">Skills Utilized</h3>
				<div class="skills-tags">
					{#each experience.skills as skill}
						<span class="skill-tag">{skill}</span>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</aside>

<style>
	.job-details {
		position: sticky;
		top: calc(var(--header-height) + var(--space-lg));
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 16px;
		padding: 0;
		max-height: calc(100vh - var(--header-height) - var(--space-xl));
		overflow-y: auto;
		opacity: 0;
		transform: translateX(20px);
		transition: var(--transition-smooth);
		pointer-events: none;
	}

	.job-details.visible {
		opacity: 1;
		transform: translateX(0);
		pointer-events: auto;
	}

	.details-header {
		position: sticky;
		top: 0;
		background: var(--cv-paper);
		padding: var(--space-md);
		border-bottom: 1px solid var(--cv-border);
		z-index: 1;
	}

	.close-btn {
		position: absolute;
		top: var(--space-sm);
		right: var(--space-sm);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		color: var(--cv-text-muted);
		transition: var(--transition-fast);
	}

	.close-btn:hover {
		background: var(--cv-cream);
		color: var(--cv-charcoal);
	}

	.header-content {
		display: flex;
		gap: var(--space-md);
		padding-right: 32px;
	}

	.company-logo {
		width: 56px;
		height: 56px;
		object-fit: contain;
		border-radius: 12px;
		background: var(--cv-cream);
		padding: 6px;
		flex-shrink: 0;
	}

	.header-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.position {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.company-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.company-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--cv-accent);
		text-decoration: none;
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.company-link:hover {
		text-decoration: underline;
	}

	.company-name {
		font-size: 0.9375rem;
		color: var(--cv-text-muted);
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
	}

	.divider {
		color: var(--cv-border);
	}

	.details-body {
		padding: var(--space-md);
	}

	.details-section {
		margin-bottom: var(--space-lg);
	}

	.details-section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 0.9375rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.highlights-list {
		margin: 0;
		padding-left: 1.25rem;
	}

	.highlights-list li {
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--cv-text);
		margin-bottom: 0.5rem;
	}

	.highlights-list li:last-child {
		margin-bottom: 0;
	}

	.achievements-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.achievements-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--cv-text);
		margin-bottom: 0.5rem;
	}

	.achievements-list li:last-child {
		margin-bottom: 0;
	}

	.achievement-icon {
		flex-shrink: 0;
		color: var(--cv-accent);
		margin-top: 0.125rem;
	}

	.skills-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tag {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		background: var(--cv-accent-glow);
		color: var(--cv-accent);
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 20px;
		border: 1px solid rgba(211, 82, 51, 0.2);
	}

	@media (max-width: 1024px) {
		.job-details {
			position: fixed;
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			max-height: 70vh;
			border-radius: 24px 24px 0 0;
			transform: translateY(100%);
			z-index: 50;
		}

		.job-details.visible {
			transform: translateY(0);
		}
	}
</style>
