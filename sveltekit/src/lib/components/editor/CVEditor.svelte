<script lang="ts">
	import EditorToolbar from './EditorToolbar.svelte';
	import FormEditor from './FormEditor.svelte';
	import YAMLEditor from './YAMLEditor.svelte';
	import { editorMode } from '$lib/stores/editor';
	import type { EditorMode } from '$lib/stores/editor';

	let mode = $state<EditorMode>('form');

	editorMode.subscribe((m) => (mode = m));
</script>

<div class="cv-editor-container">
	<EditorToolbar />

	<div class="editor-content">
		{#if mode === 'form'}
			<FormEditor />
		{:else}
			<YAMLEditor />
		{/if}
	</div>
</div>

<style>
	.cv-editor-container {
		max-width: 900px;
		margin: 0 auto;
	}

	.editor-content {
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
