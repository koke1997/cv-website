<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		type?: 'ribbons' | 'circles' | 'torus' | 'waves' | 'particles';
		color?: string;
		animated?: boolean;
	}

	let { type = 'ribbons', color = '#1a1a1a', animated = true }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationFrame: number | undefined;
	let time = 0;
	let mounted = $state(false);

	function resizeCanvas() {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * window.devicePixelRatio;
		canvas.height = rect.height * window.devicePixelRatio;
		ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	function drawRibbons() {
		if (!ctx || !canvas) return;
		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;
		const centerX = width / 2;
		const centerY = height / 2;

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = color;
		ctx.lineWidth = 0.5;

		const ribbonCount = 40;
		const ribbonLength = 80;

		for (let i = 0; i < ribbonCount; i++) {
			const angle = (i / ribbonCount) * Math.PI * 2;
			const radius = 80 + Math.sin(time * 0.5 + i * 0.3) * 30;

			ctx.beginPath();
			for (let j = 0; j < ribbonLength; j++) {
				const t = j / ribbonLength;
				const twist = t * Math.PI * 4 + time * 0.3;
				const r = radius * (1 - t * 0.5);
				const x = centerX + Math.cos(angle + twist * 0.3) * r * (1 + Math.sin(twist) * 0.3);
				const y = centerY + Math.sin(angle + twist * 0.3) * r * (1 + Math.cos(twist) * 0.2);

				if (j === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	}

	function drawCircles() {
		if (!ctx || !canvas) return;
		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;
		const centerX = width / 2;
		const centerY = height / 2;

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = color;
		ctx.lineWidth = 0.5;

		const circleCount = 30;
		const maxRadius = Math.min(width, height) * 0.4;

		for (let i = 0; i < circleCount; i++) {
			const radius = (i / circleCount) * maxRadius;
			const offset = Math.sin(time * 0.5 + i * 0.2) * 15;
			const segments = 100;

			ctx.beginPath();
			for (let j = 0; j <= segments; j++) {
				const angle = (j / segments) * Math.PI * 2;
				const wobble = Math.sin(angle * 8 + time + i * 0.3) * (radius * 0.05);
				const x = centerX + Math.cos(angle) * (radius + wobble + offset);
				const y = centerY + Math.sin(angle) * (radius + wobble);

				if (j === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}

		// Scatter particles
		const particleCount = 60;
		ctx.fillStyle = color;
		for (let i = 0; i < particleCount; i++) {
			const angle = (i / particleCount) * Math.PI * 2 + time * 0.1;
			const dist = maxRadius + 20 + Math.sin(time + i) * 30;
			const x = centerX + Math.cos(angle) * dist;
			const y = centerY + Math.sin(angle) * dist;
			const size = 1 + Math.sin(time * 2 + i) * 0.5;
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function drawTorus() {
		if (!ctx || !canvas) return;
		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;
		const centerX = width / 2;
		const centerY = height / 2;

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = color;
		ctx.lineWidth = 0.4;

		const R = 70; // Major radius
		const r = 35; // Minor radius
		const segments = 60;
		const rings = 30;

		// Draw radial lines forming torus
		for (let i = 0; i < segments; i++) {
			const u = (i / segments) * Math.PI * 2;
			ctx.beginPath();
			for (let j = 0; j <= rings; j++) {
				const v = (j / rings) * Math.PI * 2;
				const rotationY = time * 0.3;
				const rotationX = Math.PI * 0.3;

				// 3D torus coordinates
				let x3d = (R + r * Math.cos(v)) * Math.cos(u);
				let y3d = (R + r * Math.cos(v)) * Math.sin(u);
				let z3d = r * Math.sin(v);

				// Rotate around Y
				const x3dRotY = x3d * Math.cos(rotationY) - z3d * Math.sin(rotationY);
				const z3dRotY = x3d * Math.sin(rotationY) + z3d * Math.cos(rotationY);
				x3d = x3dRotY;
				z3d = z3dRotY;

				// Rotate around X
				const y3dRotX = y3d * Math.cos(rotationX) - z3d * Math.sin(rotationX);
				const z3dRotX = y3d * Math.sin(rotationX) + z3d * Math.cos(rotationX);
				y3d = y3dRotX;

				// Project to 2D
				const scale = 300 / (300 + z3dRotX);
				const x2d = centerX + x3d * scale;
				const y2d = centerY + y3d * scale;

				if (j === 0) {
					ctx.moveTo(x2d, y2d);
				} else {
					ctx.lineTo(x2d, y2d);
				}
			}
			ctx.stroke();
		}
	}

	function drawWaves() {
		if (!ctx || !canvas) return;
		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = color;
		ctx.lineWidth = 0.5;

		const waveCount = 25;
		const points = 100;

		for (let w = 0; w < waveCount; w++) {
			const baseY = (w / waveCount) * height;
			ctx.beginPath();

			for (let i = 0; i <= points; i++) {
				const x = (i / points) * width;
				const normalizedX = i / points;

				const wave1 = Math.sin(normalizedX * Math.PI * 4 + time + w * 0.3) * 15;
				const wave2 = Math.sin(normalizedX * Math.PI * 2 + time * 0.7) * 10;
				const wave3 = Math.sin(normalizedX * Math.PI * 6 + time * 1.3 + w * 0.2) * 5;

				const y = baseY + wave1 + wave2 + wave3;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	}

	function drawParticles() {
		if (!ctx || !canvas) return;
		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;
		const centerX = width / 2;
		const centerY = height / 2;

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 0.3;

		const particleCount = 150;
		const particles: Array<{ x: number; y: number }> = [];

		// Generate particle positions
		for (let i = 0; i < particleCount; i++) {
			const angle = (i / particleCount) * Math.PI * 2 * 3;
			const spiralRadius = (i / particleCount) * 120;
			const wobble = Math.sin(time + i * 0.1) * 10;
			const x = centerX + Math.cos(angle + time * 0.2) * (spiralRadius + wobble);
			const y = centerY + Math.sin(angle + time * 0.2) * (spiralRadius + wobble);
			particles.push({ x, y });

			// Draw particle
			ctx.beginPath();
			ctx.arc(x, y, 1.5, 0, Math.PI * 2);
			ctx.fill();
		}

		// Connect nearby particles
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const dx = particles[i].x - particles[j].x;
				const dy = particles[i].y - particles[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 30) {
					ctx.globalAlpha = 1 - dist / 30;
					ctx.beginPath();
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(particles[j].x, particles[j].y);
					ctx.stroke();
				}
			}
		}
		ctx.globalAlpha = 1;
	}

	function draw() {
		switch (type) {
			case 'ribbons':
				drawRibbons();
				break;
			case 'circles':
				drawCircles();
				break;
			case 'torus':
				drawTorus();
				break;
			case 'waves':
				drawWaves();
				break;
			case 'particles':
				drawParticles();
				break;
		}
	}

	function animate() {
		if (animated) {
			time += 0.01;
		}
		draw();
		animationFrame = requestAnimationFrame(animate);
	}

	onMount(() => {
		if (!browser) return;
		mounted = true;
		ctx = canvas.getContext('2d');
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		animate();
	});

	onDestroy(() => {
		if (!browser) return;
		if (animationFrame !== undefined) {
			cancelAnimationFrame(animationFrame);
		}
		window.removeEventListener('resize', resizeCanvas);
	});
</script>

{#if browser}
	<canvas bind:this={canvas} class="generative-canvas"></canvas>
{:else}
	<div class="generative-canvas placeholder"></div>
{/if}

<style>
	.generative-canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.placeholder {
		background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
	}
</style>
