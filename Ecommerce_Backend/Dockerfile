# Multi-stage production build for Node.js Express Backend
# Stage 1: Build TypeScript source code
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies for tsc build
RUN npm ci

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript in /app/dist
RUN npm run build

# Stage 2: Production runtime environment
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory and set permissions for security
RUN mkdir -p /app/uploads && chown -R node:node /app

# Run as non-root user
USER node

EXPOSE 4000

CMD ["node", "dist/app.js"]
