<script lang="ts">
	import { patternConfig, defaultPatternConfig } from '$lib/stores/creative';
	import { browser } from '$app/environment';

	let isOpen = $state(false);
	let config = $state({
		opacity: 1,
		speed: 1,
		density: 1,
		mouseInfluence: 1
	});

	// Subscribe to store
	if (browser) {
		patternConfig.subscribe((value) => {
			config = { ...value };
		});
	}

	function updateConfig(key: keyof typeof config, value: number) {
		config[key] = value;
		patternConfig.set({ ...config });
	}

	function resetToDefaults() {
		patternConfig.reset();
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
</script>

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
		min-width: 240px;
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
</style>
