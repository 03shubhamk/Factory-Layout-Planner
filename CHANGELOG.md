# Changelog

All notable changes to the **Factory Layout Planner & MES Optimizer** project are documented here.

## [v1.2.0] - Live Simulation & Presets Release

### Added
- **Live Flow Simulation Engine**: Animated SVG cargo particles (`📦`) traveling along flow lines.
- **Playback Controls**: Play/Pause button and speed multipliers (`1x`, `2x`, `4x`).
- **Friction Heatmap Overlay**: Radial heatmap halos highlighting long-distance travel segments ($>15\text{m}$).
- **Industry Preset Templates**: 1-click presets for Automotive Assembly, EV Battery Gigafactory, Electronics SMT, and Pharma Packaging.
- **Canvas Panning & Zoom**: Smooth hand tool panning (`cursor-grab`) and mouse wheel zoom (`Ctrl + Wheel`).
- **Grid Header Toolbar Redesign**: Sleek, single-height aligned control bar.

### Fixed
- **Canvas Overflow & Clipping**: Fixed CSS flexbox centering issue to allow smooth scrolling in all directions.
- **Node Bounding Protection**: Added `getMachX` and `getMachY` coordinate bounding to ensure nodes stay 100% visible on the blueprint grid.
- **Windows Execution Policy**: Updated root script commands to use `npm.cmd` for native Windows execution.
