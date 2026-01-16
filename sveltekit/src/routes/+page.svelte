<script lang="ts">
	import { base } from '$app/paths';
	import { skills, getSkillsByCategory, getSkillUrl, skillCategories } from '$lib/data/skills';
	import { languages } from '$lib/data/languages';
	import { experiences } from '$lib/data/experience';
	import ScrollReveal from '$lib/components/visual/ScrollReveal.svelte';
	import AnimatedDivider from '$lib/components/visual/AnimatedDivider.svelte';

	const stats = [
		{ number: '7+', label: 'Years Experience' },
		{ number: '5', label: 'Companies' },
		{ number: '15+', label: 'Skill Categories' },
		{ number: '6', label: 'Languages' }
	];

	// Group skills by category for display
	const skillGroups = [
		{ name: 'Programming', category: 'Programming Languages', icon: 'M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2a2 2 0 0 0 2-2V5h2V3H8m8 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2Z' },
		{ name: 'Infrastructure & DevOps', category: 'Infrastructure & DevOps', icon: 'M6.5 20q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20h-12Z' },
		{ name: 'Databases', category: 'Databases', icon: 'M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4m0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2s-6-1.5-6-2s2.13-2 6-2' },
		{ name: 'Monitoring', category: 'Monitoring', icon: 'M16 11.78l4.24-7.33l1.73 1l-5.23 9.05l-6.51-3.75L5.46 19H22v2H2V3h2v14.54L9.5 8l6.5 3.78Z' },
		{ name: 'Security & Identity', category: 'Security & Identity', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4m0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8Z' },
		{ name: 'AI & Computer Vision', category: 'AI & Computer Vision', icon: 'M21.33 12.91c.09 1.55-.62 3.04-1.89 3.95l.77 1.49c.23.45.26.98.06 1.45c-.19.47-.58.84-1.06 1l-.79.26a1.62 1.62 0 0 1-1.67-.49l-.39-.44c-1.15.49-2.43.59-3.63.29l-.35.62c-.3.54-.84.92-1.46.99c-.63.07-1.26-.17-1.68-.64l-.49-.55a5.28 5.28 0 0 1-3.15-1.27l-.65.65c-.38.38-.92.56-1.44.48c-.53-.08-.99-.41-1.24-.88l-.39-.75c-.29-.56-.24-1.22.13-1.73L2.1 16.3c-.71-1.09-1.03-2.4-.91-3.71c.11-1.31.66-2.54 1.57-3.51l-.56-.9a1.6 1.6 0 0 1-.06-1.61c.21-.52.64-.91 1.18-1.06l.78-.22c.53-.15 1.11-.02 1.5.35l.38.35c1.19-.6 2.53-.81 3.85-.6l.29-.49c.3-.51.82-.86 1.41-.93c.59-.08 1.19.14 1.6.58l.5.53a5.3 5.3 0 0 1 3.07 1.3l.58-.52c.41-.37.97-.51 1.5-.38c.53.13.97.49 1.19.97l.36.76c.23.48.19 1.04-.11 1.49l-.69 1.01c.79 1.15 1.18 2.52 1.09 3.9' }
	];
</script>

<svelte:head>
	<title>Ivan Kokalovic - Backend Developer & Infrastructure Engineer</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero-section">
	<div class="hero-content">
		<img src="{base}/images/profile.jpg" alt="Ivan Kokalovic" class="hero-avatar" />
		<h1 class="hero-title">Ivan Kokalovic</h1>
		<p class="hero-subtitle">Backend Developer & Infrastructure Engineer</p>
		<p class="hero-location">Bremen, Germany</p>
		<div class="hero-actions">
			<a href="{base}/cv" class="button button-primary">View Full CV</a>
			<a href="{base}/download" class="button button-secondary">Download PDF</a>
		</div>
	</div>
</section>

<AnimatedDivider variant="wave" />

<!-- Stats -->
<ScrollReveal>
	<section class="stats-container">
		{#each stats as stat, i}
			<div class="stat-card" style:--delay="{i * 100}ms">
				<span class="stat-number">{stat.number}</span>
				<span class="stat-label">{stat.label}</span>
			</div>
		{/each}
	</section>
</ScrollReveal>

<AnimatedDivider variant="dots" />

<!-- About -->
<ScrollReveal delay={100}>
	<section>
		<h2>About Me</h2>
		<p>
			Backend Developer at <strong>RISE</strong> (Research Industrial Systems Engineering) in Leipzig, specializing in infrastructure management, IAM systems, and backend development with Terragrunt, Java, Terraform, and Docker.
		</p>
		<p>
			Previously spent over 4 years at <strong>IDnow</strong>, progressing from Ident Specialist through Fraud Prevention to Technical Services Engineer. Built OCR engines, wrote Lambda functions, and worked with monitoring tools like Graylog and Grafana.
		</p>
		<p>
			Founded <strong>In Voice d.o.o.</strong> in Bosnia and Herzegovina - an IT consulting company where I built CRM systems, developed OCR solutions using Beowulf clusters, and worked on VoIP infrastructure.
		</p>
	</section>
</ScrollReveal>

<AnimatedDivider variant="gradient" />

<!-- Technical Skills -->
<ScrollReveal delay={150}>
	<section>
		<h2>Technical Skills</h2>
		<div class="skills-grid">
			{#each skillGroups as group, i}
				{@const categorySkills = getSkillsByCategory(group.category)}
				{#if categorySkills.length > 0}
					<ScrollReveal delay={i * 80} direction="up">
						<div class="skill-card">
							<div class="skill-header">
								<span class="skill-icon">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path fill="currentColor" d={group.icon}/>
									</svg>
								</span>
								<span class="skill-name">{group.name}</span>
							</div>
							<div class="skill-tags">
								{#each categorySkills as skill}
									{@const url = getSkillUrl(skill)}
									{#if url}
										<a href={url} target="_blank" rel="noopener noreferrer" class="tech-badge">
											{skill.name}
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12">
												<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
											</svg>
										</a>
									{:else}
										<span class="tech-badge">{skill.name}</span>
									{/if}
								{/each}
							</div>
						</div>
					</ScrollReveal>
				{/if}
			{/each}
		</div>
	</section>
</ScrollReveal>

<AnimatedDivider variant="wave" />

<!-- Experience Timeline (Simple) -->
<ScrollReveal delay={200}>
	<section>
		<h2>Experience Timeline</h2>
		<div class="experience-table">
			<table>
				<thead>
					<tr>
						<th>Period</th>
						<th>Role</th>
						<th>Company</th>
					</tr>
				</thead>
				<tbody>
					{#each experiences as exp}
						<tr>
							<td>{exp.startDate.split('-')[0]} - {exp.endDate === 'present' ? 'Present' : exp.endDate.split('-')[0]}</td>
							<td>{exp.position}</td>
							<td>{exp.company.includes('RISE') ? 'RISE, Leipzig' : exp.company.includes('IDnow') ? 'IDnow' : exp.company}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="text-center" style="margin-top: 1rem;">
			<a href="{base}/cv" class="button button-secondary">View Interactive Timeline</a>
		</p>
	</section>
</ScrollReveal>

<AnimatedDivider variant="dots" />

<!-- Languages -->
<ScrollReveal delay={100}>
	<section>
		<h2>Languages</h2>
		<div class="language-grid">
			{#each languages as lang, i}
				<ScrollReveal delay={i * 50} direction="up">
					<div class="language-card" class:certified={lang.certified}>
						<span class="language-flag">{lang.flagEmoji}</span>
						<span class="language-name">{lang.name}</span>
						<span class="language-level">{lang.level}</span>
						<div class="proficiency-dots">
							{#each Array(6) as _, j}
								<span class="dot" class:filled={j < lang.levelNumber}></span>
							{/each}
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</section>
</ScrollReveal>

<AnimatedDivider variant="gradient" />

<!-- Award -->
<ScrollReveal delay={150}>
	<section>
		<h2>Honours & Awards</h2>
		<a href="https://sscitluk.ba/najbolji-na-skolskom-natjecanju-iz-njemackog-jezika/" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
			<div class="award-card shimmer">
				<span class="award-icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path fill="currentColor" d="M18 2c-.9 0-2 1-2 2H8c0-1-1.1-2-2-2H2v9c0 1 1 2 2 2h2.2c.4 2 1.7 3.7 4.8 4v2.08c-2 .2-3 1.92-3 2.92h8c0-1-1-2.72-3-2.92V17c3.1-.3 4.4-2 4.8-4H20c1 0 2-1 2-2V2h-4M6 11H4V4h2v7m14 0h-2V4h2v7Z"/>
					</svg>
				</span>
				<div class="award-content">
					<h4>First Place - German Language Competition</h4>
					<p>2015 - Recognized for excellence in German language proficiency</p>
				</div>
			</div>
		</a>
	</section>
</ScrollReveal>

<AnimatedDivider variant="wave" />

<!-- Quick Links -->
<ScrollReveal delay={100}>
	<section>
		<h2>Quick Links</h2>
		<div class="download-grid">
			{#each [
				{ href: `${base}/cv`, icon: 'M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6m0 2h7v5h5v11H6V4m2 8v2h8v-2H8m0 4v2h5v-2H8Z', format: 'Full CV', desc: 'Complete details' },
				{ href: `${base}/creative`, icon: 'M21 3v12.5a3.5 3.5 0 0 1-3.5 3.5a3.5 3.5 0 0 1-3.5-3.5a3.5 3.5 0 0 1 3.5-3.5c.54 0 1.05.12 1.5.34V6.47L9 8.6v8.9A3.5 3.5 0 0 1 5.5 21A3.5 3.5 0 0 1 2 17.5A3.5 3.5 0 0 1 5.5 14c.54 0 1.05.12 1.5.34V6l14-3Z', format: 'Creative', desc: 'Music & Art' },
				{ href: `${base}/download`, icon: 'M5 20h14v-2H5v2M19 9h-4V3H9v6H5l7 7l7-7Z', format: 'Download', desc: 'PDF, DOCX, ODT' },
				{ href: `${base}/contact`, icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5v2Z', format: 'Contact', desc: 'Get in touch' }
			] as link, i}
				<ScrollReveal delay={i * 80} direction="up">
					<a href={link.href} class="download-card">
						<span class="download-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path fill="currentColor" d={link.icon}/>
							</svg>
						</span>
						<span class="download-format">{link.format}</span>
						<span class="download-desc">{link.desc}</span>
					</a>
				</ScrollReveal>
			{/each}
		</div>
	</section>
</ScrollReveal>

<div class="text-center text-muted" style="margin-top: var(--space-lg);">
	<p>Last updated: January 2026</p>
</div>

<style>
	.hero-section {
		position: relative;
		min-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: var(--space-xl) 0;
	}

	h2 {
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-sm);
		border-bottom: 2px solid var(--cv-border);
		position: relative;
	}

	h2::before {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 40px;
		height: 2px;
		background: var(--cv-accent);
	}

	.experience-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9375rem;
	}

	th, td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--cv-border);
	}

	th {
		font-weight: 600;
		color: var(--cv-text-muted);
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
	}

	td {
		color: var(--cv-text);
	}

	tr:hover td {
		background: var(--cv-cream);
	}

	/* Stat card stagger animation */
	.stat-card {
		animation: statReveal 0.6s ease-out forwards;
		animation-delay: var(--delay, 0ms);
		opacity: 0;
		transform: translateY(20px);
	}

	@keyframes statReveal {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Award shimmer effect */
	.award-card.shimmer {
		position: relative;
		overflow: hidden;
	}

	.award-card.shimmer::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.15),
			transparent
		);
		animation: shimmer 3s infinite;
	}

	@keyframes shimmer {
		0% {
			left: -100%;
		}
		50%, 100% {
			left: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stat-card {
			animation: none;
			opacity: 1;
			transform: none;
		}

		.award-card.shimmer::after {
			animation: none;
		}
	}
</style>
