<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		variant?: 'wave' | 'line' | 'dots' | 'gradient';
		color?: string;
	}

	let { variant = 'wave', color = 'var(--cv-accent)' }: Props = $props();

	let element = $state<SVGSVGElement | HTMLDivElement | null>(null);
	let isVisible = $state(false);

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			isVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.5 }
		);

		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	});
</script>

{#if variant === 'wave'}
	<svg
		bind:this={element}
		class="divider wave"
		class:animate={isVisible}
		viewBox="0 0 1200 40"
		preserveAspectRatio="none"
	>
		<path
			d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20"
			fill="none"
			stroke={color}
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
{:else if variant === 'line'}
	<svg
		bind:this={element}
		class="divider line"
		class:animate={isVisible}
		viewBox="0 0 1200 10"
		preserveAspectRatio="none"
	>
		<line
			x1="0"
			y1="5"
			x2="1200"
			y2="5"
			stroke={color}
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
{:else if variant === 'dots'}
	<div bind:this={element} class="divider dots" class:animate={isVisible}>
		{#each Array(7) as _, i}
			<span class="dot" style:--i={i} style:background={color}></span>
		{/each}
	</div>
{:else if variant === 'gradient'}
	<div
		bind:this={element}
		class="divider gradient"
		class:animate={isVisible}
		style:--color={color}
	></div>
{/if}

<style>
	.divider {
		width: 100%;
		margin: var(--space-lg) 0;
		overflow: visible;
	}

	/* Wave animation */
	.wave {
		height: 40px;
	}

	.wave path {
		stroke-dasharray: 1300;
		stroke-dashoffset: 1300;
		transition: stroke-dashoffset 1.5s ease-out;
	}

	.wave.animate path {
		stroke-dashoffset: 0;
	}

	/* Line animation */
	.line {
		height: 10px;
	}

	.line line {
		stroke-dasharray: 1200;
		stroke-dashoffset: 1200;
		transition: stroke-dashoffset 1s ease-out;
	}

	.line.animate line {
		stroke-dashoffset: 0;
	}

	/* Dots animation */
	.dots {
		display: flex;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-md) 0;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		opacity: 0;
		transform: scale(0);
		transition:
			opacity 0.4s ease-out,
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		transition-delay: calc(var(--i) * 100ms);
	}

	.dots.animate .dot {
		opacity: 1;
		transform: scale(1);
	}

	/* Gradient animation */
	.gradient {
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--color) 50%,
			transparent 100%
		);
		transform: scaleX(0);
		transition: transform 1s ease-out;
	}

	.gradient.animate {
		transform: scaleX(1);
	}

	@media (prefers-reduced-motion: reduce) {
		.wave path,
		.line line {
			stroke-dasharray: none;
			stroke-dashoffset: 0;
		}

		.dot {
			opacity: 1;
			transform: scale(1);
		}

		.gradient {
			transform: scaleX(1);
		}
	}
</style>
