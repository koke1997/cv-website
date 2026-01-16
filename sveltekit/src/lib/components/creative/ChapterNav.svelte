<script lang="ts">
	interface Chapter {
		number: number;
		title: string;
	}

	interface Props {
		chapters: Chapter[];
		activeChapter: number;
		onSelect: (chapter: number) => void;
	}

	let { chapters, activeChapter, onSelect }: Props = $props();
</script>

<nav class="chapter-nav">
	<div class="nav-title">Chapters</div>
	<ul class="chapter-list">
		{#each chapters as chapter}
			<li>
				<button
					class="chapter-item"
					class:active={activeChapter === chapter.number}
					onclick={() => onSelect(chapter.number)}
				>
					<span class="chapter-number">{chapter.number}</span>
					<span class="chapter-title">{chapter.title}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.chapter-nav {
		position: sticky;
		top: calc(var(--header-height) + 2rem);
		padding: 1.5rem 0;
	}

	.nav-title {
		font-family: var(--font-serif, Georgia, 'Times New Roman', serif);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #8b8680;
		margin-bottom: 1rem;
		padding-left: 0.5rem;
	}

	.chapter-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.chapter-item {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		width: 100%;
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.chapter-item:hover {
		background: rgba(139, 134, 128, 0.08);
	}

	.chapter-item.active {
		background: rgba(139, 134, 128, 0.12);
	}

	.chapter-number {
		font-family: var(--font-serif, Georgia, 'Times New Roman', serif);
		font-size: 0.8rem;
		color: #8b8680;
		min-width: 1.5rem;
	}

	.chapter-item.active .chapter-number {
		color: #1a1a1a;
	}

	.chapter-title {
		font-family: var(--font-serif, Georgia, 'Times New Roman', serif);
		font-size: 0.9rem;
		color: #5a5550;
		line-height: 1.4;
	}

	.chapter-item.active .chapter-title {
		color: #1a1a1a;
	}

	@media (max-width: 900px) {
		.chapter-nav {
			position: static;
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 1rem 0;
			overflow-x: auto;
			border-bottom: 1px solid rgba(139, 134, 128, 0.2);
			margin-bottom: 2rem;
		}

		.nav-title {
			display: none;
		}

		.chapter-list {
			flex-direction: row;
			gap: 0.5rem;
		}

		.chapter-item {
			white-space: nowrap;
			padding: 0.5rem 1rem;
		}

		.chapter-title {
			display: none;
		}
	}
</style>
