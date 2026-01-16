<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { ExperienceEntry } from '$lib/export/types';

	let experiences = $state<ExperienceEntry[]>([]);
	let expandedIndex = $state<number | null>(0);

	cvEditor.subscribe((data) => {
		experiences = [...data.experience];
	});

	function updateEntry(index: number, field: keyof ExperienceEntry, value: unknown) {
		const entry = { ...experiences[index], [field]: value };
		cvEditor.updateExperience(index, entry);
		isDirty.markDirty();
	}

	function addHighlight(index: number) {
		const entry = { ...experiences[index] };
		entry.highlights = [...entry.highlights, ''];
		cvEditor.updateExperience(index, entry);
		isDirty.markDirty();
	}

	function updateHighlight(expIndex: number, highlightIndex: number, value: string) {
		const entry = { ...experiences[expIndex] };
		entry.highlights = [...entry.highlights];
		entry.highlights[highlightIndex] = value;
		cvEditor.updateExperience(expIndex, entry);
		isDirty.markDirty();
	}

	function removeHighlight(expIndex: number, highlightIndex: number) {
		const entry = { ...experiences[expIndex] };
		entry.highlights = entry.highlights.filter((_, i) => i !== highlightIndex);
		cvEditor.updateExperience(expIndex, entry);
		isDirty.markDirty();
	}

	function addExperience() {
		cvEditor.addExperience();
		isDirty.markDirty();
		expandedIndex = experiences.length; // Expand the new entry
	}

	function removeExperience(index: number) {
		cvEditor.removeExperience(index);
		isDirty.markDirty();
		if (expandedIndex === index) {
			expandedIndex = null;
		} else if (expandedIndex !== null && expandedIndex > index) {
			expandedIndex--;
		}
	}

	function toggleExpanded(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-6 0h-4V4h4v2z" />
		</svg>
		<h3>Work Experience</h3>
		<button class="add-btn" onclick={addExperience}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			Add
		</button>
	</div>

	<div class="entries-list">
		{#each experiences as exp, index}
			<div class="entry-card" class:expanded={expandedIndex === index}>
				<button class="entry-header" onclick={() => toggleExpanded(index)}>
					<div class="entry-info">
						<span class="entry-title">{exp.position || 'New Position'}</span>
						<span class="entry-subtitle">{exp.company || 'Company Name'}</span>
					</div>
					<div class="entry-actions">
						<span class="entry-dates">{exp.startDate} - {exp.endDate || 'Present'}</span>
						<svg
							class="chevron"
							class:rotated={expandedIndex === index}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="20"
							height="20"
						>
							<path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41z" />
						</svg>
					</div>
				</button>

				{#if expandedIndex === index}
					<div class="entry-content">
						<div class="form-grid">
							<div class="form-group">
								<label>Position / Job Title</label>
								<input
									type="text"
									value={exp.position}
									onchange={(e) => updateEntry(index, 'position', e.currentTarget.value)}
									placeholder="Senior Software Engineer"
								/>
							</div>

							<div class="form-group">
								<label>Company</label>
								<input
									type="text"
									value={exp.company}
									onchange={(e) => updateEntry(index, 'company', e.currentTarget.value)}
									placeholder="Company Name"
								/>
							</div>

							<div class="form-group">
								<label>Location</label>
								<input
									type="text"
									value={exp.location}
									onchange={(e) => updateEntry(index, 'location', e.currentTarget.value)}
									placeholder="City, Country"
								/>
							</div>

							<div class="form-row">
								<div class="form-group">
									<label>Start Date</label>
									<input
										type="month"
										value={exp.startDate}
										onchange={(e) => updateEntry(index, 'startDate', e.currentTarget.value)}
									/>
								</div>
								<div class="form-group">
									<label>End Date</label>
									<input
										type="month"
										value={exp.endDate}
										onchange={(e) => updateEntry(index, 'endDate', e.currentTarget.value)}
										placeholder="Present"
									/>
								</div>
							</div>
						</div>

						<div class="highlights-section">
							<div class="highlights-header">
								<label>Key Achievements & Responsibilities</label>
								<button class="small-btn" onclick={() => addHighlight(index)}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
										<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
									</svg>
									Add
								</button>
							</div>
							<div class="highlights-list">
								{#each exp.highlights as highlight, hIndex}
									<div class="highlight-item">
										<span class="bullet">•</span>
										<input
											type="text"
											value={highlight}
											onchange={(e) => updateHighlight(index, hIndex, e.currentTarget.value)}
											placeholder="Describe an achievement or responsibility..."
										/>
										<button
											class="remove-btn"
											onclick={() => removeHighlight(index, hIndex)}
											title="Remove"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
												<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
											</svg>
										</button>
									</div>
								{/each}
							</div>
						</div>

						<div class="entry-footer">
							<button class="delete-btn" onclick={() => removeExperience(index)}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
									<path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
								</svg>
								Delete Entry
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if experiences.length === 0}
		<div class="empty-state">
			<p>No work experience added yet.</p>
			<button class="add-btn-large" onclick={addExperience}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
				Add Your First Experience
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

	.entries-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.entry-card {
		border: 1px solid var(--cv-border);
		border-radius: 10px;
		overflow: hidden;
		transition: var(--transition-fast);
	}

	.entry-card.expanded {
		border-color: var(--cv-accent-light);
	}

	.entry-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		background: var(--cv-cream);
		border: none;
		cursor: pointer;
		text-align: left;
		transition: var(--transition-fast);
	}

	.entry-header:hover {
		background: var(--cv-accent-glow);
	}

	.entry-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.entry-title {
		font-weight: 600;
		color: var(--cv-charcoal);
		font-size: 0.9375rem;
	}

	.entry-subtitle {
		color: var(--cv-text-muted);
		font-size: 0.8125rem;
	}

	.entry-actions {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.entry-dates {
		color: var(--cv-text-muted);
		font-size: 0.75rem;
	}

	.chevron {
		color: var(--cv-text-muted);
		transition: transform 0.2s ease;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.entry-content {
		padding: var(--space-md);
		background: var(--cv-paper);
		border-top: 1px solid var(--cv-border);
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.form-row {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-group label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--cv-text-muted);
	}

	.form-group input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--cv-border);
		border-radius: 6px;
		font-size: 0.875rem;
		color: var(--cv-text);
		background: var(--cv-cream);
		transition: var(--transition-fast);
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--cv-accent);
		background: var(--cv-paper);
		box-shadow: 0 0 0 3px var(--cv-accent-glow);
	}

	.highlights-section {
		margin-bottom: var(--space-md);
	}

	.highlights-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-xs);
	}

	.highlights-header label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--cv-text-muted);
	}

	.small-btn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: transparent;
		color: var(--cv-accent);
		border: 1px solid var(--cv-accent);
		border-radius: 4px;
		font-size: 0.75rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.small-btn:hover {
		background: var(--cv-accent);
		color: white;
	}

	.highlights-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.highlight-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.bullet {
		color: var(--cv-accent);
		font-weight: bold;
	}

	.highlight-item input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--cv-border);
		border-radius: 6px;
		font-size: 0.875rem;
		color: var(--cv-text);
		background: var(--cv-cream);
		transition: var(--transition-fast);
	}

	.highlight-item input:focus {
		outline: none;
		border-color: var(--cv-accent);
		background: var(--cv-paper);
		box-shadow: 0 0 0 3px var(--cv-accent-glow);
	}

	.remove-btn {
		padding: 0.25rem;
		background: transparent;
		border: none;
		color: var(--cv-text-muted);
		cursor: pointer;
		border-radius: 4px;
		transition: var(--transition-fast);
	}

	.remove-btn:hover {
		color: #dc3545;
		background: rgba(220, 53, 69, 0.1);
	}

	.entry-footer {
		display: flex;
		justify-content: flex-end;
		padding-top: var(--space-sm);
		border-top: 1px solid var(--cv-border);
	}

	.delete-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		background: transparent;
		color: #dc3545;
		border: 1px solid #dc3545;
		border-radius: 6px;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.delete-btn:hover {
		background: #dc3545;
		color: white;
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
		.form-grid {
			grid-template-columns: 1fr;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.entry-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.entry-actions {
			width: 100%;
			justify-content: space-between;
		}
	}
</style>
