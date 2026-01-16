<script lang="ts">
	import { cvEditor, isDirty } from '$lib/stores/editor';
	import type { CVData } from '$lib/export/types';
	import { onMount } from 'svelte';

	let jsonContent = $state('');
	let error = $state('');
	let isValid = $state(true);

	cvEditor.subscribe((data) => {
		jsonContent = JSON.stringify(data, null, 2);
	});

	function handleInput(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		jsonContent = textarea.value;
		validateAndSave();
	}

	function validateAndSave() {
		try {
			const parsed = JSON.parse(jsonContent) as CVData;
			// Basic validation
			if (!parsed.personal || !parsed.experience || !parsed.education || !parsed.skills) {
				throw new Error('Missing required fields: personal, experience, education, or skills');
			}
			cvEditor.set(parsed);
			isDirty.markDirty();
			error = '';
			isValid = true;
		} catch (e) {
			isValid = false;
			error = e instanceof Error ? e.message : 'Invalid JSON';
		}
	}

	function formatJSON() {
		try {
			const parsed = JSON.parse(jsonContent);
			jsonContent = JSON.stringify(parsed, null, 2);
			error = '';
			isValid = true;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Cannot format invalid JSON';
		}
	}

	// Handle tab key for indentation
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault();
			const textarea = e.target as HTMLTextAreaElement;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			// Insert tab character
			const newValue = jsonContent.substring(0, start) + '  ' + jsonContent.substring(end);
			jsonContent = newValue;

			// Move cursor
			requestAnimationFrame(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 2;
			});
		}
	}
</script>

<div class="yaml-editor">
	<div class="editor-header">
		<div class="header-left">
			<span class="status-indicator" class:valid={isValid} class:invalid={!isValid}>
				{#if isValid}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
						<path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" />
					</svg>
					Valid JSON
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
						<path fill="currentColor" d="M13 13H11V7H13M13 17H11V15H13M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2Z" />
					</svg>
					Invalid
				{/if}
			</span>
		</div>
		<div class="header-right">
			<button class="format-btn" onclick={formatJSON}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
					<path fill="currentColor" d="M3 3v18h18V3H3m16 16H5V5h14v14M11 7h2v2h-2V7m0 4h2v6h-2v-6Z" />
				</svg>
				Format
			</button>
		</div>
	</div>

	{#if error}
		<div class="error-banner">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
				<path fill="currentColor" d="M13 13H11V7H13M13 17H11V15H13M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2Z" />
			</svg>
			<span>{error}</span>
		</div>
	{/if}

	<div class="editor-container">
		<div class="line-numbers" aria-hidden="true">
			{#each jsonContent.split('\n') as _, i}
				<span>{i + 1}</span>
			{/each}
		</div>
		<textarea
			class="code-editor"
			class:has-error={!isValid}
			value={jsonContent}
			oninput={handleInput}
			onkeydown={handleKeyDown}
			spellcheck="false"
			autocomplete="off"
			autocorrect="off"
			autocapitalize="off"
		></textarea>
	</div>

	<div class="editor-footer">
		<span class="hint">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
				<path fill="currentColor" d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
			</svg>
			Edit the JSON directly. Changes are saved automatically when valid.
		</span>
	</div>
</div>

<style>
	.yaml-editor {
		background: var(--cv-paper);
		border: 1px solid var(--cv-border);
		border-radius: 12px;
		overflow: hidden;
	}

	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-md);
		background: var(--cv-cream);
		border-bottom: 1px solid var(--cv-border);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.status-indicator.valid {
		color: #28a745;
	}

	.status-indicator.invalid {
		color: #dc3545;
	}

	.header-right {
		display: flex;
		gap: var(--space-xs);
	}

	.format-btn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem 0.75rem;
		background: var(--cv-paper);
		color: var(--cv-text);
		border: 1px solid var(--cv-border);
		border-radius: 6px;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: var(--transition-fast);
	}

	.format-btn:hover {
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: var(--space-xs) var(--space-md);
		background: rgba(220, 53, 69, 0.1);
		color: #dc3545;
		font-size: 0.8125rem;
		border-bottom: 1px solid rgba(220, 53, 69, 0.2);
	}

	.editor-container {
		display: flex;
		min-height: 500px;
		max-height: 70vh;
		overflow: auto;
	}

	.line-numbers {
		display: flex;
		flex-direction: column;
		padding: var(--space-sm);
		background: var(--cv-cream);
		border-right: 1px solid var(--cv-border);
		text-align: right;
		user-select: none;
		min-width: 50px;
	}

	.line-numbers span {
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--cv-text-muted);
	}

	.code-editor {
		flex: 1;
		padding: var(--space-sm);
		border: none;
		resize: none;
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--cv-text);
		background: var(--cv-paper);
		tab-size: 2;
	}

	.code-editor:focus {
		outline: none;
	}

	.code-editor.has-error {
		background: rgba(220, 53, 69, 0.05);
	}

	.editor-footer {
		padding: var(--space-xs) var(--space-md);
		background: var(--cv-cream);
		border-top: 1px solid var(--cv-border);
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.75rem;
		color: var(--cv-text-muted);
	}

	.hint svg {
		flex-shrink: 0;
	}
</style>
