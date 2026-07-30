# 🏭 Factory Layout Planner & MES Optimizer

A modern, web-based industrial **Factory Layout Planner & MES Optimizer** for designing manufacturing floor plans, simulating real-time material handling flows, and analyzing travel distance efficiency.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React_18-blue)
![Vite](https://img.shields.io/badge/bundler-Vite_5-purple)
![Express](https://img.shields.io/badge/backend-Express_4-green)
![Prisma](https://img.shields.io/badge/ORM-Prisma_5-indigo)

---

## 🌟 Key Features

- **📐 Interactive Blueprint Canvas**:
  - Drag-and-drop machine node positioning ($0.5\text{m}$ grid snap).
  - Smooth pan (`cursor-grab` hand tool) & mouse wheel zoom (`Ctrl + Wheel`).
  - Bounded coordinate protection to prevent clipping.

- **🚀 Live Flow Simulation & Particle Animation**:
  - Animated SVG material cargo particles (`📦`) traveling along production flow lines ($M_1 \rightarrow M_2 \rightarrow \dots \rightarrow M_n$).
  - Multi-speed simulation controls (`1x`, `2x`, `4x`).
  - Operational machine status toggles (**Running** 🟢, **Idle** ⚪, **Maintenance** 🔴).

- **🔥 Friction Heatmap & Bottleneck Analyzer**:
  - Radial heatmap overlays highlighting high-distance material travel segments ($>15\text{m}$).
  - Live Heatmap Legend & Simulation HUD.

- **🚗 Industry Preset Templates**:
  - 1-click loading of pre-configured industry layouts:
    - 🚗 **Automotive Assembly Line**
    - ⚡ **EV Battery Gigafactory**
    - 📱 **Electronics SMT Line**
    - 💊 **Pharma Packaging Line**

- **📊 Material Handling Analytics & Reports**:
  - Manhattan travel distance calculations ($D = |x_2 - x_1| + |y_2 - y_1|$).
  - Efficiency rating scores and AI optimization suggestions.
  - Printable executive reports & JSON data exports.

---

## 🏗️ Architecture Stack

- **Frontend**: React 18, Vite 5, TailwindCSS, Lucide Icons, Recharts, React Router v6.
- **Backend**: Node.js, Express.js, Prisma ORM, SQLite database.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Seed database
node server/prisma/seed.js

# 3. Start development server
npm run dev
```

- Client UI: `http://localhost:5173`
- Backend API: `http://localhost:5000`
