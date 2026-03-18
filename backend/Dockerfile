# ── Stage 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production ──
FROM node:20-alpine AS production

WORKDIR /app

# Only install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
