<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { T } from '@threlte/core';
	import { OrbitControls, Float } from '@threlte/extras';

	let { theme = 'light' }: { theme?: 'light' | 'dark' } = $props();

	// Colors based on theme
	const colors = $derived({
		primary: theme === 'dark' ? '#ff6b4a' : '#D35233',
		secondary: theme === 'dark' ? '#4a9fff' : '#4A90D9',
		tertiary: theme === 'dark' ? '#b366ff' : '#9B59B6',
		ambient: theme === 'dark' ? '#1a1a2e' : '#f8f5f0',
		background: theme === 'dark' ? '#0a0a0f' : '#fdfaf6'
	});

	// Particle positions
	const particleCount = 200;
	const particlePositions = new Float32Array(particleCount * 3);
	const particleColors = new Float32Array(particleCount * 3);

	for (let i = 0; i < particleCount; i++) {
		particlePositions[i * 3] = (Math.random() - 0.5) * 20;
		particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
		particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

		// Coral-ish colors with variation
		particleColors[i * 3] = 0.8 + Math.random() * 0.2;
		particleColors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
		particleColors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
	}
</script>

<div class="hero-scene" style="--bg-color: {colors.background}">
	<Canvas>
		<!-- Camera -->
		<T.PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50}>
			<OrbitControls
				enableZoom={false}
				enablePan={false}
				autoRotate
				autoRotateSpeed={0.5}
				maxPolarAngle={Math.PI / 1.5}
				minPolarAngle={Math.PI / 3}
			/>
		</T.PerspectiveCamera>

		<!-- Ambient Light -->
		<T.AmbientLight intensity={0.4} />

		<!-- Main directional light -->
		<T.DirectionalLight
			position={[5, 5, 5]}
			intensity={1}
			color={colors.primary}
		/>

		<!-- Secondary light -->
		<T.PointLight
			position={[-5, -3, 3]}
			intensity={0.6}
			color={colors.secondary}
		/>

		<!-- Central icosahedron - main focus -->
		<Float floatIntensity={0.5} rotationIntensity={0.3} speed={2}>
			<T.Mesh position={[0, 0, 0]}>
				<T.IcosahedronGeometry args={[1.5, 0]} />
				<T.MeshStandardMaterial
					color={colors.primary}
					wireframe
					transparent
					opacity={0.8}
				/>
			</T.Mesh>
		</Float>

		<!-- Inner solid icosahedron -->
		<Float floatIntensity={0.3} rotationIntensity={0.2} speed={1.5}>
			<T.Mesh position={[0, 0, 0]}>
				<T.IcosahedronGeometry args={[0.8, 1]} />
				<T.MeshStandardMaterial
					color={colors.primary}
					metalness={0.3}
					roughness={0.4}
				/>
			</T.Mesh>
		</Float>

		<!-- Orbiting torus -->
		<Float floatIntensity={0.8} rotationIntensity={0.5} speed={3}>
			<T.Mesh position={[3, 1, -1]} rotation={[Math.PI / 4, 0, 0]}>
				<T.TorusGeometry args={[0.5, 0.15, 16, 32]} />
				<T.MeshStandardMaterial
					color={colors.secondary}
					metalness={0.5}
					roughness={0.3}
				/>
			</T.Mesh>
		</Float>

		<!-- Small octahedron -->
		<Float floatIntensity={0.6} rotationIntensity={0.4} speed={2.5}>
			<T.Mesh position={[-2.5, -0.5, 1]}>
				<T.OctahedronGeometry args={[0.6]} />
				<T.MeshStandardMaterial
					color={colors.tertiary}
					wireframe
					transparent
					opacity={0.7}
				/>
			</T.Mesh>
		</Float>

		<!-- Another small shape -->
		<Float floatIntensity={0.7} rotationIntensity={0.6} speed={2}>
			<T.Mesh position={[2, -1.5, 0.5]}>
				<T.TetrahedronGeometry args={[0.4]} />
				<T.MeshStandardMaterial
					color={colors.secondary}
					metalness={0.4}
					roughness={0.5}
				/>
			</T.Mesh>
		</Float>

		<!-- Floating ring -->
		<Float floatIntensity={0.4} rotationIntensity={0.3} speed={1.8}>
			<T.Mesh position={[-1.5, 2, -0.5]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
				<T.TorusGeometry args={[0.35, 0.08, 16, 32]} />
				<T.MeshStandardMaterial
					color={colors.tertiary}
					metalness={0.6}
					roughness={0.2}
				/>
			</T.Mesh>
		</Float>

		<!-- Particle field -->
		<T.Points>
			<T.BufferGeometry>
				<T.BufferAttribute
					attach="attributes-position"
					args={[particlePositions, 3]}
				/>
				<T.BufferAttribute
					attach="attributes-color"
					args={[particleColors, 3]}
				/>
			</T.BufferGeometry>
			<T.PointsMaterial
				size={0.03}
				vertexColors
				transparent
				opacity={theme === 'dark' ? 0.6 : 0.4}
				sizeAttenuation
			/>
		</T.Points>
	</Canvas>
</div>

<style>
	.hero-scene {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
		opacity: 0.9;
	}

	.hero-scene :global(canvas) {
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-scene {
			display: none;
		}
	}
</style>
