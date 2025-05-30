FROM node:22.1.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and create migration
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM node:22.1.0-alpine AS production

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled JavaScript code
COPY --from=builder /app/dist ./dist

# Copy any other necessary files (not needed for runtime)
# COPY --from=builder /app/tsconfig.json ./

# Expose the port the app will run on
EXPOSE 3000

# Create a startup script to run migrations and start the application
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Waiting for database to be ready..."' >> /app/start.sh && \
    echo 'sleep 5' >> /app/start.sh && \
    echo 'echo "Running database migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Command to run the application
CMD ["/bin/sh", "/app/start.sh"]
