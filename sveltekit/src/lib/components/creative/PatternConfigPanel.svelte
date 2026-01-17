<script lang="ts">
	import { patternConfig, defaultPatternConfig, ART_PATTERNS, selectedPattern, type ArtPatternId } from '$lib/stores/creative';
	import { browser } from '$app/environment';

	let isOpen = $state(false);
	let config = $state({
		opacity: 1,
		speed: 1,
		density: 1,
		mouseInfluence: 1
	});
	let currentSelectedPattern = $state<ArtPatternId | null>(null);

	// Subscribe to stores
	if (browser) {
		patternConfig.subscribe((value) => {
			config = { ...value };
		});
		selectedPattern.subscribe((value) => {
			currentSelectedPattern = value;
		});
	}

	function updateConfig(key: keyof typeof config, value: number) {
		config[key] = value;
		patternConfig.set({ ...config });
	}

	function selectPattern(patternId: ArtPatternId | null) {
		selectedPattern.set(patternId);
	}

	function resetToDefaults() {
		patternConfig.reset();
		selectedPattern.clear();
	}

	function togglePanel() {
		isOpen = !isOpen;
	}

	// Close panel when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.pattern-config-panel')) {
			isOpen = false;
		}
	}

	// Get current pattern name for display
	function getCurrentPatternName(): string {
		if (currentSelectedPattern) {
			const pattern = ART_PATTERNS.find(p => p.id === currentSelectedPattern);
			return pattern ? pattern.name : 'Unknown';
		}
		return 'Auto (Route-based)';
	}
</script>

