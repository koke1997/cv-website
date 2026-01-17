<script lang="ts">
	import { browser } from '$app/environment';
	import { selectedPattern, type ArtPatternId } from '$lib/stores/creative';

	// All 20 patterns for cycling (wasm first, then Canvas2D patterns)
	const patterns: ArtPatternId[] = [
		'wasm', 'particles', 'flow', 'gradient', 'constellation', 'ripple', 'grid',
		'voronoi', 'waves', 'hexagon', 'orbits', 'bokeh', 'curves',
		'magnetic', 'spiral', 'lattice', 'aurora', 'circuit', 'plasma', 'noise'
	];

	let currentIndex = $state(0);
	let isMouseDown = $state(false);
	let mouseDownTime = $state(0);

	// Check if current pattern is wasm (it has its own mouse handling)
	let isWasmPattern = $derived(patterns[currentIndex] === 'wasm');
	let gravityWellSize = $state(0);
	let gravityWellPos = $state({ x: 0, y: 0 });
	let showHint = $state(true);

	// Hide hint after first interaction
	function hideHint() {
		if (showHint) showHint = false;
	}

	// Cycle to next/previous pattern
	function cyclePattern(direction: 1 | -1) {
		currentIndex = (currentIndex + direction + patterns.length) % patterns.length;
		selectedPattern.set(patterns[currentIndex]);
		hideHint();
	}

	// Scroll wheel cycles patterns
	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		cyclePattern(e.deltaY > 0 ? 1 : -1);
	}

	// Double-click cycles pattern
	function handleDoubleClick() {
		cyclePattern(1);
	}

	// Mouse down starts gravity well (skip for wasm - it has its own handling)
	function handleMouseDown(e: MouseEvent) {
		if (isWasmPattern) return;
		isMouseDown = true;
		mouseDownTime = Date.now();
		gravityWellPos = { x: e.clientX, y: e.clientY };
		gravityWellSize = 0;
		hideHint();
	}

	// Mouse up releases gravity well
	function handleMouseUp() {
		if (isWasmPattern) return;
		if (isMouseDown) {
			const holdTime = Date.now() - mouseDownTime;
			if (holdTime > 200) {
				// Long hold: create explosion ripple from gravity well
				triggerExplosion(gravityWellPos.x, gravityWellPos.y, gravityWellSize);
			} else {
				// Quick click: small spark effect
				triggerExplosion(gravityWellPos.x, gravityWellPos.y, 10);
			}
		}
		isMouseDown = false;
		gravityWellSize = 0;
	}

	// Track mouse position for gravity well
	function handleMouseMove(e: MouseEvent) {
		if (isWasmPattern) return;
		if (isMouseDown) {
			gravityWellPos = { x: e.clientX, y: e.clientY };
		}
	}

	// Explosion effect (dispatches custom event for background to catch)
	function triggerExplosion(x: number, y: number, size: number) {
		if (browser) {
			window.dispatchEvent(new CustomEvent('artExplosion', {
				detail: { x, y, size, timestamp: Date.now() }
			}));
		}
	}

	// Keyboard shortcuts
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			cyclePattern(1);
		} else if (e.key === 'ArrowLeft') {
			cyclePattern(-1);
		}
	}

	// Auto-hide hint after 5 seconds
	$effect(() => {
		if (browser && showHint) {
			const timer = setTimeout(() => { showHint = false; }, 5000);
			return () => clearTimeout(timer);
		}
	});

	// Continuously update gravity well size while mouse is held down
	$effect(() => {
		if (!browser || !isMouseDown) return;

		const updateGravityWell = () => {
			if (!isMouseDown) return;
			const holdTime = Date.now() - mouseDownTime;
			gravityWellSize = Math.min(holdTime / 10, 150);
		};

		const interval = setInterval(updateGravityWell, 16); // ~60fps
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Creative - Ivan Kokalovic</title>
	<meta name="description" content="Interactive generative art playground" />
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="canvas-container"
	onwheel={handleWheel}
	ondblclick={handleDoubleClick}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseUp}
>
	<!-- Gravity well indicator (only for Canvas2D patterns, not wasm) -->
	{#if !isWasmPattern && isMouseDown && gravityWellSize > 10}
		<div
			class="gravity-well"
			style="
				left: {gravityWellPos.x}px;
				top: {gravityWellPos.y}px;
				width: {gravityWellSize * 2}px;
				height: {gravityWellSize * 2}px;
			"
		></div>
	{/if}

	<!-- Subtle hint that fades away -->
	{#if showHint}
		<div class="hint">
			<span>scroll or double-click to change patterns</span>
		</div>
	{/if}

	<!-- Pattern indicator (bottom left, minimal) -->
	<div class="pattern-indicator">
		<span class="pattern-number">{(currentIndex + 1).toString().padStart(2, '0')}</span>
		<span class="pattern-divider">/</span>
		<span class="pattern-total">20</span>
	</div>
</div>

<style>
	.canvas-container {
		position: fixed;
		inset: 0;
		cursor: crosshair;
		z-index: 1;
		user-select: none;
	}

	.gravity-well {
		position: fixed;
		pointer-events: none;
		transform: translate(-50%, -50%);
		z-index: 10;
		/* Simple elegant circle */
		border-radius: 50%;
		background: radial-gradient(
			circle at center,
			rgba(120, 115, 105, 0.15) 0%,
			rgba(100, 95, 85, 0.08) 50%,
			transparent 100%
		);
		border: 1px solid rgba(100, 95, 85, 0.2);
		animation: wellPulse 1s ease-out infinite;
	}

	@keyframes wellPulse {
		0%, 100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
		50% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.98); }
	}

	.hint {
		position: fixed;
		bottom: 3rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.4);
		text-transform: lowercase;
		pointer-events: none;
		animation: fadeHint 5s ease-out forwards;
		z-index: 10;
	}

	@keyframes fadeHint {
		0%, 60% { opacity: 1; }
		100% { opacity: 0; }
	}

	.pattern-indicator {
		position: fixed;
		bottom: 1.5rem;
		left: 1.5rem;
		font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		color: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		gap: 0.25rem;
		pointer-events: none;
		z-index: 10;
	}

	.pattern-number {
		color: rgba(255, 255, 255, 0.4);
	}

	.pattern-divider {
		opacity: 0.5;
	}

	/* Dark mode adjustments */
	:global([data-theme='light']) .hint {
		color: rgba(0, 0, 0, 0.3);
	}

	:global([data-theme='light']) .pattern-indicator {
		color: rgba(0, 0, 0, 0.2);
	}

	:global([data-theme='light']) .pattern-number {
		color: rgba(0, 0, 0, 0.3);
	}

	:global([data-theme='light']) .gravity-well {
		background: radial-gradient(
			ellipse 60% 80% at 40% 40%,
			rgba(80, 80, 80, 0.35) 0%,
			rgba(60, 60, 60, 0.2) 30%,
			rgba(40, 40, 40, 0.08) 60%,
			transparent 100%
		);
		border-color: rgba(80, 80, 80, 0.25);
		box-shadow:
			0 0 20px rgba(60, 60, 60, 0.15),
			inset 0 0 10px rgba(100, 100, 100, 0.08);
	}

	:global([data-theme='light']) .gravity-well::after {
		background: linear-gradient(
			135deg,
			rgba(80, 80, 80, 0.15) 0%,
			rgba(50, 50, 50, 0.08) 40%,
			transparent 100%
		);
	}
</style>
