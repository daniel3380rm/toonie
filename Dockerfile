# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# کپی کردن کل فولدر dist
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/i18n ./i18n
# Expose the application port
EXPOSE 3500

# Command to run the application
CMD ["npm", "start"]
