# Use the official Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Clear yarn cache
RUN yarn cache clean

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies with no cache and frozen lockfile
RUN yarn install --frozen-lockfile --no-cache --network-timeout 100000

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:prod"]