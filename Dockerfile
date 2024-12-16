# Use the official Node.js image
FROM node:20-alpine AS base

# Install tzdata and yarn
RUN apk add --no-cache tzdata

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Clean install with yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Remove development dependencies
RUN yarn install --production --frozen-lockfile

# Expose the application port
EXPOSE 3500

# Command to run the application
CMD ["yarn", "start:prod"]