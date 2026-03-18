# ── Stage 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
# Note: VITE_ env vars must be set at build time
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:alpine AS production

# Copy built files to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
