<script lang="ts">
	const contactMethods = [
		{
			name: 'Email',
			value: 'ivankokalovic@protonmail.ch',
			href: 'mailto:ivankokalovic@protonmail.ch',
			icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5v2Z',
			description: 'Best for detailed inquiries',
			primary: true
		},
		{
			name: 'LinkedIn',
			value: 'in/kokalovic',
			href: 'https://www.linkedin.com/in/kokalovic/',
			icon: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z',
			description: 'Professional networking',
			external: true
		},
		{
			name: 'GitHub',
			value: 'koke1997',
			href: 'https://github.com/koke1997',
			icon: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z',
			description: 'Open source contributions',
			external: true
		}
	];

	const availability = {
		status: 'Available',
		message: 'Open to new opportunities',
		details: 'Currently looking for Backend Developer and Infrastructure Engineer roles.'
	};
</script>

<svelte:head>
	<title>Contact - Ivan Kokalovic</title>
	<meta name="description" content="Get in touch with Ivan Kokalović - Backend Developer & Infrastructure Engineer" />
</svelte:head>

<div class="contact-page">
	<section class="contact-hero">
		<h1 class="page-title">Get in Touch</h1>
		<p class="page-subtitle">
			Interested in working together? I'd love to hear from you.
		</p>
	</section>

	<!-- Availability Status -->
	<section class="availability-section">
		<div class="availability-card">
			<div class="status-indicator">
				<span class="status-dot"></span>
				<span class="status-text">{availability.status}</span>
			</div>
			<h3 class="availability-title">{availability.message}</h3>
			<p class="availability-details">{availability.details}</p>
		</div>
	</section>

	<!-- Contact Methods -->
	<section class="contact-methods">
		<h2 class="section-title">Contact Methods</h2>
		<div class="methods-grid">
			{#each contactMethods as method}
				<a
					href={method.href}
					class="method-card"
					class:primary={method.primary}
					target={method.external ? '_blank' : undefined}
					rel={method.external ? 'noopener noreferrer' : undefined}
				>
					<div class="method-icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
							<path fill="currentColor" d={method.icon} />
						</svg>
					</div>
					<div class="method-content">
						<h3 class="method-name">
							{method.name}
							{#if method.external}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="14"
									height="14"
									class="external-icon"
								>
									<path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7Z" />
								</svg>
							{/if}
						</h3>
						<p class="method-value">{method.value}</p>
						<p class="method-description">{method.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Location -->
	<section class="location-section">
		<h2 class="section-title">Location</h2>
		<div class="location-card">
			<div class="location-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
					<path
						fill="currentColor"
						d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"
					/>
				</svg>
			</div>
			<div class="location-content">
				<h3 class="location-city">Germany</h3>
				<p class="location-details">Based in Leipzig / Munich area</p>
				<p class="location-note">Open to remote work and relocation within EU</p>
			</div>
		</div>
	</section>

	<!-- Salary Expectations -->
	<section class="expectations-section">
		<h2 class="section-title">Expectations</h2>
		<div class="expectations-card">
			<div class="expectation-item">
				<span class="expectation-label">Minimum Salary</span>
				<span class="expectation-value">€70,000</span>
			</div>
			<div class="expectation-item">
				<span class="expectation-label">Work Model</span>
				<span class="expectation-value">Remote / Hybrid</span>
			</div>
			<div class="expectation-item">
				<span class="expectation-label">Contract Type</span>
				<span class="expectation-value">Full-time</span>
			</div>
		</div>
	</section>
</div>

<style>
	.contact-page {
		padding-bottom: var(--space-xl);
	}

	.contact-hero {
		text-align: center;
		padding: var(--space-xl) 0;
		margin-bottom: var(--space-lg);
	}

	.page-title {
		font-family: var(--font-display);
		font-size: 2.5rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-xs);
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: var(--cv-text-muted);
		margin: 0;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-md);
	}

	/* Availability */
	.availability-section {
		margin-bottom: var(--space-xl);
	}

	.availability-card {
		background: linear-gradient(135deg, var(--cv-accent) 0%, var(--cv-accent-light) 100%);
		border-radius: 16px;
		padding: var(--space-lg);
		text-align: center;
		color: white;
	}

	.status-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.875rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		margin-bottom: var(--space-sm);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		background: #4ade80;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.status-text {
		font-size: 0.875rem;
		font-weight: 500;
	}

	.availability-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		margin: 0 0 0.5rem;
	}

	.availability-details {
		font-size: 1rem;
		opacity: 0.9;
		margin: 0;
	}

	/* Contact Methods */
	.contact-methods {
		margin-bottom: var(--space-xl);
	}

	.methods-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-md);
	}

	.method-card {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-md);
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 16px;
		text-decoration: none;
		transition: var(--transition-smooth);
	}

	.method-card:hover {
		border-color: var(--cv-accent);
		box-shadow: 0 8px 30px rgba(211, 82, 51, 0.12);
		transform: translateY(-2px);
	}

	.method-card.primary {
		background: var(--cv-accent-glow);
		border-color: rgba(211, 82, 51, 0.2);
	}

	.method-icon {
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--cv-cream);
		border-radius: 12px;
		color: var(--cv-accent);
		flex-shrink: 0;
	}

	.method-card.primary .method-icon {
		background: white;
	}

	.method-content {
		flex: 1;
		min-width: 0;
	}

	.method-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--cv-charcoal);
		margin: 0 0 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.external-icon {
		opacity: 0.5;
	}

	.method-value {
		font-size: 0.9375rem;
		color: var(--cv-accent);
		font-weight: 500;
		margin: 0;
		word-break: break-all;
	}

	.method-description {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
		margin: 0.25rem 0 0;
	}

	/* Location */
	.location-section {
		margin-bottom: var(--space-xl);
	}

	.location-card {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-md);
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 16px;
	}

	.location-icon {
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

	.location-content {
		flex: 1;
	}

	.location-city {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.location-details {
		font-size: 0.9375rem;
		color: var(--cv-text);
		margin: 0.25rem 0;
	}

	.location-note {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
		margin: 0;
	}

	/* Expectations */
	.expectations-section {
		margin-bottom: var(--space-lg);
	}

	.expectations-card {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--space-md);
		padding: var(--space-md);
		background: var(--cv-cream);
		border-radius: 16px;
	}

	.expectation-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: var(--space-sm);
		background: var(--cv-paper);
		border-radius: 12px;
		text-align: center;
	}

	.expectation-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--cv-text-muted);
	}

	.expectation-value {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--cv-accent);
	}

	@media (max-width: 640px) {
		.page-title {
			font-size: 2rem;
		}

		.methods-grid {
			grid-template-columns: 1fr;
		}

		.location-card {
			flex-direction: column;
			text-align: center;
		}

		.location-icon {
			margin: 0 auto;
		}
	}
</style>
