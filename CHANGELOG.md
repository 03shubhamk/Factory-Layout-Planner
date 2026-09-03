# Changelog

All notable changes to the **Factory Layout Planner & MES Optimizer** project are documented here.

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
- **Friction Heatmap Overlay**: Radial heatmap halos highlighting long-distance travel segments ($>15\text{m}$).
- **Industry Preset Templates**: 1-click presets for Automotive Assembly, EV Battery Gigafactory, Electronics SMT, and Pharma Packaging.
- **Canvas Panning & Zoom**: Smooth hand tool panning (`cursor-grab`) and mouse wheel zoom (`Ctrl + Wheel`).
- **Grid Header Toolbar Redesign**: Sleek, single-height aligned control bar.

### Fixed
- **Canvas Overflow & Clipping**: Fixed CSS flexbox centering issue to allow smooth scrolling in all directions.
- **Node Bounding Protection**: Added `getMachX` and `getMachY` coordinate bounding to ensure nodes stay 100% visible on the blueprint grid.
- **Windows Execution Policy**: Updated root script commands to use `npm.cmd` for native Windows execution.
