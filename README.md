# 🏭 PlantCAD Pro — Factory Layout Planner & MES Optimizer

A modern, web-based industrial **Factory Layout Planner & MES Optimizer** for designing manufacturing floor plans, simulating real-time material handling flows, and analyzing facility layout efficiency using formal Operations Research formulations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React_18-blue)
![Vite](https://img.shields.io/badge/bundler-Vite_5-purple)
![Express](https://img.shields.io/badge/backend-Express_4-green)
![Prisma](https://img.shields.io/badge/ORM-Prisma_5-indigo)
![Socket.io](https://img.shields.io/badge/realtime-Socket.io_4-black)

---

## 🌟 Key Features

- **📐 Academic Operations Research & Facilities Planning**:
  - Evaluation based on **Tompkins, White, Bozer, Tanchoco** (*"Facilities Planning"*, 4th Edition, John Wiley & Sons, Chapter 6) and **Richard Muther's Systematic Layout Planning (SLP)**.
  - **From-To Flow Matrix ($F = [f_{ij}]$)**: Maps material batch transfer frequencies between workcenters with inflow and outflow sums.
  - **Material Handling Work ($MHW$)**: Quantitative objective function $MHW = \sum \sum f_{ij} \cdot c_{ij} \cdot d_{ij}$ with unit handling cost rate ($c_{ij} = \$0.05/\text{m}$).
  - **Rectilinear Manhattan Metric ($d_{ij}$)**: Orthogonal aisle distance ($d_{ij} = |x_i - x_j| + |y_i - y_j|$) modeling actual conveyor paths and AGV guide tracks.
  - **Area Utilization Ratio ($AUR$)**: Layout packaging density metric including OSHA 1.0m equipment safety clearance buffers.

- **💧 Industrial Water Purification & Bottling Plant**:
  - Turnkey 10-station processing line: Raw Water Intake Reservoir, Multi-Media Sand & Carbon Filter Bed, 4-Stage Industrial RO Skid, UV & Ozone Sterilizer, 316L Polishing Tank, Rotary Rinser-Filler-Capper Monoblock, Laser Coder, Shrink Sleeve Labeler, Case Bundler, and Dispatch Bay.
  - Dedicated 2D CAD engineering silhouettes for storage tanks, filter vessels, RO tubes, and rotary starwheel carousels.

- **🏭 Multi-Vertical Machinery Catalogs**:
  - Domain-engineered machinery specifications, physical footprints ($w \times h\text{ in meters}$), and throughput capacities across 4 manufacturing verticals:
    - 💧 **Water Purification & Bottling**
    - 🚗 **Automotive Powertrain & Assembly**
    - 📱 **High-Density Electronics SMT**
    - 💊 **cGMP Pharmaceutical Cleanroom**

- **⚡ Live Industrial IoT & MES Command Center**:
  - Real-time WebSocket telemetry streaming (Temperature °C, Vibration RMS mm/s, Spindle RPM, Power kW, Load %, Fleet OEE).
  - Live MES Fleet Monitor dashboard (`/telemetry/:id`) with aggregate power demand and alarms log.
  - Interactive Edge Anomaly Injector (Overheat, Bearing Failure, Spindle Stall, Power Surge) with live alarm propagation.
  - Machine Telemetry Waveforms Drawer with Recharts area curves and thermal safety limits (75°C & 85°C).

- **📐 Interactive CAD Blueprint Canvas**:
  - Drag-and-drop machine node positioning ($0.5\text{m}$ grid snap).
  - Live cursor coordinate datum ($X, Y$ in meters) and drawing scale ($1:100$).
  - Bounded coordinate protection to prevent clipping.
  - Clean CAD Blueprint (Light) and Digital Twin (Dark) visual themes.

- **🚀 Live Flow Simulation & Particle Animation**:
  - Animated SVG material cargo particles traveling along production flow lines ($M_1 \rightarrow M_2 \rightarrow \dots \rightarrow M_n$).
  - Multi-speed simulation controls (`1x`, `2x`, `4x`).
  - Operational machine status toggles (**Running** 🟢, **Idle** ⚪, **Maintenance** 🔴).
  - Radial heatmap overlays highlighting high-distance material travel segments ($>15\text{m}$).

- **📊 Certified Reports & Data Exports**:
  - Full academic methodology citations and interactive From-To Flow Matrix table.
  - Print-ready certified PDF report generation with layout schematic and equipment telemetry.
  - One-click CSV coordinate data exports.

---

## 🏗️ Architecture Stack

- **Frontend**: React 18, Vite 5, TailwindCSS, Lucide Icons, Recharts, Socket.io-client, React Router v6.
- **Backend**: Node.js, Express.js, Socket.io, Prisma ORM, SQLite database.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/03shubhamk/Factory-Layout-Planner.git
cd Factory-Layout-Planner

# Install dependencies
npm run install:all

# Start dev servers (Server on port 5000, Vite client on port 5173/5174)
npm run dev
```

---

## 🧪 Test Suite

```bash
# Run unit tests
node tests/test-runner.js

# Run full integration test suite
node tests/integration.test.mjs
```
