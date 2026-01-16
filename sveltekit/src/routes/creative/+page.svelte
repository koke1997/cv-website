<script lang="ts">
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import CodeDisplay from '$lib/components/creative/CodeDisplay.svelte';
	import { creativeChapter } from '$lib/stores/creative';

	const chapters = [
		{
			number: 1,
			title: 'Flow',
			subtitle: 'The art of letting go',
			code: `const FlowField = (mouse) => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const angle = noise(i, j, time);
      const mouseInfluence = distance(mouse, [i, j]);

      // Let the field guide you
      drawVector(angle + mouseInfluence);
    }
  }
};`,
			wisdom: [
				'Code flows like water—',
				'it finds its own path.',
				'',
				'The best solutions emerge',
				'when we stop forcing them.'
			],
			personal: 'After 5+ years of backend development, I learned that elegant systems design themselves. You just need to listen.'
		},
		{
			number: 2,
			title: 'Center',
			subtitle: 'Finding the core',
			code: `const ConcentricPulse = (origin) => {
  const center = mouse || screenCenter;

  for (let ring = 0; ring < 50; ring++) {
    const pulse = sin(time - ring * 0.15);
    const radius = ring * spacing + pulse;

    drawCircle(center, radius);
  }

  // Everything emanates from one point
  scatterParticles(center, maxRadius);
};`,
			wisdom: [
				'Return to the center.',
				'When complexity overwhelms—',
				'find the single source of truth.',
				'',
				'One function. One purpose.'
			],
			personal: 'From Austria to the world of distributed systems. Every complex architecture has a simple core waiting to be found.'
		},
		{
			number: 3,
			title: 'Form',
			subtitle: 'Structure in chaos',
			code: `const GeometricMesh = (rotation) => {
  const R = majorRadius;
  const r = minorRadius;

  for (let u = 0; u < segments; u++) {
    for (let v = 0; v < rings; v++) {
      // The torus: infinite yet bounded
      const [x, y, z] = torusPoint(R, r, u, v);
      const projected = rotateAndProject([x, y, z]);

      drawLine(projected);
    }
  }
};`,
			wisdom: [
				'Constraints create freedom.',
				'A torus is infinite,',
				'yet perfectly contained.',
				'',
				'So too with architecture.'
			],
			personal: 'Keycloak, Kubernetes, Terraform—complex tools that create beautiful structure from chaos. That\'s what draws me to infrastructure.'
		},
		{
			number: 4,
			title: 'Wave',
			subtitle: 'Patterns emerge',
			code: `const WaveInterference = () => {
  for (let w = 0; w < waveCount; w++) {
    for (let x = 0; x < width; x++) {
      // Three simple waves, superimposed
      const y = sin(x * f1 + time) * a1
              + sin(x * f2 + time * 0.8) * a2
              + sin(x * f3 + time * 1.5) * a3;

      plot(x, baseY + y);
    }
  }
};`,
			wisdom: [
				'Complexity from simplicity.',
				'Three waves, combined,',
				'create infinite patterns.',
				'',
				'Small functions, composed well.'
			],
			personal: 'Music production taught me this—layers of simple elements create rich soundscapes. Code works the same way.'
		},
		{
			number: 5,
			title: 'Connection',
			subtitle: 'Networks of meaning',
			code: `const NeuralNetwork = (nodes) => {
  // Every node exists in relation
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = distance(nodes[i], nodes[j]);

      if (dist < threshold) {
        // The beauty is in the edges
        drawConnection(nodes[i], nodes[j], dist);
      }
    }
  }
};`,
			wisdom: [
				'No code exists alone.',
				'Every function calls another.',
				'Every system connects.',
				'',
				'Build bridges, not islands.'
			],
			personal: 'Open source contributor, team player, eternal learner. The connections we build matter more than the code we write.'
		}
	];

	let activeChapter = $state(1);
	let showCode = $state(false);

	function selectChapter(num: number) {
		activeChapter = num;
		creativeChapter.set(num); // Update the global store for the background
		showCode = false;
	}

	// Initialize the store with the current chapter
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

	<!-- Main content floating over background -->
	<main class="content">
		{#key activeChapter}
			<article class="chapter" class:show-code={showCode}>
				<header class="chapter-header">
					<div class="chapter-meta">
						<span class="chapter-number">{currentChapter.number.toString().padStart(2, '0')}</span>
						<span class="chapter-divider">/</span>
						<span class="chapter-total">05</span>
					</div>
					<h1 class="chapter-title">{currentChapter.title}</h1>
					<p class="chapter-subtitle">{currentChapter.subtitle}</p>
				</header>

				<div class="chapter-content">
					<div class="wisdom-section">
						{#each currentChapter.wisdom as line}
							{#if line === ''}
								<br />
							{:else}
								<p class="wisdom-line">{line}</p>
							{/if}
						{/each}

						<p class="personal-note">{currentChapter.personal}</p>
					</div>

					<button class="toggle-code" onclick={() => showCode = !showCode}>
						{showCode ? 'Hide' : 'View'} the code
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
							<path fill="currentColor" d={showCode ? 'M19 13H5v-2h14v2z' : 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'} />
						</svg>
					</button>
				</div>

				{#if showCode}
					<div class="code-section">
						<CodeDisplay code={currentChapter.code} language="typescript" />
					</div>
				{/if}
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
		margin-bottom: 2rem;
	}

	.chapter-meta {
		display: flex;
		align-items: center;
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

	.chapter-content {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.5);
	}

	.wisdom-section {
		margin-bottom: 1.5rem;
	}

	.wisdom-line {
		font-family: var(--font-serif);
		font-size: 1.5rem;
		line-height: 1.6;
		color: var(--text-dark);
		margin: 0;
	}

	.wisdom-line:nth-child(n + 4) {
		color: var(--text-muted);
	}

	.personal-note {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-style: italic;
		color: var(--text-light);
		margin: 1.5rem 0 0;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		line-height: 1.6;
	}

	.toggle-code {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: transparent;
		border: 1px solid var(--text-light);
		border-radius: 8px;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-code:hover {
		background: var(--text-dark);
		color: white;
		border-color: var(--text-dark);
	}

	.code-section {
		margin-top: 1.5rem;
		animation: fadeUp 0.4s ease;
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
