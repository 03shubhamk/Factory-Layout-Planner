# Real-Time IoT Telemetry & Digital Twin Pipeline

## Communication Architecture
The Live MES Command Center communicates via bidirectional WebSocket connections powered by **Socket.io**.

### Event Topics
- `join-layout-telemetry`: Client registers to stream telemetry for active layout ID.
- `telemetry-update`: Server broadcasts multi-channel waveform telemetry packet every 2000ms.
- `inject-fault`: Client triggers synthetic physical failure (bearing wear, thermal runaway, motor stall).
- `clear-fault`: Restores machine state to nominal operating baseline.

## Anomaly Detection Rules
| Metric | Nominal Range | Warning Threshold | Critical Alarm |
| :--- | :--- | :--- | :--- |
| Vibration (RMS) | 0.5 - 2.5 mm/s | > 4.5 mm/s | > 7.0 mm/s |
| Motor Temp | 35 - 60 °C | > 75 °C | > 90 °C |
| Current Draw | 10 - 25 A | > 35 A | > 50 A |
| Power Factor | 0.92 - 0.98 | < 0.85 | < 0.75 |
