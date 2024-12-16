# Use the official Node.js image
FROM node:20-alpine AS base

RUN apk add --no-cache tzdata

# Set the working directory in the container
WORKDIR /app

# Copy package.json a nd package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
