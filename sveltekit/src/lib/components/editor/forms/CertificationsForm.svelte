<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { CertificationEntry } from '$lib/export/types';

	let certifications = $state<CertificationEntry[]>([]);

	cvEditor.subscribe((data) => {
		certifications = [...data.certifications];
	});

	function updateCert(index: number, field: keyof CertificationEntry, value: string) {
		const updated = [...certifications];
		updated[index] = { ...updated[index], [field]: value };
		cvEditor.updateCertifications(updated);
		isDirty.markDirty();
	}

	function addCertification() {
		cvEditor.addCertification();
		isDirty.markDirty();
	}

	function removeCertification(index: number) {
		cvEditor.removeCertification(index);
		isDirty.markDirty();
	}
</script>

<div class="form-section">
	<div class="section-header">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
			<path fill="currentColor" d="M4 3c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2h8v5l3-3l3 3v-5h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4m8 2l3 2l3-2v4l-3 2l-3-2V5M4 5h6v2H4V5m0 4h4v2H4V9m0 4h4v2H4v-2z" />
		</svg>
		<h3>Certifications</h3>
		<button class="add-btn" onclick={addCertification}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			Add
		</button>
	</div>

	<div class="certs-list">
		{#each certifications as cert, index}
			<div class="cert-card">
				<div class="cert-inputs">
					<div class="form-group name">
						<label>Certification Name</label>
						<input
							type="text"
							value={cert.name}
							onchange={(e) => updateCert(index, 'name', e.currentTarget.value)}
							placeholder="AWS Solutions Architect"
						/>
					</div>
					<div class="form-group issuer">
						<label>Issuing Organization</label>
						<input
							type="text"
							value={cert.issuer}
							onchange={(e) => updateCert(index, 'issuer', e.currentTarget.value)}
							placeholder="Amazon Web Services"
						/>
					</div>
					<div class="form-group date">
						<label>Date (optional)</label>
						<input
							type="month"
							value={cert.date || ''}
							onchange={(e) => updateCert(index, 'date', e.currentTarget.value)}
						/>
					</div>
					<button
						class="remove-btn"
						onclick={() => removeCertification(index)}
						title="Remove certification"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
							<path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
						</svg>
					</button>
				</div>
			</div>
		{/each}
	</div>

	{#if certifications.length === 0}
		<div class="empty-state">
			<p>No certifications added yet.</p>
			<button class="add-btn-large" onclick={addCertification}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
				Add Certification
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

	.certs-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.cert-card {
		background: var(--cv-cream);
		padding: var(--space-sm);
		border-radius: 8px;
	}

	.cert-inputs {
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
		flex: 2;
	}

	.form-group.issuer {
		flex: 1.5;
	}

	.form-group.date {
		flex: 1;
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

	@media (max-width: 768px) {
		.cert-inputs {
			flex-wrap: wrap;
		}

		.form-group.name,
		.form-group.issuer {
			flex: 100%;
		}

		.form-group.date {
			flex: 1;
		}
	}
</style>
