<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { SkillEntry } from '$lib/export/types';

	let skills = $state<SkillEntry[]>([]);
	let newSkillName = $state('');
	let newSkillCategory = $state('');

	cvEditor.subscribe((data) => {
		skills = [...data.skills];
	});

	// Get unique categories
	let categories = $derived([...new Set(skills.map((s) => s.category))].sort());

	// Group skills by category
	let groupedSkills = $derived(
		skills.reduce(
			(acc, skill) => {
				if (!acc[skill.category]) {
					acc[skill.category] = [];
				}
				acc[skill.category].push(skill);
				return acc;
			},
			{} as Record<string, SkillEntry[]>
		)
	);

	function addSkill() {
		if (newSkillName.trim() && newSkillCategory.trim()) {
			cvEditor.addSkill({
				name: newSkillName.trim(),
				category: newSkillCategory.trim()
			});
			isDirty.markDirty();
			newSkillName = '';
		}
	}

	function removeSkill(index: number) {
		cvEditor.removeSkill(index);
		isDirty.markDirty();
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addSkill();
		}
	}

	const predefinedCategories = [
		'Programming Languages',
		'Frameworks & Libraries',
		'Databases',
		'Cloud & Infrastructure',
		'Tools & DevOps',
		'Methodologies',
		'Soft Skills'
	];
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M7.5 5.6L5 7l1.6 2.6L5 12l2.5 1.4L6.1 16l2.9.9l-.5 3.1l3.1-.5l.9 2.9l2.4-1.9l2.4 1.9l.9-2.9l3.1.5l-.5-3.1l2.9-.9l-1.4-2.6l2.5-1.4l-2.5-1.4l1.4-2.6l-2.9-.9l.5-3.1l-3.1.5l-.9-2.9l-2.4 1.9l-2.4-1.9l-.9 2.9l-3.1-.5l.5 3.1l-2.9.9l1.4 2.6z" />
		</svg>
		<h3>Skills</h3>
	</div>

	<!-- Add New Skill -->
	<div class="add-skill-form">
		<div class="skill-inputs">
			<div class="form-group">
				<label for="skill-name">Skill Name</label>
				<input
					type="text"
					id="skill-name"
					bind:value={newSkillName}
					onkeypress={handleKeyPress}
					placeholder="e.g., TypeScript, React, AWS"
				/>
			</div>
			<div class="form-group">
				<label for="skill-category">Category</label>
				<div class="category-input-wrapper">
					<input
						type="text"
						id="skill-category"
						bind:value={newSkillCategory}
						onkeypress={handleKeyPress}
						placeholder="e.g., Programming Languages"
						list="category-suggestions"
					/>
					<datalist id="category-suggestions">
						{#each predefinedCategories as cat}
							<option value={cat} />
						{/each}
						{#each categories as cat}
							{#if !predefinedCategories.includes(cat)}
								<option value={cat} />
							{/if}
						{/each}
					</datalist>
				</div>
			</div>
			<button class="add-skill-btn" onclick={addSkill} disabled={!newSkillName.trim() || !newSkillCategory.trim()}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
					<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
				Add
			</button>
		</div>
	</div>

	<!-- Skills by Category -->
	<div class="skills-container">
		{#each Object.entries(groupedSkills) as [category, categorySkills]}
			<div class="category-group">
				<h4 class="category-title">{category}</h4>
				<div class="skills-grid">
					{#each categorySkills as skill}
						{@const globalIndex = skills.findIndex((s) => s.name === skill.name && s.category === skill.category)}
						<div class="skill-tag">
							<span>{skill.name}</span>
							<button
								class="remove-skill-btn"
								onclick={() => removeSkill(globalIndex)}
								title="Remove skill"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
									<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#if skills.length === 0}
		<div class="empty-state">
			<p>No skills added yet. Add your first skill above.</p>
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
	}

	.add-skill-form {
		background: var(--cv-cream);
		padding: var(--space-md);
		border-radius: 10px;
		margin-bottom: var(--space-md);
	}

	.skill-inputs {
		display: flex;
		gap: var(--space-sm);
		align-items: flex-end;
	}

	.form-group {
		flex: 1;
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
		background: var(--cv-paper);
		transition: var(--transition-fast);
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--cv-accent);
		box-shadow: 0 0 0 3px var(--cv-accent-glow);
	}

	.category-input-wrapper {
		position: relative;
	}

	.add-skill-btn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 1rem;
		background: var(--cv-accent);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: var(--transition-fast);
		white-space: nowrap;
	}

	.add-skill-btn:hover:not(:disabled) {
		background: var(--cv-accent-light);
	}

	.add-skill-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.skills-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.category-group {
		padding: var(--space-sm);
		background: var(--cv-cream);
		border-radius: 8px;
	}

	.category-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--cv-accent);
		margin: 0 0 var(--space-xs);
		padding-bottom: var(--space-xs);
		border-bottom: 1px solid var(--cv-border);
	}

	.skills-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tag {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 20px;
		font-size: 0.8125rem;
		color: var(--cv-text);
		transition: var(--transition-fast);
	}

	.skill-tag:hover {
		border-color: var(--cv-accent-light);
	}

	.remove-skill-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--cv-text-muted);
		cursor: pointer;
		opacity: 0.6;
		transition: var(--transition-fast);
	}

	.remove-skill-btn:hover {
		color: #dc3545;
		opacity: 1;
	}

	.empty-state {
		text-align: center;
		padding: var(--space-md);
		color: var(--cv-text-muted);
	}

	.empty-state p {
		margin: 0;
	}

	@media (max-width: 640px) {
		.skill-inputs {
			flex-direction: column;
			align-items: stretch;
		}

		.add-skill-btn {
			justify-content: center;
		}
	}
</style>
