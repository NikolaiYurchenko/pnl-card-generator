# Use the official Node.js image
FROM node:18-slim

RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcurl4 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    --no-install-recommends

# Install global dependencies (ts-node and typescript)
# I think this in unnessesary if using build js
RUN npm install -g ts-node typescript

# Install Puppeteer
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Start the app
# Same, if using js from build, ts-node -> node
CMD ["ts-node", "src/server/server.ts"]
