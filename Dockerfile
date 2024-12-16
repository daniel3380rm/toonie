# Build stage
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Clear yarn cache
RUN yarn cache clean

# Copy package files
COPY package*.json yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile --no-cache --network-timeout 100000

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile --no-cache --network-timeout 100000

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]