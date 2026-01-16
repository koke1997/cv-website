<script lang="ts">
	import { onMount } from 'svelte';

	let { theme = 'light' }: { theme?: 'light' | 'dark' } = $props();

	const colors = $derived({
		primary: theme === 'dark' ? '#ff6b4a' : '#D35233',
		secondary: theme === 'dark' ? '#4a9fff' : '#4A90D9',
		tertiary: theme === 'dark' ? '#b366ff' : '#9B59B6'
	});

	// Generate floating shapes
	const shapes = Array.from({ length: 12 }, (_, i) => ({
		id: i,
		type: ['circle', 'square', 'triangle'][i % 3],
		size: 20 + Math.random() * 40,
		x: Math.random() * 100,
		y: Math.random() * 100,
		delay: Math.random() * 5,
		duration: 8 + Math.random() * 8,
		color: [colors.primary, colors.secondary, colors.tertiary][i % 3]
	}));
</script>

<div class="hero-bg-2d">
	<!-- Gradient orbs -->
	<div class="orb orb-1" style:--color={colors.primary}></div>
	<div class="orb orb-2" style:--color={colors.secondary}></div>
	<div class="orb orb-3" style:--color={colors.tertiary}></div>

	<!-- Floating shapes -->
	{#each shapes as shape}
		<div
			class="floating-shape {shape.type}"
			style:--x="{shape.x}%"
			style:--y="{shape.y}%"
			style:--size="{shape.size}px"
			style:--delay="{shape.delay}s"
			style:--duration="{shape.duration}s"
			style:--color={shape.color}
		></div>
	{/each}

	<!-- Grid pattern overlay -->
	<svg class="grid-pattern" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
				<path
					d="M 60 0 L 0 0 0 60"
					fill="none"
					stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
					stroke-width="1"
				/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid)" />
	</svg>
</div>

<style>
	.hero-bg-2d {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
		animation: orbPulse 8s ease-in-out infinite;
	}

	.orb-1 {
		width: 400px;
		height: 400px;
		background: var(--color);
		top: -100px;
		right: -100px;
		animation-delay: 0s;
	}

	.orb-2 {
		width: 300px;
		height: 300px;
		background: var(--color);
		bottom: -50px;
		left: -50px;
		animation-delay: 2s;
	}

	.orb-3 {
		width: 250px;
		height: 250px;
		background: var(--color);
		top: 40%;
		left: 30%;
		animation-delay: 4s;
	}

	@keyframes orbPulse {
		0%, 100% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.5;
		}
	}

	.floating-shape {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--size);
		height: var(--size);
		opacity: 0.15;
		animation: float var(--duration) ease-in-out infinite;
		animation-delay: var(--delay);
	}

	.floating-shape.circle {
		border-radius: 50%;
		border: 2px solid var(--color);
	}

	.floating-shape.square {
		border: 2px solid var(--color);
		transform: rotate(45deg);
	}

	.floating-shape.triangle {
		width: 0;
		height: 0;
		border-left: calc(var(--size) / 2) solid transparent;
		border-right: calc(var(--size) / 2) solid transparent;
		border-bottom: var(--size) solid var(--color);
		opacity: 0.1;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		33% {
			transform: translateY(-15px) rotate(5deg);
		}
		66% {
			transform: translateY(10px) rotate(-5deg);
		}
	}

	.grid-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	@media (prefers-reduced-motion: reduce) {
		.orb,
		.floating-shape {
			animation: none;
		}
	}
</style>
