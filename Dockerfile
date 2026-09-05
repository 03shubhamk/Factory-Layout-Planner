# Multi-stage Dockerfile for Factory Layout Planner

# Stage 1: Build client frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci || npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --omit=dev || npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy built frontend assets to client build destination
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node scripts/healthcheck.js || exit 1

CMD ["node", "server/server.js"]
