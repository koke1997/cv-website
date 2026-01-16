<script lang="ts">
	import { editorMode, cvEditor, isDirty } from '$lib/stores/editor';
	import type { EditorMode } from '$lib/stores/editor';

	let mode = $state<EditorMode>('form');
	let dirty = $state(false);
	let showResetConfirm = $state(false);

	editorMode.subscribe((m) => (mode = m));
	isDirty.subscribe((d) => (dirty = d));

	function toggleMode() {
		editorMode.toggle();
	}

	function handleReset() {
		showResetConfirm = true;
	}

	function confirmReset() {
		cvEditor.reset();
		isDirty.markClean();
		showResetConfirm = false;
	}

	async function handleExport() {
		const { downloadPDF } = await import('$lib/export');
		let cvData: import('$lib/export/types').CVData;
		cvEditor.subscribe((d) => (cvData = d))();
		await downloadPDF(cvData!, 'universal', true);
	}
</script>

<div class="editor-toolbar">
	<div class="toolbar-left">
		<h2 class="toolbar-title">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
				<path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
			</svg>
			CV Editor
		</h2>
		{#if dirty}
			<span class="dirty-indicator" title="Unsaved changes">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="8" height="8">
					<circle cx="12" cy="12" r="10" fill="currentColor" />
				</svg>
			</span>
		{/if}
	</div>

	<div class="toolbar-center">
		<div class="mode-toggle" role="group" aria-label="Editor mode">
			<button
				class="mode-btn"
				class:active={mode === 'form'}
				onclick={() => editorMode.set('form')}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
					<path fill="currentColor" d="M4 7V5h16v2H4m0 4V9h16v2H4m0 4v-2h10v2H4m0 4v-2h7v2H4m11.41-2.83L14 14.76V20h5.24l1.41-1.41l-3.54-3.54l1.41-1.41l3.54 3.54L20.65 16l-5.24-5.24z" />
				</svg>
				Form
			</button>
			<button
				class="mode-btn"
				class:active={mode === 'yaml'}
				onclick={() => editorMode.set('yaml')}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
					<path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4z" />
				</svg>
				YAML
			</button>
		</div>
	</div>

	<div class="toolbar-right">
		<button class="toolbar-btn secondary" onclick={handleReset} title="Reset to defaults">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
			</svg>
			Reset
		</button>
		<button class="toolbar-btn primary" onclick={handleExport}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M5 20h14v-2H5v2zm7-18v12l4-4h3L12 17L5 10h3l1 .01V2h3z" />
			</svg>
			Export PDF
		</button>
	</div>
</div>

{#if showResetConfirm}
	<div class="reset-modal-overlay" onclick={() => (showResetConfirm = false)} role="presentation">
		<div class="reset-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
			<h3>Reset CV Data?</h3>
			<p>This will restore all data to the original values. Any changes you've made will be lost.</p>
			<div class="modal-actions">
				<button class="toolbar-btn secondary" onclick={() => (showResetConfirm = false)}>
					Cancel
				</button>
				<button class="toolbar-btn danger" onclick={confirmReset}>
					Reset to Defaults
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.editor-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-md);
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 12px;
		margin-bottom: var(--space-md);
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.toolbar-left {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.toolbar-title {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--cv-charcoal);
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.toolbar-title svg {
		color: var(--cv-accent);
	}

	.dirty-indicator {
		color: var(--cv-accent);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.toolbar-center {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.mode-toggle {
		display: flex;
		background: var(--cv-cream);
		border-radius: 8px;
		padding: 3px;
	}

	.mode-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		border: none;
		background: transparent;
		color: var(--cv-text-muted);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		border-radius: 6px;
		transition: var(--transition-fast);
	}

	.mode-btn:hover {
		color: var(--cv-text);
	}

	.mode-btn.active {
		background: var(--cv-paper);
		color: var(--cv-accent);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.toolbar-right {
		display: flex;
		gap: var(--space-xs);
	}

	.toolbar-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.toolbar-btn.primary {
		background: var(--cv-accent);
		color: white;
	}

	.toolbar-btn.primary:hover {
		background: var(--cv-accent-light);
	}

	.toolbar-btn.secondary {
		background: var(--cv-cream);
		color: var(--cv-text);
		border: 1px solid var(--cv-border);
	}

	.toolbar-btn.secondary:hover {
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}

	.toolbar-btn.danger {
		background: #dc3545;
		color: white;
	}

	.toolbar-btn.danger:hover {
		background: #c82333;
	}

	/* Reset Modal */
	.reset-modal-overlay {
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

	.reset-modal {
		background: var(--cv-paper);
		padding: var(--space-lg);
		border-radius: 16px;
		max-width: 400px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
	}

	.reset-modal h3 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0 0 var(--space-sm);
	}

	.reset-modal p {
		color: var(--cv-text-muted);
		margin: 0 0 var(--space-md);
		line-height: 1.5;
	}

	.modal-actions {
		display: flex;
		gap: var(--space-sm);
		justify-content: flex-end;
	}

	@media (max-width: 640px) {
		.editor-toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toolbar-left,
		.toolbar-center,
		.toolbar-right {
			justify-content: center;
		}

		.mode-toggle {
			width: 100%;
		}

		.mode-btn {
			flex: 1;
			justify-content: center;
		}

		.toolbar-right {
			flex-wrap: wrap;
		}

		.toolbar-btn {
			flex: 1;
			justify-content: center;
		}
	}
</style>
