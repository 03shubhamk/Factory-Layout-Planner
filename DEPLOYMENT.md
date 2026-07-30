# Deployment & Execution Guide

Instructions for building, running, and deploying the **Factory Layout Planner**.

## Quick Start (Development)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Database
```bash
node server/prisma/seed.js
```

### 3. Launch Application
```bash
npm run dev
```

- **Frontend Client**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Production Build

To build the client application for production:
```bash
npm run build --prefix client
```
Output files will be generated in `client/dist/`.

## Environment Configuration

Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
```
