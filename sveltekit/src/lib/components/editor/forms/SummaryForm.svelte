<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';

	let summary = $state('');

	cvEditor.subscribe((data) => {
		summary = data.summary || '';
	});

	function handleChange(value: string) {
		cvEditor.updateSummary(value);
		isDirty.markDirty();
	}
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
		</svg>
		<h3>Professional Summary</h3>
	</div>

	<div class="form-content">
		<label for="summary" class="sr-only">Professional Summary</label>
		<textarea
			id="summary"
			value={summary}
			onchange={(e) => handleChange(e.currentTarget.value)}
			placeholder="Write a brief professional summary highlighting your key qualifications, experience, and career goals..."
			rows="4"
		></textarea>
		<p class="char-count">{summary.length} / 500 recommended characters</p>
	</div>
</div>

<style>
	.form-section {
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 12px;
		padding: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid var(--cv-border);
	}

	.section-header svg {
		color: var(--cv-accent);
	}

	.section-header h3 {
		font-family: var(--font-display);
		font-size: 1rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--cv-border);
		border-radius: 8px;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--cv-text);
		background: var(--cv-cream);
		resize: vertical;
		min-height: 100px;
		line-height: 1.5;
		transition: var(--transition-fast);
	}

	textarea:focus {
		outline: none;
		border-color: var(--cv-accent);
		background: var(--cv-paper);
		box-shadow: 0 0 0 3px var(--cv-accent-glow);
	}

	textarea::placeholder {
		color: var(--cv-text-muted);
		opacity: 0.6;
	}

	.char-count {
		font-size: 0.75rem;
		color: var(--cv-text-muted);
		text-align: right;
		margin: 0;
	}
</style>
