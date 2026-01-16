<script lang="ts">
	import CVEditor from '$lib/components/editor/CVEditor.svelte';
</script>

<svelte:head>
	<title>CV Editor - Ivan Kokalovic</title>
	<meta name="description" content="Edit and customize your CV with the interactive editor. Export to multiple formats including PDF, DOCX, and ODT." />
</svelte:head>

<div class="editor-page">
	<CVEditor />
</div>

<style>
	.editor-page {
		padding-bottom: var(--space-xl);
	}
</style>