<!-- SVG icon definitions (hidden, referenced via use) -->
<svg style="display: none;">
	<defs>
		<!-- Auto/Refresh icon -->
		<symbol id="icon-auto" viewBox="0 0 16 16">
			<path d="M14 8A6 6 0 1 1 2.34 5.74" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
			<path d="M2 2v4h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</symbol>
		<!-- Particles - scattered dots -->
		<symbol id="icon-particles" viewBox="0 0 16 16">
			<circle cx="4" cy="4" r="1.5" fill="currentColor"/>
			<circle cx="12" cy="5" r="1" fill="currentColor"/>
			<circle cx="8" cy="8" r="1.5" fill="currentColor"/>
			<circle cx="3" cy="11" r="1" fill="currentColor"/>
			<circle cx="11" cy="12" r="1.5" fill="currentColor"/>
			<circle cx="6" cy="13" r="0.8" fill="currentColor"/>
		</symbol>
		<!-- Flow - curved lines -->
		<symbol id="icon-flow" viewBox="0 0 16 16">
			<path d="M2 4c4 0 4 4 8 4s4-4 8-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
			<path d="M2 8c4 0 4 4 8 4s4-4 8-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
			<path d="M2 12c4 0 4 4 8 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
		</symbol>
		<!-- Gradient - overlapping circles -->
		<symbol id="icon-gradient" viewBox="0 0 16 16">
			<circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<circle cx="10" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<circle cx="8" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
		</symbol>
		<!-- Constellation - connected stars -->
		<symbol id="icon-constellation" viewBox="0 0 16 16">
			<circle cx="3" cy="4" r="1.2" fill="currentColor"/>
			<circle cx="8" cy="2" r="1" fill="currentColor"/>
			<circle cx="13" cy="5" r="1.2" fill="currentColor"/>
			<circle cx="5" cy="10" r="1" fill="currentColor"/>
			<circle cx="11" cy="12" r="1.2" fill="currentColor"/>
			<path d="M3 4l5-2m0 0l5 3m-5-3l2 8m-5 0l6 2" fill="none" stroke="currentColor" stroke-width="0.6"/>
		</symbol>
		<!-- Ripple - concentric circles -->
		<symbol id="icon-ripple" viewBox="0 0 16 16">
			<circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
			<circle cx="8" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.7"/>
			<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
		</symbol>
		<!-- Grid - dot grid -->
		<symbol id="icon-grid" viewBox="0 0 16 16">
			<circle cx="4" cy="4" r="1" fill="currentColor"/>
			<circle cx="8" cy="4" r="1" fill="currentColor"/>
			<circle cx="12" cy="4" r="1" fill="currentColor"/>
			<circle cx="4" cy="8" r="1" fill="currentColor"/>
			<circle cx="8" cy="8" r="1" fill="currentColor"/>
			<circle cx="12" cy="8" r="1" fill="currentColor"/>
			<circle cx="4" cy="12" r="1" fill="currentColor"/>
			<circle cx="8" cy="12" r="1" fill="currentColor"/>
			<circle cx="12" cy="12" r="1" fill="currentColor"/>
		</symbol>
		<!-- Voronoi - cellular pattern -->
		<symbol id="icon-voronoi" viewBox="0 0 16 16">
			<path d="M1 8l4-6h6l4 6-4 6H5z" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<path d="M5 2v12M11 2v12M1 8h14" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
		</symbol>
		<!-- Waves - wavy lines -->
		<symbol id="icon-waves" viewBox="0 0 16 16">
			<path d="M1 5c2-2 4 2 6 0s4 2 6 0" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
			<path d="M1 9c2-2 4 2 6 0s4 2 6 0" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
			<path d="M1 13c2-2 4 2 6 0s4 2 6 0" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
		</symbol>
		<!-- Hexagon - hexagonal shape -->
		<symbol id="icon-hexagon" viewBox="0 0 16 16">
			<path d="M8 1l6 3.5v7L8 15l-6-3.5v-7z" fill="none" stroke="currentColor" stroke-width="1.3"/>
			<circle cx="8" cy="8" r="1" fill="currentColor"/>
		</symbol>
		<!-- Orbits - concentric ellipses -->
		<symbol id="icon-orbits" viewBox="0 0 16 16">
			<ellipse cx="8" cy="8" rx="6" ry="3" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(-30 8 8)"/>
			<ellipse cx="8" cy="8" rx="6" ry="3" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(30 8 8)"/>
			<circle cx="8" cy="8" r="1.5" fill="currentColor"/>
		</symbol>
		<!-- Bokeh - blurred circles -->
		<symbol id="icon-bokeh" viewBox="0 0 16 16">
			<circle cx="5" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<circle cx="11" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
			<circle cx="7" cy="11" r="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<circle cx="12" cy="12" r="1.5" fill="none" stroke="currentColor" stroke-width="0.8"/>
		</symbol>
		<!-- Curves - bezier curves -->
		<symbol id="icon-curves" viewBox="0 0 16 16">
			<path d="M2 14C2 6 6 2 14 2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
			<path d="M2 10C2 6 6 4 10 4" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
			<path d="M4 14C4 10 8 8 12 8" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
		</symbol>
		<!-- Magnetic - field lines -->
		<symbol id="icon-magnetic" viewBox="0 0 16 16">
			<circle cx="4" cy="8" r="2" fill="currentColor"/>
			<circle cx="12" cy="8" r="2" fill="currentColor"/>
			<path d="M6 8c2-3 2-3 4 0s2 3 4 0" fill="none" stroke="currentColor" stroke-width="0.8"/>
			<path d="M6 8c2 3 2 3 4 0s2-3 4 0" fill="none" stroke="currentColor" stroke-width="0.8"/>
		</symbol>
		<!-- Spiral - spiral shape -->
		<symbol id="icon-spiral" viewBox="0 0 16 16">
			<path d="M8 8c0-1 1-2 2-2s2 1 2 2-1 3-3 3-4-2-4-4 2-5 5-5 6 3 6 6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
		</symbol>
		<!-- Lattice - connected grid -->
		<symbol id="icon-lattice" viewBox="0 0 16 16">
			<path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" stroke-width="0.8"/>
			<path d="M4 2v12M8 2v12M12 2v12" fill="none" stroke="currentColor" stroke-width="0.8"/>
			<circle cx="4" cy="4" r="1" fill="currentColor"/>
			<circle cx="8" cy="8" r="1" fill="currentColor"/>
			<circle cx="12" cy="12" r="1" fill="currentColor"/>
		</symbol>
		<!-- Aurora - horizontal bands -->
		<symbol id="icon-aurora" viewBox="0 0 16 16">
			<path d="M1 4c4 1 8-1 14 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
			<path d="M1 8c5 2 9-2 14 1" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
			<path d="M1 12c3 1 11-1 14 0" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
		</symbol>
		<!-- Rain - vertical lines -->
		<symbol id="icon-rain" viewBox="0 0 16 16">
			<path d="M3 1v6M7 3v8M11 1v10M15 4v6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
			<path d="M5 5v5M9 2v7M13 6v8" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" opacity="0.6"/>
		</symbol>
		<!-- Circuit - electronic paths -->
		<symbol id="icon-circuit" viewBox="0 0 16 16">
			<path d="M2 8h4l2-4h4l2 4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M4 12h8" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<circle cx="4" cy="12" r="1" fill="currentColor"/>
			<circle cx="12" cy="12" r="1" fill="currentColor"/>
			<circle cx="8" cy="4" r="1" fill="currentColor"/>
		</symbol>
		<!-- Plasma - wavy blob -->
		<symbol id="icon-plasma" viewBox="0 0 16 16">
			<path d="M8 2c3 0 5 1 5.5 4s-1 4-2.5 5-3 2-5 1-3-2-3.5-4.5S5 2 8 2z" fill="none" stroke="currentColor" stroke-width="1.2"/>
			<path d="M6 6c1-1 3 0 4 1s0 3-1 3-2-1-2-2" fill="none" stroke="currentColor" stroke-width="0.8"/>
		</symbol>
		<!-- Noise - scattered pattern -->
		<symbol id="icon-noise" viewBox="0 0 16 16">
			<rect x="2" y="2" width="2" height="2" fill="currentColor" opacity="0.3"/>
			<rect x="6" y="2" width="2" height="2" fill="currentColor" opacity="0.7"/>
			<rect x="10" y="2" width="2" height="2" fill="currentColor" opacity="0.5"/>
			<rect x="4" y="6" width="2" height="2" fill="currentColor" opacity="0.8"/>
			<rect x="8" y="6" width="2" height="2" fill="currentColor" opacity="0.4"/>
			<rect x="12" y="6" width="2" height="2" fill="currentColor" opacity="0.6"/>
			<rect x="2" y="10" width="2" height="2" fill="currentColor" opacity="0.5"/>
			<rect x="6" y="10" width="2" height="2" fill="currentColor" opacity="0.9"/>
			<rect x="10" y="10" width="2" height="2" fill="currentColor" opacity="0.3"/>
		</symbol>
	</defs>
