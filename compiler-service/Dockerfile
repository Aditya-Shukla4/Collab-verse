# compiler-service/Dockerfile

FROM node:20-slim

WORKDIR /usr/src/app

# Install all necessary dependencies for compilers AND for node-pty
RUN apt-get update && apt-get install -y \
    python3 \
    gcc \
    g++ \
    default-jdk \
    golang \
    php-cli \
    rustc \
    make \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package*.json ./

# Install dependencies. This will now correctly build node-pty inside the container
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port
EXPOSE 6001

CMD ["node", "index.js"]