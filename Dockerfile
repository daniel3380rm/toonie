# Use the official Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean npm cache
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV production

# Command to run the application
CMD ["node", "dist/main"]