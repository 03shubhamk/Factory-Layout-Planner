# Changelog

All notable changes to the **Factory Layout Planner & MES Optimizer** project are documented here.

## [v1.4.0] - Operations Research Models, Water Purification Plant & PlantCAD Pro UI Revamp

### Added
- **Industrial Water Purification & Bottling Plant**: Full 10-workstation turnkey plant preset including Raw Intake Reservoir, Dual Sand/Carbon Filter, 4-Stage RO Skid, UV/Ozone Disinfection, 316L Storage, Rotary Rinser-Filler Monoblock, Laser Coder, Sleeve Labeler, Case Bundler, and Dispatch Bay.
- **Operations Research Facilities Planning Formulations**: Standardized layout evaluation based on Tompkins, White, Bozer, Tanchoco (*Facilities Planning*, 4th Ed., Ch. 6) and Muther's Systematic Layout Planning (SLP).
- **From-To Flow Matrix (F = [f_ij])**: N x N material frequency transfer matrix with inter-departmental volume tracking, outflow totals, and inflow totals.
- **Total Material Handling Work (MHW)**: Quantitative optimization metric MHW = sum sum (f_ij * c_ij * d_ij) with unit handling cost rate (c_ij = $0.05/m).
- **Rectilinear Manhattan Metric (d_ij)**: Orthogonal aisle distance modeling actual AGV and conveyor transport lanes.
- **Area Utilization Ratio (AUR)**: Space packaging efficiency metric including OSHA-standard 1.0m equipment safety clearance buffers.
- **Domain-Specific Machinery Catalogs**: 4 discrete manufacturing verticals (Water Purification, Automotive Assembly, High-Density SMT, and cGMP Pharma Cleanroom) with physical footprints (w x h) and throughput rates.
- **2D CAD Engineering Silhouettes**: Top-down vector schematics for water storage tanks, dual pressure filter vessels with manifold pipes, horizontal RO membrane tubes, and rotary starwheel carousels.
- **CAD Status Bar**: Live cursor coordinate datum (X, Y in meters), drawing scale, placed node count, and connected flow steps.
- **Auto-Sequence Flow Routing**: 1-click automatic sequencing of production routing along factory floor coordinate progression.
- **Certified PDF & CSV Report Enhancements**: Full academic methodology citations, mathematical formulations, and From-To Flow Matrix table embedded in exportable reports.

### Changed
- **PlantCAD Pro Brand Redesign**: Unified IDE-style navigation with structured groups (WORKSPACE, CAD & ROUTING, ENGINEERING AUDIT, OPERATIONS) and active facility indicators.
- **Eliminated AI Gimmicks**: Removed rainbow gradient buttons, sparkles, glowing blur spheres, Yelp star ratings, and raw emojis in favor of crisp industrial CAD styling.

## [v1.3.0] - Real-Time Industrial IoT & Live MES Fleet Command Center

### Added
- **Real-Time IoT WebSocket Gateway**: Built-in `socket.io` server broadcasting live sensor metrics every 1.5s per active factory.
- **Industrial Sensor Simulation Engine**: Realistic Brownian drift generating Temperature (°C), Vibration RMS (mm/s), Spindle RPM, Active Power (kW), Live Load %, Cycle Count, and Fleet OEE.
- **Edge Fault / Anomaly Injector**: Interactive fault simulator supporting Overheat Spikes, Bearing Wear, Spindle Jams, and Power Surges with instant alarm propagation.
- **Live MES Fleet Command Center (`/telemetry/:id`)**: Dedicated operational dashboard featuring fleet health gauges, total power meters, real-time alarms feed, and MQTT/OPC-UA payload ingestion simulator.
- **Machine Telemetry Waveforms Drawer**: Slide-over HUD with live Recharts area charts, thermal safety reference lines (75°C warning, 85°C critical), and vibration harmonics.
- **Live Canvas Sensor Chips & Alarm Halos**: Machine blueprint nodes now display live temperature chips and pulsing alarm halos on critical faults.
- **REST Telemetry APIs**: Added `/api/factories/:id/telemetry/inject-anomaly`, `/api/factories/:id/telemetry/reset-anomaly`, and `/api/factories/:id/telemetry/publish`.

## [v1.2.0] - Live Simulation & Presets Release

### Added
- **Live Flow Simulation Engine**: Animated SVG cargo particles (`📦`) traveling along flow lines.
- **Playback Controls**: Play/Pause button and speed multipliers (`1x`, `2x`, `4x`).
- **Friction Heatmap Overlay**: Radial heatmap halos highlighting long-distance travel segments (>15m).
- **Industry Preset Templates**: 1-click presets for Automotive Assembly, EV Battery Gigafactory, Electronics SMT, and Pharma Packaging.
- **Canvas Panning & Zoom**: Smooth hand tool panning (`cursor-grab`) and mouse wheel zoom (`Ctrl + Wheel`).
- **Grid Header Toolbar Redesign**: Sleek, single-height aligned control bar.

### Fixed
- **Canvas Overflow & Clipping**: Fixed CSS flexbox centering issue to allow smooth scrolling in all directions.
- **Node Bounding Protection**: Added `getMachX` and `getMachY` coordinate bounding to ensure nodes stay 100% visible on the blueprint grid.
- **Windows Execution Policy**: Updated root script commands to use `npm.cmd` for native Windows execution.
