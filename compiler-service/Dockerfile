FROM node:20-slim

WORKDIR /usr/src/app

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

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6001

CMD ["node", "index.js"]