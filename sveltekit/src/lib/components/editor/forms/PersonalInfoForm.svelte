<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { PersonalInfo } from '$lib/export/types';

	let personal = $state<PersonalInfo>({
		name: '',
		title: '',
		email: '',
		phone: '',
		location: '',
		linkedin: '',
		github: '',
		website: ''
	});

	cvEditor.subscribe((data) => {
		personal = { ...data.personal };
	});

	function handleChange(field: keyof PersonalInfo, value: string) {
		cvEditor.updatePersonal(field, value);
		isDirty.markDirty();
	}
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
		</svg>
		<h3>Personal Information</h3>
	</div>

	<div class="form-grid">
		<div class="form-group">
			<label for="name">Full Name</label>
			<input
				type="text"
				id="name"
				value={personal.name}
				onchange={(e) => handleChange('name', e.currentTarget.value)}
				placeholder="John Doe"
			/>
		</div>

		<div class="form-group">
			<label for="title">Professional Title</label>
			<input
				type="text"
				id="title"
				value={personal.title}
				onchange={(e) => handleChange('title', e.currentTarget.value)}
				placeholder="Senior Software Engineer"
			/>
		</div>

		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				value={personal.email}
				onchange={(e) => handleChange('email', e.currentTarget.value)}
				placeholder="john@example.com"
			/>
		</div>

		<div class="form-group">
			<label for="phone">Phone</label>
			<input
				type="tel"
				id="phone"
				value={personal.phone}
				onchange={(e) => handleChange('phone', e.currentTarget.value)}
				placeholder="+1 234 567 890"
			/>
		</div>

		<div class="form-group full-width">
			<label for="location">Location</label>
			<input
				type="text"
				id="location"
				value={personal.location}
				onchange={(e) => handleChange('location', e.currentTarget.value)}
				placeholder="City, Country"
			/>
		</div>

		<div class="form-group">
			<label for="linkedin">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
					<path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
				</svg>
				LinkedIn URL
			</label>
			<input
				type="url"
				id="linkedin"
				value={personal.linkedin || ''}
				onchange={(e) => handleChange('linkedin', e.currentTarget.value)}
				placeholder="https://linkedin.com/in/username"
			/>
		</div>

		<div class="form-group">
			<label for="github">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
					<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
				</svg>
				GitHub URL
			</label>
			<input
				type="url"
				id="github"
				value={personal.github || ''}
				onchange={(e) => handleChange('github', e.currentTarget.value)}
				placeholder="https://github.com/username"
			/>
		</div>

		<div class="form-group full-width">
			<label for="website">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
					<path fill="currentColor" d="M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2c0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2c0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2H4.26M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
				</svg>
				Website (optional)
			</label>
			<input
				type="url"
				id="website"
				value={personal.website || ''}
				onchange={(e) => handleChange('website', e.currentTarget.value)}
				placeholder="https://yourwebsite.com"
			/>
		</div>
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

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
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
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--cv-text-muted);
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.form-group label svg {
		color: var(--cv-accent);
	}

	.form-group input {
		padding: 0.625rem 0.875rem;
		border: 1px solid var(--cv-border);
		border-radius: 8px;
		font-size: 0.9375rem;
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

	.form-group input::placeholder {
		color: var(--cv-text-muted);
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