</svg>

<svelte:window onclick={handleClickOutside} />

{#if browser}
	<div class="pattern-config-panel" class:open={isOpen}>
		<button
			class="toggle-button"
			onclick={togglePanel}
			aria-label="Pattern configuration"
			title="Configure background patterns"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3"></circle>
				<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
			</svg>
		</button>

		{#if isOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div class="panel-content" onclick={(e) => e.stopPropagation()}>
				<div class="panel-header">
					<h3>Background Pattern</h3>
					<button class="reset-btn" onclick={resetToDefaults} title="Reset to defaults">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="1 4 1 10 7 10"></polyline>
							<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
						</svg>
					</button>
				</div>

				<!-- Pattern Selector -->
				<div class="pattern-selector">
					<div class="current-pattern">
						<span class="label">Current:</span>
						<span class="value">{getCurrentPatternName()}</span>
					</div>

					<div class="pattern-grid">
						<button
							class="pattern-item auto"
							class:selected={currentSelectedPattern === null}
							onclick={() => selectPattern(null)}
							title="Use route-based pattern selection"
						>
							<span class="pattern-icon">
								<svg width="16" height="16"><use href="#icon-auto"/></svg>
							</span>
							<span class="pattern-name">Auto</span>
						</button>
						{#each ART_PATTERNS as pattern}
							<button
								class="pattern-item"
								class:selected={currentSelectedPattern === pattern.id}
								onclick={() => selectPattern(pattern.id)}
								title={pattern.name}
							>
								<span class="pattern-icon">
									<svg width="16" height="16"><use href="#icon-{pattern.icon}"/></svg>
								</span>
								<span class="pattern-name">{pattern.name.split(' ')[0]}</span>
							</button>
						{/each}
					</div>
				</div>

				<div class="config-sliders">
					<label class="slider-group">
						<span class="slider-label">
							<span>Opacity</span>
							<span class="slider-value">{Math.round(config.opacity * 100)}%</span>
						</span>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={config.opacity}
							oninput={(e) => updateConfig('opacity', parseFloat(e.currentTarget.value))}
						/>
					</label>

					<label class="slider-group">
						<span class="slider-label">
							<span>Speed</span>
							<span class="slider-value">{Math.round(config.speed * 100)}%</span>
						</span>
						<input
							type="range"
							min="0.1"
							max="3"
							step="0.1"
							value={config.speed}
							oninput={(e) => updateConfig('speed', parseFloat(e.currentTarget.value))}
						/>
					</label>

					<label class="slider-group">
						<span class="slider-label">
							<span>Density</span>
							<span class="slider-value">{Math.round(config.density * 100)}%</span>
						</span>
						<input
							type="range"
							min="0.2"
							max="2"
							step="0.1"
							value={config.density}
							oninput={(e) => updateConfig('density', parseFloat(e.currentTarget.value))}
						/>
					</label>

					<label class="slider-group">
						<span class="slider-label">
							<span>Mouse Effect</span>
							<span class="slider-value">{Math.round(config.mouseInfluence * 100)}%</span>
						</span>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={config.mouseInfluence}
							oninput={(e) => updateConfig('mouseInfluence', parseFloat(e.currentTarget.value))}
						/>
					</label>
				</div>

				<div class="panel-footer">
					<span class="hint">Settings saved automatically</span>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.pattern-config-panel {
		position: fixed;
		bottom: 70px;
		right: 20px;
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.toggle-button {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #555;
		transition: all 0.2s ease;
	}

	.toggle-button:hover {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
		transform: scale(1.05);
	}

	.pattern-config-panel.open .toggle-button {
		background: #333;
		color: white;
		transform: rotate(90deg);
	}

	.panel-content {
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(12px);
		border-radius: 16px;
		padding: 16px 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		min-width: 280px;
		max-width: 320px;
		max-height: 70vh;
		overflow-y: auto;
		animation: slideIn 0.2s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		color: #333;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.reset-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: none;
		background: rgba(0, 0, 0, 0.05);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		transition: all 0.15s ease;
	}

	.reset-btn:hover {
		background: rgba(0, 0, 0, 0.1);
		color: #333;
	}

	/* Pattern Selector */
	.pattern-selector {
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}

	.current-pattern {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		font-size: 12px;
	}

	.current-pattern .label {
		color: #888;
	}

	.current-pattern .value {
		font-weight: 600;
		color: #333;
	}

	.pattern-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}

	.pattern-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px 4px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.02);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.pattern-item:hover {
		background: rgba(0, 0, 0, 0.05);
		border-color: rgba(0, 0, 0, 0.15);
	}

	.pattern-item.selected {
		background: #333;
		border-color: #333;
		color: white;
	}

	.pattern-item.auto {
		border-style: dashed;
	}

	.pattern-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		margin-bottom: 4px;
	}

	.pattern-icon svg {
		width: 16px;
		height: 16px;
	}

	.pattern-name {
		font-size: 9px;
		font-weight: 500;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.config-sliders {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.slider-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.slider-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: #555;
		font-weight: 500;
	}

	.slider-value {
		color: #888;
		font-weight: 400;
		font-variant-numeric: tabular-nums;
	}

	.slider-group input[type="range"] {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: linear-gradient(to right, #ddd, #ddd);
		appearance: none;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.slider-group input[type="range"]::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #333;
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	.slider-group input[type="range"]::-webkit-slider-thumb:hover {
		transform: scale(1.15);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
	}

	.slider-group input[type="range"]::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #333;
		cursor: pointer;
		border: none;
	}

	.panel-footer {
		margin-top: 14px;
		padding-top: 12px;
		border-top: 1px solid rgba(0, 0, 0, 0.06);
	}

	.hint {
		font-size: 10px;
		color: #999;
		font-style: italic;
	}

	/* Scrollbar styling */
	.panel-content::-webkit-scrollbar {
		width: 6px;
	}

	.panel-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.panel-content::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.15);
		border-radius: 3px;
	}

	.panel-content::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.25);
	}
</style>
