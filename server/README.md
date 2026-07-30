# Factory Layout Planner - Server API

RESTful API backend powered by **Express.js**, **Prisma ORM**, and **SQLite**.

## API Endpoints

### 🏭 Factories
- `GET /api/factories` - Fetch all factory layouts
- `GET /api/factories/:id` - Fetch factory detail with placed machines & production flow
- `POST /api/factories` - Create a new factory layout workspace
- `DELETE /api/factories/:id` - Delete factory layout

### ⚙️ Machines
- `POST /api/factories/:id/machines` - Add machine node to layout
- `PUT /api/factories/:id/machines/:machineId` - Update position (X, Y), orientation, or status
- `DELETE /api/factories/:id/machines/:machineId` - Remove machine node

### 🔀 Production Flow
- `GET /api/factories/:id/flow` - Fetch flow step sequence
- `POST /api/factories/:id/flow` - Save flow step sequence array `['m-id-1', 'm-id-2']`

### 📊 Reports & Analysis
- `GET /api/factories/:id/reports` - Fetch layout optimization reports
- `POST /api/factories/:id/reports` - Save optimization report

## Database Commands
```bash
# Run migrations
npm run db:migrate

# Open Prisma Studio GUI
npm run db:studio

# Seed sample data
node prisma/seed.js
```
