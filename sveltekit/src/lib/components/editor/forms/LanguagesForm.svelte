<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { LanguageEntry } from '$lib/export/types';

	let languages = $state<LanguageEntry[]>([]);

	cvEditor.subscribe((data) => {
		languages = [...data.languages];
	});

	function updateLanguage(index: number, field: keyof LanguageEntry, value: string | number) {
		const updated = [...languages];
		updated[index] = { ...updated[index], [field]: value };
		cvEditor.updateLanguages(updated);
		isDirty.markDirty();
	}

	function addLanguage() {
		cvEditor.addLanguage();
		isDirty.markDirty();
	}

	function removeLanguage(index: number) {
		cvEditor.removeLanguage(index);
		isDirty.markDirty();
	}

	const proficiencyLevels = [
		{ value: 'Native', number: 5 },
		{ value: 'Fluent', number: 4 },
		{ value: 'Advanced', number: 3 },
		{ value: 'Intermediate', number: 2 },
		{ value: 'Basic', number: 1 }
	];
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="m12.87 15.07l-2.54-2.51l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11l.76-2.04M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12m-2.62 7l1.62-4.33L19.12 17h-3.24Z" />
		</svg>
		<h3>Languages</h3>
		<button class="add-btn" onclick={addLanguage}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			Add
		</button>
	</div>

	<div class="languages-list">
		{#each languages as lang, index}
			<div class="language-card">
				<div class="language-inputs">
					<div class="form-group name">
						<label>Language</label>
						<input
							type="text"
							value={lang.name}
							onchange={(e) => updateLanguage(index, 'name', e.currentTarget.value)}
							placeholder="English"
						/>
					</div>
					<div class="form-group level">
						<label>Proficiency Level</label>
						<select
							value={lang.level}
							onchange={(e) => {
								const selected = proficiencyLevels.find((l) => l.value === e.currentTarget.value);
								updateLanguage(index, 'level', e.currentTarget.value);
								if (selected) {
									updateLanguage(index, 'levelNumber', selected.number);
								}
							}}
						>
							<option value="">Select level</option>
							{#each proficiencyLevels as level}
								<option value={level.value}>{level.value}</option>
							{/each}
						</select>
					</div>
					<div class="proficiency-visual">
						{#each Array(5) as _, i}
							<span class="dot" class:filled={i < lang.levelNumber}></span>
						{/each}
					</div>
					<button
						class="remove-btn"
						onclick={() => removeLanguage(index)}
						title="Remove language"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
							<path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
						</svg>
					</button>
				</div>
			</div>
		{/each}
	</div>

	{#if languages.length === 0}
		<div class="empty-state">
			<p>No languages added yet.</p>
			<button class="add-btn-large" onclick={addLanguage}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
				Add Language
			</button>
		</div>
	{/if}
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
		flex: 1;
	}

	.add-btn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem 0.75rem;
		background: var(--cv-accent-glow);
		color: var(--cv-accent);
		border: none;
		border-radius: 6px;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.add-btn:hover {
		background: var(--cv-accent);
		color: white;
	}

	.languages-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.language-card {
		background: var(--cv-cream);
		padding: var(--space-sm);
		border-radius: 8px;
	}

	.language-inputs {
		display: flex;
		gap: var(--space-sm);
		align-items: flex-end;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-group.name {
		flex: 1.5;
	}

	.form-group.level {
		flex: 1.5;
	}

	.form-group label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--cv-text-muted);
	}

	.form-group input,
	.form-group select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--cv-border);
		border-radius: 6px;
		font-size: 0.875rem;
		color: var(--cv-text);
		background: var(--cv-paper);
		transition: var(--transition-fast);
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--cv-accent);
		box-shadow: 0 0 0 3px var(--cv-accent-glow);
	}

	.proficiency-visual {
		display: flex;
		gap: 4px;
		align-items: center;
		padding: 0.5rem;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--cv-border);
		transition: var(--transition-fast);
	}

	.dot.filled {
		background: var(--cv-accent);
	}

	.remove-btn {
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: var(--cv-text-muted);
		cursor: pointer;
		border-radius: 6px;
		transition: var(--transition-fast);
	}

	.remove-btn:hover {
		color: #dc3545;
		background: rgba(220, 53, 69, 0.1);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-lg);
		color: var(--cv-text-muted);
	}

	.empty-state p {
		margin: 0 0 var(--space-md);
	}

	.add-btn-large {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--cv-accent);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.add-btn-large:hover {
		background: var(--cv-accent-light);
	}

	@media (max-width: 640px) {
		.language-inputs {
			flex-wrap: wrap;
		}

		.form-group.name,
		.form-group.level {
			flex: 100%;
		}

		.proficiency-visual {
			flex: 1;
		}
	}
</style>
