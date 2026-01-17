# Changelog

## [1.1.0] - 2026-01-17

### Added
- 5 new background patterns:
  - Metaballs - Organic merging blobs with implicit surface rendering
  - Lightning - Recursive branching electric bolts with glow effects
  - Terrain Map - 3D height map visualization with grid lines
  - Kaleidoscope - 8-fold mirror symmetry pattern
  - Matrix Rain - Falling binary/ASCII characters

### Changed
- Improved Gradient Mesh with warm/cool color variation and 7-stop gradients
- Improved Bokeh Lights with bright center highlights and depth sorting
- Completely redesigned Perlin Noise with flowing streamlines, animated contours, and floating particles
- Enhanced Voronoi Cells with cell fills, seed glow effects, and sharper edges
- Matrix Rain uses binary/ASCII characters only

### Technical
- Total patterns: 25 (increased from 20)
- All patterns maintain 30+ FPS performance
- New pattern icons in PatternConfigPanel.svelte
- Updated ART_PATTERNS array in creative.ts

## [0.1.0] - 2026-01-17

### Changed
- Replaced colorful mouse trail with subtle gray glow effect on creative page
- Updated gravity well visual to gray/comet-shaped design matching site colors

### Fixed
- Mouse hold animation now updates continuously even without mouse movement
