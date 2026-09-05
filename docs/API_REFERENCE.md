# API Reference Manual

## REST API Endpoints

### 1. Layouts
- `GET /api/layouts` - List all saved layouts
- `POST /api/layouts` - Create new plant layout
- `GET /api/layouts/:id` - Fetch single layout with nodes and connections
- `PUT /api/layouts/:id` - Update layout geometry and metadata
- `DELETE /api/layouts/:id` - Delete layout by ID

### 2. Live Telemetry
- `GET /api/telemetry/:id/snapshot` - Current snapshot of all machines in layout
- `POST /api/telemetry/:id/fault` - Inject fault into machine
- `POST /api/telemetry/:id/clear` - Clear faults
