<script lang="ts">
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { creativeChapter } from '$lib/stores/creative';

	const chapters = [
		{ number: 1, title: 'Flow', subtitle: 'Move your mouse to shape the field' },
		{ number: 2, title: 'Center', subtitle: 'Watch the ripples follow your cursor' },
		{ number: 3, title: 'Form', subtitle: 'Explore the rotating geometry' },
		{ number: 4, title: 'Wave', subtitle: 'See patterns emerge from motion' },
		{ number: 5, title: 'Connection', subtitle: 'Draw lines between the nodes' }
	];

	let activeChapter = $state(1);

	function selectChapter(num: number) {
		activeChapter = num;
		creativeChapter.set(num);
	}

	$effect(() => {
		creativeChapter.set(activeChapter);
	});

	let currentChapter = $derived(chapters.find((c) => c.number === activeChapter) || chapters[0]);
</script>

<svelte:head>
	<title>The Way of Code - Ivan Kokalovic</title>
	<meta name="description" content="Where algorithms meet philosophy - an immersive creative experience" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="creative-page">

	<!-- Floating chapter indicators -->
	<nav class="chapter-dots">
		{#each chapters as chapter}
			<button
				class="dot"
				class:active={activeChapter === chapter.number}
				onclick={() => selectChapter(chapter.number)}
				aria-label="Chapter {chapter.number}: {chapter.title}"
			>
				<span class="dot-number">{chapter.number}</span>
			</button>
		{/each}
	</nav>

	<!-- Minimal floating UI -->
	<main class="content">
		{#key activeChapter}
			<article class="chapter">
				<header class="chapter-header">
					<div class="chapter-meta">
						<span class="chapter-number">{currentChapter.number.toString().padStart(2, '0')}</span>
						<span class="chapter-divider">/</span>
						<span class="chapter-total">05</span>
					</div>
					<h1 class="chapter-title">{currentChapter.title}</h1>
					<p class="chapter-subtitle">{currentChapter.subtitle}</p>
				</header>
			</article>
		{/key}
	</main>

	<!-- Navigation hints -->
	<div class="nav-hints">
		{#if activeChapter > 1}
			<button class="nav-hint prev" onclick={() => selectChapter(activeChapter - 1)}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
				</svg>
				<span>{chapters[activeChapter - 2]?.title}</span>
			</button>
		{/if}
		{#if activeChapter < 5}
			<button class="nav-hint next" onclick={() => selectChapter(activeChapter + 1)}>
				<span>{chapters[activeChapter]?.title}</span>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
				</svg>
			</button>
		{/if}
	</div>

	<!-- Footer -->
	<footer class="page-footer">
		<a href="{base}/cv" class="footer-link">
			View my professional journey →
		</a>
	</footer>
</div>

<style>
	.creative-page {
		--font-serif: 'Cormorant Garamond', Georgia, serif;
		--text-dark: #1a1a1a;
		--text-muted: #5a5550;
		--text-light: #8b8680;

		min-height: 100vh;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}

	/* Chapter navigation dots */
	.chapter-dots {
		position: fixed;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 100;
	}

	.dot {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(30, 30, 30, 0.1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	.dot:hover {
		transform: scale(1.1);
		background: rgba(255, 255, 255, 0.95);
	}

	.dot.active {
		background: var(--text-dark);
		transform: scale(1.15);
	}

	.dot-number {
		font-family: var(--font-serif);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-muted);
		transition: color 0.3s ease;
	}

	.dot.active .dot-number {
		color: white;
	}

	/* Main content */
	.content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6rem 2rem;
		min-height: 100vh;
	}

	.chapter {
		max-width: 600px;
		animation: fadeUp 0.6s ease;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.chapter-header {
		text-align: center;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(20px);
		border-radius: 16px;
		padding: 2rem 3rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.5);
	}

	.chapter-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--text-light);
		margin-bottom: 1rem;
	}

	.chapter-number {
		font-weight: 500;
	}

	.chapter-divider {
		opacity: 0.5;
	}

	.chapter-title {
		font-family: var(--font-serif);
		font-size: 4rem;
		font-weight: 300;
		color: var(--text-dark);
		margin: 0;
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.chapter-subtitle {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-style: italic;
		color: var(--text-muted);
		margin: 0.75rem 0 0;
	}

	/* Navigation hints */
	.nav-hints {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 2rem;
		z-index: 100;
	}

	.nav-hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(30, 30, 30, 0.1);
		border-radius: 30px;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.nav-hint:hover {
		background: var(--text-dark);
		color: white;
	}

	.nav-hint svg {
		opacity: 0.7;
	}

	/* Footer */
	.page-footer {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 100;
	}

	.footer-link {
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--text-light);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer-link:hover {
		color: var(--text-dark);
	}

	/* Responsive */
	@media (max-width: 900px) {
		.chapter-dots {
			right: 1rem;
			top: auto;
			bottom: 6rem;
			flex-direction: row;
			transform: none;
		}

		.dot {
			width: 36px;
			height: 36px;
		}

		.chapter-title {
			font-size: 3rem;
		}

		.nav-hints {
			display: none;
		}

		.page-footer {
			bottom: 1rem;
			right: 1rem;
		}
	}

	@media (max-width: 600px) {
		.content {
			padding: 4rem 1rem;
		}

		.chapter-title {
			font-size: 2.5rem;
		}

		.wisdom-line {
			font-size: 1.25rem;
		}

		.chapter-content {
			padding: 1.5rem;
		}
	}

	/* Dark mode */
	:global([data-theme='dark']) .creative-page {
		--text-dark: #e8e4dc;
		--text-muted: #a8a49c;
		--text-light: #6b6860;
	}

	:global([data-theme='dark']) .dot {
		background: rgba(30, 30, 30, 0.8);
		border-color: rgba(255, 255, 255, 0.1);
	}

	:global([data-theme='dark']) .dot.active {
		background: #e8e4dc;
	}

	:global([data-theme='dark']) .dot.active .dot-number {
		color: #1a1a1a;
	}

	:global([data-theme='dark']) .chapter-content {
		background: rgba(30, 30, 30, 0.85);
		border-color: rgba(255, 255, 255, 0.1);
	}

	:global([data-theme='dark']) .nav-hint {
		background: rgba(30, 30, 30, 0.9);
		border-color: rgba(255, 255, 255, 0.1);
	}

	:global([data-theme='dark']) .toggle-code:hover {
		background: #e8e4dc;
		color: #1a1a1a;
		border-color: #e8e4dc;
	}

	:global([data-theme='dark']) .nav-hint:hover {
		background: #e8e4dc;
		color: #1a1a1a;
	}
</style>
