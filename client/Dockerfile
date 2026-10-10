# ==========================================================
# DreamLearn Frontend - Multi-Stage Production Dockerfile
# ==========================================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Remove default nginx configs
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
