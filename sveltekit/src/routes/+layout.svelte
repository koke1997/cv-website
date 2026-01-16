<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ImmersiveBackground from '$lib/components/creative/ImmersiveBackground.svelte';
	import PatternConfigPanel from '$lib/components/creative/PatternConfigPanel.svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Track mouse position for background interaction
	let mouseX = $state(0.5);
	let mouseY = $state(0.5);

	function handleMouseMove(e: MouseEvent) {
		if (!browser) return;
		mouseX = e.clientX / window.innerWidth;
		mouseY = e.clientY / window.innerHeight;
	}

	// Derive the clean route path (strip base path for pattern detection)
	let currentRoute = $derived(() => {
		const pathname = $page.url.pathname;
		// Strip the base path to get the actual route
		if (base && pathname.startsWith(base)) {
			const route = pathname.slice(base.length) || '/';
			return route;
		}
		return pathname || '/';
	});
</script>

<svelte:head>
	<title>Ivan Kokalovic - CV</title>
</svelte:head>

<!-- Global generative art background -->
<ImmersiveBackground currentRoute={currentRoute()} {mouseX} {mouseY} />

<!-- Pattern configuration panel (floating gear icon) -->
<PatternConfigPanel />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="app" onmousemove={handleMouseMove}>
	<Header />
	<main class="container">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
