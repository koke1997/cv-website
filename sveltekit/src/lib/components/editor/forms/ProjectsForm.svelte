<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { ProjectEntry } from '$lib/export/types';

	let projects = $state<ProjectEntry[]>([]);
	let expandedIndex = $state<number | null>(0);

	cvEditor.subscribe((data) => {
		projects = [...data.projects];
	});

	function updateProject(index: number, field: keyof ProjectEntry, value: unknown) {
		const updated = [...projects];
		updated[index] = { ...updated[index], [field]: value };
		cvEditor.updateProjects(updated);
		isDirty.markDirty();
	}

	function addTech(index: number, tech: string) {
		if (tech.trim()) {
			const updated = [...projects];
			updated[index] = {
				...updated[index],
				technologies: [...updated[index].technologies, tech.trim()]
			};
			cvEditor.updateProjects(updated);
			isDirty.markDirty();
		}
	}

	function removeTech(projectIndex: number, techIndex: number) {
		const updated = [...projects];
		updated[projectIndex] = {
			...updated[projectIndex],
			technologies: updated[projectIndex].technologies.filter((_, i) => i !== techIndex)
		};
		cvEditor.updateProjects(updated);
		isDirty.markDirty();
	}

	function addProject() {
		cvEditor.addProject();
		isDirty.markDirty();
		expandedIndex = projects.length;
	}

	function removeProject(index: number) {
		cvEditor.removeProject(index);
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

	let techInputs = $state<string[]>([]);
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 12H4V6h5.17l2 2H20v10m-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2z" />
		</svg>
		<h3>Projects</h3>
		<button class="add-btn" onclick={addProject}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			Add
		</button>
	</div>

	<div class="entries-list">
		{#each projects as project, index}
			<div class="entry-card" class:expanded={expandedIndex === index}>
				<button class="entry-header" onclick={() => toggleExpanded(index)}>
					<div class="entry-info">
						<span class="entry-title">{project.name || 'New Project'}</span>
						<span class="entry-subtitle">{project.technologies.slice(0, 3).join(', ') || 'No technologies'}</span>
					</div>
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
				</button>

				{#if expandedIndex === index}
					<div class="entry-content">
						<div class="form-grid">
							<div class="form-group">
								<label>Project Name</label>
								<input
									type="text"
									value={project.name}
									onchange={(e) => updateProject(index, 'name', e.currentTarget.value)}
									placeholder="My Awesome Project"
								/>
							</div>

							<div class="form-group">
								<label>URL (optional)</label>
								<input
									type="url"
									value={project.url || ''}
									onchange={(e) => updateProject(index, 'url', e.currentTarget.value)}
									placeholder="https://github.com/..."
								/>
							</div>

							<div class="form-group full-width">
								<label>Description</label>
								<textarea
									value={project.description}
									onchange={(e) => updateProject(index, 'description', e.currentTarget.value)}
									placeholder="Describe what the project does and your role..."
									rows="3"
								></textarea>
							</div>
						</div>

						<div class="tech-section">
							<div class="tech-header">
								<label>Technologies Used</label>
								<div class="tech-input-wrapper">
									<input
										type="text"
										bind:value={techInputs[index]}
										onkeypress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												addTech(index, techInputs[index] || '');
												techInputs[index] = '';
											}
										}}
										placeholder="Add technology..."
									/>
									<button
										class="small-add-btn"
										onclick={() => {
											addTech(index, techInputs[index] || '');
											techInputs[index] = '';
										}}
									>
										Add
									</button>
								</div>
							</div>
							<div class="tech-tags">
								{#each project.technologies as tech, techIndex}
									<span class="tech-tag">
										{tech}
										<button
											class="remove-tech-btn"
											onclick={() => removeTech(index, techIndex)}
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12">
												<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
											</svg>
										</button>
									</span>
								{/each}
							</div>
						</div>

						<div class="entry-footer">
							<button class="delete-btn" onclick={() => removeProject(index)}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
									<path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
								</svg>
								Delete Project
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if projects.length === 0}
		<div class="empty-state">
			<p>No projects added yet.</p>
			<button class="add-btn-large" onclick={addProject}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
				Add Project
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

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--cv-text-muted);
	}

	.form-group input,
	.form-group textarea {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--cv-border);
		border-radius: 6px;
		font-size: 0.875rem;
		font-family: inherit;
		color: var(--cv-text);
		background: var(--cv-cream);
		transition: var(--transition-fast);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
		line-height: 1.5;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--cv-accent);
		background: var(--cv-paper);
		box-shadow: 0 0 0 3px var(--cv-accent-glow);
	}

	.tech-section {
		margin-bottom: var(--space-md);
	}

	.tech-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-xs);
		gap: var(--space-sm);
	}

	.tech-header label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--cv-text-muted);
	}

	.tech-input-wrapper {
		display: flex;
		gap: 0.375rem;
	}

	.tech-input-wrapper input {
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--cv-border);
		border-radius: 4px;
		font-size: 0.8125rem;
		width: 140px;
	}

	.tech-input-wrapper input:focus {
		outline: none;
		border-color: var(--cv-accent);
	}

	.small-add-btn {
		padding: 0.25rem 0.5rem;
		background: var(--cv-accent);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.75rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.small-add-btn:hover {
		background: var(--cv-accent-light);
	}

	.tech-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.tech-tag {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: var(--cv-accent-glow);
		color: var(--cv-accent);
		border-radius: 4px;
		font-size: 0.75rem;
	}

	.remove-tech-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--cv-accent);
		cursor: pointer;
		opacity: 0.7;
		transition: var(--transition-fast);
	}

	.remove-tech-btn:hover {
		opacity: 1;
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
	}
</style>
