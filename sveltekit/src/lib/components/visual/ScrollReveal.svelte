<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		delay?: number;
		duration?: number;
		direction?: 'up' | 'down' | 'left' | 'right' | 'none';
		distance?: number;
		once?: boolean;
		threshold?: number;
	}

	let {
		children,
		delay = 0,
		duration = 600,
		direction = 'up',
		distance = 30,
		once = true,
		threshold = 0.1
	}: Props = $props();

	let element: HTMLDivElement;
	let isVisible = $state(false);

	const getTransform = () => {
		if (!isVisible) {
			switch (direction) {
				case 'up':
					return `translateY(${distance}px)`;
				case 'down':
					return `translateY(-${distance}px)`;
				case 'left':
					return `translateX(${distance}px)`;
				case 'right':
					return `translateX(-${distance}px)`;
				default:
					return 'none';
			}
		}
		return 'none';
	};

	onMount(() => {
		// Check for reduced motion preference
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
						if (once) {
							observer.unobserve(entry.target);
						}
					} else if (!once) {
						isVisible = false;
					}
				});
			},
			{ threshold }
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

<div
	bind:this={element}
	class="scroll-reveal"
	class:visible={isVisible}
	style:--delay="{delay}ms"
	style:--duration="{duration}ms"
	style:--transform={getTransform()}
>
	{@render children()}
</div>

<style>
	.scroll-reveal {
		opacity: 0;
		transform: var(--transform);
		transition:
			opacity var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--delay),
			transform var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--delay);
	}

	.scroll-reveal.visible {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
