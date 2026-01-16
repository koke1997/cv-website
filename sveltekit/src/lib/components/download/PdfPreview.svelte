<script lang="ts">
	import { base } from '$app/paths';

	let { isOpen = $bindable(false), pdfUrl = `${base}/Ivan_Kokalovic_CV.pdf` }: { isOpen: boolean; pdfUrl?: string } =
		$props();

	function close() {
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
	<div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="PDF Preview" tabindex="-1">
		<div class="modal-container">
			<div class="modal-header">
				<h2 class="modal-title">CV Preview</h2>
				<div class="modal-actions">
					<a href={pdfUrl} download="Ivan_Kokalovic_CV.pdf" class="download-btn">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
							<path fill="currentColor" d="M5 20h14v-2H5v2zm7-18v12l4-4h3L12 17L5 10h3l1 .01V2h3z" />
						</svg>
						Download
					</a>
					<button class="close-btn" onclick={close} type="button" aria-label="Close preview">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<path
								fill="currentColor"
								d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div class="modal-body">
				<div class="pdf-container">
					<iframe src={pdfUrl} title="CV Preview" class="pdf-iframe"></iframe>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-md);
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		background: var(--cv-paper);
		border-radius: 16px;
		width: 100%;
		max-width: 900px;
		height: 90vh;
		max-height: 900px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-md);
		border-bottom: 1px solid var(--cv-border);
		flex-shrink: 0;
	}

	.modal-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
		margin: 0;
	}

	.modal-actions {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--cv-accent);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-size: 0.9375rem;
		font-weight: 500;
		transition: var(--transition-fast);
	}

	.download-btn:hover {
		background: var(--cv-accent-light);
	}

	.close-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--cv-border);
		border-radius: 8px;
		cursor: pointer;
		color: var(--cv-text-muted);
		transition: var(--transition-fast);
	}

	.close-btn:hover {
		background: var(--cv-cream);
		border-color: var(--cv-accent);
		color: var(--cv-charcoal);
	}

	.modal-body {
		flex: 1;
		overflow: hidden;
		padding: var(--space-md);
		background: var(--cv-cream);
	}

	.pdf-container {
		width: 100%;
		height: 100%;
		border-radius: 8px;
		overflow: hidden;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.pdf-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}

	@media (max-width: 640px) {
		.modal-container {
			height: 100vh;
			max-height: none;
			border-radius: 0;
		}

		.modal-backdrop {
			padding: 0;
		}

		.modal-header {
			padding: var(--space-sm) var(--space-md);
		}
	}
</style>
