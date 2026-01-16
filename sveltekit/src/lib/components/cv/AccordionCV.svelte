<script lang="ts">
	import { base } from '$app/paths';
	import AccordionSection from './AccordionSection.svelte';
	import Timeline from './Timeline.svelte';
	import { education, certifications, projects } from '$lib/data/experience';
	import { skillCategories, getSkillsByCategory, getSkillUrl } from '$lib/data/skills';
	import { languages } from '$lib/data/languages';
</script>

<div class="accordion-cv">
	<!-- Hero Section -->
	<section class="cv-hero">
		<div class="hero-content">
			<h1 class="page-title">Curriculum Vitae</h1>
			<p class="page-subtitle">
				Click on any section to expand and view detailed information
			</p>
			<a href="{base}/download" class="download-btn">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M5 20h14v-2H5v2zm7-18v12l4-4h3L12 17L5 10h3l1 .01V2h3z" />
				</svg>
				Download CV
			</a>
		</div>
	</section>

	<!-- Accordion Sections -->
	<div class="accordion-container">
		<!-- Experience Section -->
		<AccordionSection sectionId="experience">
			<Timeline />
		</AccordionSection>

		<!-- Education Section -->
		<AccordionSection sectionId="education">
			<div class="education-grid">
				{#each education as edu}
					<div class="education-card">
						<div class="edu-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
								<path
									fill="currentColor"
									d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72L5.18 9L12 5.28L18.82 9zM17 15.99l-5 2.73l-5-2.73v-3.72L12 15l5-2.73v3.72z"
								/>
							</svg>
						</div>
						<div class="edu-content">
							<h3 class="edu-degree">{edu.degree}</h3>
							<p class="edu-area">{edu.area}</p>
							<p class="edu-institution">{edu.institution}</p>
							<p class="edu-dates">{edu.startDate} - {edu.endDate}</p>
							{#if edu.highlights && edu.highlights.length > 0}
								<ul class="edu-highlights">
									{#each edu.highlights as highlight}
										<li>{highlight}</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</AccordionSection>

		<!-- Skills Section -->
		<AccordionSection sectionId="skills">
			<div class="skills-categories">
				{#each skillCategories as category}
					{@const categorySkills = getSkillsByCategory(category)}
					{#if categorySkills.length > 0}
						<div class="skill-category">
							<h3 class="category-name">{category}</h3>
							<div class="skills-list">
								{#each categorySkills as skill}
									{@const url = getSkillUrl(skill)}
									{#if url}
										<a
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											class="skill-badge"
											title={skill.note || skill.name}
										>
											{skill.name}
											{#if skill.repos && skill.repos.length > 0}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="12"
													height="12"
													class="github-icon"
												>
													<path
														fill="currentColor"
														d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
													/>
												</svg>
											{/if}
										</a>
									{:else}
										<span class="skill-badge" title={skill.note || skill.name}>{skill.name}</span>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</AccordionSection>

		<!-- Certifications Section -->
		<AccordionSection sectionId="certifications">
			<div class="certifications-grid">
				{#each certifications as cert}
					<div class="cert-card">
						<div class="cert-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
								<path
									fill="currentColor"
									d="M4 3c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2h8v5l3-3l3 3v-5h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm8 2l3 2l-3 2l-3-2l3-2zm-7 4h6v1H5V9zm8 0h6v1h-6V9zM5 11h6v1H5v-1zm8 0h6v1h-6v-1z"
								/>
							</svg>
						</div>
						<div class="cert-content">
							<h4 class="cert-name">{cert.name}</h4>
							<p class="cert-issuer">{cert.issuer}</p>
						</div>
					</div>
				{/each}
			</div>
		</AccordionSection>

		<!-- Languages Section -->
		<AccordionSection sectionId="languages">
			<div class="languages-grid">
				{#each languages as lang}
					<div class="language-card">
						<span class="lang-flag">{lang.flagEmoji}</span>
						<div class="lang-info">
							<span class="lang-name">{lang.name}</span>
							<span class="lang-level">{lang.level}</span>
						</div>
						<div class="lang-bar">
							<div class="lang-fill" style="width: {(lang.levelNumber / 6) * 100}%"></div>
						</div>
					</div>
				{/each}
			</div>
		</AccordionSection>

		<!-- Projects Section -->
		<AccordionSection sectionId="projects">
			<div class="projects-grid">
				{#each projects as project}
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						class="project-card"
					>
						<div class="project-header">
							<h4 class="project-name">{project.name}</h4>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="external-icon">
								<path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7Z" />
							</svg>
						</div>
						<p class="project-description">{project.description}</p>
						{#if project.technologies && project.technologies.length > 0}
							<div class="project-tech">
								{#each project.technologies as tech}
									<span class="tech-tag">{tech}</span>
								{/each}
							</div>
						{/if}
					</a>
				{/each}
			</div>
		</AccordionSection>
	</div>
</div>

<style>
	.accordion-cv {
		padding-bottom: var(--space-xl);
	}

	.cv-hero {
		text-align: center;
		padding: var(--space-lg) 0 var(--space-xl);
		margin-bottom: var(--space-md);
	}

	.page-title {
		font-family: var(--font-display);
		font-size: 2.5rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-xs);
	}

	.page-subtitle {
		font-size: 1rem;
		color: var(--cv-text-muted);
		margin: 0 0 var(--space-md);
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--cv-accent);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 500;
		transition: var(--transition-fast);
	}

	.download-btn:hover {
		background: var(--cv-accent-light);
		transform: translateY(-1px);
	}

	.accordion-container {
		display: flex;
		flex-direction: column;
	}

	/* Education */
	.education-grid {
		display: grid;
		gap: var(--space-md);
	}

	.education-card {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-md);
		background: var(--cv-cream);
		border-radius: 12px;
	}

	.edu-icon {
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--cv-accent-glow);
		border-radius: 12px;
		color: var(--cv-accent);
		flex-shrink: 0;
	}

	.edu-content {
		flex: 1;
	}

	.edu-degree {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--cv-charcoal);
		margin: 0 0 0.125rem;
	}

	.edu-area {
		font-size: 0.9375rem;
		color: var(--cv-accent);
		margin: 0;
	}

	.edu-institution {
		font-size: 0.875rem;
		color: var(--cv-text-muted);
		margin: 0.25rem 0;
	}

	.edu-dates {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
		margin: 0;
	}

	.edu-highlights {
		margin: var(--space-sm) 0 0;
		padding-left: 1.25rem;
		font-size: 0.9375rem;
		color: var(--cv-text);
	}

	/* Skills */
	.skills-categories {
		display: grid;
		gap: var(--space-md);
	}

	.skill-category {
		padding: var(--space-md);
		background: var(--cv-cream);
		border-radius: 12px;
	}

	.category-name {
		font-family: var(--font-display);
		font-size: 1rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem 0.75rem;
		background: var(--cv-paper);
		color: var(--cv-text);
		font-size: 0.875rem;
		border-radius: 20px;
		text-decoration: none;
		transition: var(--transition-fast);
		border: 1px solid transparent;
	}

	a.skill-badge:hover {
		background: var(--cv-accent-glow);
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}

	.github-icon {
		opacity: 0.7;
	}

	/* Certifications */
	.certifications-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-md);
	}

	.cert-card {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--cv-cream);
		border-radius: 12px;
	}

	.cert-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--cv-accent-glow);
		border-radius: 8px;
		color: var(--cv-accent);
		flex-shrink: 0;
	}

	.cert-content {
		flex: 1;
		min-width: 0;
	}

	.cert-name {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.cert-issuer {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
		margin: 0;
	}

	/* Languages */
	.languages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-md);
	}

	.language-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: var(--space-md);
		background: var(--cv-cream);
		border-radius: 12px;
	}

	.lang-flag {
		font-size: 2rem;
	}

	.lang-info {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.lang-name {
		font-weight: 500;
		color: var(--cv-charcoal);
	}

	.lang-level {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
	}

	.lang-bar {
		height: 4px;
		background: var(--cv-paper);
		border-radius: 2px;
		overflow: hidden;
	}

	.lang-fill {
		height: 100%;
		background: var(--cv-accent);
		border-radius: 2px;
		transition: width 0.5s ease;
	}

	/* Projects */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-md);
	}

	.project-card {
		padding: var(--space-md);
		background: var(--cv-cream);
		border: 1px solid transparent;
		border-radius: 12px;
		text-decoration: none;
		transition: var(--transition-smooth);
	}

	.project-card:hover {
		border-color: var(--cv-accent);
		box-shadow: 0 4px 20px rgba(211, 82, 51, 0.1);
		transform: translateY(-2px);
	}

	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.project-name {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.external-icon {
		color: var(--cv-text-muted);
	}

	.project-description {
		font-size: 0.9375rem;
		color: var(--cv-text);
		line-height: 1.5;
		margin: 0 0 var(--space-sm);
	}

	.project-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.tech-tag {
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		background: var(--cv-paper);
		color: var(--cv-text-muted);
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.certifications-grid {
			grid-template-columns: 1fr;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}

		.education-card {
			flex-direction: column;
		}
	}
</style>
