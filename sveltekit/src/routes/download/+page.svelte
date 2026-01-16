<script lang="ts">
	import { base } from '$app/paths';
	import PdfPreview from '$lib/components/download/PdfPreview.svelte';
	import { profileMetadata } from '$lib/export/ats-profiles';

	let showPreview = $state(false);
	let isGenerating = $state(false);
	let generatingFormat = $state('');
	let copiedToClipboard = $state(false);
	let selectedAtsProfile = $state('universal');
	let hoveredProfile = $state<string | null>(null);

	// Import export functions lazily
	async function handlePDFDownload(profileId: string) {
		isGenerating = true;
		generatingFormat = `PDF (${profileId})`;
		try {
			const { getCVData, downloadPDF } = await import('$lib/export');
			const cvData = getCVData();
			await downloadPDF(cvData, profileId, true);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	async function handleDOCXDownload() {
		isGenerating = true;
		generatingFormat = 'DOCX';
		try {
			const { getCVData, downloadDOCX } = await import('$lib/export');
			const cvData = getCVData();
			await downloadDOCX(cvData);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	async function handleODTDownload() {
		isGenerating = true;
		generatingFormat = 'ODT';
		try {
			const { getCVData, downloadODT } = await import('$lib/export');
			const cvData = getCVData();
			await downloadODT(cvData);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	async function handleJSONDownload() {
		isGenerating = true;
		generatingFormat = 'JSON';
		try {
			const { getCVData, downloadJSON } = await import('$lib/export');
			const cvData = getCVData();
			await downloadJSON(cvData);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	async function handleTXTDownload() {
		isGenerating = true;
		generatingFormat = 'TXT';
		try {
			const { getCVData, downloadTXT } = await import('$lib/export');
			const cvData = getCVData();
			await downloadTXT(cvData);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	async function handleCopyToClipboard() {
		try {
			const { getCVData, copyToClipboard } = await import('$lib/export');
			const cvData = getCVData();
			await copyToClipboard(cvData);
			copiedToClipboard = true;
			setTimeout(() => (copiedToClipboard = false), 2000);
		} catch (e) {
			console.error('Failed to copy', e);
		}
	}

	async function handleDownloadAllFormats() {
		isGenerating = true;
		generatingFormat = 'All Formats ZIP';
		try {
			const { getCVData, downloadAllFormats } = await import('$lib/export');
			const cvData = getCVData();
			await downloadAllFormats(cvData);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	async function handleDownloadAllATS() {
		isGenerating = true;
		generatingFormat = 'All ATS PDFs ZIP';
		try {
			const { getCVData, downloadAllATSPDFs } = await import('$lib/export');
			const cvData = getCVData();
			await downloadAllATSPDFs(cvData);
		} finally {
			isGenerating = false;
			generatingFormat = '';
		}
	}

	// Using profileMetadata from ats-profiles module for richer ATS information

	const socialLinks = [
		{
			name: 'LinkedIn',
			description: 'View my professional profile',
			icon: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z',
			href: 'https://www.linkedin.com/in/kokalovic/'
		},
		{
			name: 'GitHub',
			description: 'Explore my projects',
			icon: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z',
			href: 'https://github.com/koke1997'
		},
		{
			name: 'Email',
			description: 'Get in touch',
			icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5v2Z',
			href: 'mailto:ivankokalovic@protonmail.ch'
		}
	];
</script>

<svelte:head>
	<title>Download CV - Ivan Kokalovic</title>
	<meta name="description" content="Download Ivan Kokalović's CV in multiple formats: PDF, DOCX, ODT. ATS-optimized versions available." />
</svelte:head>

<div class="download-page">
	<!-- Hero Section -->
	<section class="download-hero">
		<h1 class="page-title">Download My CV</h1>
		<p class="page-subtitle">Choose your preferred format. All exports are generated client-side for privacy.</p>
	</section>

	<!-- Loading Overlay -->
	{#if isGenerating}
		<div class="generating-overlay">
			<div class="generating-modal">
				<div class="spinner"></div>
				<p>Generating {generatingFormat}...</p>
			</div>
		</div>
	{/if}

	<!-- Document Formats Section -->
	<section class="format-section">
		<h2 class="section-title">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d="M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
			</svg>
			Document Formats
		</h2>
		<div class="format-grid">
			<!-- Static PDF -->
			<a
				href="{base}/Ivan_Kokalovic_CV.pdf"
				class="format-card primary"
				onclick={(e) => { e.preventDefault(); showPreview = true; }}
			>
				<div class="format-icon">📄</div>
				<div class="format-info">
					<h3>PDF</h3>
					<p>Standard format for applications</p>
				</div>
				<span class="preview-badge">Preview</span>
			</a>

			<!-- DOCX -->
			<button class="format-card" onclick={handleDOCXDownload}>
				<div class="format-icon">📝</div>
				<div class="format-info">
					<h3>DOCX</h3>
					<p>Microsoft Word format</p>
				</div>
			</button>

			<!-- ODT -->
			<button class="format-card" onclick={handleODTDownload}>
				<div class="format-icon">📘</div>
				<div class="format-info">
					<h3>ODT</h3>
					<p>LibreOffice / OpenDocument</p>
				</div>
			</button>

			<!-- JSON -->
			<button class="format-card" onclick={handleJSONDownload}>
				<div class="format-icon">📊</div>
				<div class="format-info">
					<h3>JSON</h3>
					<p>Structured data format</p>
				</div>
			</button>
		</div>
	</section>

	<!-- ATS-Optimized PDFs Section -->
	<section class="format-section">
		<h2 class="section-title">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
			</svg>
			ATS-Optimized PDFs
		</h2>
		<p class="section-description">
			Different ATS systems parse resumes differently. Choose the system your target company uses for best results.
		</p>

		<div class="ats-selector">
			<div class="ats-grid">
				{#each profileMetadata as profile}
					<button
						class="ats-option"
						class:selected={selectedAtsProfile === profile.id}
						onclick={() => selectedAtsProfile = profile.id}
						onmouseenter={() => hoveredProfile = profile.id}
						onmouseleave={() => hoveredProfile = null}
					>
						<span class="ats-icon">{profile.icon}</span>
						<span class="ats-name">{profile.name}</span>
						<span class="ats-desc">{profile.description}</span>
						{#if hoveredProfile === profile.id}
							<div class="ats-tooltip">
								<span class="tooltip-arrow"></span>
								{profile.details}
							</div>
						{/if}
					</button>
				{/each}
			</div>

			<div class="ats-actions">
				<button class="btn-primary" onclick={() => handlePDFDownload(selectedAtsProfile)}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
						<path fill="currentColor" d="M5 20h14v-2H5v2zm7-18v12l4-4h3L12 17L5 10h3l1 .01V2h3z" />
					</svg>
					Download Selected PDF
				</button>
				<button class="btn-secondary" onclick={handleDownloadAllATS}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
						<path fill="currentColor" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
					</svg>
					Download All ATS PDFs (ZIP)
				</button>
			</div>
		</div>
	</section>

	<!-- Plain Text Section -->
	<section class="format-section">
		<h2 class="section-title">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
			</svg>
			Plain Text (ATS-Safe)
		</h2>
		<p class="section-description">
			Maximum compatibility for any ATS system. Perfect for copy-pasting into application forms.
		</p>

		<div class="text-actions">
			<button class="btn-text" onclick={handleCopyToClipboard}>
				{#if copiedToClipboard}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
						<path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" />
					</svg>
					Copied!
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
						<path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z" />
					</svg>
					Copy to Clipboard
				{/if}
			</button>
			<button class="btn-text" onclick={handleTXTDownload}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
					<path fill="currentColor" d="M5 20h14v-2H5v2zm7-18v12l4-4h3L12 17L5 10h3l1 .01V2h3z" />
				</svg>
				Download .txt
			</button>
		</div>
	</section>

	<!-- Bulk Download Section -->
	<section class="bulk-section">
		<div class="bulk-card">
			<div class="bulk-icon">📦</div>
			<div class="bulk-info">
				<h3>Download All Formats</h3>
				<p>Get PDF, DOCX, ODT, TXT, and JSON in a single ZIP file</p>
			</div>
			<button class="btn-primary" onclick={handleDownloadAllFormats}>
				Download All as ZIP
			</button>
		</div>
	</section>

	<!-- Connect Section -->
	<section class="format-section">
		<h2 class="section-title">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
			</svg>
			Connect With Me
		</h2>
		<div class="social-grid">
			{#each socialLinks as link}
				<a href={link.href} target="_blank" rel="noopener noreferrer" class="social-card">
					<div class="social-icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<path fill="currentColor" d={link.icon} />
						</svg>
					</div>
					<div class="social-info">
						<h3>{link.name}</h3>
						<p>{link.description}</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="external-icon">
						<path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7Z" />
					</svg>
				</a>
			{/each}
		</div>
	</section>
</div>

<PdfPreview bind:isOpen={showPreview} />

<style>
	.download-page {
		padding-bottom: var(--space-xl);
	}

	.download-hero {
		text-align: center;
		padding: var(--space-lg) 0 var(--space-xl);
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

	/* Loading Overlay */
	.generating-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.generating-modal {
		background: var(--cv-paper);
		padding: var(--space-lg);
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--cv-cream);
		border-top-color: var(--cv-accent);
		border-radius: 50%;
		margin: 0 auto var(--space-md);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Section Styles */
	.format-section {
		margin-bottom: var(--space-xl);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-sm);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.section-title svg {
		color: var(--cv-accent);
	}

	.section-description {
		color: var(--cv-text-muted);
		font-size: 0.9375rem;
		margin: 0 0 var(--space-md);
	}

	/* Format Grid */
	.format-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-md);
	}

	.format-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md);
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 12px;
		cursor: pointer;
		transition: var(--transition-fast);
		text-decoration: none;
		text-align: left;
	}

	.format-card:hover {
		border-color: var(--cv-accent);
		box-shadow: 0 4px 20px rgba(211, 82, 51, 0.1);
		transform: translateY(-2px);
	}

	.format-card.primary {
		background: linear-gradient(135deg, var(--cv-accent) 0%, var(--cv-accent-light) 100%);
		border-color: transparent;
		color: white;
	}

	.format-icon {
		font-size: 1.75rem;
	}

	.format-info h3 {
		font-family: var(--font-display);
		font-size: 1rem;
		margin: 0;
		color: var(--cv-charcoal);
	}

	.format-card.primary .format-info h3 {
		color: white;
	}

	.format-info p {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
		margin: 0.25rem 0 0;
	}

	.format-card.primary .format-info p {
		color: rgba(255, 255, 255, 0.9);
	}

	.preview-badge {
		position: absolute;
		top: var(--space-xs);
		right: var(--space-xs);
		font-size: 0.6875rem;
		padding: 0.125rem 0.375rem;
		background: rgba(255, 255, 255, 0.9);
		color: var(--cv-accent);
		border-radius: 4px;
		font-weight: 500;
	}

	/* ATS Section */
	.ats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 0.75rem;
		margin-bottom: var(--space-md);
	}

	.ats-option {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-sm);
		background: var(--cv-paper);
		border: 2px solid var(--cv-border);
		border-radius: 10px;
		cursor: pointer;
		transition: var(--transition-fast);
		text-align: center;
	}

	.ats-option:hover {
		border-color: var(--cv-accent-light);
	}

	.ats-option.selected {
		border-color: var(--cv-accent);
		background: var(--cv-accent-glow);
	}

	.ats-icon {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.ats-name {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--cv-charcoal);
	}

	.ats-desc {
		font-size: 0.6875rem;
		color: var(--cv-text-muted);
	}

	.ats-tooltip {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--cv-charcoal);
		color: white;
		padding: 0.625rem 0.875rem;
		border-radius: 8px;
		font-size: 0.8125rem;
		line-height: 1.4;
		width: max-content;
		max-width: 240px;
		text-align: center;
		z-index: 100;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		animation: tooltipFade 0.2s ease;
	}

	@keyframes tooltipFade {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.tooltip-arrow {
		position: absolute;
		bottom: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid var(--cv-charcoal);
	}

	.ats-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	/* Buttons */
	.btn-primary,
	.btn-secondary,
	.btn-text {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-radius: 8px;
		font-weight: 500;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: var(--transition-fast);
		border: none;
	}

	.btn-primary {
		background: var(--cv-accent);
		color: white;
	}

	.btn-primary:hover {
		background: var(--cv-accent-light);
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: var(--cv-cream);
		color: var(--cv-text);
		border: 1px solid var(--cv-border);
	}

	.btn-secondary:hover {
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}

	.btn-text {
		background: var(--cv-paper);
		color: var(--cv-text);
		border: 1px solid var(--cv-border);
	}

	.btn-text:hover {
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}

	/* Text Actions */
	.text-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	/* Bulk Download */
	.bulk-section {
		margin-bottom: var(--space-xl);
	}

	.bulk-card {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--cv-cream);
		border-radius: 16px;
		flex-wrap: wrap;
	}

	.bulk-icon {
		font-size: 2.5rem;
	}

	.bulk-info {
		flex: 1;
		min-width: 200px;
	}

	.bulk-info h3 {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.bulk-info p {
		font-size: 0.875rem;
		color: var(--cv-text-muted);
		margin: 0.25rem 0 0;
	}

	/* Social Grid */
	.social-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--space-md);
	}

	.social-card {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 12px;
		text-decoration: none;
		transition: var(--transition-fast);
	}

	.social-card:hover {
		border-color: var(--cv-accent);
		box-shadow: 0 4px 20px rgba(211, 82, 51, 0.1);
	}

	.social-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--cv-accent-glow);
		border-radius: 10px;
		color: var(--cv-accent);
		flex-shrink: 0;
	}

	.social-info {
		flex: 1;
	}

	.social-info h3 {
		font-size: 1rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.social-info p {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
		margin: 0.125rem 0 0;
	}

	.external-icon {
		color: var(--cv-text-muted);
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		.page-title {
			font-size: 2rem;
		}

		.format-grid,
		.ats-grid,
		.social-grid {
			grid-template-columns: 1fr;
		}

		.bulk-card {
			flex-direction: column;
			text-align: center;
		}

		.ats-actions,
		.text-actions {
			justify-content: center;
		}
	}
</style>
