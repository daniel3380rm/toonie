# Use the official Node.js image
FROM node:20-alpine AS base

# Install tzdata and yarn
RUN apk add --no-cache tzdata

# Set the working directory in the container
WORKDIR /app

# Install global dependencies
RUN yarn global add @nestjs/cli

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
# Expose the application port
EXPOSE 3500

# Command to run the application
CMD ["npm", "run", "start:prod"]
