# Dockerfile

# Stage 1: Base image with Node.js
FROM node:20-slim AS base

# Stage 2: Builder - Install all compilers
FROM base AS builder
# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies (Python, C/C++, Java JDK, and Go)
RUN apt-get update && apt-get install -y \
    python3 \
    gcc \
    g++ \
    default-jdk \
    golang \
    php-cli \
    rustc \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Command to run the node server
CMD ["node", "index.js"]