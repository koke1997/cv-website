<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { creativeChapter, patternConfig as patternConfigStore, selectedPattern as selectedPatternStore, type PatternConfig, type ArtPatternId } from '$lib/stores/creative';

	interface Props {
		currentRoute?: string;
		mouseX?: number;
		mouseY?: number;
	}

	let { currentRoute = '/', mouseX = 0.5, mouseY = 0.5 }: Props = $props();

	// Subscribe to creative chapter store for /creative page
	let storeChapter = $state(1);
	if (browser) {
		creativeChapter.subscribe((value) => {
			storeChapter = value;
		});
	}

	// Dual canvas for cross-fade transitions
	let canvasCurrent = $state<HTMLCanvasElement | null>(null);
	let canvasPrevious = $state<HTMLCanvasElement | null>(null);
	let ctxCurrent: CanvasRenderingContext2D | null = null;
	let ctxPrevious: CanvasRenderingContext2D | null = null;
	let animationFrame: number | undefined;
	let time = 0;
	let width = 0;
	let height = 0;

	// Art style types (20 total)
	type ArtStyle = 'particles' | 'flow' | 'gradient' | 'constellation' | 'ripple' | 'grid' |
		'voronoi' | 'waves' | 'hexagon' | 'orbits' | 'bokeh' | 'curves' |
		'magnetic' | 'spiral' | 'lattice' | 'aurora' | 'rain' | 'circuit' | 'plasma' | 'noise';

	// Current style state (declared early for use in subscriptions)
	let currentStyle = $state<ArtStyle>('particles');

	// Flag to track if component is fully initialized (prevents calling startTransition during init)
	let isInitialized = false;

	// Subscribe to selectedPattern store for manual override
	let selectedPatternOverride = $state<ArtPatternId | null>(null);
	if (browser) {
		selectedPatternStore.subscribe((value) => {
			selectedPatternOverride = value;
			// When user selects a pattern, trigger a transition (only after initialization)
			if (isInitialized && value && value !== currentStyle) {
				startTransition(value as ArtStyle);
			}
		});
	}

	// Subscribe to pattern config store
	let patternConfig = $state<PatternConfig>({
		opacity: 1,
		speed: 1,
		density: 1,
		mouseInfluence: 1
	});

	if (browser) {
		patternConfigStore.subscribe((value) => {
			patternConfig = value;
		});
	}

	// Route to art style mapping
	function getArtStyle(route: string): ArtStyle {
		const map: Record<string, ArtStyle> = {
			'/': 'voronoi',
			'/cv': 'waves',
			'/creative': 'gradient',
			'/download': 'orbits',
			'/contact': 'bokeh',
			'/editor': 'hexagon'
		};
		return map[route] || 'particles';
	}

	// For Creative page, map chapters to different styles (all 20 patterns)
	function getCreativeChapterStyle(chapter: number): ArtStyle {
		const styles: ArtStyle[] = [
			'particles', 'flow', 'gradient', 'constellation', 'ripple', 'grid',
			'voronoi', 'waves', 'hexagon', 'orbits', 'bokeh', 'curves',
			'magnetic', 'spiral', 'lattice', 'aurora', 'rain', 'circuit', 'plasma', 'noise'
		];
		return styles[(chapter - 1) % styles.length];
	}

	// State
	let artSeed = $state(Date.now());
	let previousRoute = $state<string | null>(null);
	let previousStyle = $state<ArtStyle | null>(null);
	let animationStarted = false;

	// Transition state
	let transitionProgress = $state(1); // 0 = fully previous, 1 = fully current
	let isTransitioning = $state(false);
	const TRANSITION_DURATION = 800; // ms
	let transitionStartTime = 0;

	// Configurable opacity (0.5 = 50%, 1 = 100%, 2 = 200%)
	let opacityMultiplier = $state(2.5);
	let showOpacitySlider = $state(false);

	// Explosion effects
	interface Explosion {
		x: number;
		y: number;
		startTime: number;
		size: number;
	}
	let explosions: Explosion[] = [];

	// Particle system state for current canvas
	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
	}
	let particles: Particle[] = [];
	let particlesPrev: Particle[] = [];

	// Gradient blob state
	interface Blob {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		opacity: number;
	}
	let blobs: Blob[] = [];
	let blobsPrev: Blob[] = [];

	// Voronoi seed points
	interface VoronoiSeed {
		x: number;
		y: number;
		vx: number;
		vy: number;
	}
	let voronoiSeeds: VoronoiSeed[] = [];
	let voronoiSeedsPrev: VoronoiSeed[] = [];

	// Orbit particles
	interface OrbitParticle {
		orbitIndex: number;
		angle: number;
		speed: number;
	}
	let orbitParticles: OrbitParticle[] = [];
	let orbitParticlesPrev: OrbitParticle[] = [];

	// Bokeh light orbs
	interface BokehOrb {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		opacity: number;
	}
	let bokehOrbs: BokehOrb[] = [];
	let bokehOrbsPrev: BokehOrb[] = [];

	// Magnetic field attractors
	interface MagneticAttractor {
		x: number;
		y: number;
		vx: number;
		vy: number;
		strength: number;
	}
	let magneticAttractors: MagneticAttractor[] = [];
	let magneticAttractorsPrev: MagneticAttractor[] = [];

	// Spiral galaxy particles
	interface SpiralParticle {
		armIndex: number;
		distance: number;
		angle: number;
		speed: number;
		size: number;
	}
	let spiralParticles: SpiralParticle[] = [];
	let spiralParticlesPrev: SpiralParticle[] = [];

	// Liquid lattice nodes
	interface LatticeNode {
		baseX: number;
		baseY: number;
		x: number;
		y: number;
		vx: number;
		vy: number;
	}
	let latticeNodes: LatticeNode[] = [];
	let latticeNodesPrev: LatticeNode[] = [];

	// Mulberry32 PRNG
	function createRandom(seed: number) {
		return function () {
			let t = (seed += 0x6d2b79f5);
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	// Simple noise function
	function noise(x: number, y: number, seed: number): number {
		const rand = createRandom(Math.floor(x * 100 + y * 7919 + seed));
		return rand() * 2 - 1;
	}

	// Initialize particles for particle-based styles
	function initParticles(count: number, seed: number): Particle[] {
		const rand = createRandom(seed);
		const result: Particle[] = [];
		for (let i = 0; i < count; i++) {
			result.push({
				x: rand() * width,
				y: rand() * height,
				vx: (rand() - 0.5) * 0.5,
				vy: (rand() - 0.5) * 0.5,
				size: rand() * 2.5 + 1.5
			});
		}
		return result;
	}

	// Initialize blobs for gradient style
	function initBlobs(count: number, seed: number): Blob[] {
		const rand = createRandom(seed);
		const result: Blob[] = [];
		for (let i = 0; i < count; i++) {
			result.push({
				x: rand() * width,
				y: rand() * height,
				vx: (rand() - 0.5) * 0.3,
				vy: (rand() - 0.5) * 0.3,
				radius: rand() * 200 + 150,
				opacity: rand() * 0.06 + 0.06
			});
		}
		return result;
	}

	// Initialize Voronoi seeds
	function initVoronoiSeeds(count: number, seed: number): VoronoiSeed[] {
		const rand = createRandom(seed);
		const result: VoronoiSeed[] = [];
		for (let i = 0; i < count; i++) {
			result.push({
				x: rand() * width,
				y: rand() * height,
				vx: (rand() - 0.5) * 0.3,
				vy: (rand() - 0.5) * 0.3
			});
		}
		return result;
	}

	// Initialize orbit particles
	function initOrbitParticles(seed: number): OrbitParticle[] {
		const rand = createRandom(seed);
		const result: OrbitParticle[] = [];
		const orbitCount = 5;
		const particlesPerOrbit = 3;
		for (let o = 0; o < orbitCount; o++) {
			for (let p = 0; p < particlesPerOrbit; p++) {
				result.push({
					orbitIndex: o,
					angle: rand() * Math.PI * 2,
					speed: 0.003 + rand() * 0.004
				});
			}
		}
		return result;
	}

	// Initialize bokeh orbs
	function initBokehOrbs(count: number, seed: number): BokehOrb[] {
		const rand = createRandom(seed);
		const result: BokehOrb[] = [];
		for (let i = 0; i < count; i++) {
			result.push({
				x: rand() * width,
				y: rand() * height,
				vx: (rand() - 0.5) * 0.2,
				vy: (rand() - 0.5) * 0.2,
				radius: rand() * 100 + 60,
				opacity: rand() * 0.04 + 0.02
			});
		}
		return result;
	}

	// Initialize magnetic attractors
	function initMagneticAttractors(count: number, seed: number): MagneticAttractor[] {
		const rand = createRandom(seed);
		const result: MagneticAttractor[] = [];
		for (let i = 0; i < count; i++) {
			result.push({
				x: rand() * width * 0.6 + width * 0.2,
				y: rand() * height * 0.6 + height * 0.2,
				vx: (rand() - 0.5) * 0.3,
				vy: (rand() - 0.5) * 0.3,
				strength: rand() > 0.5 ? 1 : -1 // positive or negative pole
			});
		}
		return result;
	}

	// Initialize spiral particles
	function initSpiralParticles(count: number, seed: number): SpiralParticle[] {
		const rand = createRandom(seed);
		const result: SpiralParticle[] = [];
		const armCount = 3;
		for (let i = 0; i < count; i++) {
			result.push({
				armIndex: Math.floor(rand() * armCount),
				distance: rand() * Math.min(width, height) * 0.4 + 20,
				angle: rand() * Math.PI * 2,
				speed: 0.002 + rand() * 0.003,
				size: rand() * 2 + 1
			});
		}
		return result;
	}

	// Initialize lattice nodes
	function initLatticeNodes(seed: number): LatticeNode[] {
		const rand = createRandom(seed);
		const result: LatticeNode[] = [];
		const spacing = 60;
		const cols = Math.ceil(width / spacing) + 1;
		const rows = Math.ceil(height / spacing) + 1;

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const baseX = i * spacing;
				const baseY = j * spacing;
				result.push({
					baseX,
					baseY,
					x: baseX + (rand() - 0.5) * 5,
					y: baseY + (rand() - 0.5) * 5,
					vx: 0,
					vy: 0
				});
			}
		}
		return result;
	}

	// Start transition to new style
	function startTransition(newStyle: ArtStyle) {
		if (currentStyle === newStyle) return;

		// Save current state to previous
		previousStyle = currentStyle;
		particlesPrev = [...particles];
		blobsPrev = [...blobs];
		voronoiSeedsPrev = [...voronoiSeeds];
		orbitParticlesPrev = [...orbitParticles];
		bokehOrbsPrev = [...bokehOrbs];
		magneticAttractorsPrev = [...magneticAttractors];
		spiralParticlesPrev = [...spiralParticles];
		latticeNodesPrev = [...latticeNodes];

		// Set new style
		currentStyle = newStyle;
		artSeed = Date.now() + Math.random() * 100000;

		// Initialize new art state
		initializeArtState();

		// Start transition
		isTransitioning = true;
		transitionProgress = 0;
		transitionStartTime = performance.now();
	}

	// When route changes, update art style and start transition (unless manual override is set)
	$effect(() => {
		// If user has selected a pattern manually, don't change on route changes
		if (selectedPatternOverride) return;

		const isFirstRender = previousRoute === null;
		const routeChanged = currentRoute !== previousRoute;

		if (isFirstRender) {
			previousRoute = currentRoute;
			if (currentRoute === '/creative') {
				currentStyle = getCreativeChapterStyle(storeChapter);
			} else {
				currentStyle = getArtStyle(currentRoute);
			}
			artSeed = Date.now() + Math.random() * 100000;
			if (width > 0 && height > 0) {
				initializeArtState();
			}
		} else if (routeChanged) {
			previousRoute = currentRoute;
			const newStyle = currentRoute === '/creative'
				? getCreativeChapterStyle(storeChapter)
				: getArtStyle(currentRoute);
			startTransition(newStyle);
		}
	});

	// Also react to chapter changes on creative page (unless manual override is set)
	$effect(() => {
		if (selectedPatternOverride) return;
		if (currentRoute === '/creative') {
			const newStyle = getCreativeChapterStyle(storeChapter);
			if (newStyle !== currentStyle && !isTransitioning) {
				startTransition(newStyle);
			}
		}
	});

	function initializeArtState() {
		const densityMult = patternConfig.density;
		switch (currentStyle) {
			case 'particles':
				particles = initParticles(Math.round(40 * densityMult), artSeed);
				break;
			case 'flow':
				// Flow field doesn't need particle init
				break;
			case 'gradient':
				blobs = initBlobs(Math.round(5 * densityMult), artSeed);
				break;
			case 'constellation':
				particles = initParticles(Math.round(25 * densityMult), artSeed);
				break;
			case 'ripple':
				// Ripple doesn't need particle init
				break;
			case 'grid':
				// Grid doesn't need particle init
				break;
			case 'voronoi':
				voronoiSeeds = initVoronoiSeeds(Math.round(15 * densityMult), artSeed);
				break;
			case 'waves':
				// Waves doesn't need state init
				break;
			case 'hexagon':
				// Hexagon doesn't need state init
				break;
			case 'orbits':
				orbitParticles = initOrbitParticles(artSeed);
				break;
			case 'bokeh':
				bokehOrbs = initBokehOrbs(Math.round(12 * densityMult), artSeed);
				break;
			case 'curves':
				// Curves doesn't need state init
				break;
			case 'magnetic':
				magneticAttractors = initMagneticAttractors(Math.round(4 * densityMult), artSeed);
				break;
			case 'spiral':
				spiralParticles = initSpiralParticles(Math.round(80 * densityMult), artSeed);
				break;
			case 'lattice':
				latticeNodes = initLatticeNodes(artSeed);
				break;
			case 'aurora':
				// Aurora doesn't need state init (calculated on-the-fly)
				break;
			case 'rain':
				// Reset rain drops - will be reinitialized in draw function
				rainDrops = [];
				break;
			case 'circuit':
				// Reset circuit nodes - will be reinitialized in draw function
				circuitNodes = [];
				break;
			case 'plasma':
				// Plasma doesn't need state init (calculated on-the-fly)
				break;
			case 'noise':
				// Perlin noise doesn't need state init (calculated on-the-fly)
				break;
		}
	}

	function resizeCanvas() {
		if (!browser) return;
		width = window.innerWidth;
		height = window.innerHeight;

		if (canvasCurrent) {
			canvasCurrent.width = width * window.devicePixelRatio;
			canvasCurrent.height = height * window.devicePixelRatio;
			ctxCurrent?.scale(window.devicePixelRatio, window.devicePixelRatio);
		}
		if (canvasPrevious) {
			canvasPrevious.width = width * window.devicePixelRatio;
			canvasPrevious.height = height * window.devicePixelRatio;
			ctxPrevious?.scale(window.devicePixelRatio, window.devicePixelRatio);
		}
		initializeArtState();
	}

	// ============================================
	// 1. PARTICLE NETWORK (Home)
	// ============================================
	function drawParticleNetwork(ctx: CanvasRenderingContext2D, particleList: Particle[], seed: number) {
		const opacity = 0.08 * opacityMultiplier * patternConfig.opacity;
		const connectionDist = 120;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;

		// Update particles
		particleList.forEach((p) => {
			// Mouse attraction
			const dx = mouseX * width - p.x;
			const dy = mouseY * height - p.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 200 && dist > 0) {
				p.vx += (dx / dist) * 0.02 * mouseMult;
				p.vy += (dy / dist) * 0.02 * mouseMult;
			}

			// Apply velocity with damping
			p.x += p.vx * speedMult;
			p.y += p.vy * speedMult;
			p.vx *= 0.99;
			p.vy *= 0.99;

			// Add slight noise movement
			p.vx += noise(p.x * 0.01, time * 0.5 * speedMult, seed) * 0.05;
			p.vy += noise(p.y * 0.01, time * 0.5 * speedMult + 100, seed) * 0.05;

			// Wrap around edges
			if (p.x < 0) p.x = width;
			if (p.x > width) p.x = 0;
			if (p.y < 0) p.y = height;
			if (p.y > height) p.y = 0;
		});

		// Draw connections
		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity * 0.4})`;
		ctx.lineWidth = 0.5;
		for (let i = 0; i < particleList.length; i++) {
			for (let j = i + 1; j < particleList.length; j++) {
				const dx = particleList[i].x - particleList[j].x;
				const dy = particleList[i].y - particleList[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < connectionDist) {
					ctx.globalAlpha = (1 - dist / connectionDist) * opacity;
					ctx.beginPath();
					ctx.moveTo(particleList[i].x, particleList[i].y);
					ctx.lineTo(particleList[j].x, particleList[j].y);
					ctx.stroke();
				}
			}
		}

		// Draw particles
		ctx.globalAlpha = 1;
		ctx.fillStyle = `rgba(60, 60, 60, ${opacity})`;
		particleList.forEach((p) => {
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	// ============================================
	// 2. FLOW FIELD (CV)
	// ============================================
	function drawFlowField(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const cols = 25;
		const rows = 15;
		const cellW = width / cols;
		const cellH = height / rows;

		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 1;
		ctx.globalAlpha = 1;

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const x = i * cellW + cellW / 2;
				const y = j * cellH + cellH / 2;

				// Mouse influence
				const dx = (mouseX * width - x) / width;
				const dy = (mouseY * height - y) / height;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const mouseInfluence = Math.max(0, 1 - dist * 2.5) * mouseMult;

				// Calculate angle from noise
				const angle =
					Math.sin(x * 0.005 + time * 0.3 * speedMult) * Math.cos(y * 0.005 + time * 0.2 * speedMult) * Math.PI +
					noise(i * 0.3, j * 0.3, seed) * 0.5 +
					mouseInfluence * Math.atan2(dy, dx);

				const len = 15 + mouseInfluence * 10;

				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
				ctx.stroke();
			}
		}
	}

	// ============================================
	// 3. GRADIENT MESH (Creative)
	// ============================================
	function drawGradientMesh(ctx: CanvasRenderingContext2D, blobList: Blob[]) {
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;

		// Update blobs
		blobList.forEach((b) => {
			// Mouse repulsion
			const dx = mouseX * width - b.x;
			const dy = mouseY * height - b.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 300 && dist > 0) {
				b.vx -= (dx / dist) * 0.1 * mouseMult;
				b.vy -= (dy / dist) * 0.1 * mouseMult;
			}

			b.x += b.vx + Math.sin(time * 0.5 * speedMult + b.radius) * 0.5;
			b.y += b.vy + Math.cos(time * 0.4 * speedMult + b.radius) * 0.5;
			b.vx *= 0.98;
			b.vy *= 0.98;

			// Keep blobs on screen
			if (b.x < -b.radius) b.x = width + b.radius;
			if (b.x > width + b.radius) b.x = -b.radius;
			if (b.y < -b.radius) b.y = height + b.radius;
			if (b.y > height + b.radius) b.y = -b.radius;
		});

		// Draw soft gradient blobs
		blobList.forEach((b) => {
			const adjustedOpacity = b.opacity * opacityMultiplier * patternConfig.opacity;
			const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
			gradient.addColorStop(0, `rgba(80, 80, 80, ${adjustedOpacity})`);
			gradient.addColorStop(0.5, `rgba(80, 80, 80, ${adjustedOpacity * 0.5})`);
			gradient.addColorStop(1, 'rgba(80, 80, 80, 0)');
			ctx.fillStyle = gradient;
			ctx.fillRect(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2);
		});
	}

	// ============================================
	// 4. CONSTELLATION (Download)
	// ============================================
	function drawConstellation(ctx: CanvasRenderingContext2D, particleList: Particle[]) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const connectionDist = 150;
		const mouseInfluenceRadius = 200 * mouseMult;
		const mousePosX = mouseX * width;
		const mousePosY = mouseY * height;

		// Update particles (slow drift + magnetic pull toward mouse)
		particleList.forEach((p) => {
			// Calculate distance to mouse
			const dx = mousePosX - p.x;
			const dy = mousePosY - p.y;
			const distToMouse = Math.sqrt(dx * dx + dy * dy);

			// Magnetic pull effect - stars gently attracted to mouse
			if (distToMouse < mouseInfluenceRadius && distToMouse > 0) {
				const pullStrength = (1 - distToMouse / mouseInfluenceRadius) * 0.5 * mouseMult;
				p.x += (dx / distToMouse) * pullStrength;
				p.y += (dy / distToMouse) * pullStrength;
			}

			p.x += p.vx * 0.3 * speedMult;
			p.y += p.vy * 0.3 * speedMult;

			// Gentle wrapping
			if (p.x < 0) p.x = width;
			if (p.x > width) p.x = 0;
			if (p.y < 0) p.y = height;
			if (p.y > height) p.y = 0;
		});

		// Draw connections to nearest 2-3 neighbors with mouse highlighting
		particleList.forEach((p, i) => {
			// Find nearest neighbors
			const distances = particleList
				.map((other, j) => ({
					j,
					dist: Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2)
				}))
				.filter((d) => d.j !== i && d.dist < connectionDist)
				.sort((a, b) => a.dist - b.dist)
				.slice(0, 3);

			distances.forEach((d) => {
				const other = particleList[d.j];
				// Check if connection line is near mouse
				const midX = (p.x + other.x) / 2;
				const midY = (p.y + other.y) / 2;
				const distMidToMouse = Math.sqrt((midX - mousePosX) ** 2 + (midY - mousePosY) ** 2);
				const mouseNearLine = distMidToMouse < mouseInfluenceRadius * 0.6;

				// Highlight connections near mouse
				const baseAlpha = (1 - d.dist / connectionDist) * opacity;
				const highlightBoost = mouseNearLine ? (1 - distMidToMouse / (mouseInfluenceRadius * 0.6)) * mouseMult * 2 : 0;

				ctx.strokeStyle = mouseNearLine
					? `rgba(40, 40, 40, ${baseAlpha * (1 + highlightBoost)})`
					: `rgba(60, 60, 60, ${baseAlpha * 0.3})`;
				ctx.lineWidth = mouseNearLine ? 1 + highlightBoost : 0.5;
				ctx.globalAlpha = 1;
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(other.x, other.y);
				ctx.stroke();
			});
		});

		// Draw stars with twinkling and mouse-proximity brightening
		ctx.globalAlpha = 1;
		particleList.forEach((p, i) => {
			const distToMouse = Math.sqrt((p.x - mousePosX) ** 2 + (p.y - mousePosY) ** 2);
			const mouseProximity = Math.max(0, 1 - distToMouse / mouseInfluenceRadius);

			// Enhanced twinkle when near mouse
			const baseFreq = 2 * speedMult;
			const twinkleFreq = baseFreq + mouseProximity * 4 * mouseMult;
			const twinkle = Math.sin(time * twinkleFreq + i * 0.5) * 0.5 + 0.5;

			// Stars near mouse are larger and brighter
			const sizeBoost = 1 + mouseProximity * 1.5 * mouseMult;
			const brightnessBoost = 1 + mouseProximity * 2 * mouseMult;
			const size = p.size * (0.7 + twinkle * 0.3) * sizeBoost;

			// Pulsing glow for stars near mouse
			if (mouseProximity > 0.3) {
				const pulseSize = size * (1.5 + Math.sin(time * 6) * 0.3);
				const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 2);
				glowGradient.addColorStop(0, `rgba(50, 50, 50, ${opacity * mouseProximity * 0.5})`);
				glowGradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
				ctx.fillStyle = glowGradient;
				ctx.beginPath();
				ctx.arc(p.x, p.y, pulseSize * 2, 0, Math.PI * 2);
				ctx.fill();
			}

			const gray = Math.max(30, 60 - mouseProximity * 30);
			ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${opacity * (0.7 + twinkle * 0.3) * brightnessBoost})`;
			ctx.beginPath();
			ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
			ctx.fill();
		});

		// Mouse glow (enhanced)
		const glowRadius = 100 * mouseMult;
		const gradient = ctx.createRadialGradient(
			mousePosX,
			mousePosY,
			0,
			mousePosX,
			mousePosY,
			glowRadius
		);
		gradient.addColorStop(0, `rgba(50, 50, 50, ${opacity * 0.6 * mouseMult})`);
		gradient.addColorStop(0.5, `rgba(55, 55, 55, ${opacity * 0.3 * mouseMult})`);
		gradient.addColorStop(1, 'rgba(60, 60, 60, 0)');
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(mousePosX, mousePosY, glowRadius, 0, Math.PI * 2);
		ctx.fill();

		// Small cursor star
		ctx.fillStyle = `rgba(40, 40, 40, ${opacity * 2 * mouseMult})`;
		ctx.beginPath();
		ctx.arc(mousePosX, mousePosY, 3, 0, Math.PI * 2);
		ctx.fill();
	}

	// ============================================
	// 5. RIPPLE PULSE (Contact)
	// ============================================
	function drawRipplePulse(ctx: CanvasRenderingContext2D) {
		const opacity = 0.07 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const centerX = width / 2 + (mouseX - 0.5) * 100 * mouseMult;
		const centerY = height / 2 + (mouseY - 0.5) * 100 * mouseMult;
		const maxRadius = Math.max(width, height) * 0.6;
		const ringCount = 12;

		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 1;

		// Main center ripples
		for (let i = 0; i < ringCount; i++) {
			const phase = (time * 0.5 * speedMult + i * 0.3) % (Math.PI * 2);
			const progress = phase / (Math.PI * 2);
			const radius = progress * maxRadius;
			const fadeOut = 1 - progress;

			ctx.globalAlpha = fadeOut * opacity;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Mouse-triggered ripples emanating from mouse position
		const mouseRippleX = mouseX * width;
		const mouseRippleY = mouseY * height;
		const mouseRippleCount = 6;
		const mouseMaxRadius = 200 * mouseMult;

		ctx.strokeStyle = `rgba(50, 50, 50, ${opacity * 1.5})`;
		ctx.lineWidth = 1.5;

		for (let i = 0; i < mouseRippleCount; i++) {
			const phase = (time * 0.8 * speedMult + i * 0.5) % (Math.PI * 2);
			const progress = phase / (Math.PI * 2);
			const radius = progress * mouseMaxRadius;
			const fadeOut = (1 - progress) * mouseMult;

			ctx.globalAlpha = fadeOut * opacity * 1.2;
			ctx.beginPath();
			ctx.arc(mouseRippleX, mouseRippleY, radius, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Interaction effect - ripples pushed away from mouse
		const distToCenter = Math.sqrt((mouseRippleX - centerX) ** 2 + (mouseRippleY - centerY) ** 2);
		if (distToCenter < maxRadius * 0.8) {
			const pushStrength = (1 - distToCenter / (maxRadius * 0.8)) * mouseMult;
			ctx.strokeStyle = `rgba(40, 40, 40, ${opacity * pushStrength * 2})`;
			ctx.lineWidth = 2;
			ctx.globalAlpha = opacity * pushStrength;
			ctx.beginPath();
			ctx.arc(mouseRippleX, mouseRippleY, 30 + Math.sin(time * 3) * 10, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Center dot
		ctx.globalAlpha = opacity * 2;
		ctx.fillStyle = `rgba(60, 60, 60, ${opacity * 2})`;
		ctx.beginPath();
		ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
		ctx.fill();

		// Mouse dot
		ctx.globalAlpha = opacity * 2 * mouseMult;
		ctx.fillStyle = `rgba(50, 50, 50, ${opacity * 2})`;
		ctx.beginPath();
		ctx.arc(mouseRippleX, mouseRippleY, 3, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalAlpha = 1;
	}

	// ============================================
	// 6. DOT GRID (Editor)
	// ============================================
	function drawDotGrid(ctx: CanvasRenderingContext2D) {
		const opacity = 0.07 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const spacing = 40;
		const cols = Math.ceil(width / spacing) + 1;
		const rows = Math.ceil(height / spacing) + 1;

		ctx.fillStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.globalAlpha = 1;

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const baseX = i * spacing;
				const baseY = j * spacing;

				// Wave displacement
				const waveX = Math.sin(time * 0.8 * speedMult + j * 0.2) * 3;
				const waveY = Math.cos(time * 0.6 * speedMult + i * 0.15) * 3;

				// Mouse displacement
				const dx = mouseX * width - baseX;
				const dy = mouseY * height - baseY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const mouseDisplace = dist < 100 ? ((100 - dist) / 100) * 15 * mouseMult : 0;
				const mouseAngle = Math.atan2(dy, dx);

				const x = baseX + waveX - Math.cos(mouseAngle) * mouseDisplace;
				const y = baseY + waveY - Math.sin(mouseAngle) * mouseDisplace;

				// Size variation based on wave
				const sizeMod = Math.sin(time * speedMult + i * 0.3 + j * 0.2) * 0.3 + 1;
				const size = 1.5 * sizeMod;

				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	// ============================================
	// 7. VORONOI TESSELLATION
	// ============================================
	function drawVoronoi(ctx: CanvasRenderingContext2D, seeds: VoronoiSeed[]) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;

		// Update seed positions
		seeds.forEach((s) => {
			// Mouse influence
			const dx = mouseX * width - s.x;
			const dy = mouseY * height - s.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 200 && dist > 0) {
				s.vx -= (dx / dist) * 0.02 * mouseMult;
				s.vy -= (dy / dist) * 0.02 * mouseMult;
			}

			s.x += s.vx + Math.sin(time * 0.3 * speedMult + s.y * 0.01) * 0.3;
			s.y += s.vy + Math.cos(time * 0.25 * speedMult + s.x * 0.01) * 0.3;
			s.vx *= 0.99;
			s.vy *= 0.99;

			// Wrap around
			if (s.x < -50) s.x = width + 50;
			if (s.x > width + 50) s.x = -50;
			if (s.y < -50) s.y = height + 50;
			if (s.y > height + 50) s.y = -50;
		});

		// Draw Voronoi edges by sampling points
		const step = 20;
		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 1;
		ctx.globalAlpha = 1;

		for (let x = 0; x < width; x += step) {
			for (let y = 0; y < height; y += step) {
				// Find two closest seeds
				let closest1 = 0, closest2 = 1;
				let dist1 = Infinity, dist2 = Infinity;

				seeds.forEach((s, i) => {
					const d = Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2);
					if (d < dist1) {
						dist2 = dist1;
						closest2 = closest1;
						dist1 = d;
						closest1 = i;
					} else if (d < dist2) {
						dist2 = d;
						closest2 = i;
					}
				});

				// If close to edge (similar distances), draw point
				const edgeness = Math.abs(dist1 - dist2) / step;
				if (edgeness < 1.2) {
					const alpha = (1 - edgeness / 1.2) * opacity;
					ctx.fillStyle = `rgba(60, 60, 60, ${alpha})`;
					ctx.beginPath();
					ctx.arc(x, y, 1.5, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}

		// Draw seed points
		ctx.fillStyle = `rgba(60, 60, 60, ${opacity * 1.5})`;
		seeds.forEach((s) => {
			ctx.beginPath();
			ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	// ============================================
	// 8. WAVE CONTOURS (Topographic)
	// ============================================
	function drawWaveContours(ctx: CanvasRenderingContext2D) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const waveCount = 12;
		const pointCount = 80;

		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 1;
		ctx.globalAlpha = 1;

		for (let w = 0; w < waveCount; w++) {
			const baseY = (height / (waveCount + 1)) * (w + 1);
			const phase = time * 0.4 * speedMult + w * 0.3;
			const amplitude = 20 + Math.sin(time * 0.2 * speedMult + w) * 10;

			ctx.beginPath();
			for (let i = 0; i <= pointCount; i++) {
				const x = (width / pointCount) * i;
				const normalizedX = i / pointCount;

				// Mouse distortion
				const dx = mouseX - normalizedX;
				const dy = mouseY - (baseY / height);
				const mouseDist = Math.sqrt(dx * dx + dy * dy);
				const mouseEffect = Math.max(0, 1 - mouseDist * 3) * 30 * mouseMult;

				const y = baseY +
					Math.sin(normalizedX * Math.PI * 3 + phase) * amplitude +
					Math.sin(normalizedX * Math.PI * 5 + phase * 1.3) * (amplitude * 0.3) +
					Math.sin(mouseDist * 10 - time * 2 * speedMult) * mouseEffect;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	}

	// ============================================
	// 9. HEXAGONAL HIVE
	// ============================================
	function drawHexagonalGrid(ctx: CanvasRenderingContext2D) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const hexSize = 35;
		const hexHeight = hexSize * Math.sqrt(3);
		const hexWidth = hexSize * 2;

		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 1;

		const cols = Math.ceil(width / (hexWidth * 0.75)) + 2;
		const rows = Math.ceil(height / hexHeight) + 2;

		for (let row = -1; row < rows; row++) {
			for (let col = -1; col < cols; col++) {
				const offsetX = (row % 2) * (hexWidth * 0.375);
				const centerX = col * hexWidth * 0.75 + offsetX;
				const centerY = row * hexHeight * 0.5;

				// Mouse proximity for glow
				const dx = mouseX * width - centerX;
				const dy = mouseY * height - centerY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const glow = Math.max(0, 1 - dist / 150) * mouseMult;

				// Pulse based on position and time
				const pulse = Math.sin(time * 1.5 * speedMult + col * 0.3 + row * 0.2) * 0.3 + 0.7;
				const alpha = opacity * pulse + glow * opacity * 2;

				ctx.globalAlpha = alpha;
				ctx.beginPath();

				// Draw hexagon
				for (let i = 0; i < 6; i++) {
					const angle = (Math.PI / 3) * i - Math.PI / 6;
					const hx = centerX + Math.cos(angle) * hexSize;
					const hy = centerY + Math.sin(angle) * hexSize;
					if (i === 0) {
						ctx.moveTo(hx, hy);
					} else {
						ctx.lineTo(hx, hy);
					}
				}
				ctx.closePath();
				ctx.stroke();

				// Fill with glow if mouse nearby
				if (glow > 0.3) {
					ctx.fillStyle = `rgba(60, 60, 60, ${glow * opacity * 0.5})`;
					ctx.fill();
				}
			}
		}
		ctx.globalAlpha = 1;
	}

	// ============================================
	// 10. ORBITING RINGS
	// ============================================
	function drawOrbitingRings(ctx: CanvasRenderingContext2D, orbitParts: OrbitParticle[]) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const centerX = width / 2 + (mouseX - 0.5) * 100 * mouseMult;
		const centerY = height / 2 + (mouseY - 0.5) * 100 * mouseMult;

		// Define orbits
		const orbits = [
			{ rx: 80, ry: 40, rotation: 0 },
			{ rx: 130, ry: 60, rotation: Math.PI / 4 },
			{ rx: 180, ry: 80, rotation: -Math.PI / 6 },
			{ rx: 240, ry: 100, rotation: Math.PI / 3 },
			{ rx: 300, ry: 130, rotation: -Math.PI / 5 }
		];

		// Draw orbit paths
		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity * 0.4})`;
		ctx.lineWidth = 0.5;
		ctx.globalAlpha = 1;

		orbits.forEach((orbit, i) => {
			const rot = orbit.rotation + time * 0.05 * speedMult * (i % 2 === 0 ? 1 : -1);
			ctx.beginPath();
			for (let a = 0; a <= Math.PI * 2; a += 0.1) {
				const x = Math.cos(a) * orbit.rx;
				const y = Math.sin(a) * orbit.ry;
				const rx = x * Math.cos(rot) - y * Math.sin(rot) + centerX;
				const ry = x * Math.sin(rot) + y * Math.cos(rot) + centerY;
				if (a === 0) ctx.moveTo(rx, ry);
				else ctx.lineTo(rx, ry);
			}
			ctx.closePath();
			ctx.stroke();
		});

		// Update and draw particles
		ctx.fillStyle = `rgba(60, 60, 60, ${opacity * 2})`;
		orbitParts.forEach((p) => {
			p.angle += p.speed * speedMult;
			const orbit = orbits[p.orbitIndex];
			const rot = orbit.rotation + time * 0.05 * speedMult * (p.orbitIndex % 2 === 0 ? 1 : -1);

			const x = Math.cos(p.angle) * orbit.rx;
			const y = Math.sin(p.angle) * orbit.ry;
			const px = x * Math.cos(rot) - y * Math.sin(rot) + centerX;
			const py = x * Math.sin(rot) + y * Math.cos(rot) + centerY;

			ctx.beginPath();
			ctx.arc(px, py, 3, 0, Math.PI * 2);
			ctx.fill();
		});

		// Center point
		ctx.fillStyle = `rgba(60, 60, 60, ${opacity * 1.5})`;
		ctx.beginPath();
		ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
		ctx.fill();
	}

	// ============================================
	// 11. BOKEH LIGHTS
	// ============================================
	function drawBokehLights(ctx: CanvasRenderingContext2D, orbs: BokehOrb[]) {
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;

		// Update orbs
		orbs.forEach((o) => {
			// Gentle mouse attraction
			const dx = mouseX * width - o.x;
			const dy = mouseY * height - o.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > 50 && dist < 400) {
				o.vx += (dx / dist) * 0.005 * mouseMult;
				o.vy += (dy / dist) * 0.005 * mouseMult;
			}

			o.x += o.vx + Math.sin(time * 0.2 * speedMult + o.radius * 0.01) * 0.3;
			o.y += o.vy + Math.cos(time * 0.15 * speedMult + o.radius * 0.01) * 0.3;
			o.vx *= 0.99;
			o.vy *= 0.99;

			// Keep on screen with soft bounce
			if (o.x < -o.radius) o.x = width + o.radius;
			if (o.x > width + o.radius) o.x = -o.radius;
			if (o.y < -o.radius) o.y = height + o.radius;
			if (o.y > height + o.radius) o.y = -o.radius;
		});

		// Draw orbs with soft gradients
		orbs.forEach((o) => {
			const adjustedOpacity = o.opacity * opacityMultiplier * patternConfig.opacity;
			const gradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.radius);
			gradient.addColorStop(0, `rgba(70, 70, 70, ${adjustedOpacity})`);
			gradient.addColorStop(0.3, `rgba(70, 70, 70, ${adjustedOpacity * 0.6})`);
			gradient.addColorStop(0.6, `rgba(70, 70, 70, ${adjustedOpacity * 0.2})`);
			gradient.addColorStop(1, 'rgba(70, 70, 70, 0)');

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	// ============================================
	// 12. BEZIER CURVES (String Art)
	// ============================================
	function drawBezierCurves(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.05 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const pointCount = 24;
		const connectionCount = 8;
		const mousePosX = mouseX * width;
		const mousePosY = mouseY * height;
		const mouseInfluenceRadius = 250 * mouseMult;

		ctx.globalAlpha = 1;

		const centerX = width / 2;
		const centerY = height / 2;
		const radius = Math.min(width, height) * 0.35;

		// Generate points on an ellipse that rotates over time
		const points: { x: number; y: number; distToMouse: number }[] = [];
		const rotationOffset = time * 0.1 * speedMult;

		for (let i = 0; i < pointCount; i++) {
			const angle = (Math.PI * 2 / pointCount) * i + rotationOffset;
			const wobble = Math.sin(time * 0.5 * speedMult + i * 0.5) * 20;
			const rx = radius + wobble + Math.sin(angle * 3) * 30;
			const ry = radius * 0.7 + wobble + Math.cos(angle * 2) * 20;

			let px = centerX + Math.cos(angle) * rx;
			let py = centerY + Math.sin(angle) * ry;

			// Calculate distance to mouse for elastic pull
			const dx = mousePosX - px;
			const dy = mousePosY - py;
			const distToMouse = Math.sqrt(dx * dx + dy * dy);

			// Elastic pull toward mouse - points near mouse get pulled stronger
			if (distToMouse < mouseInfluenceRadius && distToMouse > 0) {
				const pullStrength = (1 - distToMouse / mouseInfluenceRadius) * 80 * mouseMult;
				const springFactor = Math.sin(time * 3 + i * 0.3) * 0.2 + 0.8; // Spring oscillation
				px += (dx / distToMouse) * pullStrength * springFactor;
				py += (dy / distToMouse) * pullStrength * springFactor;
			}

			points.push({ x: px, y: py, distToMouse });
		}

		// Draw bezier curves connecting points with mouse-aware styling
		for (let i = 0; i < pointCount; i++) {
			for (let j = 1; j <= connectionCount; j++) {
				const targetIndex = (i + j * 3) % pointCount;
				const p1 = points[i];
				const p2 = points[targetIndex];

				// Control point - dramatically pulled toward mouse
				const baseCpx = (p1.x + p2.x) / 2;
				const baseCpy = (p1.y + p2.y) / 2;

				const cpDx = mousePosX - baseCpx;
				const cpDy = mousePosY - baseCpy;
				const cpDistToMouse = Math.sqrt(cpDx * cpDx + cpDy * cpDy);

				// Strong elastic distortion of control point
				let cpx = baseCpx;
				let cpy = baseCpy;
				if (cpDistToMouse < mouseInfluenceRadius && cpDistToMouse > 0) {
					const elasticPull = (1 - cpDistToMouse / mouseInfluenceRadius) * 120 * mouseMult;
					const wave = Math.sin(time * 4 + i * 0.2) * 0.3 + 0.7;
					cpx += (cpDx / cpDistToMouse) * elasticPull * wave;
					cpy += (cpDy / cpDistToMouse) * elasticPull * wave;
				}

				// Curve styling based on proximity to mouse
				const avgDistToMouse = (p1.distToMouse + p2.distToMouse + cpDistToMouse) / 3;
				const mouseProximity = Math.max(0, 1 - avgDistToMouse / mouseInfluenceRadius);

				// Curves near mouse are thicker and more opaque
				const lineWidth = 0.5 + mouseProximity * 2 * mouseMult;
				const lineOpacity = opacity * (1 + mouseProximity * 3);
				const gray = Math.max(30, 60 - mouseProximity * 30);

				ctx.strokeStyle = `rgba(${gray}, ${gray}, ${gray}, ${lineOpacity})`;
				ctx.lineWidth = lineWidth;

				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.quadraticCurveTo(cpx, cpy, p2.x, p2.y);
				ctx.stroke();
			}
		}

		// Draw anchor points with mouse proximity highlight
		points.forEach((p) => {
			const mouseProximity = Math.max(0, 1 - p.distToMouse / mouseInfluenceRadius);
			const pointSize = 2 + mouseProximity * 4 * mouseMult;
			const pointOpacity = opacity * 1.5 * (1 + mouseProximity * 2);

			// Glow for points near mouse
			if (mouseProximity > 0.3) {
				const glowSize = pointSize * 3;
				const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
				glowGradient.addColorStop(0, `rgba(50, 50, 50, ${pointOpacity * mouseProximity * 0.5})`);
				glowGradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
				ctx.fillStyle = glowGradient;
				ctx.beginPath();
				ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.fillStyle = `rgba(50, 50, 50, ${pointOpacity})`;
			ctx.beginPath();
			ctx.arc(p.x, p.y, pointSize, 0, Math.PI * 2);
			ctx.fill();
		});

		// Mouse cursor indicator
		ctx.fillStyle = `rgba(40, 40, 40, ${opacity * 3 * mouseMult})`;
		ctx.beginPath();
		ctx.arc(mousePosX, mousePosY, 4, 0, Math.PI * 2);
		ctx.fill();

		// Trailing curves from mouse (elastic ribbons)
		const trailCount = 6;
		ctx.strokeStyle = `rgba(50, 50, 50, ${opacity * 0.8 * mouseMult})`;
		ctx.lineWidth = 1;
		for (let t = 0; t < trailCount; t++) {
			const trailAngle = (Math.PI * 2 / trailCount) * t + time * 0.5;
			const trailLength = 60 * mouseMult;
			const endX = mousePosX + Math.cos(trailAngle) * trailLength;
			const endY = mousePosY + Math.sin(trailAngle) * trailLength;
			const ctrlX = mousePosX + Math.cos(trailAngle + 0.5) * trailLength * 0.7;
			const ctrlY = mousePosY + Math.sin(trailAngle + 0.3) * trailLength * 0.5;

			ctx.beginPath();
			ctx.moveTo(mousePosX, mousePosY);
			ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
			ctx.stroke();
		}
	}

	// ============================================
	// 13. MAGNETIC FIELD
	// ============================================
	function drawMagneticField(ctx: CanvasRenderingContext2D, attractors: MagneticAttractor[]) {
		const opacity = 0.05 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const mousePosX = mouseX * width;
		const mousePosY = mouseY * height;

		// Mouse acts as a virtual attractor (alternates polarity based on time)
		const mouseStrength = 1.5 * mouseMult * Math.sin(time * 0.5);

		// Update attractor positions
		attractors.forEach((a) => {
			// Mouse influence on attractor movement
			const dx = mousePosX - a.x;
			const dy = mousePosY - a.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 250 && dist > 0) {
				const pullForce = (1 - dist / 250) * 0.03 * mouseMult;
				a.vx += (dx / dist) * pullForce;
				a.vy += (dy / dist) * pullForce;
			}

			a.x += a.vx * speedMult + Math.sin(time * 0.3 + a.strength) * 0.5;
			a.y += a.vy * speedMult + Math.cos(time * 0.25 + a.strength) * 0.5;
			a.vx *= 0.97;
			a.vy *= 0.97;

			// Keep on screen
			if (a.x < 50) a.vx += 0.1;
			if (a.x > width - 50) a.vx -= 0.1;
			if (a.y < 50) a.vy += 0.1;
			if (a.y > height - 50) a.vy -= 0.1;
		});

		// Draw field lines from attractors with mouse influence
		const lineCount = 30;
		const steps = 60;

		for (let l = 0; l < lineCount; l++) {
			const startAngle = (Math.PI * 2 / lineCount) * l + time * 0.1;

			// Start from each attractor
			attractors.forEach((attractor) => {
				const startX = attractor.x + Math.cos(startAngle) * 20;
				const startY = attractor.y + Math.sin(startAngle) * 20;

				ctx.beginPath();
				ctx.moveTo(startX, startY);

				let px = startX;
				let py = startY;

				for (let s = 0; s < steps; s++) {
					// Calculate field direction from all attractors
					let fx = 0, fy = 0;
					attractors.forEach((a) => {
						const dx = a.x - px;
						const dy = a.y - py;
						const d = Math.sqrt(dx * dx + dy * dy) + 1;
						const strength = a.strength / (d * d) * 5000;
						fx += (dy / d) * strength;
						fy -= (dx / d) * strength;
					});

					// Add mouse as virtual attractor - creates visible field bending
					const mdx = mousePosX - px;
					const mdy = mousePosY - py;
					const md = Math.sqrt(mdx * mdx + mdy * mdy) + 1;
					const mStrength = mouseStrength / (md * md) * 8000 * mouseMult;
					fx += (mdy / md) * mStrength;
					fy -= (mdx / md) * mStrength;

					// Normalize
					const mag = Math.sqrt(fx * fx + fy * fy) + 0.001;
					fx = (fx / mag) * 5;
					fy = (fy / mag) * 5;

					px += fx;
					py += fy;

					// Stop if out of bounds
					if (px < 0 || px > width || py < 0 || py > height) break;

					// Color and thickness based on proximity to mouse
					const distToMouse = Math.sqrt((px - mousePosX) ** 2 + (py - mousePosY) ** 2);
					const mouseProximity = Math.max(0, 1 - distToMouse / 200);

					ctx.lineTo(px, py);
				}

				// Style based on overall proximity to mouse
				const lineMidX = (startX + px) / 2;
				const lineMidY = (startY + py) / 2;
				const lineDist = Math.sqrt((lineMidX - mousePosX) ** 2 + (lineMidY - mousePosY) ** 2);
				const lineProximity = Math.max(0, 1 - lineDist / 300);

				ctx.strokeStyle = `rgba(${50 - lineProximity * 20}, ${50 - lineProximity * 20}, ${50 - lineProximity * 20}, ${opacity * (1 + lineProximity * 2)})`;
				ctx.lineWidth = 0.8 + lineProximity * 1.5 * mouseMult;
				ctx.stroke();
			});
		}

		// Draw additional field lines emanating from mouse position
		const mouseLineCount = 16;
		const mouseSteps = 40;
		ctx.lineWidth = 1;

		for (let l = 0; l < mouseLineCount; l++) {
			const startAngle = (Math.PI * 2 / mouseLineCount) * l + time * 0.2;
			const startX = mousePosX + Math.cos(startAngle) * 15;
			const startY = mousePosY + Math.sin(startAngle) * 15;

			ctx.beginPath();
			ctx.moveTo(startX, startY);

			let px = startX;
			let py = startY;

			for (let s = 0; s < mouseSteps; s++) {
				let fx = 0, fy = 0;

				// Influence from all attractors
				attractors.forEach((a) => {
					const dx = a.x - px;
					const dy = a.y - py;
					const d = Math.sqrt(dx * dx + dy * dy) + 1;
					const strength = a.strength / (d * d) * 5000;
					fx += (dy / d) * strength;
					fy -= (dx / d) * strength;
				});

				// Self-repulsion from mouse to push lines outward
				const mdx = px - mousePosX;
				const mdy = py - mousePosY;
				const md = Math.sqrt(mdx * mdx + mdy * mdy) + 1;
				fx += (mdx / md) * 3;
				fy += (mdy / md) * 3;

				const mag = Math.sqrt(fx * fx + fy * fy) + 0.001;
				fx = (fx / mag) * 6;
				fy = (fy / mag) * 6;

				px += fx;
				py += fy;

				if (px < 0 || px > width || py < 0 || py > height) break;

				ctx.lineTo(px, py);
			}

			ctx.strokeStyle = `rgba(45, 45, 45, ${opacity * 1.5 * mouseMult})`;
			ctx.stroke();
		}

		// Draw attractor points
		attractors.forEach((a) => {
			const distToMouse = Math.sqrt((a.x - mousePosX) ** 2 + (a.y - mousePosY) ** 2);
			const mouseProximity = Math.max(0, 1 - distToMouse / 200);
			const size = (a.strength > 0 ? 8 : 6) + mouseProximity * 4 * mouseMult;

			// Glow when near mouse
			if (mouseProximity > 0.2) {
				const glowGradient = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, size * 2.5);
				glowGradient.addColorStop(0, `rgba(50, 50, 50, ${opacity * 2 * mouseProximity})`);
				glowGradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
				ctx.fillStyle = glowGradient;
				ctx.beginPath();
				ctx.arc(a.x, a.y, size * 2.5, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.fillStyle = `rgba(50, 50, 50, ${opacity * 3 * (1 + mouseProximity)})`;
			ctx.beginPath();
			ctx.arc(a.x, a.y, size, 0, Math.PI * 2);
			ctx.fill();

			// Draw + or - symbol
			ctx.strokeStyle = `rgba(245, 242, 235, ${opacity * 5})`;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(a.x - 4, a.y);
			ctx.lineTo(a.x + 4, a.y);
			if (a.strength > 0) {
				ctx.moveTo(a.x, a.y - 4);
				ctx.lineTo(a.x, a.y + 4);
			}
			ctx.stroke();
		});

		// Draw mouse attractor indicator (pulsing)
		const pulse = Math.sin(time * 3) * 0.3 + 0.7;
		const mouseIndicatorSize = 10 * pulse * mouseMult;

		// Outer glow
		const mouseGlow = ctx.createRadialGradient(mousePosX, mousePosY, 0, mousePosX, mousePosY, mouseIndicatorSize * 3);
		mouseGlow.addColorStop(0, `rgba(40, 40, 40, ${opacity * 2 * mouseMult})`);
		mouseGlow.addColorStop(1, 'rgba(40, 40, 40, 0)');
		ctx.fillStyle = mouseGlow;
		ctx.beginPath();
		ctx.arc(mousePosX, mousePosY, mouseIndicatorSize * 3, 0, Math.PI * 2);
		ctx.fill();

		// Inner dot
		ctx.fillStyle = `rgba(35, 35, 35, ${opacity * 4 * mouseMult})`;
		ctx.beginPath();
		ctx.arc(mousePosX, mousePosY, mouseIndicatorSize * 0.5, 0, Math.PI * 2);
		ctx.fill();

		// Draw polarity indicator (+ or - based on current phase)
		ctx.strokeStyle = `rgba(245, 242, 235, ${opacity * 6 * mouseMult})`;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(mousePosX - 5, mousePosY);
		ctx.lineTo(mousePosX + 5, mousePosY);
		if (mouseStrength > 0) {
			ctx.moveTo(mousePosX, mousePosY - 5);
			ctx.lineTo(mousePosX, mousePosY + 5);
		}
		ctx.stroke();
	}

	// ============================================
	// 14. SPIRAL GALAXY
	// ============================================
	function drawSpiralGalaxy(ctx: CanvasRenderingContext2D, spirals: SpiralParticle[]) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;

		const centerX = width / 2 + (mouseX - 0.5) * 80 * mouseMult;
		const centerY = height / 2 + (mouseY - 0.5) * 80 * mouseMult;
		const armCount = 3;
		const rotationSpeed = 0.02 * speedMult;

		// Draw spiral arms (background glow)
		ctx.globalAlpha = opacity * 0.3;
		for (let arm = 0; arm < armCount; arm++) {
			const armAngle = (Math.PI * 2 / armCount) * arm + time * rotationSpeed;

			ctx.beginPath();
			for (let r = 20; r < Math.min(width, height) * 0.4; r += 5) {
				const spiralAngle = armAngle + r * 0.008;
				const x = centerX + Math.cos(spiralAngle) * r;
				const y = centerY + Math.sin(spiralAngle) * r * 0.7;

				if (r === 20) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.strokeStyle = `rgba(60, 60, 60, ${opacity * 0.5})`;
			ctx.lineWidth = 15;
			ctx.stroke();
		}

		// Update and draw particles
		ctx.globalAlpha = 1;
		spirals.forEach((p) => {
			p.angle += p.speed * speedMult;

			// Spiral formula: r increases with angle
			const spiralOffset = (Math.PI * 2 / armCount) * p.armIndex + time * rotationSpeed;
			const angle = p.angle + spiralOffset + p.distance * 0.008;

			// Add some wobble
			const wobble = Math.sin(time * 2 + p.distance * 0.05) * 5;

			const x = centerX + Math.cos(angle) * (p.distance + wobble);
			const y = centerY + Math.sin(angle) * (p.distance + wobble) * 0.7; // Flatten for perspective

			// Brightness based on distance from center
			const brightness = 1 - (p.distance / (Math.min(width, height) * 0.4)) * 0.5;

			ctx.fillStyle = `rgba(60, 60, 60, ${opacity * brightness})`;
			ctx.beginPath();
			ctx.arc(x, y, p.size, 0, Math.PI * 2);
			ctx.fill();
		});

		// Draw core glow
		const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
		coreGradient.addColorStop(0, `rgba(70, 70, 70, ${opacity * 1.5})`);
		coreGradient.addColorStop(0.5, `rgba(70, 70, 70, ${opacity * 0.5})`);
		coreGradient.addColorStop(1, 'rgba(70, 70, 70, 0)');
		ctx.fillStyle = coreGradient;
		ctx.beginPath();
		ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
		ctx.fill();
	}

	// ============================================
	// 15. LIQUID LATTICE
	// ============================================
	function drawLiquidLattice(ctx: CanvasRenderingContext2D, nodes: LatticeNode[]) {
		const opacity = 0.06 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const spacing = 60;

		// Physics update
		nodes.forEach((node) => {
			// Spring force back to base position
			const springK = 0.03 * speedMult;
			const dx = node.baseX - node.x;
			const dy = node.baseY - node.y;
			node.vx += dx * springK;
			node.vy += dy * springK;

			// Mouse repulsion
			const mx = mouseX * width;
			const my = mouseY * height;
			const mdx = node.x - mx;
			const mdy = node.y - my;
			const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
			const mouseRadius = 120 * mouseMult;

			if (mdist < mouseRadius && mdist > 0) {
				const force = ((mouseRadius - mdist) / mouseRadius) * 3 * mouseMult;
				node.vx += (mdx / mdist) * force;
				node.vy += (mdy / mdist) * force;
			}

			// Apply velocity with damping
			node.x += node.vx;
			node.y += node.vy;
			node.vx *= 0.92;
			node.vy *= 0.92;
		});

		// Draw connections between neighboring nodes
		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 1;

		const cols = Math.ceil(width / spacing) + 1;
		const rows = Math.ceil(height / spacing) + 1;

		for (let i = 0; i < nodes.length; i++) {
			const col = Math.floor(i / rows);
			const row = i % rows;
			const node = nodes[i];

			// Connect to right neighbor
			if (col < cols - 1) {
				const rightIndex = (col + 1) * rows + row;
				if (rightIndex < nodes.length) {
					const right = nodes[rightIndex];
					const dist = Math.sqrt((node.x - right.x) ** 2 + (node.y - right.y) ** 2);
					const stretch = dist / spacing;
					const alpha = Math.max(0, Math.min(1, 2 - stretch)) * opacity;

					ctx.globalAlpha = alpha;
					ctx.beginPath();
					ctx.moveTo(node.x, node.y);
					ctx.lineTo(right.x, right.y);
					ctx.stroke();
				}
			}

			// Connect to bottom neighbor
			if (row < rows - 1) {
				const bottomIndex = col * rows + row + 1;
				if (bottomIndex < nodes.length) {
					const bottom = nodes[bottomIndex];
					const dist = Math.sqrt((node.x - bottom.x) ** 2 + (node.y - bottom.y) ** 2);
					const stretch = dist / spacing;
					const alpha = Math.max(0, Math.min(1, 2 - stretch)) * opacity;

					ctx.globalAlpha = alpha;
					ctx.beginPath();
					ctx.moveTo(node.x, node.y);
					ctx.lineTo(bottom.x, bottom.y);
					ctx.stroke();
				}
			}
		}

		// Draw nodes
		ctx.globalAlpha = 1;
		nodes.forEach((node) => {
			// Displacement visualization
			const dx = node.x - node.baseX;
			const dy = node.y - node.baseY;
			const displacement = Math.sqrt(dx * dx + dy * dy);
			const intensity = Math.min(1, displacement / 30);

			ctx.fillStyle = `rgba(60, 60, 60, ${opacity * (1 + intensity)})`;
			ctx.beginPath();
			ctx.arc(node.x, node.y, 2 + intensity * 2, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	// ============================================
	// 16. AURORA BOREALIS
	// ============================================
	function drawAuroraBorealis(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.08 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const bandCount = 5;

		// Mouse influence on aurora center
		const mouseOffsetX = (mouseX - 0.5) * 200 * mouseMult;

		// Draw flowing aurora bands
		for (let band = 0; band < bandCount; band++) {
			const baseY = height * 0.15 + band * 40;
			const hue = 120 + band * 30; // Green to cyan spectrum

			ctx.beginPath();

			// Create flowing wave path
			const points: { x: number; y: number }[] = [];
			for (let x = -50; x <= width + 50; x += 10) {
				const wave1 = Math.sin((x * 0.005 + time * 0.3 * speedMult + band * 0.5)) * 40;
				const wave2 = Math.sin((x * 0.008 + time * 0.2 * speedMult - band * 0.3)) * 25;
				const wave3 = Math.sin((x * 0.015 + time * 0.5 * speedMult)) * 15;

				// Add mouse distortion
				const dx = (x - mouseX * width - mouseOffsetX) / width;
				const mouseWave = Math.exp(-dx * dx * 4) * 50 * mouseMult;

				const y = baseY + wave1 + wave2 + wave3 + mouseWave;
				points.push({ x, y });
			}

			// Draw the band as a gradient shape
			ctx.moveTo(points[0].x, points[0].y);
			for (let i = 1; i < points.length; i++) {
				ctx.lineTo(points[i].x, points[i].y);
			}

			// Close the path to make a filled shape
			ctx.lineTo(width + 50, 0);
			ctx.lineTo(-50, 0);
			ctx.closePath();

			// Create vertical gradient for aurora effect
			const gradient = ctx.createLinearGradient(0, 0, 0, baseY + 100);
			gradient.addColorStop(0, `rgba(60, 80, 60, 0)`);
			gradient.addColorStop(0.5, `rgba(60, 80, 60, ${opacity * 0.5})`);
			gradient.addColorStop(1, `rgba(60, 80, 60, ${opacity})`);

			ctx.fillStyle = gradient;
			ctx.fill();
		}

		// Add vertical ray effects
		const rayCount = 15;
		ctx.globalAlpha = opacity * 0.3;
		for (let r = 0; r < rayCount; r++) {
			const x = (width / rayCount) * r + Math.sin(time * 0.5 * speedMult + r) * 30 + mouseOffsetX * 0.3;
			const rayHeight = height * 0.4 + Math.sin(time * speedMult + r * 0.7) * height * 0.1;

			const rayGradient = ctx.createLinearGradient(x, 0, x, rayHeight);
			rayGradient.addColorStop(0, `rgba(60, 70, 60, 0)`);
			rayGradient.addColorStop(0.3, `rgba(60, 70, 60, ${opacity * 0.3})`);
			rayGradient.addColorStop(1, `rgba(60, 70, 60, 0)`);

			ctx.fillStyle = rayGradient;
			ctx.fillRect(x - 2, 0, 4, rayHeight);
		}

		ctx.globalAlpha = 1;
	}

	// ============================================
	// 17. MATRIX RAIN
	// ============================================
	// Matrix rain state
	interface RainDrop {
		x: number;
		y: number;
		speed: number;
		chars: string[];
		length: number;
	}
	let rainDrops: RainDrop[] = [];

	function initRainDrops(seed: number): RainDrop[] {
		const rand = createRandom(seed);
		const result: RainDrop[] = [];
		const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
		const colCount = Math.ceil(width / 20);

		for (let i = 0; i < colCount; i++) {
			const dropChars: string[] = [];
			const length = Math.floor(rand() * 15) + 5;
			for (let j = 0; j < length; j++) {
				dropChars.push(chars[Math.floor(rand() * chars.length)]);
			}

			result.push({
				x: i * 20 + 10,
				y: rand() * height - height,
				speed: rand() * 3 + 2,
				chars: dropChars,
				length
			});
		}
		return result;
	}

	function drawMatrixRain(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.1 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const charSize = 14;

		// Initialize rain drops if needed
		if (rainDrops.length === 0 || Math.abs(rainDrops[0]?.x - 10) > 5) {
			rainDrops = initRainDrops(seed);
		}

		ctx.font = `${charSize}px monospace`;
		ctx.textAlign = 'center';

		// Update and draw drops
		rainDrops.forEach((drop) => {
			// Mouse influence - slow down near cursor
			const dx = Math.abs(drop.x - mouseX * width);
			const mouseSlowdown = dx < 100 ? (1 - (100 - dx) / 100 * 0.5 * mouseMult) : 1;

			drop.y += drop.speed * speedMult * mouseSlowdown;

			// Reset when off screen
			if (drop.y > height + drop.length * charSize) {
				drop.y = -drop.length * charSize;
				// Randomize characters
				const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
				for (let i = 0; i < drop.chars.length; i++) {
					if (Math.random() < 0.1) {
						drop.chars[i] = chars[Math.floor(Math.random() * chars.length)];
					}
				}
			}

			// Draw characters with fade effect
			drop.chars.forEach((char, i) => {
				const y = drop.y + i * charSize;
				if (y < 0 || y > height) return;

				// Fade from bright (head) to dim (tail)
				const fadeProgress = i / drop.chars.length;
				const charOpacity = (1 - fadeProgress) * opacity;

				// Head character is brightest
				if (i === 0) {
					ctx.fillStyle = `rgba(40, 40, 40, ${charOpacity * 2})`;
				} else {
					ctx.fillStyle = `rgba(60, 60, 60, ${charOpacity})`;
				}

				ctx.fillText(char, drop.x, y);
			});
		});
	}

	// ============================================
	// 18. CIRCUIT BOARD
	// ============================================
	interface CircuitNode {
		x: number;
		y: number;
		connections: number[];
		type: 'chip' | 'resistor' | 'capacitor' | 'junction';
	}
	let circuitNodes: CircuitNode[] = [];

	function initCircuitNodes(seed: number): CircuitNode[] {
		const rand = createRandom(seed);
		const result: CircuitNode[] = [];
		const gridSize = 80;
		const cols = Math.ceil(width / gridSize);
		const rows = Math.ceil(height / gridSize);
		const types: CircuitNode['type'][] = ['chip', 'resistor', 'capacitor', 'junction'];

		// Create nodes on a grid with some randomness
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				if (rand() > 0.6) continue; // Skip some positions

				const nodeIndex = result.length;
				result.push({
					x: i * gridSize + gridSize / 2 + (rand() - 0.5) * 20,
					y: j * gridSize + gridSize / 2 + (rand() - 0.5) * 20,
					connections: [],
					type: types[Math.floor(rand() * types.length)]
				});

				// Connect to nearby existing nodes
				result.forEach((other, idx) => {
					if (idx === nodeIndex) return;
					const dist = Math.sqrt((result[nodeIndex].x - other.x) ** 2 + (result[nodeIndex].y - other.y) ** 2);
					if (dist < gridSize * 1.5 && rand() > 0.5) {
						result[nodeIndex].connections.push(idx);
					}
				});
			}
		}
		return result;
	}

	function drawCircuitBoard(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.08 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;

		// Initialize nodes if needed
		if (circuitNodes.length === 0) {
			circuitNodes = initCircuitNodes(seed);
		}

		// Draw traces (connections) first
		ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
		ctx.lineWidth = 2;

		circuitNodes.forEach((node) => {
			node.connections.forEach((targetIdx) => {
				const target = circuitNodes[targetIdx];
				if (!target) return;

				// Draw right-angle traces (like real PCB)
				ctx.beginPath();
				ctx.moveTo(node.x, node.y);

				// Decide whether to go horizontal-then-vertical or vice versa
				const midX = (node.x + target.x) / 2;

				// Pulse effect based on time
				const pulsePos = (time * speedMult * 50) % 100 / 100;
				const px = node.x + (target.x - node.x) * pulsePos;
				const py = node.y + (target.y - node.y) * pulsePos;

				if (Math.abs(node.x - target.x) > Math.abs(node.y - target.y)) {
					ctx.lineTo(midX, node.y);
					ctx.lineTo(midX, target.y);
				} else {
					ctx.lineTo(node.x, (node.y + target.y) / 2);
					ctx.lineTo(target.x, (node.y + target.y) / 2);
				}
				ctx.lineTo(target.x, target.y);
				ctx.stroke();

				// Draw pulse traveling along trace
				const mouseDist = Math.sqrt((px - mouseX * width) ** 2 + (py - mouseY * height) ** 2);
				const pulseGlow = mouseDist < 100 ? (100 - mouseDist) / 100 * mouseMult : 0;

				ctx.fillStyle = `rgba(50, 50, 50, ${opacity * (1 + pulseGlow * 2)})`;
				ctx.beginPath();
				ctx.arc(px, py, 3 + pulseGlow * 3, 0, Math.PI * 2);
				ctx.fill();
			});
		});

		// Draw nodes based on type
		circuitNodes.forEach((node) => {
			// Mouse proximity glow
			const dx = node.x - mouseX * width;
			const dy = node.y - mouseY * height;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const glow = dist < 80 ? (80 - dist) / 80 * mouseMult : 0;

			ctx.fillStyle = `rgba(50, 50, 50, ${opacity * (1.5 + glow)})`;
			ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
			ctx.lineWidth = 1;

			switch (node.type) {
				case 'chip':
					// Rectangle with pins
					ctx.fillRect(node.x - 12, node.y - 8, 24, 16);
					// Draw pins
					for (let p = 0; p < 3; p++) {
						ctx.fillRect(node.x - 10 + p * 8, node.y - 12, 2, 4);
						ctx.fillRect(node.x - 10 + p * 8, node.y + 8, 2, 4);
					}
					break;
				case 'resistor':
					// Zigzag pattern
					ctx.beginPath();
					ctx.moveTo(node.x - 10, node.y);
					ctx.lineTo(node.x - 6, node.y - 4);
					ctx.lineTo(node.x - 2, node.y + 4);
					ctx.lineTo(node.x + 2, node.y - 4);
					ctx.lineTo(node.x + 6, node.y + 4);
					ctx.lineTo(node.x + 10, node.y);
					ctx.stroke();
					break;
				case 'capacitor':
					// Two parallel lines
					ctx.beginPath();
					ctx.moveTo(node.x - 2, node.y - 6);
					ctx.lineTo(node.x - 2, node.y + 6);
					ctx.moveTo(node.x + 2, node.y - 6);
					ctx.lineTo(node.x + 2, node.y + 6);
					ctx.stroke();
					break;
				case 'junction':
					// Simple dot
					ctx.beginPath();
					ctx.arc(node.x, node.y, 4 + glow * 2, 0, Math.PI * 2);
					ctx.fill();
					break;
			}
		});
	}

	// ============================================
	// 19. PLASMA WAVE
	// ============================================
	function drawPlasmaWave(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.12 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const resolution = 6; // Smaller for better quality

		// Plasma formula using multiple sine waves
		for (let x = 0; x < width; x += resolution) {
			for (let y = 0; y < height; y += resolution) {
				const nx = x / width;
				const ny = y / height;

				// Multiple wave interference with varied frequencies
				const wave1 = Math.sin(nx * 12 + time * speedMult * 0.8);
				const wave2 = Math.sin(ny * 10 + time * 0.7 * speedMult);
				const wave3 = Math.sin((nx + ny) * 8 + time * 0.5 * speedMult);
				const wave4 = Math.sin(Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2) * 18 + time * speedMult);
				const wave5 = Math.sin(nx * ny * 20 + time * 0.4 * speedMult);

				// Enhanced mouse influence - stronger ripple effect
				const dx = nx - mouseX;
				const dy = ny - mouseY;
				const mouseDist = Math.sqrt(dx * dx + dy * dy);
				const mouseRadius = 0.4; // Larger influence radius
				const mouseStrength = Math.max(0, 1 - mouseDist / mouseRadius);
				const mouseWave = Math.sin(mouseDist * 30 - time * 4 * speedMult) * mouseMult * mouseStrength * 2;

				// Combine waves with mouse having stronger influence
				const value = (wave1 + wave2 + wave3 + wave4 + wave5 + mouseWave * 2) / 6;

				// Map to grayscale with more contrast
				const intensity = (value + 1) / 2; // 0 to 1
				const gray = Math.floor(30 + intensity * 60);

				ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${opacity * (0.4 + intensity * 0.6)})`;
				ctx.fillRect(x, y, resolution, resolution);
			}
		}
	}

	// ============================================
	// 20. PERLIN NOISE (Smooth Terrain)
	// ============================================
	// Improved noise function for smoother results
	function smoothNoise(x: number, y: number, seed: number): number {
		const ix = Math.floor(x);
		const iy = Math.floor(y);
		const fx = x - ix;
		const fy = y - iy;

		// Smoothstep interpolation
		const sx = fx * fx * (3 - 2 * fx);
		const sy = fy * fy * (3 - 2 * fy);

		const rand = createRandom(seed);
		const n00 = createRandom(ix * 374761393 + iy * 668265263 + seed)() * 2 - 1;
		const n10 = createRandom((ix + 1) * 374761393 + iy * 668265263 + seed)() * 2 - 1;
		const n01 = createRandom(ix * 374761393 + (iy + 1) * 668265263 + seed)() * 2 - 1;
		const n11 = createRandom((ix + 1) * 374761393 + (iy + 1) * 668265263 + seed)() * 2 - 1;

		const nx0 = n00 * (1 - sx) + n10 * sx;
		const nx1 = n01 * (1 - sx) + n11 * sx;

		return nx0 * (1 - sy) + nx1 * sy;
	}

	function fractalNoise(x: number, y: number, seed: number, octaves: number = 4): number {
		let value = 0;
		let amplitude = 1;
		let frequency = 1;
		let maxValue = 0;

		for (let i = 0; i < octaves; i++) {
			value += smoothNoise(x * frequency, y * frequency, seed) * amplitude;
			maxValue += amplitude;
			amplitude *= 0.5;
			frequency *= 2;
		}

		return value / maxValue;
	}

	function drawPerlinNoise(ctx: CanvasRenderingContext2D, seed: number) {
		const opacity = 0.08 * opacityMultiplier * patternConfig.opacity;
		const speedMult = patternConfig.speed;
		const mouseMult = patternConfig.mouseInfluence;
		const resolution = 6;
		const scale = 0.008;

		// Draw noise field as contour-like visualization
		const contourLevels = 8;

		for (let x = 0; x < width; x += resolution) {
			for (let y = 0; y < height; y += resolution) {
				// Animated noise
				const nx = x * scale + time * 0.1 * speedMult;
				const ny = y * scale + time * 0.05 * speedMult;

				// Mouse creates distortion
				const dx = (x - mouseX * width) / width;
				const dy = (y - mouseY * height) / height;
				const mouseDist = Math.sqrt(dx * dx + dy * dy);
				const mouseDistort = Math.exp(-mouseDist * 3) * 0.3 * mouseMult;

				const noiseValue = fractalNoise(nx + mouseDistort * dx, ny + mouseDistort * dy, seed);

				// Quantize to contour levels
				const level = Math.floor((noiseValue + 1) / 2 * contourLevels);
				const normalizedLevel = level / contourLevels;

				// Draw with varying intensity
				const gray = 50 + normalizedLevel * 30;
				const alpha = opacity * (0.3 + normalizedLevel * 0.7);

				ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
				ctx.fillRect(x, y, resolution, resolution);

				// Draw contour lines (edges between levels)
				if (x > 0 && y > 0) {
					const prevXNoise = fractalNoise((x - resolution) * scale + time * 0.1 * speedMult, ny, seed);
					const prevYNoise = fractalNoise(nx, (y - resolution) * scale + time * 0.05 * speedMult, seed);

					const prevXLevel = Math.floor((prevXNoise + 1) / 2 * contourLevels);
					const prevYLevel = Math.floor((prevYNoise + 1) / 2 * contourLevels);

					// If there's a level change, draw a contour line
					if (prevXLevel !== level || prevYLevel !== level) {
						ctx.fillStyle = `rgba(40, 40, 40, ${opacity * 1.5})`;
						ctx.fillRect(x, y, resolution, resolution);
					}
				}
			}
		}
	}

	// Draw a specific style on a context
	function drawStyle(ctx: CanvasRenderingContext2D, style: ArtStyle, particleList: Particle[], blobList: Blob[], seed: number) {
		switch (style) {
			case 'particles':
				drawParticleNetwork(ctx, particleList, seed);
				break;
			case 'flow':
				drawFlowField(ctx, seed);
				break;
			case 'gradient':
				drawGradientMesh(ctx, blobList);
				break;
			case 'constellation':
				drawConstellation(ctx, particleList);
				break;
			case 'ripple':
				drawRipplePulse(ctx);
				break;
			case 'grid':
				drawDotGrid(ctx);
				break;
			case 'voronoi':
				drawVoronoi(ctx, voronoiSeeds);
				break;
			case 'waves':
				drawWaveContours(ctx);
				break;
			case 'hexagon':
				drawHexagonalGrid(ctx);
				break;
			case 'orbits':
				drawOrbitingRings(ctx, orbitParticles);
				break;
			case 'bokeh':
				drawBokehLights(ctx, bokehOrbs);
				break;
			case 'curves':
				drawBezierCurves(ctx, seed);
				break;
			case 'magnetic':
				drawMagneticField(ctx, magneticAttractors);
				break;
			case 'spiral':
				drawSpiralGalaxy(ctx, spiralParticles);
				break;
			case 'lattice':
				drawLiquidLattice(ctx, latticeNodes);
				break;
			case 'aurora':
				drawAuroraBorealis(ctx, seed);
				break;
			case 'rain':
				drawMatrixRain(ctx, seed);
				break;
			case 'circuit':
				drawCircuitBoard(ctx, seed);
				break;
			case 'plasma':
				drawPlasmaWave(ctx, seed);
				break;
			case 'noise':
				drawPerlinNoise(ctx, seed);
				break;
		}
	}

	// ============================================
	// SUBTLE MOUSE GLOW (creative page only)
	// ============================================
	function drawMouseGlow(ctx: CanvasRenderingContext2D) {
		if (currentRoute !== '/creative') return;

		const mx = mouseX * width;
		const my = mouseY * height;

		// Soft gray radial glow
		const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
		gradient.addColorStop(0, 'rgba(120, 115, 105, 0.08)');
		gradient.addColorStop(0.4, 'rgba(100, 95, 85, 0.04)');
		gradient.addColorStop(1, 'rgba(80, 75, 65, 0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(mx - 120, my - 120, 240, 240);
	}

	// ============================================
	// EXPLOSION EFFECTS
	// ============================================
	function updateExplosions() {
		const now = performance.now();
		for (let i = explosions.length - 1; i >= 0; i--) {
			const age = (now - explosions[i].startTime) / 1000;
			if (age > 1.5) { // 1.5 second lifetime
				explosions.splice(i, 1);
			}
		}
	}

	function drawExplosions(ctx: CanvasRenderingContext2D) {
		const now = performance.now();

		for (const exp of explosions) {
			const age = (now - exp.startTime) / 1000;
			const progress = age / 1.5; // 0 to 1 over 1.5 seconds

			if (progress >= 1) continue;

			const radius = exp.size + progress * 200;
			const alpha = 1 - progress;

			// Multiple rings expanding
			for (let ring = 0; ring < 3; ring++) {
				const ringRadius = radius * (0.5 + ring * 0.3);
				const ringAlpha = alpha * (1 - ring * 0.3);

				ctx.beginPath();
				ctx.arc(exp.x, exp.y, ringRadius, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha * 0.5})`;
				ctx.lineWidth = 3 - ring;
				ctx.stroke();
			}

			// Particle burst
			const particleCount = 12;
			for (let i = 0; i < particleCount; i++) {
				const angle = (i / particleCount) * Math.PI * 2;
				const dist = radius * (0.8 + Math.sin(angle * 3 + time * 5) * 0.2);
				const px = exp.x + Math.cos(angle) * dist;
				const py = exp.y + Math.sin(angle) * dist;
				const particleSize = (1 - progress) * 4;

				ctx.beginPath();
				ctx.arc(px, py, particleSize, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
				ctx.fill();
			}
		}
	}

	// Listen for explosion events from creative page
	function handleArtExplosion(e: CustomEvent<{ x: number; y: number; size: number; timestamp: number }>) {
		explosions.push({
			x: e.detail.x,
			y: e.detail.y,
			size: e.detail.size,
			startTime: e.detail.timestamp
		});
	}

	// ============================================
	// MAIN DRAW FUNCTION
	// ============================================
	function draw() {
		if (!ctxCurrent || !browser) return;

		// Update transition progress
		if (isTransitioning) {
			const elapsed = performance.now() - transitionStartTime;
			transitionProgress = Math.min(1, elapsed / TRANSITION_DURATION);

			// Ease out cubic for smoother transition
			transitionProgress = 1 - Math.pow(1 - transitionProgress, 3);

			if (transitionProgress >= 1) {
				isTransitioning = false;
				previousStyle = null;
			}
		}

		// Clear current canvas with background color
		ctxCurrent.fillStyle = '#f5f2eb';
		ctxCurrent.fillRect(0, 0, width, height);

		// If transitioning, draw previous style with fading opacity on previous canvas
		if (isTransitioning && previousStyle && ctxPrevious) {
			ctxPrevious.fillStyle = '#f5f2eb';
			ctxPrevious.fillRect(0, 0, width, height);
			drawStyle(ctxPrevious, previousStyle, particlesPrev, blobsPrev, artSeed - 1000);
		}

		// Draw current style
		drawStyle(ctxCurrent, currentStyle, particles, blobs, artSeed);

		// Draw interactive overlays
		drawMouseGlow(ctxCurrent);
		drawExplosions(ctxCurrent);
	}

	// Performance: track visibility
	let isVisible = $state(true);
	let prefersReducedMotion = $state(false);

	function animate() {
		if (!isVisible || prefersReducedMotion) {
			animationFrame = requestAnimationFrame(animate);
			return;
		}
		time += 0.016;

		// Update interactive systems
		updateExplosions();

		draw();
		animationFrame = requestAnimationFrame(animate);
	}

	function handleVisibilityChange() {
		isVisible = !document.hidden;
	}

	// Initialize canvas when available
	$effect(() => {
		if (!browser || !canvasCurrent || animationStarted) return;

		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		ctxCurrent = canvasCurrent.getContext('2d');
		if (canvasPrevious) {
			ctxPrevious = canvasPrevious.getContext('2d');
		}
		resizeCanvas();

		if (prefersReducedMotion) {
			draw();
		}

		animationStarted = true;
		animate();
	});

	onMount(() => {
		if (!browser) return;
		window.addEventListener('resize', resizeCanvas);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		// Listen for explosion events from creative page
		window.addEventListener('artExplosion', handleArtExplosion as EventListener);
		// Mark as initialized - allows store subscriptions to trigger transitions
		isInitialized = true;
	});

	onDestroy(() => {
		if (!browser) return;
		if (animationFrame !== undefined) {
			cancelAnimationFrame(animationFrame);
		}
		window.removeEventListener('resize', resizeCanvas);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		window.removeEventListener('artExplosion', handleArtExplosion as EventListener);
	});
</script>

{#if browser}
	<!-- Previous canvas (for fade-out during transitions) -->
	<canvas
		bind:this={canvasPrevious}
		class="immersive-bg previous"
		class:transitioning={isTransitioning}
		style:opacity={isTransitioning ? 1 - transitionProgress : 0}
	></canvas>
	<!-- Current canvas (main) -->
	<canvas
		bind:this={canvasCurrent}
		class="immersive-bg current"
		class:transitioning={isTransitioning}
		style:opacity={isTransitioning ? transitionProgress : 1}
	></canvas>

	<!-- Opacity slider control -->
	<div class="opacity-control" class:open={showOpacitySlider}>
		<button
			class="opacity-toggle"
			onclick={() => (showOpacitySlider = !showOpacitySlider)}
			aria-label="Toggle background opacity control"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3"></circle>
				<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
			</svg>
		</button>
		{#if showOpacitySlider}
			<div class="slider-panel">
				<label class="slider-label">
					<span>Background: {Math.round(opacityMultiplier * 40)}%</span>
					<input
						type="range"
						min="0"
						max="5"
						step="0.1"
						bind:value={opacityMultiplier}
					/>
				</label>
			</div>
		{/if}
	</div>
{:else}
	<div class="immersive-bg placeholder"></div>
{/if}

<style>
	.immersive-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		pointer-events: none;
	}

	.immersive-bg.previous {
		z-index: -2;
	}

	.immersive-bg.current {
		z-index: -1;
	}

	.immersive-bg.transitioning {
		transition: opacity 0.1s linear;
	}

	.placeholder {
		background: #f5f2eb;
	}

	/* Opacity slider control */
	.opacity-control {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.opacity-toggle {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #555;
		transition: all 0.2s ease;
	}

	.opacity-toggle:hover {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: scale(1.05);
	}

	.opacity-control.open .opacity-toggle {
		background: #333;
		color: white;
	}

	.slider-panel {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 12px 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
		min-width: 200px;
	}

	.slider-label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 12px;
		color: #555;
		font-weight: 500;
	}

	.slider-label input[type="range"] {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: #ddd;
		appearance: none;
		cursor: pointer;
	}

	.slider-label input[type="range"]::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #333;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.slider-label input[type="range"]::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.slider-label input[type="range"]::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #333;
		cursor: pointer;
		border: none;
	}
</style>
