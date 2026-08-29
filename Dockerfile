# Build stage
FROM node:20-alpine AS builder

# Install system dependencies for video processing
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    curl \
    wget \
    && rm -rf /var/cache/apk/*

# Install latest yt-dlp from GitHub
RUN wget -O /usr/local/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && rm -rf /tmp/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the client
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install system dependencies for video processing
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    curl \
    wget \
    && rm -rf /var/cache/apk/*

# Install latest yt-dlp from GitHub
RUN wget -O /usr/local/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && rm -rf /tmp/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy server code and other necessary files
COPY server ./server
COPY shared ./shared
COPY drizzle.config.ts ./
COPY tsconfig.json ./

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npx", "tsx", "server/index.ts"]
