# ==========================================================
# DreamLearn Backend - Production Dockerfile
# Includes compilers for Python, Java, C, C++, and Node.js
# ==========================================================

FROM node:20-bullseye-slim

WORKDIR /app

# Install native compilers and runtimes for sandbox code execution
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    g++ \
    gcc \
    openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose API port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]
